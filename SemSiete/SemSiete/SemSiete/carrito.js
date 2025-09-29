
// Esperar a que todo esté cargado, se renderiza para mostrar dinamicamente el contenido 
//Toma los datos del carrito obtenido de carritoManager
document.addEventListener('DOMContentLoaded', function () {
    // Verificar que el carritoManager exista
    if (typeof window.carritoManager === 'undefined') {
        console.error('CarritoManager no está disponible');
        return;
    }

    // Renderizar el carrito
    renderizarCarrito();
    actualizarTotal();

    // Se actualiza la pagina cada 10s 
    setInterval(() => {
        window.carritoManager.recargarCarrito();
        renderizarCarrito();
        actualizarTotal();
    }, 10000);
});



// Función para renderizar el carrito
function renderizarCarrito() {
    const contenedor = document.getElementById('productos-carrito');
    const btnVaciar = document.getElementById('btn-vaciar');
    const totalCarrito = document.getElementById('total-carrito');

    if (!contenedor) return;

    const carrito = window.carritoManager.obtenerCarrito();
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <div class="carrito-vacio-icono">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Compra en Moneyless para siempre andar con estilo</p>
            </div>
        `;
        if (btnVaciar) btnVaciar.style.display = 'none';
        if (totalCarrito) totalCarrito.style.display = 'none';
        return;
    }

    if (btnVaciar) btnVaciar.style.display = 'inline-block';
    if (totalCarrito) totalCarrito.style.display = 'block';
    //Genera el codigo HTML con la caracteristica de js de string interpolation y lo une con join al final
    contenedor.innerHTML = carrito.map((producto, index) => `
        <div class="producto-carrito" data-id="${producto.id}" style="animation-delay: ${index * 0.1}s">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Crect fill=\\'%23f8f8f8\\' width=\\'100\\' height=\\'100\\'/%3E%3Ctext x=\\'50\\' y=\\'50\\' font-size=\\'12\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\'%3EImagen%3C/text%3E%3C/svg%3E'">
            
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-categoria">${producto.categoria}</p>
                
                <div class="opciones-producto">
                    <div class="selector-talla">
                        <label>Talla:</label>
                        <select onchange="actualizarTalla(${producto.id}, this.value)">
                            ${generarOpcionesTalla(producto.categoria, producto.talla)}
                        </select>
                    </div>
                    
                    <div class="selector-color">
                        <label>Color:</label>
                        <div class="colores-opciones">
                            <div class="color-option color-negro ${producto.color === 'negro' ? 'selected' : ''}" 
                                 onclick="actualizarColor(${producto.id}, 'negro', this)"></div>
                            <div class="color-option color-gris ${producto.color === 'gris' ? 'selected' : ''}" 
                                 onclick="actualizarColor(${producto.id}, 'gris', this)"></div>
                            <div class="color-option color-blanco ${producto.color === 'blanco' ? 'selected' : ''}" 
                                 onclick="actualizarColor(${producto.id}, 'blanco', this)"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="producto-precio">$${producto.precio}</div>
            
            <div class="botones-producto">
                <button class="btn-cancelar" onclick="eliminarProducto(${producto.id})">
                    ✕ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Generar opciones de talla según categoría
function generarOpcionesTalla(categoria, tallaActual) {
    let opciones = [];

    switch (categoria.toLowerCase()) {
        case 'gorra':
            opciones = ['30-42'];
            break;
        case 'zapato':
            opciones = ['38', '39', '40', '41', '42', '43', '44', '45'];
            break;
        case 'pantalon':
            opciones = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            break;
        default:
            opciones = ['XS', 'S', 'M', 'L', 'XL'];
    }

    return opciones.map(talla =>
        `<option value="${talla}" ${talla === tallaActual ? 'selected' : ''}>${talla}</option>`
    ).join('');
}

// Actualizar total
function actualizarTotal() {
    const total = window.carritoManager.obtenerTotal();
    const totalElement = document.getElementById('total-precio');
    if (totalElement) {
        totalElement.textContent = `$${total}`;
    }
}

// Actualizar talla del producto
function actualizarTalla(id, nuevaTalla) {
    window.carritoManager.actualizarTalla(id, nuevaTalla);
}

// Actualizar color del producto
function actualizarColor(id, nuevoColor, elemento) {
    // Actualizar selección visual
    const coloresContainer = elemento.parentNode;
    coloresContainer.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    elemento.classList.add('selected');

    // Actualizar en el carrito
    window.carritoManager.actualizarColor(id, nuevoColor);
}

// Eliminar producto del carrito
function eliminarProducto(id) {
    const carrito = window.carritoManager.obtenerCarrito();
    const producto = carrito.find(item => item.id === id);

    if (confirm(`¿Estás seguro de eliminar "${producto.nombre}" del carrito?`)) {
        const elemento = document.querySelector(`[data-id="${id}"]`);
        if (elemento) {
            elemento.classList.add('producto-eliminando');
            setTimeout(() => {
                window.carritoManager.eliminarProducto(id);
                renderizarCarrito();
                actualizarTotal();
            }, 500);
        }
    }
}

// Procesar pago
function procesarPago() {
    const carrito = window.carritoManager.obtenerCarrito();

    if (carrito.length > 0) {
        const modal = document.getElementById("miModal");
        modal.style.display = "flex"; // mostrar modal
    }
}

// Cerrar modal al hacer click en la X
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("miModal");
    const closeBtn = document.querySelector(".close-modal");

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Cerrar modal si se hace click fuera del contenido
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

function validarPago() {
    const nombre = document.getElementById("nombreTitular").value.trim();
    const numero = document.getElementById("numeroTarjeta").value.trim();
    const expiracion = document.getElementById("fechaExpiracion").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!nombre || !numero || !expiracion || !cvv) {
        alert("Por favor, complete todos los campos antes de continuar.");
        return false;
    }

    // Si todo está correcto, mostrar animación de éxito
    document.getElementById("formContent").style.display = "none";
    const success = document.getElementById("successContent");
    success.style.display = "block";

    // Opcional: cerrar modal automáticamente después de 3 segundos
    setTimeout(() => {
        document.getElementById("miModal").style.display = "none";
        // Reiniciar formulario y contenido para futuras compras
        success.style.display = "none";
        document.getElementById("formContent").style.display = "block";
        document.getElementById("formPago").reset();
        window.carritoManager.vaciarCarrito();
        renderizarCarrito();
        actualizarTotal();
    }, 2000);
}

// Cerrar modal con X o clic fuera
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("miModal");
    const closeBtn = document.querySelector(".close-modal");

    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
    window.addEventListener("click", e => { if(e.target===modal) modal.style.display = "none"; });
});

// Vaciar carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar completamente tu carrito?')) {
        window.carritoManager.vaciarCarrito();
        renderizarCarrito();
        actualizarTotal();
    }
}

// Exportar funciones globalmente
window.renderizarCarrito = renderizarCarrito;
window.actualizarTalla = actualizarTalla;
window.actualizarColor = actualizarColor;
window.eliminarProducto = eliminarProducto;
window.procesarPago = procesarPago;
window.vaciarCarrito = vaciarCarrito;