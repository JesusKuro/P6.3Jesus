// --- frontend/app.js ---

//const API_URL =  'http://localhost:3000/users';
const API_URL = 'http://192.168.100.131:3000/users'; //Indicar IP del servidor
const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');

// Función para mostrar una sección
function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll('main section');
    //secciones.forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
};
window.onload = () => {
    document.getElementById('btnDelete').style.display = 'none';
    // Evento para cargar usuarios al inicio
    fetchUsers();
};

// Función para obtener y mostrar usuarios
async function fetchUsers() {

    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      const users = await response.json();      
      userList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.user} | ${user.dni} | ${user.phone} | ${user.email}`;          
        userList.appendChild(li);
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
};
  

const btnDelete = document.getElementById('btnDelete');

btnDelete.addEventListener('click', async (event) => {
  event.preventDefault();
  
  const userId = document.getElementById('userId').value; // Obtener el ID del usuario si se está editando

  try {
      if (userId) { // Si existe userId, estamos editando el usuario
        const response = await fetch(`${API_URL}/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, dni, phone, email })
        });
        
        if (response.ok) {
          alert('Usuario eliminado correctamente');
          fetchUsers(); // Recargar la lista de usuarios
          userForm.reset(); // Borrar datos del formulario
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }  

  userForm.reset();
  document.getElementById('userId').value = ''; //Borrar a mano el campo oculto 'hidden'
  btnDelete.style.display = 'none'; //Oculta botón
});

// Función para cambio de etiqueta en botón submit y borrar formulario
userForm.addEventListener('reset', async (event) => {
  event.preventDefault();
  document.getElementById('formTitle').innerText = 'Crear usuario';
  document.getElementById('btnNewUpd').innerText = 'Crear';
  //userForm.reset(); // Borrar datos del formulario
  document.getElementById('userId').value = ''; //Borrar a mano el campo oculto 'hidden'
  document.getElementById('user').value = '';
  document.getElementById('dni').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
  document.getElementById('btnDelete').style.display = 'none';
});

// Evento para crear o modificar un usuario
userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userId = document.getElementById('userId').value; // Obtener el ID del usuario si se está editando
  const user = document.getElementById('user').value;
  const dni = document.getElementById('dni').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;

  const method = userId ? 'PUT' : 'POST';  // Si hay ID, es una actualización, si no, es creación

  console.log(`method ---> ${method}`);

  try {
    if (userId) { // Si existe userId, estamos editando el usuario
      const response = await fetch(`${API_URL}/${userId}`, {
        method: method, //method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, dni, phone, email })
      });
      
      if (response.ok) {
        alert('Usuario modificado correctamente');
        fetchUsers(); // Recargar la lista de usuarios
        userForm.reset(); // Borrar datos del formulario
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } else { // Si no existe userId, estamos creando un nuevo usuario
        const response = await fetch(API_URL, {      
        method: method, //method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, dni, phone, email })
      });
      
      if (response.ok) {
        alert('Usuario creado correctamente');
        fetchUsers(); // Recargar la lista de usuarios
        userForm.reset(); // Borrar datos del formulario
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

const ul = document.getElementById('userList');

ul.addEventListener('click', (event) => {
  
  if (event.target.tagName === 'LI'){
    const items = Array.from(ul.children);
    const index = items.indexOf(event.target);
   
    loadUserToEdit(index + 1)
  }
});

function loadUserToEdit(userId) {

  document.getElementById('btnDelete').style.display = 'inline';
  fetch(`${API_URL}/${userId}`)
    .then(response => response.json())
    .then(user => {
      // Cargar los datos del usuario en el formulario
      document.getElementById('userId').value = user.id;  // Asigna el ID al campo oculto
      document.getElementById('user').value = user.user;
      document.getElementById('dni').value = user.dni;
      document.getElementById('phone').value = user.phone;
      document.getElementById('email').value = user.email;
      document.getElementById('formTitle').innerText = 'Modificar usuario';
      document.getElementById('btnNewUpd').innerText = 'Modificar';
      console.log(`Load ID: ${document.getElementById('userId').value}`);
    })
    .catch(error => alert(`Error: ${error.message}`));
};
  
  


