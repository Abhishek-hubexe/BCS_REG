# Cloudflare Worker Registration System

A robust, serverless Student Registration system built with Cloudflare Workers and Cloudflare D1 (SQL).

## Features
- Validates input fields using `zod`.
- Uses Cloudflare D1 (SQLite) for strong relational storage and `UNIQUE` constraints to prevent duplicate emails.
- Generates a human-readable unique Student ID (`BEC-2026-DEPT-XXXX`).
- Integrates Cloudflare Turnstile CAPTCHA to prevent bot signups.
- Designed with `hono` for fast, simple routing and built-in CORS.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Local Database (D1)**
   Before running locally, initialize the SQLite database using the schema.
   ```bash
   npx wrangler d1 execute DB --local --file=./schema.sql
   ```

3. **Start Local Development Server**
   ```bash
   npm run dev
   ```
   *Note: Ensure you add `"dev": "wrangler dev"` to your package.json scripts.*

4. **Deploy to Cloudflare**
   - Create a D1 database in your Cloudflare dashboard.
   - Update `wrangler.toml` with the generated `database_id`.
   - Run the schema on production:
     ```bash
     npx wrangler d1 execute DB --file=./schema.sql
     ```
   - Deploy the worker:
     ```bash
     npx wrangler deploy
     ```

## API Endpoints

### `POST /register`
Accepts a JSON payload to register a student.

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "department": "CSE",
  "year": "2026",
  "phone": "555-123-4567",
  "turnstileToken": "dummy-token" 
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful",
  "student_id": "BEC-2026-CSE-0001"
}
```

### `GET /verify/:studentId`
Retrieves public student information for verification (e.g., from a QR code scan).

**Request:**
```
GET /verify/BEC-2026-CSE-0001
```

**Response (200 OK):**
```json
{
  "student": {
    "student_id": "BEC-2026-CSE-0001",
    "name": "Jane Doe",
    "department": "CSE",
    "year": "2026",
    "created_at": "2026-09-22 18:20:00"
  }
}
```
