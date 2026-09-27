# Supabase Student Registration System

A production-ready student registration backend using **Supabase** (Postgres + Edge Functions + RLS).

## Architecture

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│   Frontend   │────▸│  Edge Function        │────▸│  Postgres (D1)       │
│  (React app) │     │  /functions/register  │     │  register_student()  │
│              │     │  • Turnstile verify   │     │  • Atomic counter    │
│              │     │  • Rate limiting      │     │  • UNIQUE email      │
│              │     │  • Input sanitization │     │  • Returns student_id│
└──────────────┘     └──────────────────────┘     └──────────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | Postgres tables, functions, RLS policies, constraints |
| `functions/register/index.ts` | Edge Function with CAPTCHA + rate limit + sanitization |
| `client_example.js` | Frontend/Node.js example for registration & verification |

## Setup

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the Schema

In the **Supabase SQL Editor** (Dashboard → SQL Editor), paste the contents of `schema.sql` and run it. This creates:

- `students` table with `UNIQUE` constraints on `email` and `student_id`
- `student_counters` table for atomic sequence generation
- `register_student()` RPC function (atomic ID generation + insert)
- `verify_student()` RPC function (public-safe lookup)
- RLS policies restricting access

### 3. Deploy the Edge Function

```bash
# Install the Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets for the Edge Function
supabase secrets set TURNSTILE_SECRET_KEY=your_turnstile_secret
supabase secrets set ALLOWED_ORIGIN=https://your-frontend-domain.com

# Deploy
supabase functions deploy register
```

### 4. Connect from Your Frontend

Replace the placeholder values in `client_example.js` with your actual Supabase URL and anon key.

## API Reference

### Registration (via Edge Function)

```
POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/register
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "department": "CSE",
  "year_of_study": 2,
  "phone": "555-123-4567",
  "turnstile_token": "cf-turnstile-response-token"
}
```

**Success (201):**
```json
{
  "message": "Registration successful!",
  "student_id": "BEC-2026-CSE-0001"
}
```

**Duplicate Email (409):**
```json
{
  "error": "This email is already registered."
}
```

### Verification (via RPC)

```js
const { data } = await supabase.rpc('verify_student', {
  p_student_id: 'BEC-2026-CSE-0001'
});
```

**Returns:**
```json
{
  "student_id": "BEC-2026-CSE-0001",
  "full_name": "Jane Doe",
  "department": "CSE",
  "year_of_study": 2,
  "registered_at": "2026-09-22T18:20:00.000Z"
}
```

> Note: Email and phone are intentionally excluded from verification responses.

## Security Checklist

- [x] Passwords/keys: Only the `anon` key is used client-side; `service_role` key is inside Edge Functions only
- [x] RLS enabled on all tables — anon cannot SELECT, UPDATE, or DELETE students
- [x] Registration goes through `SECURITY DEFINER` function — client cannot set `student_id` or `id` directly
- [x] Counter table is completely locked down via RLS (`USING (false)`)
- [x] Turnstile CAPTCHA verified server-side before DB insert
- [x] IP-based rate limiting in the Edge Function
- [x] Input sanitized (HTML stripped, length capped) before DB insert
- [x] Parameterized queries via Supabase client (SQL injection proof)
- [x] CHECK constraints on email format, name length, year range
- [x] Atomic sequence generation via `INSERT ... ON CONFLICT DO UPDATE ... RETURNING`
