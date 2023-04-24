import { createClient } from '@supabase/supabase-js';
import CONFIG from '@/utils/config';

const supabaseUrl = 'https://woxxryzzlgwgafpapebm.supabase.co';
const supabaseKey = CONFIG.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;