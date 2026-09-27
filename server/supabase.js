import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    console.log('✅ Supabase client connected:', supabaseUrl);
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.warn('⚠️ Supabase credentials not fully configured in environment.');
}

/**
 * Inserts or updates a student account in Supabase
 */
export async function syncStudentToSupabase(student) {
  if (!supabase) return null;
  try {
    const studentPayload = {
      full_name: student.name || 'Student',
      email: (student.email || '').trim().toLowerCase(),
      department: student.department || 'General',
      year_of_study: student.year || '1st Year',
      phone_whatsapp: student.phone_whatsapp || student.phone || '',
      phone: student.phone_whatsapp || student.phone || '',
      csn_esn: student.csn_esn || '',
      password_hash: student.password || '',
      role: student.role || 'student',
      avatar: student.avatar || '',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('students')
      .upsert(studentPayload, { onConflict: 'email' })
      .select();

    if (error) {
      console.warn('Supabase sync student notice:', error.message);
      return null;
    }
    return data?.[0] || null;
  } catch (e) {
    console.error('Error syncing student to Supabase:', e.message);
    return null;
  }
}

/**
 * Records a club registration / audition application in Supabase
 */
export async function syncRegistrationToSupabase(reg, clubName = '', studentEmail = '') {
  if (!supabase) return null;
  try {
    const payload = {
      reg_code: reg.reg_code,
      user_id: reg.user_id,
      student_email: studentEmail,
      club_id: reg.club_id,
      club_name: clubName,
      status: reg.status || 'pending',
      notes: reg.notes || '',
      created_at: reg.created_at || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('registrations')
      .upsert(payload, { onConflict: 'reg_code' })
      .select();

    if (error) {
      console.warn('Supabase sync registration notice:', error.message);
      return null;
    }
    return data?.[0] || null;
  } catch (e) {
    console.error('Error syncing registration to Supabase:', e.message);
    return null;
  }
}

/**
 * Persist bcs_data.json to Supabase to survive Vercel cold starts
 */
export async function syncStateToSupabase(appData) {
  if (!supabase) return null;
  try {
    const { error } = await supabase.from('app_state').upsert({ id: 1, data: appData });
    if (error) console.error('Supabase sync app_state error:', error.message);
  } catch (e) {
    console.error('Error syncing app_state:', e.message);
  }
}

export async function loadStateFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('app_state').select('data').eq('id', 1).single();
    if (error || !data) return null;
    return data.data;
  } catch (e) {
    return null;
  }
}

export default supabase;
