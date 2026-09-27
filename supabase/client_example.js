// =================================================================
// Supabase Client Example — Registration & Verification
// =================================================================
// This file demonstrates how to call the registration and
// verification endpoints from a frontend or Node.js application.
//
// IMPORTANT: Only use the `anon` key on the client side.
// The `service_role` key is used ONLY inside Edge Functions.
// =================================================================

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the PUBLIC anon key
const supabase = createClient(
  'https://YOUR_PROJECT_REF.supabase.co',  // Replace with your Supabase URL
  'eyJhbGciOi...'                           // Replace with your anon/public key
);


// ─────────────────────────────────────────────
// OPTION A: Register via Edge Function (Recommended)
// ─────────────────────────────────────────────
// This calls the Edge Function which adds CAPTCHA verification,
// rate limiting, and sanitization before hitting the DB.

async function registerViaEdgeFunction({ fullName, email, department, yearOfStudy, phone, turnstileToken }) {
  const response = await fetch(
    'https://YOUR_PROJECT_REF.supabase.co/functions/v1/register',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email,
        department,
        year_of_study: yearOfStudy,
        phone,
        turnstile_token: turnstileToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed.');
  }

  console.log('✅ Registered! Student ID:', data.student_id);
  // Example output: BEC-2026-CSE-0001
  return data.student_id;
}


// ─────────────────────────────────────────────
// OPTION B: Register via Direct RPC call
// ─────────────────────────────────────────────
// This calls the Postgres function directly via the Supabase client.
// Simpler but skips Edge Function protections (CAPTCHA, rate limit).
// Only use this if you have other rate-limiting in place.

async function registerViaRPC({ fullName, email, department, yearOfStudy, phone }) {
  const { data, error } = await supabase.rpc('register_student', {
    p_full_name: fullName,
    p_email: email,
    p_department: department,
    p_year_of_study: yearOfStudy,
    p_phone: phone || null,
  });

  if (error) {
    console.error('Registration error:', error.message);
    throw new Error(error.message);
  }

  console.log('✅ Registered! Student ID:', data);
  // `data` is the TEXT returned by the function, e.g. "BEC-2026-CSE-0001"
  return data;
}


// ─────────────────────────────────────────────
// Verify a Student ID (for QR/attendance systems)
// ─────────────────────────────────────────────
// Calls the `verify_student` Postgres function.
// Returns only public-safe fields (name, department, year).

async function verifyStudent(studentId) {
  const { data, error } = await supabase.rpc('verify_student', {
    p_student_id: studentId,
  });

  if (error) {
    console.error('Verification error:', error.message);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    console.log('❌ Student not found.');
    return null;
  }

  // data is an array of rows (should be 0 or 1)
  const student = data[0];
  console.log('✅ Verified:', student);
  // Example output:
  // {
  //   student_id: "BEC-2026-CSE-0001",
  //   full_name: "Jane Doe",
  //   department: "CSE",
  //   year_of_study: 2,
  //   registered_at: "2026-09-22T18:20:00.000Z"
  // }
  return student;
}


// ─────────────────────────────────────────────
// Example Usage
// ─────────────────────────────────────────────

/*
// Registration
const studentId = await registerViaEdgeFunction({
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  department: 'CSE',
  yearOfStudy: 2,
  phone: '555-123-4567',
  turnstileToken: 'cf-turnstile-response-token',
});

// Verification
const student = await verifyStudent('BEC-2026-CSE-0001');
*/

export { registerViaEdgeFunction, registerViaRPC, verifyStudent };
