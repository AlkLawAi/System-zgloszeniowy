// URL do funkcji Netlify (uwaga: pojedynczy slash)
const NETLIFY_FN = 'https://cheery-vacherin-08fb11.netlify.app/.netlify/functions/tasks';

// Renderowanie zadań w DOM
function renderTasks(tasks) {
  const list = document.querySelector('#taskList');
  if (!list) return;
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    list.appendChild(li);
  });
}

// Pobranie listy zadań i render
async function loadTasks() {
  try {
    const res = await fetch(NETLIFY_FN);
    if (!res.ok) {
      console.error('Błąd GET:', res.status);
      return;
    }
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    console.error('Błąd GET:', err);
  }
}

// Dodanie nowego zadania
async function addTask(text) {
  try {
    const res = await fetch(NETLIFY_FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Błąd POST:', err);
      return;
    }
    const newTask = await res.json();
    console.log('Dodane zadanie:', newTask);
    await loadTasks(); // odśwież listę
  } catch (err) {
    console.error('Błąd POST:', err);
  }
}

// Event dla przycisku dodawania zadania
document.querySelector('#addBtn').addEventListener('click', () => {
  const val = document.querySelector('#taskInput').value.trim();
  if (!val) return;
  addTask(val);
});

// Załaduj zadania przy starcie strony
window.addEventListener('load', loadTasks);
