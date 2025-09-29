

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

document.getElementById("form-registro")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let a = document.getElementById("fullname").value;
  let b = document.getElementById("email").value;
  let c = document.getElementById("password").value;
  let d = document.getElementById("confirm-password").value;

  crearUsuario(a, b, c, d);
});

document.getElementById("form-login")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let a = document.getElementById("email").value;
  let b = document.getElementById("password").value;

  inicioSesion(a, b);
});

function crearUsuario(nombre, email, password, confirmPassword) {
  if (password === confirmPassword) {
   
    if (usuarios.find(user => user.email === email)) {
      alert("Este correo ya está registrado");
      return;
    }

    let nuevoUsuario = {
      nombre: nombre,
      email: email,
      password: password,
      fechaRegistro: new Date().getTime()
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    crearCarritoParaUsuario(email);
    mostrarMensaje("Usuario registrado con éxito", "success");
    setTimeout(() => {
      if (window.location.pathname.includes('register')) {
        window.location.href = 'login.html';
      }
    }, 2000);
  } else {
    mostrarError();
  }
}

function inicioSesion(email, password) {
  let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
  
  const usuario = usuariosGuardados.find(user => user.email === email && user.password === password);
  
  if (usuario) {
    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      fechaLogin: new Date().getTime()
    }));
    
    // Crear carrito si no existe para este usuario
    crearCarritoParaUsuario(email);
    
    mostrarMensaje(`¡Bienvenido ${usuario.nombre}!`, "success");
    
    // Redirigir a la página principal
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1500);
    
  } else {
    mostrarMensaje("Credenciales incorrectas", "error");
  }
}

function obtenerUsuarioLogueado() {
  return JSON.parse(localStorage.getItem("usuarioLogueado"));
}

// Función para verificar si hay usuario logueado
function estaLogueado() {
  return localStorage.getItem("usuarioLogueado") !== null;
}

function crearCarritoParaUsuario(email) {
  let carritos = JSON.parse(localStorage.getItem('carritos')) || {};
  if (!carritos[email]) {
    carritos[email] = [];
    localStorage.setItem('carritos', JSON.stringify(carritos));
  }
}

function mostrarMensaje(mensaje, tipo = "info") {
  // Crear o usar notificación existente
  let notification = document.getElementById('user-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'user-notification';
    notification.className = 'user-notification';
    document.body.appendChild(notification);
    
    // Agregar estilos
    if (!document.getElementById('user-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'user-notification-styles';
      style.textContent = `
        .user-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 10px;
          color: white;
          font-weight: 500;
          z-index: 1060;
          transform: translateX(400px);
          transition: transform 0.5s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          max-width: 300px;
        }
        
        .user-notification.show {
          transform: translateX(0);
        }
        
        .user-notification.success { background-color: #28a745; }
        .user-notification.error { background-color: #dc3545; }
        .user-notification.info { background-color: #17a2b8; }
        .user-notification.warning { background-color: #ffc107; color: #000; }
        
        @media (max-width: 768px) {
          .user-notification {
            top: 20px;
            right: 20px;
            left: 20px;
            max-width: none;
            transform: translateY(-100px);
          }
          
          .user-notification.show {
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Remover clases de tipo anteriores
  notification.classList.remove('success', 'error', 'info', 'warning');
  
  // Agregar clase de tipo
  notification.classList.add(tipo);
  
  notification.innerHTML = `<strong>${mensaje}</strong>`;
  notification.classList.add('show');
  
  // Auto-ocultar después de 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}


function requiereLogin() {
  if (!estaLogueado()) {
    mostrarMensaje('Debes iniciar sesión para realizar esta acción', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return false;
  }
  return true;
}

function mostrarError() {
  document.getElementById("popup-error").style.display = "flex";
}

function cerrarError() {
  document.getElementById("popup-error").style.display = "none";
}


// Exportar funciones para uso global
window.crearUsuario = crearUsuario;
window.inicioSesion = inicioSesion;
window.obtenerUsuarioLogueado = obtenerUsuarioLogueado;
window.estaLogueado = estaLogueado;
window.requiereLogin = requiereLogin;