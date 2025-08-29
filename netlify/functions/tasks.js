// netlify/functions/tasks.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function handler(event, context) {
  // GET – pobierz wszystkie zadania
  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  // POST – dodaj nowe zadanie
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
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
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
}
