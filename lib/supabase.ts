import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Audit Persistence Interface
 */
export interface SavedAudit {
  id: string;
  email?: string;
  company_name?: string;
  role?: string;
  request_data: any;
  report_data: any;
  created_at?: string;
}
