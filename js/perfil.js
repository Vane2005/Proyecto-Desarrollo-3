/* ========================================
   perfil.js — VivaEventos
   Toda la logica de interfaz para:
   - perfil.html
   - editar-perfil.html
   - pago.html
   ======================================== */

/* ---- Inicializacion ---- */
document.addEventListener('DOMContentLoaded', function () {

    // Inicializar sidenav (menu movil)
    const sidenavElems = document.querySelectorAll('.sidenav');
    if (sidenavElems.length) M.Sidenav.init(sidenavElems);

    // Inicializar modales de Materialize (si existen en la pagina)
    const modales = document.querySelectorAll('.modal');
    if (modales.length) M.Modal.init(modales);

    // Inicializar tabs (editar perfil)
    const tabsElem = document.querySelector('.tabs');
    if (tabsElem) M.Tabs.init(tabsElem);

    // Inicializar selects
    const selects = document.querySelectorAll('select');
    if (selects.length) M.FormSelect.init(selects);

    // Formulario datos personales
    const formDatos = document.getElementById('formDatos');
    if (formDatos) {
        formDatos.addEventListener('submit', guardarDatos);
        // Actualizar preview del avatar al escribir
        const inputNombre = document.getElementById('inputNombre');
        const inputApellido = document.getElementById('inputApellido');
        if (inputNombre) inputNombre.addEventListener('input', actualizarAvatar);
        if (inputApellido) inputApellido.addEventListener('input', actualizarAvatar);
    }

    // Formulario seguridad
    const formSeg = document.getElementById('formSeguridad');
    if (formSeg) formSeg.addEventListener('submit', guardarSeguridad);

    // Formulario pago
    const formPago = document.getElementById('formPago');
    if (formPago) {
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    // Cargar datos desde localStorage (para demo / hasta conectar backend)
    cargarDatosUsuario();
});

/* ---- Cerrar sesion ---- */
function cerrarSesion(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

/* ---- Cargar datos del usuario ---- */
function cargarDatosUsuario() {
    // PUNTO DE CONEXION: reemplazar con fetch a /api/usuario usando el token
    // const token = localStorage.getItem('token');
    // fetch('/api/usuario', { headers: { Authorization: 'Bearer ' + token } })
    //   .then(r => r.json())
    //   .then(data => poblarPerfil(data));

    // Por ahora usa datos de ejemplo
    const usuario = {
        nombre: 'Juan',
        apellido: 'Diaz',
        email: 'juan.diaz@email.com',
        telefono: '+57 300 000 0000',
        ciudad: 'Bogota',
        documento: '1020304050',
        bio: 'Amante de la musica y los festivales.'
    };
    poblarPerfil(usuario);
}

function poblarPerfil(u) {
    const nombreCompleto = u.nombre + ' ' + u.apellido;
    const iniciales = (u.nombre.charAt(0) + u.apellido.charAt(0)).toUpperCase();

    const elNombre = document.getElementById('nombreUsuario');
    const elEmail = document.getElementById('emailUsuario');
    const elTel = document.getElementById('telefonoUsuario');
    const elCiudad = document.getElementById('ciudadUsuario');
    const elAvatar = document.getElementById('avatarInitials');

    if (elNombre) elNombre.textContent = nombreCompleto;
    if (elEmail) elEmail.innerHTML = '<i class="material-icons tiny">email</i> ' + u.email;
    if (elTel) elTel.innerHTML = '<i class="material-icons tiny">phone</i> ' + u.telefono;
    if (elCiudad) elCiudad.innerHTML = '<i class="material-icons tiny">location_on</i> ' + u.ciudad;
    if (elAvatar) elAvatar.textContent = iniciales;

    // Preview edicion
    const elPreview = document.getElementById('avatarPreview');
    if (elPreview) elPreview.textContent = iniciales;
}

/* ---- Avatar preview en edicion ---- */
function actualizarAvatar() {
    const n = document.getElementById('inputNombre');
    const a = document.getElementById('inputApellido');
    const preview = document.getElementById('avatarPreview');
    if (n && a && preview) {
        const iniciales = ((n.value.charAt(0) || '') + (a.value.charAt(0) || '')).toUpperCase();
        preview.textContent = iniciales || '?';
    }
}

/* ---- Guardar datos personales ---- */
function guardarDatos(e) {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById('inputNombre').value,
        apellido: document.getElementById('inputApellido').value,
        email: document.getElementById('inputEmail').value,
        telefono: document.getElementById('inputTelefono').value,
        documento: document.getElementById('inputDocumento').value,
        ciudad: document.getElementById('inputCiudad').value,
        bio: document.getElementById('inputBio').value
    };

    // PUNTO DE CONEXION: enviar datos al backend
    // const token = localStorage.getItem('token');
    // fetch('/api/usuario', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    //   body: JSON.stringify(datos)
    // }).then(r => { if (r.ok) mostrarAlerta('alertaExito'); else mostrarAlerta('alertaError'); });

    // Demo: simula exito
    setTimeout(() => mostrarAlerta('alertaExito'), 400);
}

/* ---- Guardar seguridad ---- */
function guardarSeguridad(e) {
    e.preventDefault();

    const passNueva = document.getElementById('passNueva').value;
    const passConfirmar = document.getElementById('passConfirmar').value;

    if (passNueva !== passConfirmar) {
        mostrarAlerta('alertaSegError');
        return;
    }

    // PUNTO DE CONEXION
    // fetch('/api/usuario/password', { method: 'PUT', ... })

    // Demo: simula exito
    setTimeout(() => mostrarAlerta('alertaSegExito'), 400);
}

function mostrarAlerta(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hide');
    setTimeout(() => el.classList.add('hide'), 4000);
}

/* ---- Evaluador de fortaleza de contrasena ---- */
function evaluarPassword(val) {
    const fill = document.getElementById('passStrengthFill');
    const label = document.getElementById('passStrengthLabel');
    if (!fill || !label) return;

    fill.className = 'pass-strength-fill';

    if (val.length === 0) {
        fill.style.width = '0';
        label.textContent = 'Ingresa una contrasena';
        return;
    }

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score <= 1) {
        fill.classList.add('debil');
        label.textContent = 'Debil';
        label.style.color = '#e57373';
    } else if (score <= 2) {
        fill.classList.add('media');
        label.textContent = 'Media';
        label.style.color = '#ffb74d';
    } else {
        fill.classList.add('fuerte');
        label.textContent = 'Fuerte';
        label.style.color = '#81c784';
    }
}

/* ---- Filtrar boletas ---- */
function filtrar(estado, btn) {
    // Actualizar boton activo
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items = document.querySelectorAll('.boleta-item');
    let visibles = 0;

    items.forEach(item => {
        if (estado === 'todas' || item.dataset.estado === estado) {
            item.style.display = 'flex';
            visibles++;
        } else {
            item.style.display = 'none';
        }
    });

    const vacias = document.getElementById('boletasVacias');
    if (vacias) {
        if (visibles === 0) vacias.classList.remove('hide');
        else vacias.classList.add('hide');
    }
}

/* ---- Modal QR ---- */
function verQR(el) {
    const nombre = el.dataset.nombre;
    const fecha = el.dataset.fecha;
    const lugar = el.dataset.lugar;
    const codigo = el.dataset.codigo;

    document.getElementById('qrNombre').textContent = nombre;
    document.getElementById('qrFecha').innerHTML = '<i class="material-icons tiny">calendar_today</i> <span>' + fecha + '</span>';
    document.getElementById('qrLugar').innerHTML = '<i class="material-icons tiny">location_on</i> <span>' + lugar + '</span>';
    document.getElementById('qrCodigo').textContent = codigo;

    // Generar QR simple (patron de cuadrados en canvas)
    dibujarQR(codigo);

    document.getElementById('modalQR').classList.add('show');
    document.getElementById('modalOverlay').classList.add('show');
}

function cerrarModal() {
    document.getElementById('modalQR').classList.remove('show');
    document.getElementById('modalOverlay').classList.remove('show');
}

/* QR visual con canvas (sin libreria externa) */
function dibujarQR(texto) {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 200;
    const modulos = 21;
    const mod = Math.floor(size / modulos);

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Semilla pseudoaleatoria basada en el texto
    let seed = 0;
    for (let i = 0; i < texto.length; i++) seed += texto.charCodeAt(i);
    function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

    ctx.fillStyle = '#1a0a2e';

    for (let r = 0; r < modulos; r++) {
        for (let c = 0; c < modulos; c++) {
            const esPatron = esPatronFijo(r, c, modulos);
            const relleno = esPatron ? esPatronFijo(r, c, modulos) : rand() > 0.5;
            if (relleno) ctx.fillRect(c * mod, r * mod, mod, mod);
        }
    }

    // Logo centrado
    ctx.fillStyle = '#8e24aa';
    const logoSize = mod * 4;
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;
    ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VE', size / 2, size / 2);
}

function esPatronFijo(r, c, n) {
    // Esquinas del QR (finder patterns)
    const enEsquina = (
        (r < 8 && c < 8) ||
        (r < 8 && c >= n - 8) ||
        (r >= n - 8 && c < 8)
    );
    if (!enEsquina) return false;
    const rr = r < 8 ? r : r - (n - 8);
    const cc = c < 8 ? c : c - (n - 8);
    if ((r >= n - 8 && c >= n - 8)) return false;
    return (rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4));
}

/* Descargar QR */
function descargarQR() {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'boleta-vivaeventos.png';
    link.href = canvas.toDataURL();
    link.click();
}

/* ---- PAGO ---- */

/* Seleccionar metodo de pago */
function seleccionarMetodo(metodo, btn) {
    document.querySelectorAll('.pago-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('metodo-tarjeta').classList.add('hide');
    document.getElementById('metodo-efecty').classList.add('hide');
    document.getElementById('metodo-pse').classList.add('hide');

    document.getElementById('metodo-' + metodo).classList.remove('hide');

    if (metodo !== 'tarjeta') {
        M.FormSelect.init(document.querySelectorAll('select'));
    }
}

/* Formatear numero de tarjeta */
function formatearTarjeta(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    input.value = val;

    const display = document.getElementById('tvNumero');
    const padded = val.padEnd(19, '•').replace(/\S{4}/g, m => m.padEnd(4, '•'));
    if (display) display.textContent = val || '•••• •••• •••• ••••';

    // Detectar marca
    const raw = input.value.replace(/\s/g, '');
    const marca = document.getElementById('tvMarca');
    if (marca) {
        if (/^4/.test(raw)) marca.textContent = 'VISA';
        else if (/^5[1-5]/.test(raw)) marca.textContent = 'MC';
        else if (/^3[47]/.test(raw)) marca.textContent = 'AMEX';
        else marca.textContent = '';
    }
}

/* Formatear expiracion */
function formatearExpiracion(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 4);
    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
    input.value = val;
    const el = document.getElementById('tvExp');
    if (el) el.textContent = val || 'MM/AA';
}

/* Cupon de descuento */
const CUPONES = { 'PROMO2025': 0.10, 'VIP50': 0.15, 'BIENVENIDO': 0.05 };
let descuentoActual = 0;

function aplicarCupon() {
    const cod = document.getElementById('cupon').value.trim().toUpperCase();
    const feedback = document.getElementById('cuponFeedback');
    const lineaDesc = document.getElementById('lineaDescuento');

    if (!feedback) return;
    feedback.classList.remove('hide', 'valido', 'invalido');

    if (CUPONES[cod]) {
        descuentoActual = CUPONES[cod];
        feedback.textContent = 'Cupon aplicado: ' + (descuentoActual * 100) + '% de descuento';
        feedback.classList.add('valido');
        if (lineaDesc) lineaDesc.classList.remove('hide');
        actualizarTotal();
    } else {
        descuentoActual = 0;
        feedback.textContent = 'Codigo invalido o expirado';
        feedback.classList.add('invalido');
        if (lineaDesc) lineaDesc.classList.add('hide');
        actualizarTotal();
    }
}

/* Cambiar cantidad de boletas */
let precioBoleta = 95000;
let cantidadActual = 1;
const CARGO_SERVICIO_PCT = 0.05;

function cambiarCantidad(delta) {
    cantidadActual = Math.max(1, Math.min(10, cantidadActual + delta));
    const elCant = document.getElementById('cantidad');
    if (elCant) elCant.textContent = cantidadActual;
    actualizarTotal();
}

function actualizarTotal() {
    const subtotal = precioBoleta * cantidadActual;
    const cargo = Math.round(subtotal * CARGO_SERVICIO_PCT);
    const descuento = Math.round(subtotal * descuentoActual);
    const total = subtotal + cargo - descuento;

    const fmt = n => '$' + n.toLocaleString('es-CO');

    const elCargo = document.getElementById('resumenCargo');
    const elDesc = document.getElementById('resumenDescuento');
    const elTotal = document.getElementById('resumenTotal');

    if (elCargo) elCargo.textContent = fmt(cargo);
    if (elDesc) elDesc.textContent = '-' + fmt(descuento);
    if (elTotal) elTotal.textContent = fmt(total);
}

/* Procesar pago */
function procesarPago() {
    const modal = document.getElementById('modalProcesando');
    const overlay = document.getElementById('modalOverlay');

    if (modal) modal.classList.add('show');
    if (overlay) overlay.classList.add('show');

    const estadoProcesando = document.getElementById('estadoProcesando');
    const estadoExito = document.getElementById('estadoExito');
    const estadoError = document.getElementById('estadoError');

    if (estadoProcesando) estadoProcesando.classList.remove('hide');
    if (estadoExito) estadoExito.classList.add('hide');
    if (estadoError) estadoError.classList.add('hide');

    // PUNTO DE CONEXION: reemplazar con llamada real al backend de pagos
    // const token = localStorage.getItem('token');
    // fetch('/api/pagos/procesar', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    //   body: JSON.stringify({ ... })
    // }).then(r => r.json()).then(data => {
    //   if (data.success) mostrarResultadoPago('exito', data.referencia);
    //   else mostrarResultadoPago('error', null);
    // });

    // Demo: simula procesamiento y exito
    setTimeout(() => {
        if (estadoProcesando) estadoProcesando.classList.add('hide');
        const refEl = document.getElementById('refPago');
        const ref = 'VE-2025-' + Math.floor(Math.random() * 9000 + 1000);
        if (refEl) refEl.textContent = ref;
        if (estadoExito) estadoExito.classList.remove('hide');
    }, 2500);
}

function cerrarModalPago() {
    const modal = document.getElementById('modalProcesando');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
}