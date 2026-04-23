// Configuración Firebase (mantén tu configuración existente)
const firebaseConfig = {
    apiKey: "AIzaSyDHvK2s9gE8QwJxGf5L3z8Uo7H9n2M5pQ4",
    authDomain: "historial-clinico-homeopatico.firebaseapp.com",
    projectId: "historial-clinico-homeopatico",
    storageBucket: "historial-clinico-homeopatico.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== NUEVAS FUNCIONES DE INTERFAZ =====

// Función para mostrar fecha actual
function mostrarFechaActual() {
    const ahora = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('fechaActual').textContent = 
        ahora.toLocaleDateString('es-ES', opciones);
}

// Función para colapsar/expandir secciones (CORREGIDA)
function toggleSeccion(header) {
    // Evitar que se ejecute si se hizo click en el botón de limpiar
    if (event.target.closest('.btn-limpiar')) {
        return;
    }
    
    const seccion = header.parentElement;
    const toggle = header.querySelector('.seccion-toggle');
    const content = seccion.querySelector('.seccion-content');
    
    seccion.classList.toggle('collapsed');
    
    if (seccion.classList.contains('collapsed')) {
        content.style.display = 'none';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'block';
        toggle.textContent = '▲';
    }
}

// Función para mostrar/ocultar campo "otro" en ocupación (actualizada)
function toggleOtroOcupacion() {
    const select = document.getElementById('ocupacion');
    const container = document.getElementById('ocupacionOtraContainer');
    const otroInput = document.getElementById('ocupacionOtra');
    
    if (select.value === 'otro') {
        container.style.display = 'block';
        otroInput.required = true;
    } else {
        container.style.display = 'none';
        otroInput.required = false;
        otroInput.value = '';
    }
}

// ===== FUNCIONES DE LIMPIEZA (NUEVAS) =====

// Limpiar sección específica (CORREGIDA COMPLETAMENTE)
function limpiarSeccion(seccionIndex) {
    // Detener la propagación del evento
    event.stopPropagation();
    event.preventDefault();
    
    if (confirm('¿ESTÁ SEGURA DE QUE DESEA LIMPIAR TODA LA INFORMACIÓN DE ESTA SECCIÓN?')) {
        const secciones = document.querySelectorAll('.seccion');
        const seccion = secciones[seccionIndex];
        
        if (seccion) {
            console.log('Limpiando sección:', seccionIndex);
            
            // Limpiar TODOS los inputs, selects y textareas de la sección
            const todosLosCampos = seccion.querySelectorAll('input, select, textarea');
            console.log('Campos encontrados:', todosLosCampos.length);
            
            todosLosCampos.forEach((campo, index) => {
                console.log(`Limpiando campo ${index}:`, campo.name || campo.id, 'valor actual:', campo.value);
                
                if (campo.type === 'radio' || campo.type === 'checkbox') {
                    campo.checked = false;
                } else {
                    campo.value = '';
                }
                
                // Disparar evento para actualizar estados
                campo.dispatchEvent(new Event('change'));
                campo.dispatchEvent(new Event('input'));
            });
            
            // Limpiar contenedores dinámicos específicos
            resetearContenedoresDinamicos(seccion);
            
            // Limpiar campos específicos por sección
            limpiarCamposEspecificosPorSeccion(seccionIndex);
            
            // Actualizar estados visuales
            setTimeout(() => {
                actualizarEstadoSeccion(seccionIndex);
                console.log('Estado actualizado para sección:', seccionIndex);
            }, 200);
            
            alert('✅ SECCIÓN LIMPIADA CORRECTAMENTE');
        } else {
            console.error('No se encontró la sección:', seccionIndex);
        }
    }
}

// Función auxiliar para resetear contenedores dinámicos
function resetearContenedoresDinamicos(seccion) {
    // Lista de todos los contenedores dinámicos posibles
    const contenedores = [
        '#datosConyuge',
        '#ocupacionOtraContainer', 
        '#datosHermanos',
        '#datosHijos',
        '#nombresHermanos',
        '#nombresHijos',
        '#datosCirugias',
        '#datosMedicamentos',
        '#datosAlergias',
        '#datosHospitalizaciones',
        '#datosCronicas',
        '#datosMiedos',
        '#datosPreferencias'
    ];
    
    contenedores.forEach(selector => {
        const contenedor = seccion.querySelector(selector);
        if (contenedor) {
            if (selector.includes('nombres')) {
                // Limpiar contenido de contenedores de nombres
                contenedor.innerHTML = '';
            } else {
                // Ocultar contenedores de datos
                contenedor.style.display = 'none';
            }
        }
    });
}

// FUNCIÓN DE RESPALDO - Limpieza más agresiva
function limpiarSeccionDirecta(seccionIndex) {
    event.stopPropagation();
    event.preventDefault();
    
    if (confirm('¿ESTÁ SEGURA DE QUE DESEA LIMPIAR TODA LA INFORMACIÓN DE ESTA SECCIÓN?')) {
        
        // IDs específicos por sección para limpieza directa
        const camposPorSeccion = {
            0: [
                'nombre', 'apellido', 'telefono', 'edad', 'ocupacion', 'ocupacionOtra',
                'nombreConyuge', 'edadConyuge'
            ],
            1: [
                'nombrePadre', 'edadPadre', 'nombreMadre', 'edadMadre', 
                'numeroHermanos', 'numeroHijos', 'antecedentesFamiliares'
            ],
            2: [
                'detalleCirugias', 'listaMedicamentos', 'listaAlergias', 
                'detalleHospitalizaciones', 'listaCronicas'
            ],
            3: [
                'motivoConsulta', 'tiempoEvolucion', 'caracter', 'listaMiedos',
                'sintomasFisicos', 'patronSueno', 'apetito', 'prefiereSalado',
                'prefiereDulce', 'prefiereCaliente', 'prefiereFrio', 'otrasPreferencias',
                'estadoEmocional', 'mejoraCon', 'empeoraCon'
            ]
        };
        
        const radiosPorSeccion = {
            0: ['sexo', 'estadoCivil'],
            1: ['tieneHermanos', 'tieneHijos'],
            2: ['tieneCirugias', 'tomaMedicamentos', 'tieneAlergias', 'hospitalizaciones', 'enfermedadesCronicas'],
            3: ['tieneMiedos', 'tienePreferencias']
        };
        
        // Limpiar campos de texto específicos
        if (camposPorSeccion[seccionIndex]) {
            camposPorSeccion[seccionIndex].forEach(campoId => {
                const campo = document.getElementById(campoId);
                if (campo) {
                    campo.value = '';
                }
            });
        }
        
        // Limpiar radio buttons específicos
        if (radiosPorSeccion[seccionIndex]) {
            radiosPorSeccion[seccionIndex].forEach(radioName => {
                const radios = document.querySelectorAll(`input[name="${radioName}"]`);
                radios.forEach(radio => {
                    radio.checked = false;
                });
            });
        }
        
        // Ocultar contenedores dinámicos
        resetearContenedoresDinamicos(document.querySelectorAll('.seccion')[seccionIndex]);
        
        // Limpiar campos específicos
        limpiarCamposEspecificosPorSeccion(seccionIndex);
        
        // Actualizar estados
        setTimeout(() => actualizarEstadoSeccion(seccionIndex), 100);
        
        alert('✅ SECCIÓN LIMPIADA CORRECTAMENTE');
        
        console.log(`Sección ${seccionIndex} limpiada completamente`);
    }
}

// Limpiar todo el historial
function limpiarTodoElHistorial() {
    if (confirm('⚠️ ATENCIÓN: ¿Está completamente segura de que desea borrar TODA la información del historial?\n\nEsta acción NO se puede deshacer.')) {
        if (confirm('🔴 CONFIRMACIÓN FINAL: Se borrará TODO el contenido. ¿Continuar?')) {
            // Limpiar formulario completo
            document.getElementById('historialForm').reset();
            
            // Ocultar todos los contenedores dinámicos
            document.getElementById('datosConyuge').style.display = 'none';
            document.getElementById('ocupacionOtraContainer').style.display = 'none';
            document.getElementById('datosHermanos').style.display = 'none';
            document.getElementById('datosHijos').style.display = 'none';
            document.getElementById('nombresHermanos').innerHTML = '';
            document.getElementById('nombresHijos').innerHTML = '';
            document.getElementById('datosCirugias').style.display = 'none';
            document.getElementById('datosMedicamentos').style.display = 'none';
            document.getElementById('datosAlergias').style.display = 'none';
            document.getElementById('datosHospitalizaciones').style.display = 'none';
            document.getElementById('datosCronicas').style.display = 'none';
            document.getElementById('datosMiedos').style.display = 'none';
            document.getElementById('datosPreferencias').style.display = 'none';
            
            // Actualizar todos los estados
            setTimeout(verificarTodasLasSecciones, 100);
            
            alert('✅ Todo el historial ha sido limpiado correctamente');
        }
    }
}

// ===== FUNCIONES FIREBASE (mantener las existentes) =====

// Función para guardar historial (actualizada)
async function guardarHistorial(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = {};
        
        // Procesar todos los campos del formulario
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Si seleccionó "otro" en ocupación, usar el campo personalizado
        if (data.ocupacion === 'otro' && data.ocupacionOtra) {
            data.ocupacion = data.ocupacionOtra;
            delete data.ocupacionOtra;
        }
        
        // Agregar timestamp
        data.fechaCreacion = firebase.firestore.Timestamp.now();
        
        console.log('Guardando datos:', data);
        
        const docRef = await db.collection('historiales').add(data);
        console.log('Historial guardado con ID:', docRef.id);
        
        // Mostrar modal personalizado en lugar de alert
        mostrarModalExito();
        
        // Limpiar formulario
        e.target.reset();
        
        // Ocultar datos dinámicos si estaban visibles
        document.getElementById('datosConyuge').style.display = 'none';
        document.getElementById('ocupacionOtraContainer').style.display = 'none';
        document.getElementById('datosHermanos').style.display = 'none';
        document.getElementById('datosHijos').style.display = 'none';
        document.getElementById('nombresHermanos').innerHTML = '';
        document.getElementById('nombresHijos').innerHTML = '';
        
        // Actualizar estados visuales
        setTimeout(verificarTodasLasSecciones, 100);
        
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('❌ Error al guardar el historial');
    }
}

// Actualizar la inicialización en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar fecha actual
    mostrarFechaActual();
    
    // Inicializar secciones colapsadas
    inicializarSecciones();
    
    // Configurar formulario
    const form = document.getElementById('historialForm');
    form.addEventListener('submit', guardarHistorial);
    
    // Configurar detección de cambios
    configurarDeteccionCambios();
    
    // Configurar campos dinámicos
    configurarCamposDinamicos('nombresHermanos', 1);
    configurarCamposDinamicos('nombresHijos', 1);
    
    // Verificar estado inicial
    setTimeout(verificarTodasLasSecciones, 100);
    
    console.log('✅ APLICACIÓN INICIALIZADA CORRECTAMENTE');
});

// Función para mostrar/ocultar datos del cónyuge (ACTUALIZADA CON VIUDO/A)
function toggleDatosConyuge() {
    const estadoCivil = document.querySelector('input[name="estadoCivil"]:checked');
    const datosConyuge = document.getElementById('datosConyuge');
    const nombreConyuge = document.getElementById('nombreConyuge');
    const edadConyuge = document.getElementById('edadConyuge');
    
    if (estadoCivil && estadoCivil.value === 'Casado') {
        datosConyuge.style.display = 'block';
        nombreConyuge.required = true;
        edadConyuge.required = true;
    } else {
        datosConyuge.style.display = 'none';
        nombreConyuge.required = false;
        edadConyuge.required = false;
        nombreConyuge.value = '';
        edadConyuge.value = '';
    }
}

// Función para mostrar modal personalizado
function mostrarModalExito() {
    document.getElementById('modalExito').style.display = 'flex';
}

// Función para cerrar modal
function cerrarModal() {
    document.getElementById('modalExito').style.display = 'none';
}

// Función para mostrar/ocultar datos de hermanos
function toggleHermanos() {
    const tieneHermanos = document.querySelector('input[name="tieneHermanos"]:checked');
    const datosHermanos = document.getElementById('datosHermanos');
    const numeroHermanos = document.getElementById('numeroHermanos');
    
    if (tieneHermanos && tieneHermanos.value === 'Si') {
        datosHermanos.style.display = 'block';
        numeroHermanos.required = true;
    } else {
        datosHermanos.style.display = 'none';
        numeroHermanos.required = false;
        numeroHermanos.value = '';
        document.getElementById('nombresHermanos').innerHTML = '';
    }
}

// Función para mostrar/ocultar datos de hijos
function toggleHijos() {
    const tieneHijos = document.querySelector('input[name="tieneHijos"]:checked');
    const datosHijos = document.getElementById('datosHijos');
    const numeroHijos = document.getElementById('numeroHijos');
    
    if (tieneHijos && tieneHijos.value === 'Si') {
        datosHijos.style.display = 'block';
        numeroHijos.required = true;
    } else {
        datosHijos.style.display = 'none';
        numeroHijos.required = false;
        numeroHijos.value = '';
        document.getElementById('nombresHijos').innerHTML = '';
    }
}

// Función para generar campos de nombres de hermanos
function generarCamposHermanos() {
    const numero = document.getElementById('numeroHermanos').value;
    const container = document.getElementById('nombresHermanos');
    container.innerHTML = '';
    
    for (let i = 1; i <= numero; i++) {
        const campo = document.createElement('div');
        campo.className = 'campo';
        campo.innerHTML = `
            <label for="hermano${i}">Nombre del hermano ${i}:</label>
            <input type="text" id="hermano${i}" name="hermano${i}">
        `;
        container.appendChild(campo);
    }
}

// Función para generar campos de nombres de hijos
function generarCamposHijos() {
    const numero = document.getElementById('numeroHijos').value;
    const container = document.getElementById('nombresHijos');
    container.innerHTML = '';
    
    for (let i = 1; i <= numero; i++) {
        const campo = document.createElement('div');
        campo.className = 'campo';
        campo.innerHTML = `
            <label for="hijo${i}">Nombre del hijo ${i}:</label>
            <input type="text" id="hijo${i}" name="hijo${i}">
        `;
        container.appendChild(campo);
    }
}

// ===== FUNCIONES SECCIÓN 3: HISTORIAL MÉDICO =====

function toggleCirugias() {
    const tieneCirugias = document.querySelector('input[name="tieneCirugias"]:checked');
    const datosCirugias = document.getElementById('datosCirugias');
    const detalleCirugias = document.getElementById('detalleCirugias');
    
    if (tieneCirugias && tieneCirugias.value === 'Si') {
        datosCirugias.style.display = 'block';
        detalleCirugias.required = true;
    } else {
        datosCirugias.style.display = 'none';
        detalleCirugias.required = false;
        detalleCirugias.value = '';
    }
}

function toggleMedicamentos() {
    const tomaMedicamentos = document.querySelector('input[name="tomaMedicamentos"]:checked');
    const datosMedicamentos = document.getElementById('datosMedicamentos');
    const listaMedicamentos = document.getElementById('listaMedicamentos');
    
    if (tomaMedicamentos && tomaMedicamentos.value === 'Si') {
        datosMedicamentos.style.display = 'block';
        listaMedicamentos.required = true;
    } else {
        datosMedicamentos.style.display = 'none';
        listaMedicamentos.required = false;
        listaMedicamentos.value = '';
    }
}

function toggleAlergias() {
    const tieneAlergias = document.querySelector('input[name="tieneAlergias"]:checked');
    const datosAlergias = document.getElementById('datosAlergias');
    const listaAlergias = document.getElementById('listaAlergias');
    
    if (tieneAlergias && tieneAlergias.value === 'Si') {
        datosAlergias.style.display = 'block';
        listaAlergias.required = true;
    } else {
        datosAlergias.style.display = 'none';
        listaAlergias.required = false;
        listaAlergias.value = '';
    }
}

function toggleHospitalizaciones() {
    const hospitalizaciones = document.querySelector('input[name="hospitalizaciones"]:checked');
    const datosHospitalizaciones = document.getElementById('datosHospitalizaciones');
    const detalleHospitalizaciones = document.getElementById('detalleHospitalizaciones');
    
    if (hospitalizaciones && hospitalizaciones.value === 'Si') {
        datosHospitalizaciones.style.display = 'block';
        detalleHospitalizaciones.required = true;
    } else {
        datosHospitalizaciones.style.display = 'none';
        detalleHospitalizaciones.required = false;
        detalleHospitalizaciones.value = '';
    }
}

function toggleCronicas() {
    const enfermedadesCronicas = document.querySelector('input[name="enfermedadesCronicas"]:checked');
    const datosCronicas = document.getElementById('datosCronicas');
    const listaCronicas = document.getElementById('listaCronicas');
    
    if (enfermedadesCronicas && enfermedadesCronicas.value === 'Si') {
        datosCronicas.style.display = 'block';
        listaCronicas.required = true;
    } else {
        datosCronicas.style.display = 'none';
        listaCronicas.required = false;
        listaCronicas.value = '';
    }
}

// ===== FUNCIONES SECCIÓN 4: PERFIL HOMEOPÁTICO =====

function toggleMiedos() {
    const tieneMiedos = document.querySelector('input[name="tieneMiedos"]:checked');
    const datosMiedos = document.getElementById('datosMiedos');
    const listaMiedos = document.getElementById('listaMiedos');
    
    if (tieneMiedos && tieneMiedos.value === 'Si') {
        datosMiedos.style.display = 'block';
        listaMiedos.required = true;
    } else {
        datosMiedos.style.display = 'none';
        listaMiedos.required = false;
        listaMiedos.value = '';
    }
}

function togglePreferencias() {
    const tienePreferencias = document.querySelector('input[name="tienePreferencias"]:checked');
    const datosPreferencias = document.getElementById('datosPreferencias');
    
    if (tienePreferencias && tienePreferencias.value === 'Si') {
        datosPreferencias.style.display = 'block';
    } else {
        datosPreferencias.style.display = 'none';
        // Limpiar todos los selects de preferencias
        document.getElementById('prefiereSalado').value = '';
        document.getElementById('prefiereDulce').value = '';
        document.getElementById('prefiereCaliente').value = '';
        document.getElementById('prefiereFrio').value = '';
        document.getElementById('otrasPreferencias').value = '';
    }
}

// ===== SISTEMA DE BÚSQUEDA (ACTUALIZADO) =====

function toggleBuscador() {
    const section = document.getElementById('buscadorSection');
    const toggle = document.getElementById('buscadorToggle');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        toggle.textContent = 'Ocultar Buscador';
    } else {
        section.style.display = 'none';
        toggle.textContent = 'Mostrar Buscador';
        limpiarBusqueda();
    }
}

// Búsqueda unificada por nombre o apellido
async function buscarEnTiempoReal(texto, campo) {
    if (texto.length < 2) {
        document.getElementById('resultadosBusqueda').innerHTML = '';
        return;
    }
    
    // Limpiar el otro campo de búsqueda
    if (campo === 'nombre') {
        document.getElementById('buscarApellido').value = '';
    } else {
        document.getElementById('buscarNombre').value = '';
    }
    
    try {
        const querySnapshot = await db.collection('historiales')
            .where(campo, '>=', texto)
            .where(campo, '<=', texto + '\uf8ff')
            .get();
        
        const resultados = [];
        querySnapshot.forEach((doc) => {
            resultados.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        mostrarResultados(resultados, campo);
    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
}

// Mostrar resultados de búsqueda (actualizado para nombre + apellido)
function mostrarResultados(resultados, tipoBusqueda) {
    const container = document.getElementById('resultadosBusqueda');
    
    if (resultados.length === 0) {
        container.innerHTML = '<div class="sin-resultados">No se encontraron pacientes</div>';
        return;
    }
    
    let html = '';
    resultados.forEach(paciente => {
        const fecha = paciente.fechaCreacion ? 
            paciente.fechaCreacion.toDate().toLocaleDateString() : 'Sin fecha';
        
        const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim();
        
        html += `
            <div class="resultado-item" onclick="cargarPaciente('${paciente.id}')">
                <div class="resultado-nombre">${nombreCompleto || 'Sin nombre'}</div>
                <div class="resultado-datos">
                    📞 ${paciente.telefono || 'Sin teléfono'} | 
                    👤 ${paciente.edad || '?'} años | 
                    📅 ${fecha}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Cargar datos del paciente en el formulario (FUNCIÓN COMPLETA)
async function cargarPaciente(pacienteId) {
    try {
        const doc = await db.collection('historiales').doc(pacienteId).get();
        
        if (doc.exists) {
            const data = doc.data();
            console.log('Cargando paciente:', data);
            
            // Llenar el formulario con los datos
            rellenarFormulario(data);
            
            // Verificar todas las secciones después de cargar
            setTimeout(verificarTodasLasSecciones, 200);
            
            // Ocultar buscador
            document.getElementById('buscadorSection').style.display = 'none';
            document.getElementById('buscadorToggle').textContent = 'Mostrar Buscador';
            
            // Expandir primera sección
            const primerSeccion = document.querySelector('.seccion');
            primerSeccion.classList.remove('collapsed');
            
            alert('✅ Datos del paciente cargados correctamente');
        }
    } catch (error) {
        console.error('Error al cargar paciente:', error);
        alert('❌ Error al cargar los datos del paciente');
    }
}

// Rellenar formulario con datos existentes (FUNCIÓN COMPLETA)
function rellenarFormulario(data) {
    for (const [key, value] of Object.entries(data)) {
        const elemento = document.querySelector(`[name="${key}"]`);
        
        if (elemento) {
            if (elemento.type === 'radio') {
                const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else {
                elemento.value = value;
            }
        }
    }
    
    // Activar funciones dinámicas si es necesario
    setTimeout(() => {
        toggleDatosConyuge();
        toggleHermanos();
        toggleHijos();
        toggleMiedos();
        togglePreferencias();
        toggleCirugias();
        toggleMedicamentos();
        toggleAlergias();
        toggleHospitalizaciones();
        toggleCronicas();
        toggleOtroOcupacion();
    }, 100);
}

// Limpiar búsqueda (actualizado)
function limpiarBusqueda() {
    document.getElementById('buscarNombre').value = '';
    document.getElementById('buscarApellido').value = '';
    document.getElementById('resultadosBusqueda').innerHTML = '';
}

// ===== SISTEMA DE DETECCIÓN DE INFORMACIÓN EN SECCIONES (3 ESTADOS) =====

// Definir campos requeridos por sección
const camposRequeridos = {
    0: ['nombre', 'apellido', 'telefono', 'edad', 'sexo', 'estadoCivil'],
    1: [],
    2: ['tieneCirugias', 'tomaMedicamentos', 'tieneAlergias', 'hospitalizaciones', 'enfermedadesCronicas'],
    3: ['motivoConsulta', 'tieneMiedos', 'tienePreferencias']
};

// Función para verificar estado de una sección
function verificarEstadoSeccion(seccionIndex) {
    const secciones = document.querySelectorAll('.seccion');
    const seccion = secciones[seccionIndex];
    
    if (!seccion) return 'vacia';
    
    const todosLosCampos = seccion.querySelectorAll('input:not([style*="display: none"]), select:not([style*="display: none"]), textarea:not([style*="display: none"])');
    const camposObligatorios = camposRequeridos[seccionIndex] || [];
    
    let camposLlenos = 0;
    let totalCampos = 0;
    let obligatoriosCompletos = 0;
    
    todosLosCampos.forEach(campo => {
        const contenedor = campo.closest('[style*="display: none"]');
        if (contenedor) return;
        
        totalCampos++;
        let tieneDatos = false;
        
        if (campo.type === 'radio') {
            if (campo.checked) {
                tieneDatos = true;
            }
        } else if (campo.value.trim() !== '') {
            tieneDatos = true;
        }
        
        if (tieneDatos) {
            camposLlenos++;
            
            if (camposObligatorios.includes(campo.name)) {
                obligatoriosCompletos++;
            }
        }
    });
    
    if (seccionIndex === 1) {
        const hermanos = verificarCamposDinamicos('nombresHermanos');
        const hijos = verificarCamposDinamicos('nombresHijos');
        totalCampos += hermanos.total + hijos.total;
        camposLlenos += hermanos.llenos + hijos.llenos;
    }
    
    if (camposLlenos === 0) {
        return 'vacia';
    }
    
    if (seccionIndex === 0) {
        const todosObligatoriosCompletos = camposObligatorios.length === obligatoriosCompletos;
        const ocupacionCompleta = verificarOcupacionCompleta();
        const conyugeCompleto = verificarConyugeCompleto();
        
        if (todosObligatoriosCompletos && ocupacionCompleta && conyugeCompleto) {
            return 'completa';
        } else {
            return 'parcial';
        }
    }
    
    const porcentajeLleno = camposLlenos / totalCampos;
    const obligatoriosOK = camposObligatorios.every(nombreCampo => {
        const campo = seccion.querySelector(`[name="${nombreCampo}"]`);
        if (!campo) return true;
        
        if (campo.type === 'radio') {
            return seccion.querySelector(`[name="${nombreCampo}"]:checked`) !== null;
        }
        return campo.value.trim() !== '';
    });
    
    if (seccionIndex === 2 || seccionIndex === 3) {
        if (obligatoriosOK && porcentajeLleno >= 0.7) {
            return 'completa';
        }
    } else {
        if (porcentajeLleno >= 0.5) {
            return 'completa';
        }
    }
    
    return 'parcial';
}

// Verificar campos dinámicos (hermanos/hijos)
function verificarCamposDinamicos(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return { total: 0, llenos: 0 };
    
    const inputs = contenedor.querySelectorAll('input[type="text"]');
    let llenos = 0;
    
    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            llenos++;
        }
    });
    
    return { total: inputs.length, llenos: llenos };
}

// Verificar si ocupación está completa
function verificarOcupacionCompleta() {
    const ocupacion = document.getElementById('ocupacion').value;
    if (ocupacion === 'otro') {
        const ocupacionOtra = document.getElementById('ocupacionOtra').value;
        return ocupacionOtra.trim() !== '';
    }
    return ocupacion !== '';
}

// Verificar si datos del cónyuge están completos (si está casado)
function verificarConyugeCompleto() {
    const casado = document.querySelector('input[name="estadoCivil"]:checked');
    if (casado && casado.value === 'Casado') {
        const nombreConyuge = document.getElementById('nombreConyuge').value;
        const edadConyuge = document.getElementById('edadConyuge').value;
        return nombreConyuge.trim() !== '' && edadConyuge.trim() !== '';
    }
    return true;
}

// Función para actualizar estado visual de una sección
function actualizarEstadoSeccion(seccionIndex) {
    const secciones = document.querySelectorAll('.seccion');
    const seccion = secciones[seccionIndex];
    
    if (!seccion) return;
    
    const estado = verificarEstadoSeccion(seccionIndex);
    
    seccion.classList.remove('con-informacion', 'parcial-informacion', 'completa-informacion');
    
    if (estado === 'completa') {
        seccion.classList.add('completa-informacion');
    } else if (estado === 'parcial') {
        seccion.classList.add('parcial-informacion');
    }
}

// Función para verificar todas las secciones
function verificarTodasLasSecciones() {
    const totalSecciones = document.querySelectorAll('.seccion').length;
    
    for (let i = 0; i < totalSecciones; i++) {
        actualizarEstadoSeccion(i);
    }
}

// Event listeners para detectar cambios en tiempo real
function configurarDeteccionCambios() {
    const secciones = document.querySelectorAll('.seccion');
    
    secciones.forEach((seccion, index) => {
        const campos = seccion.querySelectorAll('input, select, textarea');
        campos.forEach(campo => {
            ['input', 'change'].forEach(evento => {
                campo.addEventListener(evento, () => {
                    setTimeout(() => actualizarEstadoSeccion(index), 100);
                });
            });
        });
    });
}

// Función especial para campos dinámicos (hermanos, hijos)
function configurarCamposDinamicos(contenedorId, seccionIndex) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    
    const observer = new MutationObserver(() => {
        const nuevosInputs = contenedor.querySelectorAll('input[type="text"]');
        nuevosInputs.forEach(input => {
            input.removeEventListener('input', () => actualizarEstadoSeccion(seccionIndex));
            input.addEventListener('input', () => {
                setTimeout(() => actualizarEstadoSeccion(seccionIndex), 100);
            });
        });
    });
    
    observer.observe(contenedor, { childList: true, subtree: true });
}

// Función para inicializar todas las secciones como colapsadas
function inicializarSecciones() {
    const secciones = document.querySelectorAll('.seccion');
    
    secciones.forEach(seccion => {
        const content = seccion.querySelector('.seccion-content');
        const toggle = seccion.querySelector('.seccion-toggle');
        
        // Asegurar que todas empiecen colapsadas
        seccion.classList.add('collapsed');
        content.style.display = 'none';
        toggle.textContent = '▼';
    });
}

// ===== FUNCIÓN LIMPIEZA RÁPIDA (SIN CONFIRMACIONES) =====
function limpiarSeccionRapida(seccionIndex) {
    // Detener propagación del evento
    event.stopPropagation();
    event.preventDefault();
    
    console.log(`🧹 Limpiando sección ${seccionIndex}...`);
    
    const secciones = document.querySelectorAll('.seccion');
    const seccion = secciones[seccionIndex];
    
    if (!seccion) {
        console.error(`❌ Sección ${seccionIndex} no encontrada`);
        return;
    }
    
    // 1. LIMPIAR TODOS LOS INPUTS, SELECTS Y TEXTAREAS
    const todosCampos = seccion.querySelectorAll('input, select, textarea');
    todosCampos.forEach(campo => {
        if (campo.type === 'radio' || campo.type === 'checkbox') {
            campo.checked = false;
        } else {
            campo.value = '';
        }
    });
    
    // 2. OCULTAR CONTENEDORES DINÁMICOS POR SECCIÓN
    const contenedoresPorSeccion = {
        0: ['#datosConyuge', '#ocupacionOtraContainer'],
        1: ['#datosHermanos', '#datosHijos', '#nombresHermanos', '#nombresHijos'],
        2: ['#datosCirugias', '#datosMedicamentos', '#datosAlergias', '#datosHospitalizaciones', '#datosCronicas'],
        3: ['#datosMiedos', '#datosPreferencias']
    };
    
    const contenedores = contenedoresPorSeccion[seccionIndex] || [];
    contenedores.forEach(selector => {
        const elemento = seccion.querySelector(selector);
        if (elemento) {
            if (selector.includes('nombres')) {
                elemento.innerHTML = ''; // Limpiar contenido
            } else {
                elemento.style.display = 'none'; // Ocultar
            }
        }
    });
    
    // 3. LIMPIAR CAMPOS REQUERIDOS ESPECÍFICOS
    const camposPorSeccion = {
        0: () => {
            // Resetear ocupación "otro"
            const ocupacionOtra = seccion.querySelector('#ocupacionOtra');
            if (ocupacionOtra) {
                ocupacionOtra.required = false;
                ocupacionOtra.value = '';
            }
            
            // Resetear datos cónyuge
            const nombreConyuge = seccion.querySelector('#nombreConyuge');
            const edadConyuge = seccion.querySelector('#edadConyuge');
            if (nombreConyuge) nombreConyuge.required = false;
            if (edadConyuge) edadConyuge.required = false;
        },
        1: () => {
            // Resetear campos hermanos/hijos
            const numeroHermanos = seccion.querySelector('#numeroHermanos');
            const numeroHijos = seccion.querySelector('#numeroHijos');
            if (numeroHermanos) numeroHermanos.required = false;
            if (numeroHijos) numeroHijos.required = false;
        },
        2: () => {
            // Resetear campos médicos requeridos
            const campos = ['#detalleCirugias', '#listaMedicamentos', '#listaAlergias', '#detalleHospitalizaciones', '#listaCronicas'];
            campos.forEach(selector => {
                const campo = seccion.querySelector(selector);
                if (campo) campo.required = false;
            });
        },
        3: () => {
            // Resetear campos homeopáticos
            const campo = seccion.querySelector('#listaMiedos');
            if (campo) campo.required = false;
        }
    };
    
    // Ejecutar limpieza específica
    if (camposPorSeccion[seccionIndex]) {
        camposPorSeccion[seccionIndex]();
    }
    
    // 4. ACTUALIZAR ESTADO VISUAL
    setTimeout(() => {
        actualizarEstadoSeccion(seccionIndex);
        console.log(`✅ Sección ${seccionIndex} limpiada`);
    }, 100);
}

// ===== FUNCIÓN LIMPIEZA TOTAL RÁPIDA =====
function limpiarTodoRapido() {
    event.stopPropagation();
    event.preventDefault();
    
    // Limpiar formulario completo
    document.getElementById('historialForm').reset();
    
    // Ocultar todos los contenedores dinámicos
    const contenedores = [
        '#datosConyuge', '#ocupacionOtraContainer', '#datosHermanos', '#datosHijos',
        '#nombresHermanos', '#nombresHijos', '#datosCirugias', '#datosMedicamentos',
        '#datosAlergias', '#datosHospitalizaciones', '#datosCronicas', '#datosMiedos', '#datosPreferencias'
    ];
    
    contenedores.forEach(selector => {
        const elemento = document.querySelector(selector);
        if (elemento) {
            if (selector.includes('nombres')) {
                elemento.innerHTML = '';
            } else {
                elemento.style.display = 'none';
            }
        }
    });
    
    // Actualizar todos los estados
    setTimeout(verificarTodasLasSecciones, 100);
    
    console.log('🧹 Todo el historial limpiado');
}