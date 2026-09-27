-- ============================================================
-- BCS Student Registration System — Supabase/Postgres Schema
-- ============================================================

-- 1. Counters table for atomic sequence generation per dept/year
CREATE TABLE IF NOT EXISTS student_counters (
  department TEXT NOT NULL,
  year_of_study INT NOT NULL,
  last_sequence INT NOT NULL DEFAULT 0,
  PRIMARY KEY (department, year_of_study)
);

-- 2. Students table
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  student_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  phone TEXT,
  phone_whatsapp TEXT,
  csn_esn TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'student',
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Registrations table for Club Enrollments / Audition applications
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  reg_code TEXT UNIQUE,
  user_id BIGINT,
  student_email TEXT,
  club_id INT NOT NULL,
  club_name TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students (email);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students (student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (student_email);
CREATE INDEX IF NOT EXISTS idx_registrations_club_id ON registrations (club_id);

-- ============================================================
-- 4. Atomic Registration Function (RPC)
-- ============================================================
CREATE OR REPLACE FUNCTION register_student(
  p_full_name TEXT,
  p_email TEXT,
  p_department TEXT,
  p_year_of_study INT,
  p_phone TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence INT;
  v_student_id TEXT;
  v_dept_code TEXT;
  v_year_str TEXT;
BEGIN
  IF p_full_name IS NULL OR char_length(trim(p_full_name)) < 2 THEN
    RAISE EXCEPTION 'Full name is required (minimum 2 characters).';
  END IF;

  IF p_email IS NULL OR p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'A valid email address is required.';
  END IF;

  p_email := lower(trim(p_email));

  IF EXISTS (SELECT 1 FROM students WHERE email = p_email) THEN
    RAISE EXCEPTION 'This email is already registered.';
  END IF;

  v_dept_code := upper(left(trim(p_department), 3));
  v_year_str := extract(year FROM now())::TEXT;

  INSERT INTO student_counters (department, year_of_study, last_sequence)
  VALUES (v_dept_code, p_year_of_study, 1)
  ON CONFLICT (department, year_of_study)
  DO UPDATE SET last_sequence = student_counters.last_sequence + 1
  RETURNING last_sequence INTO v_sequence;

  v_student_id := 'BEC-' || v_year_str || '-' || v_dept_code || '-' || lpad(v_sequence::TEXT, 4, '0');

  INSERT INTO students (student_id, full_name, email, department, year_of_study, phone, phone_whatsapp)
  VALUES (v_student_id, trim(p_full_name), p_email, trim(p_department), p_year_of_study::TEXT, trim(p_phone), trim(p_phone));

  RETURN v_student_id;
END;
$$;

-- ============================================================
-- 5. Row Level Security (RLS)
-- ============================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS service_role_all_students ON students;
CREATE POLICY service_role_all_students ON students FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_registrations ON registrations;
CREATE POLICY service_role_all_registrations ON registrations FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_counters ON student_counters;
CREATE POLICY service_role_all_counters ON student_counters FOR ALL TO service_role USING (true) WITH CHECK (true);
