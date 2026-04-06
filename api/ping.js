import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,       // ajuste pro nome das suas env vars
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Chave secreta pra ninguém chamar esse endpoint à toa
  if (req.headers['x-ping-secret'] !== process.env.PING_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) throw error;

    return res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}