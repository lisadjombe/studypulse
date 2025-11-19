// Datos de la aplicación
let universityName = "";
let subjects = [];
let events = [];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedSubjectId = null;

// Elementos DOM
const welcomeScreen = document.getElementById('welcomeScreen');
const enterBtn = document.getElementById('enterBtn');
const mainContent = document.getElementById('mainContent');
const universityInput = document.getElementById('universityName');
const welcomeMessage = document.getElementById('welcomeMessage');
const displayUniversity = document.getElementById('displayUniversity');
const subjectsGrid = document.getElementById('subjectsGrid');
const addSubjectBtn = document.getElementById('addSubjectBtn');
const subjectModal = document.getElementById('subjectModal');
const closeSubjectModal = document.getElementById('closeSubjectModal');
const subjectForm = document.getElementById('subjectForm');
const subjectDetailModal = document.getElementById('subjectDetailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const deleteSubjectBtn = document.getElementById('deleteSubjectBtn');
const fileList = document.getElementById('fileList');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const calendar = document.getElementById('calendar');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const addEventBtn = document.getElementById('addEventBtn');
const eventModal = document.getElementById('eventModal');
const closeEventModal = document.getElementById('closeEventModal');
const eventForm = document.getElementById('eventForm');
const eventSubjectSelect = document.getElementById('eventSubject');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos guardados
    loadSavedData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Actualizar interfaz
    updateUniversityDisplay();
    renderSubjects();
    renderCalendar();
    updateEventSubjectSelect();
});

// Configurar event listeners
function setupEventListeners() {
    // Botón de entrada
    enterBtn.addEventListener('click', function() {
        if (universityInput.value.trim()) {
            universityName = universityInput.value.trim();
            saveData();
            updateUniversityDisplay();
            welcomeScreen.classList.add('hidden');
            setTimeout(() => {
                mainContent.classList.add('visible');
            }, 500);
        } else {
            alert('Por favor, ingresa el nombre de tu universidad');
        }
    });

    // Gestión de asignaturas
    addSubjectBtn.addEventListener('click', function() {
        subjectModal.classList.add('active');
    });

    closeSubjectModal.addEventListener('click', function() {
        subjectModal.classList.remove('active');
    });

    subjectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addSubject();
    });

    // Detalles de asignatura
    closeDetailModal.addEventListener('click', function() {
        subjectDetailModal.classList.remove('active');
    });

    deleteSubjectBtn.addEventListener('click', function() {
        if (selectedSubjectId !== null) {
            deleteSubject(selectedSubjectId);
        }
    });

    // Subida de archivos
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#3498db';
        uploadArea.style.background = 'rgba(52, 152, 219, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '';
        
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });

    fileInput.addEventListener('change', function() {
        handleFileUpload(this.files);
    });

    // Calendario
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    addEventBtn.addEventListener('click', function() {
        eventModal.classList.add('active');
        document.getElementById('eventDate').valueAsDate = new Date();
        updateEventSubjectSelect();
    });

    closeEventModal.addEventListener('click', function() {
        eventModal.classList.remove('active');
    });

    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addEvent();
    });

    // Funcionalidades de las tarjetas
    document.getElementById('emailCard').addEventListener('click', function() {
        window.open('https://mail.google.com', '_blank');
    });
    
    document.getElementById('tasksCard').addEventListener('click', function() {
        alert('Aquí se abriría tu aplicación de notas favorita');
    });
    
    document.getElementById('docsCard').addEventListener('click', function() {
        window.open('https://docs.google.com', '_blank');
    });
    
    document.getElementById('calendarCard').addEventListener('click', function() {
        document.querySelector('.calendar-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === subjectModal) {
            subjectModal.classList.remove('active');
        }
        if (e.target === subjectDetailModal) {
            subjectDetailModal.classList.remove('active');
        }
        if (e.target === eventModal) {
            eventModal.classList.remove('active');
        }
    });
}

// Actualizar display de universidad
function updateUniversityDisplay() {
    if (universityName) {
        displayUniversity.textContent = universityName;
        welcomeMessage.textContent = `¡Bienvenido a StudyPulse! Estás estudiando en ${universityName}.`;
    }
}

// Gestión de asignaturas
function addSubject() {
    const name = document.getElementById('subjectName').value;
    const level = document.getElementById('subjectLevel').value;
    const grade = document.getElementById('subjectGrade').value;
    const color = document.getElementById('subjectColor').value;

    // Validar que no se excedan las 10 asignaturas
    if (subjects.length >= 10) {
        alert('Has alcanzado el límite máximo de 10 asignaturas.');
        return;
    }

    const subject = {
        id: Date.now().toString(),
        name: name,
        level: level,
        grade: grade || 'Sin calificar',
        color: color,
        files: []
    };

    subjects.push(subject);
    saveData();
    renderSubjects();
    subjectModal.classList.remove('active');
    subjectForm.reset();
    
    alert(`Asignatura "${name}" añadida correctamente.`);
}

function renderSubjects() {
    subjectsGrid.innerHTML = '';
    
    if (subjects.length === 0) {
        subjectsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-book-open" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <p>No tienes asignaturas añadidas todavía.</p>
                <p>¡Añade tu primera asignatura para comenzar!</p>
            </div>
        `;
        return;
    }
    
    subjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.style.setProperty('--card-color', subject.color);
        
        const gradeClass = getGradeClass(subject.grade);
        
        subjectCard.innerHTML = `
            <h3>${subject.name}</h3>
            <div class="subject-info">
                <span class="subject-level level-${subject.level}">${subject.level.charAt(0).toUpperCase() + subject.level.slice(1)}</span>
                <span class="subject-grade ${gradeClass}">${subject.grade}</span>
            </div>
            <div class="subject-files">
                <i class="fas fa-paperclip"></i>
                ${subject.files.length} archivo${subject.files.length !== 1 ? 's' : ''}
            </div>
        `;
        
        subjectCard.addEventListener('click', function() {
            showSubjectDetails(subject.id);
        });
        
        subjectsGrid.appendChild(subjectCard);
    });
}

function getGradeClass(grade) {
    if (grade === 'Sin calificar') return '';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 9) return 'grade-excellent';
    if (numericGrade >= 7) return 'grade-good';
    return 'grade-poor';
}

function showSubjectDetails(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    selectedSubjectId = subjectId;
    
    // Actualizar modal de detalles
    document.getElementById('detailSubjectName').textContent = subject.name;
    document.getElementById('detailSubjectLevel').textContent = subject.level.charAt(0).toUpperCase() + subject.level.slice(1);
    document.getElementById('detailSubjectLevel').className = `level-${subject.level}`;
    document.getElementById('detailSubjectGrade').textContent = subject.grade;
    document.getElementById('detailSubjectGrade').className = getGradeClass(subject.grade);
    
    // Renderizar archivos
    renderFiles(subject.files);
    
    // Mostrar modal
    subjectDetailModal.classList.add('active');
}

function renderFiles(files) {
    fileList.innerHTML = '';
    
    if (files.length === 0) {
        fileList.innerHTML = `
            <div style="text-align: center; color: #666; padding: 1rem;">
                <i class="fas fa-file" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <p>No hay archivos subidos</p>
            </div>
        `;
        return;
    }
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        fileItem.innerHTML = `
            <span class="file-name">${file.name}</span>
            <div class="file-actions">
                <button class="file-action download-file" data-index="${index}">
                    <i class="fas fa-download"></i>
                </button>
                <button class="file-action delete-file" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        fileList.appendChild(fileItem);
    });
    
    // Añadir event listeners para los botones de archivo
    document.querySelectorAll('.download-file').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            downloadFile(index);
        });
    });
    
    document.querySelectorAll('.delete-file').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteFile(index);
        });
    });
}

function handleFileUpload(files) {
    if (!selectedSubjectId) return;
    
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return;
    
    Array.from(files).forEach(file => {
        // Simular subida de archivo (en un caso real, aquí se subiría a un servidor)
        const fileData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            // En una aplicación real, aquí guardaríamos el archivo real
            // Por ahora solo guardamos información del archivo
            data: URL.createObjectURL(file) // Esto es solo para simulación
        };
        
        subject.files.push(fileData);
    });
    
    saveData();
    renderFiles(subject.files);
    renderSubjects(); // Actualizar contador de archivos en la tarjeta
    
    alert(`${files.length} archivo${files.length !== 1 ? 's' : ''} subido${files.length !== 1 ? 's' : ''} correctamente.`);
}

function downloadFile(fileIndex) {
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject || !subject.files[fileIndex]) return;
    
    const file = subject.files[fileIndex];
    
    // En una aplicación real, aquí descargaríamos el archivo real
    // Por ahora simulamos la descarga
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
    
    alert(`Descargando: ${file.name}`);
}

function deleteFile(fileIndex) {
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject || !subject.files[fileIndex]) return;
    
    const fileName = subject.files[fileIndex].name;
    
    if (confirm(`¿Estás seguro de que quieres eliminar el archivo "${fileName}"?`)) {
        subject.files.splice(fileIndex, 1);
        saveData();
        renderFiles(subject.files);
        renderSubjects(); // Actualizar contador de archivos en la tarjeta
    }
}

function deleteSubject(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar la asignatura "${subject.name}"?`)) {
        subjects = subjects.filter(s => s.id !== subjectId);
        saveData();
        renderSubjects();
        subjectDetailModal.classList.remove('active');
        selectedSubjectId = null;
    }
}

// Gestión del calendario
function renderCalendar() {
    // Actualizar el título del mes
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Limpiar calendario
    calendar.innerHTML = '';
    
    // Añadir encabezados de días
    const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // Obtener primer día del mes y número de días
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Añadir días vacíos al principio si es necesario
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
    
    // Añadir días del mes
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Comprobar si es hoy
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Añadir número del día
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-header';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Añadir eventos para este día
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === dateStr);
        
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `calendar-event ${event.priority}`;
            eventElement.textContent = event.title;
            eventElement.title = `${event.title}\n${event.description || 'Sin descripción'}`;
            eventElement.addEventListener('click', function(e) {
                e.stopPropagation();
                showEventDetails(event);
            });
            dayElement.appendChild(eventElement);
        });
        
        // Permitir añadir eventos al hacer clic en el día
        dayElement.addEventListener('click', function() {
            document.getElementById('eventDate').value = dateStr;
            eventModal.classList.add('active');
            updateEventSubjectSelect();
        });
        
        calendar.appendChild(dayElement);
    }
    
    // Añadir días vacíos al final si es necesario
    const totalCells = startingDay + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 semanas * 7 días
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
}

function updateEventSubjectSelect() {
    eventSubjectSelect.innerHTML = '<option value="">Ninguna</option>';
    
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = subject.name;
        eventSubjectSelect.appendChild(option);
    });
}

function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;
    const subjectId = document.getElementById('eventSubject').value;
    const priority = document.getElementById('eventPriority').value;
    
    // Validar campos
    if (!title || !date) {
        alert('Por favor, completa al menos el título y la fecha del evento.');
        return;
    }
    
    // Validar fecha (no puede ser en el pasado)
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
        if (!confirm('Estás añadiendo un evento en una fecha pasada. ¿Estás seguro?')) {
            return;
        }
    }
    
    const event = {
        id: Date.now().toString(),
        title,
        date,
        description,
        subjectId,
        priority
    };
    
    events.push(event);
    saveData();
    renderCalendar();
    eventModal.classList.remove('active');
    eventForm.reset();
    
    alert('Evento añadido correctamente.');
}

function showEventDetails(event) {
    const subject = event.subjectId ? subjects.find(s => s.id === event.subjectId) : null;
    const subjectName = subject ? subject.name : 'No asignada';
    
    const eventDetails = `
        Título: ${event.title}
        Fecha: ${formatDate(event.date)}
        Descripción: ${event.description || 'Sin descripción'}
        Asignatura: ${subjectName}
        Prioridad: ${event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
    `;
    
    alert(eventDetails);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Persistencia de datos
function saveData() {
    const data = {
        universityName: universityName,
        subjects: subjects,
        events: events
    };
    
    localStorage.setItem('studyPulseData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('studyPulseData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        universityName = data.universityName || '';
        subjects = data.subjects || [];
        events = data.events || [];
        
        if (universityName) {
            universityInput.value = universityName;
        }
    }
}

// Funciones de utilidad para exportar/importar datos
function exportData() {
    const data = {
        universityName: universityName,
        subjects: subjects,
        events: events,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `studypulse_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('¿Estás seguro de que quieres importar estos datos? Se sobrescribirán los datos actuales.')) {
                universityName = data.universityName || '';
                subjects = data.subjects || [];
                events = data.events || [];
                
                saveData();
                updateUniversityDisplay();
                renderSubjects();
                renderCalendar();
                updateEventSubjectSelect();
                
                alert('Datos importados correctamente.');
            }
        } catch (error) {
            alert('Error al importar datos: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// Añadir funciones de exportación/importación al objeto global para acceso desde la consola
window.studyPulse = {
    exportData,
    importData,
    getData: () => ({ universityName, subjects, events })
};
// Añadir al final del archivo script.js, antes de window.studyPulse

// Funciones para editar y eliminar eventos
function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Llenar el formulario con los datos del evento
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventSubject').value = event.subjectId || '';
    document.getElementById('eventPriority').value = event.priority;
    
    // Cambiar el comportamiento del formulario para editar
    eventForm.onsubmit = function(e) {
        e.preventDefault();
        updateEvent(eventId);
    };
    
    // Cambiar el texto del botón
    const submitBtn = eventForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Actualizar Evento';
    
    // Mostrar botón de eliminar
    if (!document.getElementById('deleteEventBtn')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.id = 'deleteEventBtn';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Eliminar Evento';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.onclick = function() {
            deleteEvent(eventId);
        };
        eventForm.appendChild(deleteBtn);
    }
    
    eventModal.classList.add('active');
}

function updateEvent(eventId) {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;
    
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;
    const subjectId = document.getElementById('eventSubject').value;
    const priority = document.getElementById('eventPriority').value;
    
    // Validar campos
    if (!title || !date) {
        alert('Por favor, completa al menos el título y la fecha del evento.');
        return;
    }
    
    events[eventIndex] = {
        ...events[eventIndex],
        title,
        date,
        description,
        subjectId,
        priority
    };
    
    saveData();
    renderCalendar();
    eventModal.classList.remove('active');
    resetEventForm();
    
    alert('Evento actualizado correctamente.');
}

function deleteEvent(eventId) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        events = events.filter(e => e.id !== eventId);
        saveData();
        renderCalendar();
        eventModal.classList.remove('active');
        resetEventForm();
    }
}

function resetEventForm() {
    eventForm.reset();
    eventForm.onsubmit = function(e) {
        e.preventDefault();
        addEvent();
    };
    
    const submitBtn = eventForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Guardar Evento';
    
    const deleteBtn = document.getElementById('deleteEventBtn');
    if (deleteBtn) {
        deleteBtn.remove();
    }
}

// Modificar la función showEventDetails para incluir opciones de edición
function showEventDetails(event) {
    const subject = event.subjectId ? subjects.find(s => s.id === event.subjectId) : null;
    const subjectName = subject ? subject.name : 'No asignada';
    
    const eventDetails = `
        Título: ${event.title}
        Fecha: ${formatDate(event.date)}
        Descripción: ${event.description || 'Sin descripción'}
        Asignatura: ${subjectName}
        Prioridad: ${event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
    `;
    
    if (confirm(`${eventDetails}\n\n¿Quieres editar este evento?`)) {
        editEvent(event.id);
    }
}

// Añadir al objeto global para acceso desde la consola
window.studyPulse = {
    exportData,
    importData,
    getData: () => ({ universityName, subjects, events }),
    editEvent,
    deleteEvent
};
