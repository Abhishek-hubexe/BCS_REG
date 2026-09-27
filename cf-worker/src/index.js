import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

// Apply CORS
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.ALLOWED_ORIGIN || '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    maxAge: 600,
  });
  return corsMiddleware(c, next);
});

// Input Validation Schema
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  department: z.string().min(2).max(50),
  year: z.string().min(4).max(10), // e.g., "2026", "Freshman"
  phone: z.string().min(10).max(15),
  turnstileToken: z.string().optional() // Make optional for easy local testing, enforce in prod
});

// Utility to verify Turnstile (CAPTCHA)
async function verifyTurnstile(token, secret, ip) {
  if (!token || !secret) return false;
  
  const formData = new URLSearchParams();
  formData.append('secret', secret);
  formData.append('response', token);
  formData.append('remoteip', ip);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const result = await fetch(url, {
    body: formData,
    method: 'POST',
  });

  const outcome = await result.json();
  return outcome.success;
}

// POST /register - Register a new student
app.post(
  '/register',
  zValidator('json', registerSchema),
  async (c) => {
    const data = c.req.valid('json');
    const { name, email, department, year, phone, turnstileToken } = data;

    // Verify Turnstile Token (if secret is configured in env)
    if (c.env.TURNSTILE_SECRET_KEY && c.env.TURNSTILE_SECRET_KEY !== '1x0000000000000000000000000000000AA') {
      const ip = c.req.header('CF-Connecting-IP') || '';
      const isValid = await verifyTurnstile(turnstileToken, c.env.TURNSTILE_SECRET_KEY, ip);
      if (!isValid) {
        return c.json({ error: 'CAPTCHA verification failed.' }, 403);
      }
    }

    try {
      // Step 1: Insert into D1 (relies on UNIQUE constraint for email)
      // We first insert without the custom student_id (using a temporary or NULL)
      // Or we can get the count of users in this dept/year to generate sequence
      const db = c.env.DB;
      
      // Note: In SQLite, wrapping in a transaction or relying on RETURNING is best.
      // D1 doesn't support complex transactions in one HTTP call via the JS API,
      // but we can execute batched statements.
      
      // Let's get the max ID for this department and year to create a sequence
      const prefix = `BEC-${year.substring(0, 4)}-${department.substring(0, 3).toUpperCase()}`;
      
      const countStmt = await db.prepare(
        `SELECT COUNT(*) as count FROM students WHERE department = ? AND year = ?`
      ).bind(department, year).first();
      
      const sequence = (countStmt.count + 1).toString().padStart(4, '0');
      const studentId = `${prefix}-${sequence}`;

      // Insert record
      const insertStmt = await db.prepare(
        `INSERT INTO students (student_id, name, email, department, year, phone) VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(studentId, name, email, department, year, phone).run();

      if (!insertStmt.success) {
        throw new Error('Failed to insert record.');
      }

      return c.json({
        message: 'Registration successful',
        student_id: studentId
      }, 201);

    } catch (err) {
      // Check if it's a unique constraint error (e.g., email already exists)
      if (err.message.includes('UNIQUE constraint failed: students.email')) {
        return c.json({ error: 'This email is already registered.' }, 409);
      }
      
      console.error('Database Error:', err);
      return c.json({ error: 'Internal Server Error', details: err.message }, 500);
    }
  }
);

// GET /verify/:studentId - Fetch details (for QR scanning, etc)
app.get('/verify/:studentId', async (c) => {
  const studentId = c.req.param('studentId');
  const db = c.env.DB;

  try {
    const student = await db.prepare(
      `SELECT student_id, name, department, year, created_at FROM students WHERE student_id = ?`
    ).bind(studentId).first();

    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }

    return c.json({ student }, 200);
  } catch (err) {
    console.error('Database Error:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Basic index route
app.get('/', (c) => c.text('Student Registration API is running.'));

export default app;
