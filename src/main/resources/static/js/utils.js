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
