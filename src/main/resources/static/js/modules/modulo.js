async function loadModuloModule(page = 0) {
    const contentArea = document.getElementById('contentArea');
    updateBreadcrumbs(['Configuración', 'Módulos']);
    try {
        const data = await request(`/modulo?page=${page}&size=5`);
        contentArea.innerHTML = `
            <h1>Gestión de Módulos</h1>
            <div class="action-bar">
                <button class="btn" onclick="openModuloModal()">+ Nuevo Módulo</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Módulo</th>
                        <th style="text-align: right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.content.map(m => `
                        <tr>
                            <td>#${m.id}</td>
                            <td style="font-weight: 600">${m.strNombreModulo}</td>
                            <td class="actions-cell">
                                <button class="btn btn-secondary" onclick="openModuloModal(${m.id})">Editar</button>
                                <button class="btn btn-danger" onclick="deleteModulo(${m.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        contentArea.appendChild(createPaginator(data, loadModuloModule));
    } catch (err) {
        contentArea.innerHTML = `<div class="login-card" style="max-width: 100%; border-color: #ffcdd2"><p style="color: #c62828">Error: ${err.message}</p></div>`;
    }
}

async function openModuloModal(id = null) {
    let modulo = { strNombreModulo: '' };
    if (id) {
        modulo = await request(`/modulo/${id}`);
    }

    const formHtml = `
        <div class="form-group">
            <label>Nombre del Módulo</label>
            <input type="text" name="strNombreModulo" value="${modulo.strNombreModulo}" required>
        </div>
    `;

    showModal(id ? 'Editar Módulo' : 'Nuevo Módulo', formHtml, async (formData) => {
        const data = Object.fromEntries(formData.entries());
        try {
            await request(`/modulo${id ? '/' + id : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(data)
            });
            closeModal();
            loadModuloModule();
        } catch (err) {
            alert(err.message);
        }
    });
}

window.loadModuloModule = loadModuloModule;
window.openModuloModal = openModuloModal;
window.deleteModulo = async (id) => {
    if (confirm('¿Eliminar módulo?')) {
        await request(`/modulo/${id}`, { method: 'DELETE' });
        loadModuloModule();
    }
};
