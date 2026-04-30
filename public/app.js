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
// Función auxiliar para limpiar campos específicos por sección (ACTUALIZADA)
function limpiarCamposEspecificosPorSeccion(seccionIndex) {
    switch(seccionIndex) {
// Agregar a la función limpiarSeccionRapida en el case 0:
        case 0:
            // Resetear ocupación específica
            toggleOcupacionEspecifica();
            // Resetear datos cónyuge
            limpiarDatosConyuge();
            // Limpiar nuevos campos ocupación
            document.getElementById('queEstudia').value = '';
            document.getElementById('cualPuesto').value = '';
            document.getElementById('queVende').value = '';
            break;
        case 1:
            // Resetear hermanos/hijos/nietos
            document.getElementById('hermanosContainer').innerHTML = '';
            document.getElementById('hijosContainer').innerHTML = '';
            document.getElementById('nietosContainer').innerHTML = '';
            
            // Ocultar convivencia
            document.getElementById('convivenciaPadres').style.display = 'none';
            document.getElementById('convivenciaHijos').style.display = 'none';
            
            // Ocultar causas de muerte padres
            document.getElementById('causaMuertePadre').style.display = 'none';
            document.getElementById('causaMuerteMadre').style.display = 'none';
            
            // Ocultar pregunta abortos
            document.getElementById('preguntaAbortos').style.display = 'none';
            break;
    }
}
            
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
                'sintomasFisicos',
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
// Función auxiliar para limpiar campos específicos por sección (ACTUALIZADA)
function limpiarCamposEspecificosPorSeccion(seccionIndex) {
    switch(seccionIndex) {
        case 0:
            // Resetear ocupación otro
            toggleOtroOcupacion();
            // Resetear datos cónyuge
            limpiarDatosConyuge();
            break;
            
        case 1:
            // Resetear hermanos/hijos/nietos
            document.getElementById('hermanosContainer').innerHTML = '';
            document.getElementById('hijosContainer').innerHTML = '';
            document.getElementById('nietosContainer').innerHTML = '';
            
            // Ocultar convivencia
            document.getElementById('convivenciaPadres').style.display = 'none';
            document.getElementById('convivenciaHijos').style.display = 'none';
            
            // Ocultar causas de muerte padres
            document.getElementById('causaMuertePadre').style.display = 'none';
            document.getElementById('causaMuerteMadre').style.display = 'none';
            
            // Ocultar pregunta abortos
            document.getElementById('preguntaAbortos').style.display = 'none';
            break;
    }
}
        
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

// ACTUALIZAR FUNCIÓN GUARDAR PARA COLAPSAR DESPUÉS DE GUARDAR
async function guardarHistorial(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        if (data.ocupacion === 'otro' && data.ocupacionOtra) {
            data.ocupacion = data.ocupacionOtra;
            delete data.ocupacionOtra;
        }
        
                // Manejar campos específicos de ocupación
        if (data.ocupacion === 'Estudiante' && data.queEstudia) {
            data.detalleOcupacion = data.queEstudia;
            delete data.queEstudia;
        } else if ((data.ocupacion === 'Empleado' || data.ocupacion === 'Profesionista') && data.cualPuesto) {
            data.detalleOcupacion = data.cualPuesto;
            delete data.cualPuesto;
        } else if (data.ocupacion === 'Comerciante' && data.queVende) {
            data.detalleOcupacion = data.queVende;
            delete data.queVende;
        }
        
        if (data.ocupacion === 'otro' && data.ocupacionOtra) {
            data.ocupacion = data.ocupacionOtra;
            delete data.ocupacionOtra;
        }

        data.fechaCreacion = firebase.firestore.Timestamp.now();
        
        console.log('Guardando datos:', data);
        
        const docRef = await db.collection('historiales').add(data);
        console.log('Historial guardado con ID:', docRef.id);
        
        mostrarModalExito();
        e.target.reset();
        
        // Ocultar contenedores dinámicos
        const contenedores = [
            '#datosConyuge', '#ocupacionOtraContainer', '#datosRecomendacion',
            '#datosHermanos', '#datosHijos', '#datosNietos',
            '#hermanosContainer', '#hijosContainer', '#nietosContainer',
            '#datosCirugias', '#datosMedicamentos', '#datosAlergias',
            '#datosHospitalizaciones', '#datosCronicas', '#datosMiedos', '#datosPreferencias',
            '#preguntaAbortos'
        ];
        
        contenedores.forEach(selector => {
            const elemento = document.querySelector(selector);
            if (elemento) {
                if (selector.includes('Container')) {
                    elemento.innerHTML = '';
                } else {
                    elemento.style.display = 'none';
                }
            }
        });
        
        // COLAPSAR TODAS LAS SECCIONES DESPUÉS DE GUARDAR
        setTimeout(() => {
            colapsarTodasLasSecciones();
            verificarTodasLasSecciones();
        }, 500);
        
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('❌ Error al guardar el historial');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Configurar nuevos event listeners
    configurarEventListenersFamilia();
    
    console.log('✅ APLICACIÓN INICIALIZADA CORRECTAMENTE');
});

function configurarEventListenersFamilia() {
    // Event listeners para estado de padres
    document.querySelectorAll('input[name="estadoPadre"]').forEach(radio => {
        radio.addEventListener('change', verificarConvivenciaPadres);
    });
    
    document.querySelectorAll('input[name="estadoMadre"]').forEach(radio => {
        radio.addEventListener('change', verificarConvivenciaPadres);
    });
    
    // Event listeners para estado civil
    document.querySelectorAll('input[name="estadoCivil"]').forEach(radio => {
        radio.addEventListener('change', toggleDatosConyuge);
    });
}

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

// Modificar función buscarEnTiempoReal
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
        // Buscar en campo principal
        const query1 = db.collection('historiales')
            .where(campo, '>=', texto)
            .where(campo, '<=', texto + '\uf8ff');
            
        // Buscar en recomendados
        const query2 = db.collection('historiales')
            .where('nombreRecomendador', '>=', texto)
            .where('nombreRecomendador', '<=', texto + '\uf8ff');
        
        const [snapshot1, snapshot2] = await Promise.all([query1.get(), query2.get()]);
        
        const resultados = [];
        const idsAgregados = new Set();
        
        // Procesar resultados principales
        snapshot1.forEach((doc) => {
            if (!idsAgregados.has(doc.id)) {
                resultados.push({ id: doc.id, ...doc.data(), tipoMatch: 'directo' });
                idsAgregados.add(doc.id);
            }
        });
        
        // Procesar resultados de recomendados
        snapshot2.forEach((doc) => {
            if (!idsAgregados.has(doc.id)) {
                resultados.push({ id: doc.id, ...doc.data(), tipoMatch: 'recomendado' });
                idsAgregados.add(doc.id);
            }
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

// FUNCIÓN LIMPIAR TODO CON COLAPSO (ACTUALIZADA)
function limpiarTodoRapido() {
    event.stopPropagation();
    event.preventDefault();
    
    // Limpiar formulario completo
    document.getElementById('historialForm').reset();
    
    // Limpiar contenedores dinámicos específicos
    const contenedoresDinamicos = [
        'hermanosContainer', 'hijosContainer', 'nietosContainer'
    ];
    
    contenedoresDinamicos.forEach(id => {
        const contenedor = document.getElementById(id);
        if (contenedor) {
            contenedor.innerHTML = '';
        }
    });
    
    // Ocultar contenedores condicionales
    const contenedores = [
        '#datosConyuge', '#ocupacionOtraContainer', '#datosRecomendacion',
        '#datosCirugias', '#datosMedicamentos', '#datosAlergias', 
        '#datosHospitalizaciones', '#datosCronicas', '#datosMiedos', 
        '#datosPreferencias', '#preguntaAbortos'
    ];
    
    contenedores.forEach(selector => {
        const elemento = document.querySelector(selector);
        if (elemento) {
            elemento.style.display = 'none';
        }
    });
    
    // COLAPSAR TODAS LAS SECCIONES AUTOMÁTICAMENTE
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        const content = seccion.querySelector('.seccion-content');
        const toggle = seccion.querySelector('.seccion-toggle');
        
        seccion.classList.add('collapsed');
        if (content) content.style.display = 'none';
        if (toggle) toggle.textContent = '▼';
    });
    
    // Actualizar estados
    setTimeout(() => {
        verificarTodasLasSecciones();
        console.log('🧹 Todo limpiado y secciones colapsadas');
    }, 100);
}

// FUNCIÓN AUXILIAR: COLAPSAR TODAS LAS SECCIONES
function colapsarTodasLasSecciones() {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        const content = seccion.querySelector('.seccion-content');
        const toggle = seccion.querySelector('.seccion-toggle');
        
        seccion.classList.add('collapsed');
        if (content) content.style.display = 'none';
        if (toggle) toggle.textContent = '▼';
    });
}

// ===== NUEVAS FUNCIONES SECCIÓN 1 =====
function toggleRecomendacion() {
    const fueRecomendado = document.querySelector('input[name="fueRecomendado"]:checked');
    const datosRecomendacion = document.getElementById('datosRecomendacion');
    const nombreRecomendador = document.getElementById('nombreRecomendador');
    
    if (fueRecomendado && fueRecomendado.value === 'Si') {
        datosRecomendacion.style.display = 'block';
        nombreRecomendador.required = true;
    } else {
        datosRecomendacion.style.display = 'none';
        nombreRecomendador.required = false;
        nombreRecomendador.value = '';
    }
}

// ===== NUEVAS FUNCIONES SECCIÓN 2 =====
function toggleHermanosNuevo() {
    const tieneHermanos = document.querySelector('input[name="tieneHermanos"]:checked');
    const datosHermanos = document.getElementById('datosHermanos');
    
    if (tieneHermanos && tieneHermanos.value === 'Si') {
        datosHermanos.style.display = 'block';
    } else {
        datosHermanos.style.display = 'none';
        document.getElementById('numeroHermanos').value = '';
        document.getElementById('hermanosContainer').innerHTML = '';
    }
}

function toggleDatosHermano(numero) {
    const estado = document.querySelector(`input[name="estadoHermano${numero}"]:checked`);
    const datosContainer = document.getElementById(`datosHermano${numero}`);
    const causaMuerteContainer = document.getElementById(`causaMuerteHermano${numero}`);
    
    if (estado && estado.value === 'Vivo') {
        datosContainer.style.display = 'flex';
        causaMuerteContainer.style.display = 'none';
        // Limpiar causa de muerte
        const causaInput = document.querySelector(`input[name="causaMuerteHermano${numero}"]`);
        if (causaInput) causaInput.value = '';
    } else if (estado && estado.value === 'Muerto') {
        datosContainer.style.display = 'none';
        causaMuerteContainer.style.display = 'block';
        // Limpiar datos de vivo
        const select = datosContainer.querySelector('select');
        if (select) select.value = '';
    } else {
        datosContainer.style.display = 'none';
        causaMuerteContainer.style.display = 'none';
    }
}

function generarHermanosNuevo() {
const numero = document.getElementById('numeroHermanos').value;
const container = document.getElementById('hermanosContainer');

container.innerHTML = '';

if (!numero || numero === '') return;

for (let i = 1; i <= numero; i++) {
const div = document.createElement('div');
div.className = 'campo-hermano';
div.innerHTML = `

<div class="contenedor-familiar"> <span class="etiqueta-familiar">Hermano ${i}:</span> <div class="grupo-estado"> <label><input type="radio" name="estadoHermano${i}" value="Vivo" onchange="toggleDatosHermano(${i})" required> Vivo</label> <label><input type="radio" name="estadoHermano${i}" value="Muerto" onchange="toggleDatosHermano(${i})" required> Muerto</label> </div> <div class="grupo-datos" id="datosHermano${i}" style="display: none;"> <div class="campo-edad"> <label>Edad:</label> <select name="edadHermano${i}" class="select-edad"> <option value="">-</option> ${generarOpcionesEdad()} </select> </div> </div> <div class="grupo-muerte" id="causaMuerteHermano${i}" style="display: none;"> <div class="campo-causa-muerte"> <label>Causa de muerte:</label> <input type="text" name="causaMuerteHermano${i}" placeholder="Especificar causa..." class="input-causa-muerte"> </div> </div> </div> `; container.appendChild(div); }
}

function toggleHijosNuevo() {
    const tieneHijos = document.querySelector('input[name="tieneHijos"]:checked');
    const datosHijos = document.getElementById('datosHijos');
    
    if (tieneHijos && tieneHijos.value === 'Si') {
        datosHijos.style.display = 'block';
        mostrarPreguntaAbortos();
    } else {
        datosHijos.style.display = 'none';
        document.getElementById('numeroHijos').value = '';
        document.getElementById('hijosContainer').innerHTML = '';
    }
}

function toggleDatosHijo(numero) {
    const estado = document.querySelector(`input[name="estadoHijo${numero}"]:checked`);
    const datosContainer = document.getElementById(`datosHijo${numero}`);
    
    if (estado && estado.value === 'Vivo') {
        datosContainer.style.display = 'flex';
    } else {
        datosContainer.style.display = 'none';
        // Limpiar campos
        const selects = datosContainer.querySelectorAll('select');
        const inputs = datosContainer.querySelectorAll('input');
        selects.forEach(select => select.value = '');
        inputs.forEach(input => input.value = '');
        
        // Ocultar detalle ocupación
        const detalleContainer = document.getElementById(`detalleOcupacionHijo${numero}`);
        if (detalleContainer) detalleContainer.style.display = 'none';
    }
}

// HIJOS - Solo edad y ocupación si está vivo (CORREGIDA)
function generarHijosNuevo() {
    const numero = document.getElementById('numeroHijos').value;
    const container = document.getElementById('hijosContainer');
    
    if (!container) {
        console.error('Container hijosContainer no encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    if (!numero || numero === '') {
        return;
    }
    
    // Mostrar pregunta de abortos si es mujer
    mostrarPreguntaAbortos();
    
    for (let i = 1; i <= numero; i++) {
        const div = document.createElement('div');
        div.className = 'campo-hijo';
        div.innerHTML = `
            <div class="contenedor-familiar" id="hijoContainer${i}">
                <span class="etiqueta-familiar">Hijo ${i}:</span>
                <div class="grupo-estado">
                    <label><input type="radio" name="estadoHijo${i}" value="Vivo" onchange="toggleDatosHijo(${i})" required> Vivo</label>
                    <label><input type="radio" name="estadoHijo${i}" value="Muerto" onchange="toggleDatosHijo(${i})" required> Muerto</label>
                </div>
                <div class="grupo-datos" id="datosHijo${i}" style="display: none;">
                    <div class="campo-edad">
                        <label>Edad:</label>
                        <select name="edadHijo${i}" class="select-edad">
                            <option value="">-</option>
                            ${generarOpcionesEdad()}
                        </select>
                    </div>
                    <div class="campo-ocupacion">
                        <label>Ocupación:</label>
                        <select name="ocupacionHijo${i}" onchange="toggleOcupacionHijo(${i})" class="select-ocupacion">
                            <option value="">Seleccionar</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Trabajador">Trabajador</option>
                            <option value="Desempleado">Desempleado</option>
                            <option value="Jubilado">Jubilado</option>
                        </select>
                    </div>
                    <div class="campo-detalle" id="detalleOcupacionHijo${i}" style="display: none;">
                        <input type="text" name="detalleOcupacionHijo${i}" placeholder="Especificar..." class="input-detalle">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

function toggleOcupacionHijo(numeroHijo) {
    const select = document.querySelector(`select[name="ocupacionHijo${numeroHijo}"]`);
    const detalle = document.getElementById(`detalleOcupacionHijo${numeroHijo}`);
    const input = detalle.querySelector('input');
    
    if (select.value === 'Estudiante' || select.value === 'Trabajador') {
        detalle.style.display = 'block';
        input.placeholder = select.value === 'Estudiante' ? 'Carrera...' : '¿Qué trabajo?';
        input.required = true;
    } else {
        detalle.style.display = 'none';
        input.required = false;
        input.value = '';
    }
}

function toggleNietos() {
    const tieneNietos = document.querySelector('input[name="tieneNietos"]:checked');
    const datosNietos = document.getElementById('datosNietos');
    
    if (tieneNietos && tieneNietos.value === 'Si') {
        datosNietos.style.display = 'block';
    } else {
        datosNietos.style.display = 'none';
        document.getElementById('numeroNietos').value = '';
        document.getElementById('nietosContainer').innerHTML = '';
    }
}

// NIETOS - Solo edad si está vivo (CORREGIDA)
// NIETOS - Agregar causa de muerte (CORREGIDA)
function generarNietos() {
    const numero = document.getElementById('cantidadNietos').value;
    const container = document.getElementById('nietosContainer');
    
    if (!container) {
        console.error('Container nietosContainer no encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    if (!numero || numero === '') {
        return;
    }
    
    for (let i = 1; i <= numero; i++) {
        const div = document.createElement('div');
        div.className = 'campo-nieto';
        div.innerHTML = `
            <div class="contenedor-familiar" id="nietoContainer${i}">
                <span class="etiqueta-familiar">Nieto ${i}:</span>
                <div class="grupo-estado">
                    <label><input type="radio" name="estadoNieto${i}" value="Vivo" onchange="toggleDatosNieto(${i})" required> Vivo</label>
                    <label><input type="radio" name="estadoNieto${i}" value="Muerto" onchange="toggleDatosNieto(${i})" required> Muerto</label>
                </div>
                <div class="grupo-datos" id="datosNieto${i}" style="display: none;">
                    <div class="campo-edad">
                        <label>Edad:</label>
                        <select name="edadNieto${i}" class="select-edad">
                            <option value="">-</option>
                            ${generarOpcionesEdad(0, 25)}
                        </select>
                    </div>
                </div>
                <div class="grupo-muerte" id="causaMuerteNieto${i}" style="display: none;">
                    <div class="campo-causa-muerte">
                        <label>Causa de muerte:</label>
                        <input type="text" name="causaMuerteNieto${i}" placeholder="Especificar causa..." class="input-causa-muerte">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

function toggleDatosNieto(numero) {
    const estado = document.querySelector(`input[name="estadoNieto${numero}"]:checked`);
    const datosContainer = document.getElementById(`datosNieto${numero}`);
    const causaMuerteContainer = document.getElementById(`causaMuerteNieto${numero}`);
    
    if (estado && estado.value === 'Vivo') {
        datosContainer.style.display = 'flex';
        causaMuerteContainer.style.display = 'none';
        // Limpiar causa de muerte
        const causaInput = document.querySelector(`input[name="causaMuerteNieto${numero}"]`);
        if (causaInput) causaInput.value = '';
    } else if (estado && estado.value === 'Muerto') {
        datosContainer.style.display = 'none';
        causaMuerteContainer.style.display = 'block';
        // Limpiar datos de vivo
        const select = datosContainer.querySelector('select');
        if (select) select.value = '';
    } else {
        datosContainer.style.display = 'none';
        causaMuerteContainer.style.display = 'none';
    }
}

toggleDatosNieto

function generarOpcionesEdad(min = 1, max = 100) {
    let opciones = '';
    for (let i = min; i <= max; i++) {
        opciones += `<option value="${i}">${i}</option>`;
    }
    return opciones;
}

function mostrarPreguntaAbortos() {
    const sexo = document.querySelector('input[name="sexo"]:checked');
    const preguntaAbortos = document.getElementById('preguntaAbortos');
    
    if (sexo && sexo.value === 'Femenino') {
        preguntaAbortos.style.display = 'block';
    } else {
        preguntaAbortos.style.display = 'none';
    }
}

// Modificar la función existente de sexo para mostrar pregunta abortos
document.querySelectorAll('input[name="sexo"]').forEach(radio => {
    radio.addEventListener('change', mostrarPreguntaAbortos);
});
// ===== NUEVAS FUNCIONES PARA FAMILIARES MUERTOS =====

function toggleMuertePadre() {
    const estadoPadre = document.querySelector('input[name="estadoPadre"]:checked');
    const causaMuerte = document.getElementById('causaMuertePadre');
    const convivencia = document.getElementById('convivenciaPadres');
    
    if (estadoPadre && estadoPadre.value === 'Muerto') {
        causaMuerte.style.display = 'block';
        // Ocultar convivencia si padre está muerto
        verificarConvivenciaPadres();
    } else {
        causaMuerte.style.display = 'none';
        document.getElementById('causaMuertePadreTexto').value = '';
        verificarConvivenciaPadres();
    }
}

function toggleMuerteMadre() {
    const estadoMadre = document.querySelector('input[name="estadoMadre"]:checked');
    const causaMuerte = document.getElementById('causaMuerteMadre');
    
    if (estadoMadre && estadoMadre.value === 'Muerto') {
        causaMuerte.style.display = 'block';
        verificarConvivenciaPadres();
    } else {
        causaMuerte.style.display = 'none';
        document.getElementById('causaMuerteMadreTexto').value = '';
        verificarConvivenciaPadres();
    }
}

function verificarConvivenciaPadres() {
    const estadoPadre = document.querySelector('input[name="estadoPadre"]:checked');
    const estadoMadre = document.querySelector('input[name="estadoMadre"]:checked');
    const convivencia = document.getElementById('convivenciaPadres');
    
    // Mostrar convivencia solo si al menos uno está vivo
    if ((estadoPadre && estadoPadre.value === 'Vivo') || 
        (estadoMadre && estadoMadre.value === 'Vivo')) {
        convivencia.style.display = 'block';
    } else {
        convivencia.style.display = 'none';
        // Limpiar respuesta de convivencia
        const radios = document.querySelectorAll('input[name="viveConPadres"]');
        radios.forEach(radio => radio.checked = false);
    }
}

// ===== FUNCIONES PARA ESTADO CIVIL EXTENDIDO =====

function toggleDatosConyuge() {
    const estadoCivil = document.querySelector('input[name="estadoCivil"]:checked');
    const datosConyuge = document.getElementById('datosConyuge');
    const datosCasado = document.getElementById('datosCasado');
    const datosExConyuge = document.getElementById('datosExConyuge');
    const datosViudo = document.getElementById('datosViudo');
    
    // Limpiar todos los contenedores
    limpiarDatosConyuge();
    
    if (estadoCivil) {
        switch(estadoCivil.value) {
            case 'Casado':
                datosConyuge.style.display = 'block';
                datosCasado.style.display = 'block';
                datosExConyuge.style.display = 'none';
                datosViudo.style.display = 'none';
                
                document.getElementById('nombreConyuge').required = true;
                document.getElementById('edadConyuge').required = true;
                break;
                
            case 'Divorciado':
            case 'Separado':
                datosConyuge.style.display = 'block';
                datosCasado.style.display = 'none';
                datosExConyuge.style.display = 'block';
                datosViudo.style.display = 'none';
                break;
                
            case 'Viudo/a':
                datosConyuge.style.display = 'block';
                datosCasado.style.display = 'none';
                datosExConyuge.style.display = 'none';
                datosViudo.style.display = 'block';
                break;
                
            default:
                datosConyuge.style.display = 'none';
        }
    } else {
        datosConyuge.style.display = 'none';
    }
}

function limpiarDatosConyuge() {
    // Limpiar campos de casado
    document.getElementById('nombreConyuge').value = '';
    document.getElementById('edadConyuge').value = '';
    document.getElementById('nombreConyuge').required = false;
    document.getElementById('edadConyuge').required = false;
    
    // Limpiar campos de ex-cónyuge
    const radiosExConyuge = document.querySelectorAll('input[name="estadoExConyuge"]');
    radiosExConyuge.forEach(radio => radio.checked = false);
    
    const radiosViveEx = document.querySelectorAll('input[name="viveConExConyuge"]');
    radiosViveEx.forEach(radio => radio.checked = false);
    
    document.getElementById('causaMuerteExConyuge').value = '';
    
    // Limpiar campos de viudo
    document.getElementById('causaMuerteConyugue').value = '';
    
    // Ocultar subcampos
    document.getElementById('exConyugeVivo').style.display = 'none';
    document.getElementById('exConyugeMuerto').style.display = 'none';
}

function toggleExConyugeVivo() {
    const estadoEx = document.querySelector('input[name="estadoExConyuge"]:checked');
    const vivoDiv = document.getElementById('exConyugeVivo');
    const muertoDiv = document.getElementById('exConyugeMuerto');
    
    if (estadoEx && estadoEx.value === 'Vivo') {
        vivoDiv.style.display = 'block';
        muertoDiv.style.display = 'none';
        document.getElementById('causaMuerteExConyuge').value = '';
    } else if (estadoEx && estadoEx.value === 'Muerto') {
        vivoDiv.style.display = 'none';
        muertoDiv.style.display = 'block';
        // Limpiar pregunta de convivencia
        const radiosVive = document.querySelectorAll('input[name="viveConExConyuge"]');
        radiosVive.forEach(radio => radio.checked = false);
    } else {
        vivoDiv.style.display = 'none';
        muertoDiv.style.display = 'none';
    }
}

// ===== FUNCIONES PARA CONVIVENCIA CON HIJOS =====

function verificarConvivenciaHijos() {
    const numeroHijos = document.getElementById('numeroHijos').value;
    const convivenciaHijos = document.getElementById('convivenciaHijos');
    
    if (numeroHijos && numeroHijos !== '') {
        convivenciaHijos.style.display = 'block';
    } else {
        convivenciaHijos.style.display = 'none';
        // Limpiar respuesta
        const radios = document.querySelectorAll('input[name="viveConHijos"]');
        radios.forEach(radio => radio.checked = false);
    }
}

// ===== MODIFICAR FUNCIÓN EXISTENTE PARA HIJOS =====

// Reemplazar la función generarHijosNuevo existente con esta versión mejorada:
function generarHijosNuevo() {
    const numero = document.getElementById('numeroHijos').value;
    const container = document.getElementById('hijosContainer');
    
    if (!container) {
        console.error('Container hijosContainer no encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    if (!numero || numero === '') {
        verificarConvivenciaHijos(); // Ocultar convivencia si no hay hijos
        return;
    }
    
    // Mostrar pregunta de abortos si es mujer
    mostrarPreguntaAbortos();
    
    // Mostrar pregunta de convivencia
    verificarConvivenciaHijos();
    
    for (let i = 1; i <= numero; i++) {
        const div = document.createElement('div');
        div.className = 'campo-hijo';
        div.innerHTML = `
            <div class="contenedor-familiar" id="hijoContainer${i}">
                <span class="etiqueta-familiar">Hijo ${i}:</span>
                <div class="grupo-estado">
                    <label><input type="radio" name="estadoHijo${i}" value="Vivo" onchange="toggleDatosHijo(${i})" required> Vivo</label>
                    <label><input type="radio" name="estadoHijo${i}" value="Muerto" onchange="toggleDatosHijo(${i})" required> Muerto</label>
                </div>
                <div class="grupo-datos" id="datosHijo${i}" style="display: none;">
                    <div class="campo-edad">
                        <label>Edad:</label>
                        <select name="edadHijo${i}" class="select-edad">
                            <option value="">-</option>
                            ${generarOpcionesEdad()}
                        </select>
                    </div>
                    <div class="campo-ocupacion">
                        <label>Ocupación:</label>
                        <select name="ocupacionHijo${i}" onchange="toggleOcupacionHijo(${i})" class="select-ocupacion">
                            <option value="">Seleccionar</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Trabajador">Trabajador</option>
                            <option value="Desempleado">Desempleado</option>
                            <option value="Jubilado">Jubilado</option>
                        </select>
                    </div>
                    <div class="campo-detalle" id="detalleOcupacionHijo${i}" style="display: none;">
                        <input type="text" name="detalleOcupacionHijo${i}" placeholder="Especificar..." class="input-detalle">
                    </div>
                </div>
                <div class="grupo-muerte" id="causaMuerteHijo${i}" style="display: none;">
                    <div class="campo-causa-muerte">
                        <label>Causa de muerte:</label>
                        <input type="text" name="causaMuerteHijo${i}" placeholder="Especificar causa..." class="input-causa-muerte">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

// Modificar función toggleDatosHijo para incluir causa de muerte:
function toggleDatosHijo(numero) {
    const estado = document.querySelector(`input[name="estadoHijo${numero}"]:checked`);
    const datosContainer = document.getElementById(`datosHijo${numero}`);
    const causaMuerteContainer = document.getElementById(`causaMuerteHijo${numero}`);
    
    if (estado && estado.value === 'Vivo') {
        datosContainer.style.display = 'flex';
        causaMuerteContainer.style.display = 'none';
        // Limpiar causa de muerte
        const causaInput = document.querySelector(`input[name="causaMuerteHijo${numero}"]`);
        if (causaInput) causaInput.value = '';
    } else if (estado && estado.value === 'Muerto') {
        datosContainer.style.display = 'none';
        causaMuerteContainer.style.display = 'block';
        // Limpiar datos de vivo
        const selects = datosContainer.querySelectorAll('select');
        const inputs = datosContainer.querySelectorAll('input');
        selects.forEach(select => select.value = '');
        inputs.forEach(input => input.value = '');
        
        // Ocultar detalle ocupación
        const detalleContainer = document.getElementById(`detalleOcupacionHijo${numero}`);
        if (detalleContainer) detalleContainer.style.display = 'none';
    } else {
        datosContainer.style.display = 'none';
        causaMuerteContainer.style.display = 'none';
    }
}

// NUEVA FUNCIÓN: Manejar ocupaciones específicas
function toggleOcupacionEspecifica() {
    const ocupacion = document.getElementById('ocupacion').value;
    
    // Ocultar todos los contenedores
    document.getElementById('detalleEstudianteContainer').style.display = 'none';
    document.getElementById('detalleTrabajadorContainer').style.display = 'none';
    document.getElementById('detalleComerciante').style.display = 'none';
    document.getElementById('ocupacionOtraContainer').style.display = 'none';
    
    // Limpiar todos los campos
    document.getElementById('queEstudia').value = '';
    document.getElementById('cualPuesto').value = '';
    document.getElementById('queVende').value = '';
    document.getElementById('ocupacionOtra').value = '';
    
    // Remover required de todos
    document.getElementById('queEstudia').required = false;
    document.getElementById('cualPuesto').required = false;
    document.getElementById('queVende').required = false;
    document.getElementById('ocupacionOtra').required = false;
    
    // Mostrar y hacer requerido el campo correspondiente
    switch(ocupacion) {
        case 'Estudiante':
            document.getElementById('detalleEstudianteContainer').style.display = 'block';
            document.getElementById('queEstudia').required = true;
            break;
            
        case 'Empleado':
        case 'Profesionista':
            document.getElementById('detalleTrabajadorContainer').style.display = 'block';
            document.getElementById('cualPuesto').required = true;
            break;
            
        case 'Comerciante':
            document.getElementById('detalleComerciante').style.display = 'block';
            document.getElementById('queVende').required = true;
            break;
            
        case 'otro':
            document.getElementById('ocupacionOtraContainer').style.display = 'block';
            document.getElementById('ocupacionOtra').required = true;
            break;
    }
    
    // Actualizar estado de la sección
    setTimeout(() => actualizarEstadoSeccion(0), 100);
}

// ACTUALIZAR FUNCIÓN: toggleDatosConyuge para trabajar con select
function toggleDatosConyuge() {
    const estadoCivil = document.getElementById('estadoCivil').value; // Cambio: usar select en lugar de radio
    const datosConyuge = document.getElementById('datosConyuge');
    const datosCasado = document.getElementById('datosCasado');
    const datosExConyuge = document.getElementById('datosExConyuge');
    const datosViudo = document.getElementById('datosViudo');
    
    // Limpiar todos los contenedores
    limpiarDatosConyuge();
    
    if (estadoCivil) {
        switch(estadoCivil) {
            case 'Casado':
                datosConyuge.style.display = 'block';
                datosCasado .style.display = 'block';
                datosExConyuge.style.display = 'none';
                datosViudo.style.display = 'none';
                
                document.getElementById('nombreConyuge').required = true;
                document.getElementById('edadConyuge').required = true;
                break;
                
            case 'Divorciado':
            case 'Separado':
                datosConyuge.style.display = 'block';
                datosCasado.style.display = 'none';
                datosExConyuge.style.display = 'block';
                datosViudo.style.display = 'none';
                break;
                
            case 'Viudo/a':
                datosConyuge.style.display = 'block';
                datosCasado.style.display = 'none';
                datosExConyuge.style.display = 'none';
                datosViudo.style.display = 'block';
                break;
                
            default:
                datosConyuge.style.display = 'none';
        }
    } else {
        datosConyuge.style.display = 'none';
    }
    
    // Actualizar estado visual
    setTimeout(() => actualizarEstadoSeccion(0), 100);
}

// ACTUALIZAR FUNCIÓN: Verificación de ocupación completa
function verificarOcupacionCompleta() {
    const ocupacion = document.getElementById('ocupacion').value;
    
    if (!ocupacion) return false;
    
    switch(ocupacion) {
        case 'Estudiante':
            return document.getElementById('queEstudia').value.trim() !== '';
        case 'Empleado':
        case 'Profesionista':
            return document.getElementById('cualPuesto').value.trim() !== '';
        case 'Comerciante':
            return document.getElementById('queVende').value.trim() !== '';
        case 'otro':
            return document.getElementById('ocupacionOtra').value.trim() !== '';
        default:
            return true; // Ama de casa, Jubilado no necesitan detalle
    }
}

// ACTUALIZAR FUNCIÓN: Verificar cónyuge completo
function verificarConyugeCompleto() {
    const estadoCivil = document.getElementById('estadoCivil').value; // Cambio: usar select
    if (estadoCivil === 'Casado') {
        const nombreConyuge = document.getElementById('nombreConyuge').value;
        const edadConyuge = document.getElementById('edadConyuge').value;
        return nombreConyuge.trim() !== '' && edadConyuge.trim() !== '';
    }
    return true;
}

// Función para generar opciones de edad (0-100 años)
function generarOpcionesEdad() {
    let opciones = '';
    for (let i = 0; i <= 100; i++) {
        opciones += `<option value="${i}">${i} años</option>`;
    }
    return opciones;
}

// Función para mostrar/ocultar campos según estado
function toggleDatosHermano(numero) {
    const estadoRadios = document.getElementsByName(`estadoHermano${numero}`);
    const datosDiv = document.getElementById(`datosHermano${numero}`);
    const causaMuerteDiv = document.getElementById(`causaMuerteHermano${numero}`);
    
    const estadoSeleccionado = [...estadoRadios].find(radio => radio.checked)?.value;
    
    if (estadoSeleccionado === 'Vivo') {
        datosDiv.style.display = 'block';
        causaMuerteDiv.style.display = 'none';
    } else if (estadoSeleccionado === 'Muerto') {
        datosDiv.style.display = 'none';
        causaMuerteDiv.style.display = 'block';
    }
}

// SECCIÓN 3 - FUNCIONES CORREGIDAS PARA TU HTML EXACTO

// 1. Comida dulce - campo "otros"
function toggleOtrosDulce() {
    const dulceOtros = document.getElementById('dulce_otros');
    const otrosContainer = document.getElementById('otros-dulce-container');
    
    if (dulceOtros.checked) {
        otrosContainer.style.display = 'block';
    } else {
        otrosContainer.style.display = 'none';
        document.getElementById('otros_dulce_texto').value = '';
    }
}

// 2. Comida salada - campo "otros"
function toggleOtrosSalada() {
    const saladaOtros = document.getElementById('salada_otros');
    const otrosContainer = document.getElementById('otros-salada-container');
    
    if (saladaOtros.checked) {
        otrosContainer.style.display = 'block';
    } else {
        otrosContainer.style.display = 'none';
        document.getElementById('otros_salada_texto').value = '';
    }
}

// 3. Ejercicio - frecuencia
function toggleEjercicio() {
    const ejercicioSi = document.getElementById('ejercicio_si');
    const frecuenciaContainer = document.getElementById('ejercicio-frecuencia-container');
    
    if (ejercicioSi.checked) {
        frecuenciaContainer.style.display = 'block';
    } else {
        frecuenciaContainer.style.display = 'none';
        document.getElementById('ejercicio_frecuencia').value = '';
    }
}

// 4. Clima - campo "otro"
function toggleOtroClima() {
    const climaOtro = document.getElementById('clima_otro');
    const otroContainer = document.getElementById('otro-clima-container');
    
    if (climaOtro.checked) {
        otroContainer.style.display = 'block';
    } else {
        otroContainer.style.display = 'none';
        document.getElementById('otro_clima_texto').value = '';
    }
}

// 5. Problemas intestinales - sub-preguntas
function toggleProblemasIntestino() {
    const intestinoSi = document.getElementById('intestino_si');
    const detalleContainer = document.getElementById('problemas-intestino-detalle');
    
    if (intestinoSi.checked) {
        detalleContainer.style.display = 'block';
    } else {
        detalleContainer.style.display = 'none';
        // Limpiar sub-preguntas
        const radios = detalleContainer.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.checked = false);
        const texts = detalleContainer.querySelectorAll('input[type="text"]');
        texts.forEach(text => text.value = '');
        // Ocultar sub-containers
        document.getElementById('inflamacion-horario').style.display = 'none';
        document.getElementById('gases-horario').style.display = 'none';
    }
}

// 6. Inflamación - horario
function toggleInflamacion() {
    const inflamacionSi = document.getElementById('inflamacion_si');
    const horarioContainer = document.getElementById('inflamacion-horario');
    
    if (inflamacionSi.checked) {
        horarioContainer.style.display = 'block';
    } else {
        horarioContainer.style.display = 'none';
        document.getElementById('inflamacion_horario_texto').value = '';
    }
}

// 7. Gases - horario
function toggleGases() {
    const gasesSi = document.getElementById('gases_si');
    const horarioContainer = document.getElementById('gases-horario');
    
    if (gasesSi.checked) {
        horarioContainer.style.display = 'block';
    } else {
        horarioContainer.style.display = 'none';
        document.getElementById('gases_horario_texto').value = '';
    }
}

// 8. Frecuencia intestinal - frecuencia específica
function toggleFrecuenciaIntestinal() {
    const estrenimiento = document.getElementById('estrenimiento');
    const diarrea = document.getElementById('diarrea');
    const ambos = document.getElementById('ambos');
    const frecuenciaContainer = document.getElementById('frecuencia-intestinal-container');
    
    if (estrenimiento.checked || diarrea.checked || ambos.checked) {
        frecuenciaContainer.style.display = 'block';
    } else {
        frecuenciaContainer.style.display = 'none';
        document.getElementById('frecuencia_intestinal').value = '';
    }
}

// 9. Vida sexual - frecuencia
function toggleVidaSexual() {
    const sexualSi = document.getElementById('sexual_si');
    const frecuenciaContainer = document.getElementById('frecuencia-sexual-container');
    
    if (sexualSi.checked) {
        frecuenciaContainer.style.display = 'block';
    } else {
        frecuenciaContainer.style.display = 'none';
        document.getElementById('frecuencia_sexual').value = '';
    }
}

// 10. Transpiración - olor fuerte
function toggleTranspiracion() {
    const transpiracionSi = document.getElementById('transpiracion_si');
    const olorContainer = document.getElementById('olor-fuerte-container');
    
    if (transpiracionSi.checked) {
        olorContainer.style.display = 'block';
    } else {
        olorContainer.style.display = 'none';
        const olorRadios = document.getElementsByName('olor_fuerte');
        olorRadios.forEach(radio => radio.checked = false);
    }
}

// 11. Tomar sol - campo "otro"
function toggleOtroSol() {
    const solOtro = document.getElementById('sol_otro');
    const otroContainer = document.getElementById('otro-sol-container');
    
    if (solOtro.checked) {
        otroContainer.style.display = 'block';
    } else {
        otroContainer.style.display = 'none';
        document.getElementById('otro_sol_texto').value = '';
    }
}

// 13. Patrón de sueño - campo "otro"
function toggleOtroSueno() {
    const suenoOtro = document.getElementById('sueno_otro');
    const otroContainer = document.getElementById('otro-sueno-container');
    
    if (suenoOtro.checked) {
        otroContainer.style.display = 'block';
    } else {
        otroContainer.style.display = 'none';
        document.getElementById('otro_sueno_texto').value = '';
    }
}

function testToggle() {
    const otrosRadio = document.getElementById('dulce_otros');
    const otrosContainer = document.getElementById('otros-dulce-container');
    const otrosTexto = document.getElementById('otros_dulce_texto');
    
    if (otrosRadio.checked) {
        otrosContainer.style.display = 'block';
    } else {
        otrosContainer.style.display = 'none';
        otrosTexto.value = '';
    }
}

// 1. Función para comida dulce (ya existe, solo cambiar conexión)
function manejarComidaDulce() {
    const otrosRadio = document.getElementById('dulce_otros');
    const otrosContainer = document.getElementById('otros-dulce-container');
    const otrosTexto = document.getElementById('otros_dulce_texto');
    
    if (otrosRadio.checked) {
        otrosContainer.style.display = 'block';
    } else {
        otrosContainer.style.display = 'none';
        otrosTexto.value = '';
    }
}

// 2. Función para clima
function manejarClima() {
    const otroRadio = document.getElementById('clima_otro');
    const otroContainer = document.getElementById('otro-clima-container');
    const otroTexto = document.getElementById('otro_clima_texto');
    
    if (otroRadio.checked) {
        otroContainer.style.display = 'block';
    } else {
        otroContainer.style.display = 'none';
        otroTexto.value = '';
    }
}

// 3. Función para tomar el sol
function manejarSol() {
    const otroRadio = document.getElementById('sol_otro');
    const otroContainer = document.getElementById('otro-sol-container');
    const otroTexto = document.getElementById('otro_sol_texto');
    
    if (otroRadio.checked) {
        otroContainer.style.display = 'block';
    } else {
        otroContainer.style.display = 'none';
        otroTexto.value = '';
    }
}

function toggleAguantarSol() {
    const siSelected = document.getElementById('aguanta_sol_si').checked;
    const noSelected = document.getElementById('aguanta_sol_no').checked;
    const container = document.getElementById('porque-no-sol-container');
    
    if (noSelected) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        // Limpiar textarea si cambia a "Sí"
        document.getElementById('porque_no_sol').value = '';
    }
}

function toggleMenstruacion() {
    const siSelected = document.getElementById('menstrua_si').checked;
    const noSelected = document.getElementById('menstrua_no').checked;
    
    const colicosContainer = document.getElementById('colicos-actuales-container');
    const edadContainer = document.getElementById('edad-menopausia-container');
    
    // Ocultar todos los containers
    colicosContainer.style.display = 'none';
    edadContainer.style.display = 'none';
    document.getElementById('dolor-colicos-container').style.display = 'none';
    document.getElementById('edad-sin-colicos-container').style.display = 'none';
    
    // Limpiar todos los campos
    document.getElementById('colicos_actuales_si').checked = false;
    document.getElementById('colicos_actuales_no').checked = false;
    document.getElementById('edad_menopausia').value = '';
    document.getElementById('dolor_colicos').value = '';
    document.getElementById('edad_sin_colicos').value = '';
    
    if (siSelected) {
        // Si menstrúa → mostrar pregunta de cólicos
        colicosContainer.style.display = 'block';
    } else if (noSelected) {
        // Si no menstrúa → mostrar pregunta de edad
        edadContainer.style.display = 'block';
    }
}

function toggleColicosActuales() {
    const siColicos = document.getElementById('colicos_actuales_si').checked;
    const noColicos = document.getElementById('colicos_actuales_no').checked;
    
    const dolorContainer = document.getElementById('dolor-colicos-container');
    const edadSinColicosContainer = document.getElementById('edad-sin-colicos-container');
    
    // Ocultar ambos containers
    dolorContainer.style.display = 'none';
    edadSinColicosContainer.style.display = 'none';
    
    // Limpiar campos
    document.getElementById('dolor_colicos').value = '';
    document.getElementById('edad_sin_colicos').value = '';
    
    if (siColicos) {
        // Sí tiene cólicos → pregunta cómo es el dolor
        dolorContainer.style.display = 'block';
    } else if (noColicos) {
        // No tiene cólicos → pregunta edad
        edadSinColicosContainer.style.display = 'block';
    }
}