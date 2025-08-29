// netlify/functions/tasks.js
export const handler = async (event) => {
  const SUPABASE_URL = process.env.SUPABASE_URL; // np. https://xyz.supabase.co
  const SUPABASE_KEY = process.env.SUPABASE_KEY; // service_role key (trzymaj w Netlify env)

  const CORS = {
    'Access-Control-Allow-Origin': '*', // możesz tutaj podać konkretną domenę
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*&order=created_at.asc`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      });
      if (!res.ok) throw new Error(`Supabase GET failed: ${res.status}`);
      const tasks = await res.json();
      return { statusCode: 200, headers: CORS, body: JSON.stringify(tasks) };
    }

    if (event.httpMethod === 'POST') {
      const payload = event.body ? JSON.parse(event.body) : {};
      if (!payload.text) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing text' }) };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation'
        },
        body: JSON.stringify([{ text: payload.text, done: payload.done ?? false }]),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Supabase POST failed: ${res.status} ${txt}`);
      }
      const inserted = await res.json();
      return { statusCode: 201, headers: CORS, body: JSON.stringify(inserted[0]) };
    }

    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
