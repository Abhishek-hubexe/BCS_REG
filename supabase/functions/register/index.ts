// =================================================================
// Supabase Edge Function: /register
// =================================================================
// This Edge Function sits in front of the Postgres RPC to add:
//   1. Turnstile CAPTCHA verification
//   2. Input sanitization
//   3. Rate limiting (simple, IP-based via headers)
//   4. Proper CORS handling
// =================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? 'http://localhost:3000'
const TURNSTILE_SECRET = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// Simple in-memory rate limiter (resets on cold start — for prod, use Upstash Redis)
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 10 // max registrations per IP per window

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
}

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) return true // Skip in dev if not configured

  const form = new URLSearchParams()
  form.append('secret', TURNSTILE_SECRET)
  form.append('response', token)
  form.append('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const data = await res.json()
  return data.success === true
}

// Check rate limit
function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

// Sanitize string input
function sanitize(str) {
  if (typeof str !== 'string') return ''
  return str
    .trim()
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML injection
    .slice(0, 200)         // Hard cap on length
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  // Rate limit check
  if (!checkRateLimit(ip)) {
    return jsonResponse({ error: 'Too many registration attempts. Please try again later.' }, 429)
  }

  let body
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400)
  }

  const { full_name, email, department, year_of_study, phone, turnstile_token } = body

  // ---- Validate required fields ----
  if (!full_name || !email || !department || year_of_study == null) {
    return jsonResponse({ error: 'Missing required fields: full_name, email, department, year_of_study.' }, 400)
  }

  // Email format check
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (!emailRegex.test(email)) {
    return jsonResponse({ error: 'Invalid email format.' }, 400)
  }

  // Year check
  const year = parseInt(year_of_study, 10)
  if (isNaN(year) || year < 1 || year > 4) {
    return jsonResponse({ error: 'year_of_study must be between 1 and 4.' }, 400)
  }

  // ---- Turnstile CAPTCHA ----
  const turnstileOk = await verifyTurnstile(turnstile_token, ip)
  if (!turnstileOk) {
    return jsonResponse({ error: 'CAPTCHA verification failed.' }, 403)
  }

  // ---- Call the Postgres RPC ----
  // We use the service_role key here (server-side only, never exposed to client)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const { data, error } = await supabase.rpc('register_student', {
    p_full_name: sanitize(full_name),
    p_email: email.trim().toLowerCase(),
    p_department: sanitize(department),
    p_year_of_study: year,
    p_phone: phone ? sanitize(phone) : null,
  })

  if (error) {
    console.error('RPC Error:', error)
    // Surface user-friendly messages from the Postgres function
    const msg = error.message?.includes('already registered')
      ? 'This email is already registered.'
      : error.message || 'Registration failed.'
    return jsonResponse({ error: msg }, error.message?.includes('already registered') ? 409 : 400)
  }

  // `data` is the returned student_id string from the function
  return jsonResponse({
    message: 'Registration successful!',
    student_id: data,
  }, 201)
})
