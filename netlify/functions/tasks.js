// netlify/functions/tasks.js
import { createClient } from '@supabase/supabase-js';

// Pobieramy URL i klucz z Netlify environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_KEY:", supabaseKey ? "✅ Klucz ustawiony" : "❌ Brak klucza");

const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event, context) {
  console.log("➡️ Metoda:", event.httpMethod);

  // GET – pobierz wszystkie zadania
  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error("❌ Supabase GET error:", error.message);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Supabase GET failed", details: error.message })
        };
      }

      console.log("✅ Supabase GET ok, rekordów:", data.length);
      return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
      console.error("❌ Exception GET:", err.message);
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  // POST – dodaj nowe zadanie
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      console.log("➡️ POST body:", body);

      const newTask = {
        text: body.text,
        description: body.description || '',
        date: body.date || null,
        priority: body.priority || 'Niski',
        link: body.link || '',
        assignedTo: body.assignedTo || null,
        status: body.status || 'Nowy',
        createdBy: body.createdBy || 'Anonim',
        createdAt: body.createdAt || new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase POST error:", error.message);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Supabase POST failed", details: error.message })
        };
      }

      console.log("✅ Supabase POST ok, ID:", data.id);
      return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
      console.error("❌ Exception POST:", err.message);
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  console.warn("⚠️ Metoda nieobsługiwana:", event.httpMethod);
  return { statusCode: 405, body: 'Method Not Allowed' };
}
