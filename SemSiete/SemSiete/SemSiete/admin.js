let prendas = JSON.parse(localStorage.getItem('prendas')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderizarPrendas();
    document.getElementById('form-prenda').addEventListener('submit', guardarPrenda);
});

function guardarPrenda(e) {
    e.preventDefault();

    const id = document.getElementById('prenda-id').value;
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const imagen = document.getElementById('imagen').value;

    const prenda = {
        id: id ? parseInt(id) : Date.now(),
        nombre,
        categoria,
        precio,
        imagen: imagen || 'img/default-product.jpg'
    };

    if (id) {
        const index = prendas.findIndex(p => p.id === parseInt(id));
        prendas[index] = prenda;
    } else {
        prendas.push(prenda);
    }

    localStorage.setItem('prendas', JSON.stringify(prendas));
    renderizarPrendas();
    cancelarEdicion();
}

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

function eliminarPrenda(id) {
    if (confirm('¿Estás seguro de eliminar esta prenda?')) {
        prendas = prendas.filter(p => p.id !== id);
        localStorage.setItem('prendas', JSON.stringify(prendas));
        renderizarPrendas();
    }
}

function cancelarEdicion() {
    document.getElementById('form-prenda').reset();
    document.getElementById('prenda-id').value = '';
    document.getElementById('form-title').textContent = 'Agregar Prenda';
}