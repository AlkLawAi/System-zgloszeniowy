const NETLIFY_FN = 'https://cheery-vacherin-08fb11.netlify.app/.netlify/functions/tasks';

// Pobranie listy zadań i render
async function loadTasks() {
  const res = await fetch(NETLIFY_FN);
  if (!res.ok) { console.error('Błąd GET'); return; }
  const tasks = await res.json();
  // tutaj zrób render do DOM
  console.log(tasks);
}

// Dodanie zadania
async function addTask(text) {
  const res = await fetch(NETLIFY_FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Błąd POST', err);
    return;
  }
  const newTask = await res.json();
  console.log('Dodane:', newTask);
  await loadTasks();
}

// przykładowe użycie:
document.querySelector('#addBtn').addEventListener('click', () => {
  const val = document.querySelector('#taskInput').value.trim();
  if (!val) return;
  addTask(val);
});
window.addEventListener('load', loadTasks);

