import { createClient } from '@supabase/supabase-js';

const url: any = process.env.REACT_APP_SUPABASE_URL;
const anonKey: any = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(url, anonKey);

export default supabase;
