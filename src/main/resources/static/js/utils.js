const API_URL = '/api';
const IMGBB_API_KEY = '2287c899c31a05580bcc63797272e536';

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

async function request(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers
    };

    const response = await fetch(API_URL + url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }

    if (response.status === 403) {
        const error = await response.text();
        throw new Error(error || 'No tiene permiso para esta acción');
    }

    if (!response.ok) {
        let errorMsg = 'Error en la petición';
        try {
            const error = await response.json();
            errorMsg = error.message || errorMsg;
        } catch (e) {
            // No JSON body in error
        }
        throw new Error(errorMsg);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

function updateBreadcrumbs(path) {
    const breadcrumbs = document.getElementById('breadcrumbs');
    // Clear and set root
    breadcrumbs.innerHTML = '<span>Inicio</span>';
    path.forEach(item => {
        const span = document.createElement('span');
        span.textContent = item;
        breadcrumbs.appendChild(span);
    });
}

function showModal(title, formHtml, onSave) {
    const modal = document.getElementById('modalContainer');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2>${title}</h2>
        <form id="modalForm" style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${formHtml}
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn">Guardar</button>
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        onSave(new FormData(e.target));
    };
}

function closeModal() {
    document.getElementById('modalContainer').style.display = 'none';
}

async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Error al subir imagen a ImgBB');
    
    const result = await response.json();
    return result.data.url;
}

function createPaginator(data, onPageChange) {
    const container = document.createElement('div');
    container.className = 'pagination';
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Anterior';
    prevBtn.disabled = data.first;
    prevBtn.onclick = () => onPageChange(data.number - 1);
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Siguiente';
    nextBtn.disabled = data.last;
    nextBtn.onclick = () => onPageChange(data.number + 1);
    
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    
    return container;
}

// ================================================================
//  FORM VALIDATION UTILITIES
// ================================================================

/**
 * Muestra un mensaje de error debajo de un campo.
 * @param {HTMLElement} field - El input/select a marcar.
 * @param {string} message  - Texto del error.
 */
function showFieldError(field, message) {
    field.classList.add('field-error');
    let errorEl = field.parentElement.querySelector('.field-error-msg');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error-msg';
        field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

/**
 * Limpia todos los errores de validación en un formulario.
 * @param {HTMLElement} form
 */
function clearValidation(form) {
    form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    form.querySelectorAll('.field-error-msg').forEach(el => el.remove());
}

/**
 * Valida un formulario dado un array de reglas.
 * Cada regla: { name, label, rules: ['required','minlength:N','maxlength:N','email','phone'] }
 * Retorna true si todo es válido, false en caso contrario.
 * @param {HTMLElement} form
 * @param {Array} rules
 * @returns {boolean}
 */
function validateForm(form, rules) {
    clearValidation(form);
    let valid = true;

    rules.forEach(({ name, label, rules: fieldRules }) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        const value = field.value.trim();

        for (const rule of fieldRules) {
            if (rule === 'required') {
                if (!value) {
                    showFieldError(field, `${label} es obligatorio.`);
                    valid = false;
                    break;
                }
            } else if (rule.startsWith('minlength:')) {
                const min = parseInt(rule.split(':')[1]);
                if (value.length < min) {
                    showFieldError(field, `${label} debe tener al menos ${min} caracteres.`);
                    valid = false;
                    break;
                }
            } else if (rule.startsWith('maxlength:')) {
                const max = parseInt(rule.split(':')[1]);
                if (value.length > max) {
                    showFieldError(field, `${label} no puede superar ${max} caracteres.`);
                    valid = false;
                    break;
                }
            } else if (rule === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    showFieldError(field, `${label} no es un correo electrónico válido.`);
                    valid = false;
                    break;
                }
            } else if (rule === 'phone') {
                // Exactamente 10 dígitos numéricos, sin letras ni símbolos
                const phoneRegex = /^\d{10}$/;
                if (value && !phoneRegex.test(value)) {
                    showFieldError(field, `${label} debe tener exactamente 10 dígitos numéricos.`);
                    valid = false;
                    break;
                }
            } else if (rule === 'password') {
                // Mín 8 chars, al menos 1 mayúscula, 1 minúscula, 1 número
                if (value.length < 8) {
                    showFieldError(field, `${label} debe tener al menos 8 caracteres.`);
                    valid = false;
                    break;
                }
                if (!/[A-Z]/.test(value)) {
                    showFieldError(field, `${label} debe contener al menos una letra mayúscula.`);
                    valid = false;
                    break;
                }
                if (!/[a-z]/.test(value)) {
                    showFieldError(field, `${label} debe contener al menos una letra minúscula.`);
                    valid = false;
                    break;
                }
                if (!/[0-9]/.test(value)) {
                    showFieldError(field, `${label} debe contener al menos un número.`);
                    valid = false;
                    break;
                }
            } else if (rule === 'no-spaces') {
                if (/\s/.test(field.value)) {
                    showFieldError(field, `${label} no debe contener espacios.`);
                    valid = false;
                    break;
                }
            }
        }
    });

    return valid;
}
