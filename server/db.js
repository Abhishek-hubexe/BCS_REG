import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadStateFromSupabase, syncStateToSupabase } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultJsonPath = path.join(__dirname, 'bcs_data.json');
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const jsonPath = isServerless ? path.join('/tmp', 'bcs_data.json') : defaultJsonPath;

let inMemoryData = null;

try {
  const remoteData = await loadStateFromSupabase();
  if (remoteData) {
    inMemoryData = remoteData;
  } else {
    // Fallback to local default file
    if (fs.existsSync(defaultJsonPath)) {
      inMemoryData = JSON.parse(fs.readFileSync(defaultJsonPath, 'utf8'));
    } else {
      inMemoryData = { users: [], clubs: [], registrations: [], events: [], announcements: [], audit_logs: [], media_library: [] };
    }
  }
} catch (e) {
  console.error('Initial data load failed:', e);
  inMemoryData = { users: [], clubs: [], registrations: [], events: [], announcements: [], audit_logs: [], media_library: [] };
}

export function loadData() {
  return inMemoryData;
}

export function saveData(data) {
  inMemoryData = data;
  
  // Fire and forget sync to Supabase (Vercel persistence)
  syncStateToSupabase(data).catch(console.error);

  try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to bcs_data.json:', err);
  }
}

export function addAuditLog(adminName, action, objectName) {
  const data = loadData();
  if (!data.audit_logs) data.audit_logs = [];
  const newLog = {
    id: data.audit_logs.length > 0 ? Math.max(...data.audit_logs.map(l => l.id)) + 1 : 1,
    admin_name: adminName || 'System Administrator',
    action,
    object_name: objectName,
    timestamp: new Date().toISOString()
  };
  data.audit_logs.unshift(newLog);
  saveData(data);
  return newLog;
}

const db = {
  loadData,
  saveData,
  addAuditLog,

  // Simple compatibility layer for legacy calls
  serialize: (cb) => cb && cb(),

  get: (query, params, callback) => {
    const data = loadData();
    if (query.includes('FROM users WHERE email = ? AND password = ?')) {
      const user = data.users.find(u => u.email.toLowerCase() === (params[0] || '').toLowerCase() && u.password === params[1]);
      callback(null, user);
    } else if (query.includes('FROM users WHERE email = ?')) {
      const user = data.users.find(u => u.email.toLowerCase() === (params[0] || '').toLowerCase());
      callback(null, user);
    } else if (query.includes('FROM users WHERE id = ?')) {
      const user = data.users.find(u => u.id === Number(params[0]));
      callback(null, user);
    } else {
      callback(null, null);
    }
  },

  all: (query, params, callback) => {
    const data = loadData();
    if (query.includes('FROM clubs')) {
      callback(null, data.clubs || []);
    } else if (query.includes('FROM announcements')) {
      callback(null, data.announcements || []);
    } else if (query.includes('FROM events')) {
      callback(null, data.events || []);
    } else {
      callback(null, []);
    }
  }
};

export default db;
