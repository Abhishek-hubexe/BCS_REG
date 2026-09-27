DROP TABLE IF EXISTS students;

CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- We don't have triggers for string formatting with sequence in D1 natively easily
-- so we will handle the sequence logic in the worker code using a transaction or
-- by relying on the AUTOINCREMENT id for the sequence suffix.
-- Since the ID is unique across all students, we can just use the absolute ID 
-- zero-padded, or query the count of students per department for the sequence.
