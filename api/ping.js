export default async function handler(req, res) {
  return res.status(200).json({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY ? 'exists' : 'missing',
    secret: process.env.PING_SECRET ? 'exists' : 'missing',
  });
}

// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_ANON_KEY
// );

// export default async function handler(req, res) {
//   if (req.headers['x-ping-secret'] !== process.env.PING_SECRET) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const { error } = await supabase.from('profiles').select('id').limit(1);

//     if (error) throw error;

//     return res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
//   } catch (err) {
//     return res.status(500).json({ ok: false, error: err.message });
//   }
// }