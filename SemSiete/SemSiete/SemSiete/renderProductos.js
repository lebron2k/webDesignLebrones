// Función para renderizar productos por categoría (camisa, pantalón, etc.)
function renderizarPorCategoria(categoria) {
  // Obtiene todos los productos desde localStorage
  const prendas = JSON.parse(localStorage.getItem('prendas')) || [];

  // Filtra por categoría (ignora mayúsculas/minúsculas)
  const filtradas = prendas.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());

  // Busca el contenedor donde se mostrarán los productos
  const container = document.getElementById('productos-container');

  // Si no existe contenedor, no hace nada
  if (!container) return;

  // Genera el HTML de cada producto y lo inserta
  container.innerHTML = filtradas.map(prenda => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="product">
        <div class="imgbox">
          <img src="${prenda.imagen}" alt="${prenda.nombre}">
        </div>
        <div class="specifies">
          <h2>${prenda.nombre}<br><span>${prenda.categoria}</span></h2>
          <div class="price">$${prenda.precio}</div>
          <label>Talla</label>
          <ul><li>M</li></ul>
          <label>Colores</label>
          <ul class="colors">
            <li></li>
            <li></li>
          </ul>
          <button class="btn-card" onclick="agregarAlCarrito(${prenda.id}, '${prenda.nombre}', '${prenda.categoria}', ${prenda.precio}, '${prenda.imagen}', this)">
            Comprar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}