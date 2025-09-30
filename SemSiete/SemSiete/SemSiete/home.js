
// Selecciona una prenda por categoría para mostrar en el carrusel
const masVendidos = [
  productosQuemados.find(p => p.categoria === "Camisa"),
  productosQuemados.find(p => p.categoria === "Pantalon"),
  productosQuemados.find(p => p.categoria === "Zapato"),
  productosQuemados.find(p => p.categoria === "Gorra")
].filter(Boolean); // Elimina valores nulos si no encuentra alguna

// Referencia al contenedor del carrusel
const carouselInner = document.getElementById('carousel-productos');

// Genera un slide por producto
masVendidos.forEach((prenda, index) => {
  const active = index === 0 ? 'active' : ''; // solo el primero es visible al cargar
  const slide = `
    <div class="carousel-item ${active}">
      <div class="d-flex justify-content-center">
        <div class="product" style="max-width: 300px;">
          <div class="imgbox">
            <img src="${prenda.imagen}" alt="${prenda.nombre}">
          </div>
          <div class="specifies">
            <h2>${prenda.nombre}<br><span>${prenda.categoria}</span></h2>
            <div class="price">$${prenda.precio}</div>
            <label>Talla</label><ul><li>M</li></ul>
            <label>Colores</label><ul class="colors"><li></li><li></li></ul>
            <button class="btn-card" onclick="agregarAlCarrito(${prenda.id}, '${prenda.nombre}', '${prenda.categoria}', ${prenda.precio}, '${prenda.imagen}', this)">
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  carouselInner.innerHTML += slide;
});