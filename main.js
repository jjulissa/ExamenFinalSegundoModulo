const API_URL = 'http://127.0.0.1:5000/api/tasks';

const form = document.getElementById('form-tarea');
const lista = document.getElementById('lista-tareas');
const inputTitulo = document.getElementById('titulo');
const selectPrioridad = document.getElementById('prioridad');

let filtroActivo = '';

// Mostrar tareas al cargar la página
window.addEventListener('DOMContentLoaded', cargarTareas(filtroActivo));

// Manejar envío del formulario
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const errorDiv = document.getElementById('error-msg');
  errorDiv.textContent = '';
  const title = inputTitulo.value.trim();
  const priority = selectPrioridad.value;
  if (!title) {
    errorDiv.textContent = 'El título es obligatorio';
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, priority })
  })
  .then(async res => {
    if (!res.ok) {
      const data = await res.json();
      errorDiv.textContent = data.error || 'Error al agregar tarea';
      return;
    }
    return res.json();
  })
  .then(task => {
    if (task) {
      agregarTareaAlDOM(task);
      form.reset();
      errorDiv.textContent = '';
    }
  });
});


// Función para cargar tareas existentes
function cargarTareas(priority = '') {
  let url = API_URL;
  if (priority) {
    url += `?priority=${priority}`;
  }
  fetch(url)
    .then(res => res.json())
    .then(tasks => {
      lista.innerHTML = '';
      tasks.forEach(agregarTareaAlDOM);
    });
}


// Función para agregar una tarea al DOM
function agregarTareaAlDOM(task) {
  const li = document.createElement('li');
  li.textContent = `${task.title} [${task.priority}]`;

  // Botón eliminar
  const btn = document.createElement('button');
  btn.textContent = 'Eliminar';
  btn.style.marginLeft = '12px';
  btn.style.background = '#ff6600';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.padding = '4px 10px';
  btn.style.cursor = 'pointer';

  btn.onclick = function() {
    fetch(`${API_URL}/${task.id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => li.remove());
  };

  li.appendChild(btn);
  lista.appendChild(li);
}

const filtroBtns = document.querySelectorAll('.filtro-btn');
filtroBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filtroBtns.forEach(b => b.classList.remove('activo'));
    this.classList.add('activo');
    filtroActivo = this.getAttribute('data-priority');
    cargarTareas(filtroActivo);
  });
});

