import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://dcbdelqrytecswwthdfz.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_KEY || 'SUPABASE_CLIENT_API_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);