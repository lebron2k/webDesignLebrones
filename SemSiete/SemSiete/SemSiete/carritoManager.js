//Sistema de gestión de carrito de compras
class CarritoManager {
    constructor() {
    this.carrito = this.cargarCarrito();
    this.inicializar();
    }

    inicializar(){
        this.actualizarBadge();
        this.crearNotificacion();
        this.cargarEstilosCarrito();
    }

    cargarEstilosCarrito() {
        if(!document.getElementById("carrito-estilos")) {
            const style = document.createElement('style');
            style.id = 'carrito-styles';
            style.textContent = `
            /* Estilos para el carrito */
            .cart-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: var(--complemento-rojo, #dc3545);
                    color: white;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    z-index: 10;
                }

                .nav-item-imgcontainer {
                    position: relative;
                    cursor: pointer;
                }

                /* Notificación */
                .carrito-notification {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background-color: var(--principal-negro, #000);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    transform: translateX(400px);
                    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    z-index: 1050;
                    font-weight: 500;
                    max-width: 300px;
                    font-family: inherit;
                }

                .carrito-notification.show {
                    transform: translateX(0);
                }

                .carrito-notification.success {
                    background-color: #28a745;
                }

                .carrito-notification.info {
                    background-color: #17a2b8;
                }

                .carrito-notification.warning {
                    background-color: #ffc107;
                    color: #000;
                }

                .carrito-notification.error {
                    background-color: #dc3545;
                }

                /* Mejoras en los botones */
                .btn-card {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .btn-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }

                .btn-card:active {
                    transform: translateY(0);
                }

                .btn-card.loading {
                    pointer-events: none;
                    opacity: 0.7;
                }

                .btn-card.loading::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 16px;
                    height: 16px;
                    margin: -8px 0 0 -8px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: carrito-spin 1s linear infinite;
                }

                @keyframes carrito-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes carrito-bounce {
                    0%, 20%, 53%, 80%, 100% {
                        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
                        transform: scale(1);
                    }
                    40%, 43% {
                        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
                        transform: scale(1.15);
                    }
                    70% {
                        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
                        transform: scale(1.08);
                    }
                    90% {
                        transform: scale(1.02);
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .carrito-notification {
                        bottom: 20px;
                        right: 20px;
                        left: 20px;
                        max-width: none;
                        transform: translateY(100px);
                    }
                    
                    .carrito-notification.show {
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        
            
        }

        
    }

    //Lo de crear notificacion creo que es importante para que el usuario vea que tiene agregado productos al carrito
     crearNotificacion() {
        if (!document.getElementById('carrito-notification')) {
            const notification = document.createElement('div');
            notification.id = 'carrito-notification';
            notification.className = 'carrito-notification';
            document.body.appendChild(notification);
        }
    }

    cargarCarrito(){
        const usuarioActual = this.obtenerUsuarioActual();
        const carritos = JSON.parse(localStorage.getItem('carritos')) || {};
        return carritos[usuarioActual] || [];
    }

    guardarCarrito() {
        const usuarioActual = this.obtenerUsuarioActual();
        let carritos = JSON.parse(localStorage.getItem('carritos')) || {};
        carritos[usuarioActual] = this.carrito;
        localStorage.setItem('carritos', JSON.stringify(carritos));
    }

    // Obtener usuario actual
    obtenerUsuarioActual() {
        // Intentar obtener del sistema de login
        if(typeof window.obtenerUsuarioLogueado === 'function') {
            const usuario = window.obtenerUsuarioLogueado();
            if (usuario && usuario.email) {
                return usuario.email;
            }
        }

        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if(usuarioLogueado && usuarioLogueado.email){
            return usuarioLogueado.email;
        
        }
        return 'invitado'; // Usuario por defecto
    }

     estaLogueado() {
        if (typeof window.estaLogueado === 'function') {
            return window.estaLogueado();
        }
        return this.obtenerUsuarioActual() !== 'invitado';
    }

    // Agregar producto al carrito
    agregarProducto(id, nombre, categoria, precio, imagen, botonElement = null) {
        // Validar datos
        if (!id || !nombre || !precio) {
            this.mostrarNotificacion('Error: Datos del producto incompletos', 'error');
            return;
        }

        // Animación de carga en el botón
        if (botonElement) {
            this.aplicarEstadoCarga(botonElement, true);
        }

        // Simular delay para mejorar UX
        setTimeout(() => {
            const productoExistente = this.carrito.find(item => item.id === id);
            
            if (productoExistente) {
                this.mostrarNotificacion(`"${nombre}" ya está en tu carrito`, 'warning');
                if (botonElement) {
                    this.aplicarEstadoCarga(botonElement, false);
                }
                return;
            }

            const nuevoProducto = {
                id: id,
                nombre: nombre,
                categoria: categoria,
                precio: precio,
                imagen: imagen || 'img/default-product.jpg',
                talla: this.obtenerTallaDefecto(categoria),
                color: 'negro',
                fechaAgregado: new Date().getTime()
            };

            this.carrito.unshift(nuevoProducto); // Agregar al inicio (orden descendente)
            this.guardarCarrito();
            this.actualizarBadge();
            this.mostrarNotificacion(`¡"${nombre}" agregado al carrito!`, 'success');
            
            // Restaurar botón
            if (botonElement) {
                this.aplicarEstadoCarga(botonElement, false);
            }
        }, 600);
    }

    // Aplicar estado de carga al botón
    aplicarEstadoCarga(boton, cargar) {
        if (!boton) return;
        
        if (cargar) {
            boton.classList.add('loading');
            boton.setAttribute('data-original-text', boton.textContent);
            boton.textContent = '';
        } else {
            boton.classList.remove('loading');
            boton.textContent = boton.getAttribute('data-original-text') || 'Comprar';
        }
    }

    // Obtener talla por defecto según categoría
    obtenerTallaDefecto(categoria) {
        const tallasDefecto = {
            'gorra': '30-42',
            'zapato': '42',
            'pantalon': 'M',
            'camisa': 'M',
            'default': 'M'
        };
        
        return tallasDefecto[categoria.toLowerCase()] || tallasDefecto.default;
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        const productoEliminado = this.carrito.find(item => item.id === id);
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarBadge();
        
        if (productoEliminado) {
            this.mostrarNotificacion(`"${productoEliminado.nombre}" eliminado del carrito`, 'info');
        }
    }

    // Actualizar talla del producto
    actualizarTalla(id, nuevaTalla) {
        const producto = this.carrito.find(item => item.id === id);
        if (producto) {
            producto.talla = nuevaTalla;
            this.guardarCarrito();
        }
    }

    // Actualizar color del producto
    actualizarColor(id, nuevoColor) {
        const producto = this.carrito.find(item => item.id === id);
        if (producto) {
            producto.color = nuevoColor;
            this.guardarCarrito();
        }
    }

    // Actualizar badge del carrito
    actualizarBadge() {
        const badge = document.getElementById('cart-badge');
        if (!badge) {
            // Crear badge si no existe
            this.crearBadgeCarrito();
            return;
        }
        
        const cantidad = this.carrito.length;
        badge.textContent = cantidad;
        badge.style.display = cantidad > 0 ? 'flex' : 'none';
        
        // Animación del badge
        if (cantidad > 0) {
            badge.style.animation = 'carrito-bounce 0.6s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 600);
        }
    }

    // Crear badge del carrito
    crearBadgeCarrito() {
        const carritoContainer = document.querySelector('.nav-item-imgcontainer:last-child');
        if (carritoContainer && !document.getElementById('cart-badge')) {
            const badge = document.createElement('div');
            badge.id = 'cart-badge';
            badge.className = 'cart-badge';
            badge.textContent = '0';
            badge.style.display = 'none';
            carritoContainer.appendChild(badge);
            carritoContainer.onclick = () => this.irAlCarrito();
            carritoContainer.style.cursor = 'pointer';
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notification = document.getElementById('carrito-notification');
        if (!notification) return;
        
        // Remover clases de tipo anteriores
        notification.classList.remove('success', 'warning', 'info', 'error');
        
        // Agregar clase de tipo
        if (tipo) {
            notification.classList.add(tipo);
        }
        
        notification.innerHTML = `<strong>${mensaje}</strong>`;
        notification.classList.add('show');
        
        // Auto-ocultar después de 3.5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3500);
    }

    // Ir al carrito
    irAlCarrito() {
        // Verificar si está logueado antes de ir al carrito
        if (!this.estaLogueado()) {
            this.mostrarNotificacion('Debes iniciar sesión para ver tu carrito', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        if (this.carrito.length > 0) {
            window.location.href = 'carrito.html';
        } else {
            this.mostrarNotificacion('Tu carrito está vacío', 'info');
        }
    }

    obtenerCantidadProductos() {
        return this.carrito.length;
    }

    // Obtener total del carrito
    obtenerTotal() {
        return this.carrito.reduce((total, producto) => total + producto.precio, 0);
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarBadge();
        this.mostrarNotificacion('Carrito vaciado', 'info');
    }

    // Obtener carrito completo
    obtenerCarrito() {
        return this.carrito;
    }

    // Verificar si un producto existe en el carrito
    productoEnCarrito(id) {
        return this.carrito.some(item => item.id === id);
    }

    // Recargar carrito
    recargarCarrito() {
        this.carrito = this.cargarCarrito();
        this.actualizarBadge();
    }
}

// Funcion parar agregar al carrito, aparece que no se lee pero si funciona ya que se ejecuta en el html
function agregarAlCarrito(id, nombre, categoria, precio, imagen, botonElement) {
    if (typeof window.carritoManager === 'undefined') {
        window.carritoManager = new CarritoManager();
    }
    window.carritoManager.agregarProducto(id, nombre, categoria, precio, imagen, botonElement);
}

// Función global para ir al carrito
function irAlCarrito() {
    if (typeof window.carritoManager === 'undefined') {
        window.carritoManager = new CarritoManager();
    }
    window.carritoManager.irAlCarrito();
}

// Función para obtener el carrito (útil para otras páginas)
function obtenerCarrito() {
    if (typeof window.carritoManager === 'undefined') {
        window.carritoManager = new CarritoManager();
    }
    return window.carritoManager.obtenerCarrito();
}

// Función para obtener total del carrito
function obtenerTotalCarrito() {
    if (typeof window.carritoManager === 'undefined') {
        window.carritoManager = new CarritoManager();
    }
    return window.carritoManager.obtenerTotal();
}

// Inicializar automáticamente cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrito solo si no existe
    if (typeof window.carritoManager === 'undefined') {
        window.carritoManager = new CarritoManager();
    }
    
    // Hacer clickeable el icono del carrito si existe
    const carritoIcono = document.querySelector('.nav-item-imgcontainer:last-child');
    if (carritoIcono) {
        carritoIcono.addEventListener('click', function() {
            irAlCarrito();
        });
        carritoIcono.style.cursor = 'pointer';
    }

    // Actualizar badge periódicamente (por si cambia en otra pestaña)
    setInterval(() => {
        if (window.carritoManager) {
            window.carritoManager.recargarCarrito();
        }
    }, 5000);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarritoManager;
}