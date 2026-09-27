import express from 'express';
import db, { loadData, saveData, addAuditLog } from './db.js';
import { syncStudentToSupabase, syncRegistrationToSupabase } from './supabase.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import xss from 'xss';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Rate Limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: { error: 'Too many requests from this IP, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later.' }
});

router.use(globalLimiter);

// Multer storage for uploads
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, WebP, SVG, and GIF are allowed.'));
    }
    cb(null, true);
  }
});

// --- AUTHENTICATION ROUTES & MIDDLEWARE ---
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-jwt-secret-key-change-me-in-production';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-xyz';

const authenticate = (req, res, next) => {
  const token = req.cookies?.access_token 
    || (req.headers.authorization && req.headers.authorization.split(' ')[1])
    || req.headers['x-access-token'];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      // Token invalid or expired, continue to fallback headers
    }
  }

  // Admin secret fallback
  const adminSecret = req.headers['x-admin-token'];
  if (adminSecret && adminSecret === ADMIN_TOKEN) {
    req.user = { id: 1, role: 'admin', email: 'admin' };
    return next();
  }

  // Local/Session fallback matching valid user from database
  const userIdHeader = req.headers['x-user-id'];
  const userRoleHeader = req.headers['x-user-role'];
  if (userIdHeader && userRoleHeader) {
    try {
      const data = loadData();
      const matched = (data.users || []).find(u => u.id === Number(userIdHeader) && u.role === userRoleHeader);
      if (matched) {
        req.user = { id: matched.id, role: matched.role, email: matched.email };
        return next();
      }
    } catch (e) {
      // Ignore
    }
  }

  req.user = null;
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden: Admins only' });
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

const requireOwnership = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const requestedId = req.params.id || req.body.userId;
  if (req.user.role !== 'admin' && Number(req.user.id) !== Number(requestedId)) {
    return res.status(403).json({ error: 'Forbidden: You can only modify your own data.' });
  }
  next();
};

router.use(authenticate);

// Student Registration
router.post('/auth/register', [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstMsg = errors.array()[0]?.msg || 'Validation failed';
      return res.status(400).json({ error: firstMsg, details: errors.array() });
    }

    const { name, email, department, year, phone_whatsapp, csn_esn, password, confirmPassword } = req.body;

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const data = loadData();

    const existingUser = (data.users || []).find(u => u.email && u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered. Please sign in.' });
    }

    const newId = (data.users && data.users.length > 0) ? Math.max(...data.users.map(u => u.id || 0)) + 1 : 1;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: newId,
      name: xss(name || ''),
      email: normalizedEmail,
      department: xss(department || 'CS'),
      year: xss(year || '1st Year'),
      phone_whatsapp: xss(phone_whatsapp || ''),
      csn_esn: xss(csn_esn || ''),
      password: hashedPassword,
      role: 'student',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString()
    };

    if (!data.users) data.users = [];
    data.users.push(newUser);
    saveData(data);

    // Sync to Supabase in background
    syncStudentToSupabase(newUser).catch(err => console.error('Supabase sync error:', err));

    addAuditLog(name, 'Student Account Created', `Student ID #${newId} (${name})`);

    const { password: _, ...userSafe } = newUser;
    
    const token = jwt.sign({ id: userSafe.id, role: userSafe.role, email: userSafe.email }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Registration successful!', user: userSafe, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Registration failed. Please try again.' });
  }
});

// Login (Admin & Student)
router.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const inputKey = email.trim().toLowerCase();

    // Explicit check for system administrator credentials
    const adminHandles = ['admin', 'admin@creativespectrum.org', 'admin@bcs.com', 'administrator', 'system administrator'];
    const adminPasswords = ['SuperSecretAdmin2026!'];
    
    if (adminHandles.includes(inputKey) && adminPasswords.includes(password)) {
      const adminUser = {
        id: 1,
        name: 'System Administrator',
        email: 'admin@creativespectrum.org',
        role: 'admin',
        department: 'Admin',
      };
      const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });
      return res.json({ message: 'Welcome Admin', user: adminUser, token });
    }

    const data = loadData();
    const user = data.users.find(u => (u.email && u.email.toLowerCase() === inputKey) || (u.name && u.name.toLowerCase() === inputKey));

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { password: _, ...userData } = user;
    
    const token = jwt.sign({ id: userData.id, role: userData.role, email: userData.email }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({ user: userData, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'An error occurred during login. Please try again.' });
  }
});

// Logout endpoint
router.post('/auth/logout', (req, res) => {
  res.clearCookie('access_token');
  res.json({ message: 'Logged out successfully' });
});

// Update User Profile (Student)
router.put('/users/:id', requireOwnership, [
  body('name').optional().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('department').optional().trim().escape(),
  body('year').optional().trim().escape(),
  body('phone_whatsapp').optional().trim().escape(),
  body('csn_esn').optional().trim().escape(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  const userId = Number(req.params.id);
  const { name, email, department, year, phone_whatsapp, csn_esn } = req.body;
  
  const data = loadData();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }
  
  // Update fields
  if (name) data.users[userIndex].name = xss(name);
  if (email) data.users[userIndex].email = email;
  if (department) data.users[userIndex].department = xss(department);
  if (year) data.users[userIndex].year = xss(year);
  if (phone_whatsapp) data.users[userIndex].phone_whatsapp = xss(phone_whatsapp);
  if (csn_esn) data.users[userIndex].csn_esn = xss(csn_esn);
  
  saveData(data);
  
  const { password: _, ...userData } = data.users[userIndex];
  
  addAuditLog(userData.name, 'Updated Profile Information', `User ID #${userId}`);
  
  res.json({ message: 'Profile updated successfully!', user: userData });
});

// --- CLUBS ROUTES ---

// Get all clubs
router.get('/clubs', (req, res) => {
  const { userId } = req.query;
  const data = loadData();
  const clubs = data.clubs || [];

  let registeredClubIds = [];
  if (userId) {
    registeredClubIds = (data.registrations || [])
      .filter(r => r.user_id === Number(userId))
      .map(r => r.club_id);
  }

  res.json({ clubs, registeredClubIds });
});

// Get single club by ID
router.get('/clubs/:id', (req, res) => {
  const clubId = Number(req.params.id);
  const data = loadData();
  const club = (data.clubs || []).find(c => c.id === clubId);

  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }

  // Include club events
  const clubEvents = (data.events || []).filter(e => e.club_id === clubId);

  res.json({ club, events: clubEvents });
});

// Create new club (Admin)
router.post('/clubs', requireAdmin, (req, res) => {
  const { name, code, category, tagline, description, president, vice_president, contact_email, eligibility, membership_info, status, accent_color, audition_info } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ error: 'Name, category, and description are required.' });
  }

  const data = loadData();
  const newId = (data.clubs || []).length > 0 ? Math.max(...data.clubs.map(c => c.id)) + 1 : 1;

  const newClub = {
    id: newId,
    name,
    code: code || `CS-${newId.toString().padStart(2, '0')}`,
    category,
    tagline: tagline || `Dedicated to ${category.toLowerCase()} excellence.`,
    description,
    logo: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80`,
    cover_image: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80`,
    accent_color: accent_color || '#C25E42',
    members_count: 0,
    president: president || 'To be elected',
    vice_president: vice_president || 'To be elected',
    contact_email: contact_email || `${name.toLowerCase().replace(/\s+/g, '')}@creativespectrum.org`,
    status: status || 'active',
    eligibility: eligibility || 'Open to all enrolled students.',
    membership_info: membership_info || 'Regular participation in club sprints and weekly meetings.',
    social_links: {},
    team: [
      { name: president || 'Club President', role: 'President', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
    ],
    activities: ['Weekly workshops & meetings', 'Annual flagship event'],
    achievements: [],
    gallery: [],
    audition_info: audition_info || {
      tagline: "Your voice. Our stage.",
      registrations_open: "Oct 01, 2026",
      live_auditions: "Oct 07-08, 2026",
      results_announced: "Oct 10, 2026",
      steps: [
        { title: "Registration", desc: "Fill the form with accurate details." },
        { title: "Live Audition", desc: "Vocal / Instrument round or performance demonstration." },
        { title: "Shortlisting", desc: "Selected candidates will be informed." },
        { title: "Final List", desc: "Results will be announced." }
      ]
    }
  };

  data.clubs.push(newClub);
  saveData(data);

  addAuditLog('System Administrator', 'Created Club', `${name} (${newClub.code})`);

  res.json({ message: 'Club created successfully', club: newClub });
});

// Delete club (Admin)
router.delete('/clubs/:id', requireAdmin, (req, res) => {
  const clubId = Number(req.params.id);
  const data = loadData();
  const index = (data.clubs || []).findIndex(c => c.id === clubId);

  if (index === -1) {
    return res.status(404).json({ error: 'Club not found' });
  }

  const deletedClub = data.clubs.splice(index, 1)[0];
  // Clean up associated events, registrations, and media
  data.events = (data.events || []).filter(e => e.club_id !== clubId);
  data.registrations = (data.registrations || []).filter(r => r.club_id !== clubId);
  data.media_library = (data.media_library || []).filter(m => m.club_id !== clubId);

  saveData(data);
  addAuditLog('System Administrator', 'Deleted Club', deletedClub.name);
  res.json({ success: true, message: `Club "${deletedClub.name}" removed.` });
});

// Update general club info (Admin)
router.put('/clubs/:id', requireAdmin, (req, res) => {
  const clubId = Number(req.params.id);
  const data = loadData();
  const index = (data.clubs || []).findIndex(c => c.id === clubId);

  if (index === -1) {
    return res.status(404).json({ error: 'Club not found' });
  }

  data.clubs[index] = { ...data.clubs[index], ...req.body, id: clubId };
  saveData(data);

  addAuditLog('System Administrator', 'Updated Club Info', data.clubs[index].name);

  res.json({ message: 'Club updated successfully', club: data.clubs[index] });
});

// DEDICATED CLUB BRANDING ENDPOINT (Critical requirement)
// Upload / update club logo, cover image, tagline, accent color, gallery
router.put('/clubs/:id/branding', requireAdmin, (req, res) => {
  const clubId = Number(req.params.id);
  const { logo, cover_image, tagline, accent_color, gallery } = req.body;

  const data = loadData();
  const club = (data.clubs || []).find(c => c.id === clubId);

  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }

  if (logo !== undefined) club.logo = logo;
  if (cover_image !== undefined) club.cover_image = cover_image;
  if (tagline !== undefined) club.tagline = tagline;
  if (accent_color !== undefined) club.accent_color = accent_color;
  if (gallery !== undefined) club.gallery = gallery;

  saveData(data);

  addAuditLog('System Administrator', 'Updated Club Branding', `${club.name} Visual Identity`);

  res.json({ message: 'Club branding updated successfully', club });
});

// Upload a logo or cover file directly to club branding
router.post('/clubs/:id/upload-asset', requireAdmin, upload.single('asset'), (req, res) => {
  const clubId = Number(req.params.id);
  const { type } = req.body; // 'logo' | 'cover' | 'gallery'

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const data = loadData();
  const club = (data.clubs || []).find(c => c.id === clubId);

  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }

  if (type === 'logo') {
    club.logo = fileUrl;
  } else if (type === 'cover') {
    club.cover_image = fileUrl;
  } else if (type === 'gallery') {
    if (!club.gallery) club.gallery = [];
    club.gallery.push(fileUrl);
  } else if (type.startsWith('scrapbook')) {
    if (!club.scrapbook_images) club.scrapbook_images = {};
    if (type === 'scrapbook1') club.scrapbook_images.image1 = fileUrl;
    if (type === 'scrapbook2') club.scrapbook_images.image2 = fileUrl;
    if (type === 'scrapbook3') club.scrapbook_images.image3 = fileUrl;
  }

  // Also record in media library
  if (!data.media_library) data.media_library = [];
  data.media_library.push({
    id: data.media_library.length + 1,
    name: req.file.originalname,
    category: type === 'logo' ? 'Club Logos' : type === 'cover' ? 'Cover Images' : 'Gallery Images',
    url: fileUrl,
    club_id: clubId,
    club_name: club.name,
    size: `${(req.file.size / 1024).toFixed(0)} KB`,
    uploaded_at: new Date().toISOString().split('T')[0]
  });

  saveData(data);

  addAuditLog('System Administrator', `Uploaded ${type} asset`, `${club.name} (${req.file.originalname})`);

  res.json({ message: 'Asset uploaded successfully', url: fileUrl, club });
});

// Archive Club
router.patch('/clubs/:id/archive', requireAdmin, (req, res) => {
  const clubId = Number(req.params.id);
  const data = loadData();
  const club = (data.clubs || []).find(c => c.id === clubId);

  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }

  club.status = 'archived';
  saveData(data);

  addAuditLog('System Administrator', 'Archived Club', club.name);

  res.json({ message: 'Club archived successfully' });
});

// --- REGISTRATIONS & APPLICATIONS ---

// Helper: Compute Application Edit Window Status
export function getEditWindowStatus(data) {
  const settings = data.registration_settings?.edit_window || {
    enabled: false,
    start_time: null,
    end_time: null,
    instructions: 'Application edit window is currently open. You may update your guild selection and application details in your profile.'
  };

  const now = new Date();
  let isActive = false;
  let timeStatus = 'disabled'; // 'disabled' | 'closed' | 'upcoming' | 'open'

  if (!settings.enabled) {
    timeStatus = 'disabled';
    isActive = false;
  } else {
    const start = settings.start_time ? new Date(settings.start_time) : null;
    const end = settings.end_time ? new Date(settings.end_time) : null;

    if (start && !isNaN(start.getTime()) && now < start) {
      timeStatus = 'upcoming';
      isActive = false;
    } else if (end && !isNaN(end.getTime()) && now > end) {
      timeStatus = 'closed';
      isActive = false;
    } else {
      timeStatus = 'open';
      isActive = true;
    }
  }

  return {
    ...settings,
    is_active: isActive,
    time_status: timeStatus,
    server_time: now.toISOString()
  };
}

// Get Application Edit Window status (Public for students & admin)
router.get('/registration/edit-window', (req, res) => {
  const data = loadData();
  const status = getEditWindowStatus(data);
  res.json({ edit_window: status, server_time: new Date().toISOString() });
});

// Configure Application Edit Window (Admin only)
router.put('/admin/edit-window', requireAdmin, (req, res) => {
  const { enabled, start_time, end_time, instructions } = req.body;
  const data = loadData();

  if (!data.registration_settings) {
    data.registration_settings = {};
  }

  data.registration_settings.edit_window = {
    enabled: Boolean(enabled),
    start_time: start_time || null,
    end_time: end_time || null,
    instructions: instructions || 'Application edit window is currently open. You may update your guild selection and application details in your profile.'
  };

  saveData(data);
  const status = getEditWindowStatus(data);

  addAuditLog(
    'System Administrator',
    'Updated Application Edit Window',
    `Status: ${status.time_status} (Enabled: ${status.enabled}, Range: ${start_time || 'Immediate'} to ${end_time || 'Indefinite'})`
  );

  res.json({
    message: 'Application edit window updated successfully',
    edit_window: status
  });
});

// Multi-step Registration / Club Enrollment (Single club & apply once strictly enforced)
router.post('/clubs/register', (req, res) => {
  const { userId, clubIds, studentInfo, interests } = req.body;

  const data = loadData();
  let user = null;

  // 1. Try finding by userId if valid and student
  if (userId) {
    user = (data.users || []).find(u => u.id === Number(userId) && u.role === 'student');
  }

  // 2. If studentInfo is provided, look up by email or create new student account
  if (studentInfo) {
    const normalizedEmail = (studentInfo.email || '').trim().toLowerCase();
    if (!user && normalizedEmail) {
      user = (data.users || []).find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      const newId = (data.users || []).length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
      user = {
        id: newId,
        name: studentInfo.name || 'Anonymous Student',
        email: normalizedEmail || `student-${newId}@college.edu`,
        department: studentInfo.department || 'General',
        year: studentInfo.year || '1st Year',
        phone_whatsapp: studentInfo.phone || '',
        csn_esn: studentInfo.usn || `USN-${newId}`,
        password: studentInfo.password || 'password123',
        role: 'student',
        avatar: studentInfo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        interests: interests || [],
        created_at: new Date().toISOString()
      };
      if (!data.users) data.users = [];
      data.users.push(user);
    } else {
      // Sync info to student account
      if (studentInfo.name) user.name = studentInfo.name;
      if (studentInfo.department) user.department = studentInfo.department;
      if (studentInfo.phone) user.phone_whatsapp = studentInfo.phone;
      if (studentInfo.usn) user.csn_esn = studentInfo.usn;
      if (studentInfo.year) user.year = studentInfo.year;
    }
  }

  if (!user) {
    return res.status(400).json({ error: 'Please provide valid student registration details.' });
  }

  const selectedClubs = Array.isArray(clubIds) ? clubIds : [req.body.clubId].filter(Boolean);
  if (selectedClubs.length === 0 && (data.clubs || []).length > 0) {
    return res.status(400).json({ error: 'Please select a club to join.' });
  }

  // Institutional Single Club Policy: Student can apply to ONLY 1 club
  if (selectedClubs.length > 1) {
    return res.status(400).json({
      error: 'Rule violation: You can apply to only 1 club. Multiple club applications are not permitted.'
    });
  }

  // Institutional Rule: A student can apply ONLY ONCE (cannot apply for different clubs twice)
  if (!data.registrations) data.registrations = [];
  const existingActiveRegs = data.registrations.filter(r => r.user_id === user.id && r.status !== 'rejected');
  if (existingActiveRegs.length > 0) {
    const existingClub = (data.clubs || []).find(c => c.id === existingActiveRegs[0].club_id);
    return res.status(400).json({
      error: `You have already applied for ${existingClub?.name || 'a club'}. Students can apply only once.`
    });
  }

  // Also check if any duplicate account exists by email or USN that already has an active registration
  if (studentInfo) {
    const emailCheck = (studentInfo.email || '').trim().toLowerCase();
    const usnCheck = (studentInfo.usn || '').trim().toLowerCase();
    const duplicateStudent = (data.users || []).find(u => 
      u.id !== user.id && (
        (emailCheck && u.email && u.email.toLowerCase() === emailCheck) ||
        (usnCheck && u.csn_esn && u.csn_esn.toLowerCase() === usnCheck)
      )
    );
    if (duplicateStudent) {
      const duplicateReg = data.registrations.find(r => r.user_id === duplicateStudent.id && r.status !== 'rejected');
      if (duplicateReg) {
        const dupClub = (data.clubs || []).find(c => c.id === duplicateReg.club_id);
        return res.status(400).json({
          error: `An application has already been submitted for this student (${dupClub?.name || 'Club'}). Students can apply only once.`
        });
      }
    }
  }

  const clubIdNum = Number(selectedClubs[0]);
  const targetClub = (data.clubs || []).find(c => c.id === clubIdNum);
  if (!targetClub) {
    return res.status(400).json({ error: 'The selected club does not exist.' });
  }

  const nextRegId = data.registrations.length > 0 ? Math.max(...data.registrations.map(r => r.id)) + 1 : 1;
  const reg = {
    id: nextRegId,
    reg_code: `REG-2026-${nextRegId.toString().padStart(3, '0')}`,
    user_id: user.id,
    club_id: clubIdNum,
    status: 'pending',
    notes: 'Submitted via Creative Spectrum registration portal.',
    created_at: new Date().toISOString()
  };
  data.registrations.push(reg);
  targetClub.members_count = (targetClub.members_count || 0) + 1;

  saveData(data);

  // Sync to Supabase in background
  syncStudentToSupabase(user).catch(err => console.error('Supabase sync error:', err));
  syncRegistrationToSupabase(reg, targetClub?.name, user?.email).catch(err => console.error('Supabase sync reg error:', err));

  addAuditLog(user.name, 'Submitted Club Registration', `Registered for ${targetClub.name}`);

  res.json({
    message: 'Registration submitted successfully!',
    user: { id: user.id, name: user.name, email: user.email },
    registrations: [reg]
  });
});

// Student Edit Application (Permitted only during active edit window)
router.put('/user/registration/:id', (req, res) => {
  const regId = Number(req.params.id);
  const { clubId, studentInfo, userId } = req.body;

  const data = loadData();
  const windowStatus = getEditWindowStatus(data);

  if (!windowStatus.is_active) {
    return res.status(403).json({
      error: 'The application edit window is currently closed. Applications can only be edited during the scheduled time window set by the administrator.',
      time_status: windowStatus.time_status,
      window: windowStatus
    });
  }

  const reg = (data.registrations || []).find(r => r.id === regId);
  if (!reg) {
    return res.status(404).json({ error: 'Registration record not found.' });
  }

  // Verify ownership if userId is supplied
  if (userId && reg.user_id !== Number(userId)) {
    return res.status(403).json({ error: 'Unauthorized: You can only edit your own application.' });
  }

  const user = (data.users || []).find(u => u.id === reg.user_id);
  const oldClubId = reg.club_id;
  const newClubId = Number(clubId);

  // If changing club
  if (newClubId && newClubId !== oldClubId) {
    const targetClub = (data.clubs || []).find(c => c.id === newClubId);
    if (!targetClub) {
      return res.status(400).json({ error: 'Selected club does not exist.' });
    }

    // Decrement count of previous club
    const oldClub = (data.clubs || []).find(c => c.id === oldClubId);
    if (oldClub && (oldClub.members_count || 0) > 0) {
      oldClub.members_count = Math.max(0, (oldClub.members_count || 0) - 1);
    }

    // Increment count of new club
    targetClub.members_count = (targetClub.members_count || 0) + 1;

    reg.club_id = newClubId;
    reg.updated_at = new Date().toISOString();
    reg.notes = (reg.notes || '') + ` | Club modified to ${targetClub.name} during edit window on ${new Date().toLocaleDateString()}.`;
  }

  // Update student personal / academic info if provided
  if (user && studentInfo) {
    if (studentInfo.name) user.name = studentInfo.name;
    if (studentInfo.department) user.department = studentInfo.department;
    if (studentInfo.phone) user.phone_whatsapp = studentInfo.phone;
    if (studentInfo.usn) user.csn_esn = studentInfo.usn;
    if (studentInfo.year) user.year = studentInfo.year;
    if (studentInfo.interests && Array.isArray(studentInfo.interests)) {
      user.interests = studentInfo.interests;
    }
  }

  saveData(data);

  const updatedClub = (data.clubs || []).find(c => c.id === reg.club_id);
  addAuditLog(
    user?.name || 'Student',
    'Edited Application',
    `Updated application ${reg.reg_code} for ${updatedClub?.name || 'Club'}`
  );

  const userSafe = user ? { ...user } : null;
  if (userSafe) delete userSafe.password;

  res.json({
    message: 'Application updated successfully!',
    registration: {
      ...reg,
      club: updatedClub
    },
    user: userSafe
  });
});

// Admin list all registrations
router.get('/registrations', requireAdmin, (req, res) => {
  const data = loadData();
  const regs = (data.registrations || []).map(r => {
    const user = (data.users || []).find(u => u.id === r.user_id) || {};
    const club = (data.clubs || []).find(c => c.id === r.club_id) || {};
    return {
      id: r.id,
      reg_code: r.reg_code || `REG-${r.id}`,
      user_id: r.user_id,
      student_name: user.name || 'Unknown',
      student_email: user.email || '',
      department: user.department || 'N/A',
      year: user.year || 'N/A',
      phone: user.phone_whatsapp || 'N/A',
      usn: user.csn_esn || 'N/A',
      club_id: r.club_id,
      club_name: club.name || 'Unknown Club',
      club_logo: club.logo || '',
      category: club.category || '',
      status: r.status || 'pending',
      notes: r.notes || '',
      created_at: r.created_at
    };
  });

  res.json({ registrations: regs });
});

// Update registration status (Approve / Reject)
router.put('/registrations/:id/status', requireAdmin, (req, res) => {
  const regId = Number(req.params.id);
  const { status, notes } = req.body;

  const data = loadData();
  const reg = (data.registrations || []).find(r => r.id === regId);

  if (!reg) {
    return res.status(404).json({ error: 'Registration record not found' });
  }

  reg.status = status;
  if (notes !== undefined) reg.notes = notes;
  saveData(data);

  const user = (data.users || []).find(u => u.id === reg.user_id);
  const club = (data.clubs || []).find(c => c.id === reg.club_id);

  addAuditLog(
    'System Administrator',
    `${status === 'approved' ? 'Approved' : 'Rejected'} Registration`,
    `${user?.name || 'Student'} → ${club?.name || 'Club'}`
  );

  res.json({ message: `Registration status updated to ${status}`, registration: reg });
});

// User's registrations
router.get('/user/registrations/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const data = loadData();

  const userRegs = (data.registrations || []).filter(r => r.user_id === userId);
  const enriched = userRegs.map(r => {
    const club = (data.clubs || []).find(c => c.id === r.club_id);
    return {
      ...r,
      club
    };
  });

  res.json({ registrations: enriched });
});

// --- EVENTS ROUTES ---

router.get('/events', (req, res) => {
  const data = loadData();
  res.json({ events: data.events || [] });
});

router.post('/events', requireAdmin, (req, res) => {
  const { club_id, title, date, time, location, category, description, cover_image, capacity } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ error: 'Title, date, and location are required.' });
  }

  const data = loadData();
  const club = (data.clubs || []).find(c => c.id === Number(club_id));
  const newId = (data.events || []).length > 0 ? Math.max(...data.events.map(e => e.id)) + 1 : 1;

  const newEvent = {
    id: newId,
    club_id: Number(club_id) || 1,
    club_name: club?.name || 'Creative Spectrum',
    title,
    date,
    time: time || '10:00 AM – 01:00 PM',
    location,
    category: category || 'General',
    description: description || 'Club event open to campus members.',
    cover_image: cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    capacity: Number(capacity) || 100,
    registered_count: 0,
    status: 'published'
  };

  if (!data.events) data.events = [];
  data.events.push(newEvent);
  saveData(data);

  addAuditLog('System Administrator', 'Created Event', `${title} (${club?.name || 'General'})`);

  res.json({ message: 'Event created successfully', event: newEvent });
});

router.put('/events/:id', requireAdmin, (req, res) => {
  const eventId = Number(req.params.id);
  const data = loadData();
  const index = (data.events || []).findIndex(e => e.id === eventId);

  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  data.events[index] = { ...data.events[index], ...req.body, id: eventId };
  saveData(data);

  addAuditLog('System Administrator', 'Updated Event', data.events[index].title);

  res.json({ message: 'Event updated successfully', event: data.events[index] });
});

router.delete('/events/:id', requireAdmin, (req, res) => {
  const eventId = Number(req.params.id);
  const data = loadData();
  const event = (data.events || []).find(e => e.id === eventId);

  data.events = (data.events || []).filter(e => e.id !== eventId);
  saveData(data);

  if (event) {
    addAuditLog('System Administrator', 'Deleted Event', event.title);
  }

  res.json({ message: 'Event removed' });
});

// --- ANNOUNCEMENTS ROUTES ---

router.get('/announcements', (req, res) => {
  const data = loadData();
  res.json({ announcements: data.announcements || [] });
});

router.post('/announcements', requireAdmin, upload.single('image'), (req, res) => {
  const { title, description, target_club, author, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;
  const data = loadData();
  const newId = (data.announcements || []).length > 0 ? Math.max(...data.announcements.map(a => a.id)) + 1 : 1;

  const newAnn = {
    id: newId,
    title,
    description,
    target_club: target_club || 'All Clubs',
    author: author || 'Admin',
    image_url: imageUrl,
    status: status || 'published',
    created_at: new Date().toISOString()
  };

  if (!data.announcements) data.announcements = [];
  data.announcements.unshift(newAnn);
  saveData(data);

  addAuditLog('System Administrator', 'Published Announcement', title);

  res.json({ message: 'Announcement created successfully', announcement: newAnn });
});

router.delete('/announcements/:id', requireAdmin, (req, res) => {
  const annId = Number(req.params.id);
  const data = loadData();
  data.announcements = (data.announcements || []).filter(a => a.id !== annId);
  saveData(data);

  addAuditLog('System Administrator', 'Removed Announcement', `ID #${annId}`);

  res.json({ message: 'Announcement deleted' });
});

// --- MEDIA LIBRARY ROUTES ---

router.get('/media', (req, res) => {
  const data = loadData();
  res.json({ media: data.media_library || [] });
});

router.post('/media/upload', requireAdmin, upload.single('file'), (req, res) => {
  const { category, club_id, club_name } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const data = loadData();
  if (!data.media_library) data.media_library = [];

  const newMedia = {
    id: data.media_library.length + 1,
    name: req.file.originalname,
    category: category || 'Cover Images',
    url: `/uploads/${req.file.filename}`,
    club_id: club_id ? Number(club_id) : null,
    club_name: club_name || 'General Assets',
    size: `${(req.file.size / 1024).toFixed(0)} KB`,
    uploaded_at: new Date().toISOString().split('T')[0]
  };

  data.media_library.unshift(newMedia);
  saveData(data);

  addAuditLog('System Administrator', 'Uploaded Media Asset', req.file.originalname);

  res.json({ message: 'Media uploaded successfully', media: newMedia });
});

router.delete('/media/:id', requireAdmin, (req, res) => {
  const mediaId = Number(req.params.id);
  const data = loadData();
  data.media_library = (data.media_library || []).filter(m => m.id !== mediaId);
  saveData(data);

  addAuditLog('System Administrator', 'Deleted Media Asset', `Asset #${mediaId}`);

  res.json({ message: 'Media removed' });
});

// --- ADMIN STATS & AUDIT LOGS ---

router.get('/admin/stats', requireAdmin, (req, res) => {
  const data = loadData();
  const students = (data.users || []).filter(u => u.role === 'student');
  const clubs = data.clubs || [];
  const registrations = data.registrations || [];
  const events = data.events || [];

  const clubBreakdown = clubs.map(c => {
    const count = registrations.filter(r => r.club_id === c.id).length;
    return { name: c.name, count, category: c.category };
  });

  const departmentBreakdown = {};
  // Only count academic departments of students who have ACTUALLY applied
  const applicantUserIds = new Set(registrations.map(r => r.user_id));
  applicantUserIds.forEach(uid => {
    const user = (data.users || []).find(u => u.id === uid);
    if (user && user.department) {
      const dept = user.department;
      departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
    }
  });

  res.json({
    totalStudents: students.length,
    totalClubs: clubs.length,
    totalRegistrations: registrations.length,
    totalEvents: events.length,
    clubBreakdown,
    departmentBreakdown
  });
});

router.get('/admin/audit-logs', requireAdmin, (req, res) => {
  const data = loadData();
  res.json({ logs: data.audit_logs || [] });
});

// Admin Export Database to Excel (.xlsx)
router.get('/admin/export-excel', requireAdmin, (req, res) => {
  const data = loadData();
  const students = (data.users || []).filter(u => u.role === 'student');
  const wb = XLSX.utils.book_new();

  // Helper to map student and club to a flat row object
  const createRow = (u, clubNamesStr) => ({
    "Student ID": u.id,
    "Full Name": u.name,
    "Mail ID": u.email,
    "Department": u.department,
    "Academic Year": u.year,
    "Phone Number (WhatsApp)": u.phone_whatsapp,
    "CSN / USN": u.csn_esn,
    "Registered Clubs": clubNamesStr,
    "Account Created Date": u.created_at ? u.created_at.slice(0, 10) : 'N/A'
  });

  const colWidths = [
    { wch: 12 }, { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 15 },
    { wch: 25 }, { wch: 20 }, { wch: 40 }, { wch: 22 }
  ];

  // 1. All Students Sheet
  const allRows = students.map(u => {
    const userRegs = (data.registrations || []).filter(r => r.user_id === u.id && r.status !== 'rejected');
    const clubNames = userRegs.map(r => {
      const club = (data.clubs || []).find(c => c.id === r.club_id);
      return club ? `${club.name} (${r.status})` : '';
    }).filter(Boolean);
    return createRow(u, clubNames.join('; ') || 'None');
  });

  const wsAll = XLSX.utils.json_to_sheet(allRows);
  wsAll['!cols'] = colWidths;
  XLSX.utils.book_append_sheet(wb, wsAll, "All Registered Students");

  // 2. Individual Club Sheets
  (data.clubs || []).forEach(club => {
    // Find registrations for this club
    const clubRegs = (data.registrations || []).filter(r => r.club_id === club.id && r.status !== 'rejected');
    if (clubRegs.length > 0) {
      const clubRows = clubRegs.map(reg => {
        const student = students.find(s => s.id === reg.user_id);
        if (!student) return null;
        return createRow(student, `${club.name} (${reg.status})`);
      }).filter(Boolean);

      if (clubRows.length > 0) {
        const wsClub = XLSX.utils.json_to_sheet(clubRows);
        wsClub['!cols'] = colWidths;
        // Ensure sheet name is valid (max 31 chars, no special chars like ? * : \ / [ ])
        const safeSheetName = (club.name || `Club ${club.id}`).replace(/[:\\/?*\[\]]/g, '').substring(0, 31);
        XLSX.utils.book_append_sheet(wb, wsClub, safeSheetName);
      }
    }
  });

  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `creative_spectrum_registrations_${timestamp}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.send(excelBuffer);
});

// --- SPECTRUM BRANDING / LOGO CONFIGURATION ---

// Get Spectrum configuration (Public)
router.get('/spectrum-config', (req, res) => {
  const data = loadData();
  const config = data.spectrum_config || {
    title: 'Creative Spectrum',
    tagline: 'Collegiate Guilds Platform',
    logo_url: null,
    accent_color: '#C25E42',
    instagram_url: '',
    whatsapp_channel_url: '',
    social_links_badge: 'OFFICIAL CHANNELS',
    social_links_title: 'Join Our Community Channels',
    social_links_subtitle: 'Stay connected for real-time announcements, audition notifications, and club highlights.',
    hero_badge: 'Fall 2026 Society Auditions & Registrations',
    hero_title: 'Find Your',
    hero_title_highlight: 'Circle.',
    hero_subtitle: 'Discover clubs, creative communities, and campus experiences that make college far more than just a classroom.'
  };

  // Ensure official_links array exists and is populated
  if (!config.official_links || !Array.isArray(config.official_links)) {
    const defaultLinks = [];
    if (config.instagram_url) {
      defaultLinks.push({
        id: 'link-1',
        platform: 'instagram',
        title: 'Instagram',
        handle: config.instagram_url.startsWith('@') ? config.instagram_url : `@${config.instagram_url.split('/').filter(Boolean).pop() || 'bcs_spectrum'}`,
        url: config.instagram_url,
        description: 'Stories, reels, & event highlights',
        tag: 'INSTAGRAM',
        active: true,
        order: 1
      });
    }
    if (config.whatsapp_channel_url) {
      defaultLinks.push({
        id: 'link-2',
        platform: 'whatsapp',
        title: 'WhatsApp Channel',
        handle: 'Official WhatsApp Broadcast',
        url: config.whatsapp_channel_url,
        description: 'Instant audition & registration alerts',
        tag: 'WHATSAPP CHANNEL',
        active: true,
        order: 2
      });
    }
    config.official_links = defaultLinks;
  }

  res.json({ config });
});

// Update Spectrum configuration (Admin)
router.put('/spectrum-config', requireAdmin, (req, res) => {
  const { 
    title, tagline, logo_url, accent_color, 
    about_title, about_subtitle, about_section_title, about_section_body,
    hero_badge, hero_title, hero_title_highlight, hero_subtitle,
    instagram_url, whatsapp_channel_url, 
    social_links_badge, social_links_title, social_links_subtitle,
    official_links
  } = req.body;
  const data = loadData();
  if (!data.spectrum_config) {
    data.spectrum_config = {};
  }
  if (title !== undefined) data.spectrum_config.title = title;
  if (tagline !== undefined) data.spectrum_config.tagline = tagline;
  if (logo_url !== undefined) data.spectrum_config.logo_url = logo_url;
  if (accent_color !== undefined) data.spectrum_config.accent_color = accent_color;
  if (about_title !== undefined) data.spectrum_config.about_title = about_title;
  if (about_subtitle !== undefined) data.spectrum_config.about_subtitle = about_subtitle;
  if (about_section_title !== undefined) data.spectrum_config.about_section_title = about_section_title;
  if (about_section_body !== undefined) data.spectrum_config.about_section_body = about_section_body;
  if (hero_badge !== undefined) data.spectrum_config.hero_badge = hero_badge;
  if (hero_title !== undefined) data.spectrum_config.hero_title = hero_title;
  if (hero_title_highlight !== undefined) data.spectrum_config.hero_title_highlight = hero_title_highlight;
  if (hero_subtitle !== undefined) data.spectrum_config.hero_subtitle = hero_subtitle;
  if (social_links_badge !== undefined) data.spectrum_config.social_links_badge = social_links_badge;
  if (social_links_title !== undefined) data.spectrum_config.social_links_title = social_links_title;
  if (social_links_subtitle !== undefined) data.spectrum_config.social_links_subtitle = social_links_subtitle;
  if (instagram_url !== undefined) data.spectrum_config.instagram_url = instagram_url;
  if (whatsapp_channel_url !== undefined) data.spectrum_config.whatsapp_channel_url = whatsapp_channel_url;

  if (official_links !== undefined && Array.isArray(official_links)) {
    data.spectrum_config.official_links = official_links;
    // Auto sync primary instagram and whatsapp url if present in links
    const ig = official_links.find(l => l.platform === 'instagram');
    if (ig && ig.url) data.spectrum_config.instagram_url = ig.url;
    const wa = official_links.find(l => l.platform === 'whatsapp');
    if (wa && wa.url) data.spectrum_config.whatsapp_channel_url = wa.url;
  }

  saveData(data);
  addAuditLog('System Administrator', 'Updated Official Links & Spectrum Branding', data.spectrum_config.title || 'Creative Spectrum');
  res.json({ message: 'Spectrum configuration updated', config: data.spectrum_config });
});

// Add a new official link (Admin)
router.post('/spectrum-config/official-links', requireAdmin, (req, res) => {
  const { title, platform, url, handle, description, tag, active } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const data = loadData();
  if (!data.spectrum_config) data.spectrum_config = {};
  if (!Array.isArray(data.spectrum_config.official_links)) {
    data.spectrum_config.official_links = [];
  }

  const newLink = {
    id: `link-${Date.now()}`,
    title: title.trim(),
    platform: platform || 'website',
    url: url.trim(),
    handle: handle ? handle.trim() : title.trim(),
    description: description ? description.trim() : '',
    tag: tag ? tag.trim().toUpperCase() : (platform || 'LINK').toUpperCase(),
    active: active !== undefined ? Boolean(active) : true,
    order: data.spectrum_config.official_links.length + 1
  };

  data.spectrum_config.official_links.push(newLink);

  if (newLink.platform === 'instagram') data.spectrum_config.instagram_url = newLink.url;
  if (newLink.platform === 'whatsapp') data.spectrum_config.whatsapp_channel_url = newLink.url;

  saveData(data);
  addAuditLog('System Administrator', `Added Official Link: ${newLink.title}`, newLink.url);
  res.status(201).json({ message: 'Official link added', link: newLink, config: data.spectrum_config });
});

// Update an official link (Admin)
router.put('/spectrum-config/official-links/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, platform, url, handle, description, tag, active, order } = req.body;

  const data = loadData();
  if (!data.spectrum_config || !Array.isArray(data.spectrum_config.official_links)) {
    return res.status(404).json({ error: 'No official links found' });
  }

  const index = data.spectrum_config.official_links.findIndex(l => String(l.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Official link not found' });
  }

  const current = data.spectrum_config.official_links[index];
  data.spectrum_config.official_links[index] = {
    ...current,
    title: title !== undefined ? title.trim() : current.title,
    platform: platform !== undefined ? platform : current.platform,
    url: url !== undefined ? url.trim() : current.url,
    handle: handle !== undefined ? handle.trim() : current.handle,
    description: description !== undefined ? description.trim() : current.description,
    tag: tag !== undefined ? tag.trim().toUpperCase() : current.tag,
    active: active !== undefined ? Boolean(active) : current.active,
    order: order !== undefined ? Number(order) : current.order
  };

  saveData(data);
  addAuditLog('System Administrator', `Updated Official Link: ${data.spectrum_config.official_links[index].title}`, data.spectrum_config.official_links[index].url);
  res.json({ message: 'Official link updated', link: data.spectrum_config.official_links[index], config: data.spectrum_config });
});

// Delete an official link (Admin)
router.delete('/spectrum-config/official-links/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const data = loadData();
  if (!data.spectrum_config || !Array.isArray(data.spectrum_config.official_links)) {
    return res.status(404).json({ error: 'No official links found' });
  }

  const index = data.spectrum_config.official_links.findIndex(l => String(l.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Official link not found' });
  }

  const removed = data.spectrum_config.official_links.splice(index, 1)[0];
  saveData(data);
  addAuditLog('System Administrator', `Deleted Official Link: ${removed.title}`, removed.url);
  res.json({ message: 'Official link deleted', removedId: id, config: data.spectrum_config });
});

// Reorder official links (Admin)
router.put('/spectrum-config/official-links-reorder', requireAdmin, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array is required' });
  }

  const data = loadData();
  if (!data.spectrum_config || !Array.isArray(data.spectrum_config.official_links)) {
    return res.status(404).json({ error: 'No official links found' });
  }

  const linkMap = new Map(data.spectrum_config.official_links.map(l => [String(l.id), l]));
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    const item = linkMap.get(String(id));
    if (item) {
      item.order = idx + 1;
      reordered.push(item);
      linkMap.delete(String(id));
    }
  });

  // Append any remaining
  for (const item of linkMap.values()) {
    item.order = reordered.length + 1;
    reordered.push(item);
  }

  data.spectrum_config.official_links = reordered;
  saveData(data);
  res.json({ message: 'Official links reordered', config: data.spectrum_config });
});

// Upload Spectrum Logo (Admin)
router.post('/spectrum-config/upload', requireAdmin, upload.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No logo image uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const data = loadData();
  if (!data.spectrum_config) {
    data.spectrum_config = {};
  }
  data.spectrum_config.logo_url = fileUrl;

  if (!data.media_library) data.media_library = [];
  data.media_library.push({
    id: data.media_library.length + 1,
    name: req.file.originalname,
    category: 'Spectrum Identity',
    url: fileUrl,
    club_id: null,
    club_name: 'Creative Spectrum Hub',
    size: `${(req.file.size / 1024).toFixed(0)} KB`,
    uploaded_at: new Date().toISOString().split('T')[0]
  });

  saveData(data);
  addAuditLog('System Administrator', 'Uploaded Custom Spectrum Logo', req.file.originalname);
  res.json({ message: 'Custom Spectrum logo uploaded successfully', config: data.spectrum_config });
});

export default router;
