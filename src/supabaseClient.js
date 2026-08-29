import { createClient } from '@supabase/supabase-js';

// URL corrigida (sem o /rest/v1/)
const supabaseUrl = 'https://xdvfcmbxagsrqdljekdm.supabase.co';

// Substitua pelo texto gigante da sua chave anon public
const supabaseKey = 'sb_publishable_-IlnrdqIulQEGqzUVmVabQ_0z3ykdwL';

export const supabase = createClient(supabaseUrl, supabaseKey);