
// Carga productos desde localStorage y mezcla con los quemados
let prendas = [];

function inicializarPrendas() {
  const guardadas = JSON.parse(localStorage.getItem('prendas')) || [];
  const quemadosNoAgregados = productosQuemados.filter(q =>
    !guardadas.some(g => g.id === q.id)
  );
  prendas = [...guardadas, ...quemadosNoAgregados];
  localStorage.setItem('prendas', JSON.stringify(prendas));
}

// Al cargar la página:
// 1. Mezcla productos
// 2. Renderiza tarjetas
// 3. Escucha formulario y archivo de imagen
document.addEventListener('DOMContentLoaded', () => {
  inicializarPrendas();
  renderizarPrendas();
  document.getElementById('form-prenda').addEventListener('submit', guardarPrenda);
  document.getElementById('imagenFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        document.getElementById('imagen').value = event.target.result; // base64
      };
      reader.readAsDataURL(file);
    }
  });
});

// Guarda o actualiza un producto
function guardarPrenda(e) {
  e.preventDefault(); // evita recargar página
  const id = document.getElementById('prenda-id').value;
  const nombre = document.getElementById('nombre').value;
  const categoria = document.getElementById('categoria').value;
  const precio = parseFloat(document.getElementById('precio').value);
  const imagen = document.getElementById('imagen').value;

  const prenda = {
    id: id ? parseInt(id) : Date.now(), // nuevo ID si es creación
    nombre,
    categoria,
    precio,
    imagen: imagen || 'img/default-product.jpg'
  };

  if (id) {
    // Editar: reemplaza el producto existente
    const index = prendas.findIndex(p => p.id === parseInt(id));
    prendas[index] = prenda;
  } else {
    // Crear: agrega al array
    prendas.push(prenda);
  }

  localStorage.setItem('prendas', JSON.stringify(prendas));
  renderizarPrendas();
  cancelarEdicion();
}

// Pinta todas las tarjetas en el admin
function renderizarPrendas() {
  const container = document.getElementById('prendas-container');
  container.innerHTML = prendas.map(prenda => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="prenda-card">
        <img src="${prenda.imagen}" alt="${prenda.nombre}">
        <h5>${prenda.nombre}</h5>
        <p>${prenda.categoria} - $${prenda.precio}</p>
        <div class="acciones">
          <button class="btn-editar" onclick="editarPrenda(${prenda.id})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarPrenda(${prenda.id})">Eliminar</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Carga datos al formulario para editar
function editarPrenda(id) {
  const prenda = prendas.find(p => p.id === id);
  if (prenda) {
    document.getElementById('prenda-id').value = prenda.id;
    document.getElementById('nombre').value = prenda.nombre;
    document.getElementById('categoria').value = prenda.categoria;
    document.getElementById('precio').value = prenda.precio;
    document.getElementById('imagen').value = prenda.imagen;
    document.getElementById('form-title').textContent = 'Editar Prenda';
  }
}

// Borra producto tras confirmar
function eliminarPrenda(id) {
  if (confirm('¿Estás seguro de eliminar esta prenda?')) {
    prendas = prendas.filter(p => p.id !== id);
    localStorage.setItem('prendas', JSON.stringify(prendas));
    renderizarPrendas();
  }
}

// Limpia el formulario y vuelve a modo "crear"
function cancelarEdicion() {
  document.getElementById('form-prenda').reset();
  document.getElementById('prenda-id').value = '';
  document.getElementById('form-title').textContent = 'Agregar Prenda';
}