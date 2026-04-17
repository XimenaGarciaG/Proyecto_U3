async function loadPerfilModule(page = 0) {
    const contentArea = document.getElementById('contentArea');
    updateBreadcrumbs(['Configuración', 'Perfiles']);
    try {
        const data = await request(`/perfil?page=${page}&size=5`);
        const canAdd = hasPermission('Perfil', 'bitAgregar');
        const canEdit = hasPermission('Perfil', 'bitEditar');
        const canDelete = hasPermission('Perfil', 'bitEliminar');

        contentArea.innerHTML = `
            <h1>Gestión de Perfiles</h1>
            <div class="action-bar">
                ${canAdd ? '<button class="btn" onclick="openPerfilModal()">+ Agregar Perfil</button>' : ''}
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Perfil</th>
                        <th>Tipo</th>
                        <th style="text-align: right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.content.map(p => `
                        <tr>
                            <td>#${p.id}</td>
                            <td style="font-weight: 600">${p.strNombrePerfil}</td>
                            <td><span class="status-pill ${p.bitAdministrador ? 'active' : ''}">${p.bitAdministrador ? 'Administrador' : 'Estándar'}</span></td>
                            <td class="actions-cell">
                                ${canEdit ? `<button class="btn btn-secondary" onclick="openPerfilModal(${p.id})">Editar</button>` : ''}
                                ${canDelete ? `<button class="btn btn-danger" onclick="deletePerfil(${p.id})">Eliminar</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        contentArea.appendChild(createPaginator(data, loadPerfilModule));
    } catch (err) {
        contentArea.innerHTML = `<div class="login-card" style="max-width: 100%; border-color: #ffcdd2"><p style="color: #c62828">Error: ${err.message}</p></div>`;
    }
}

async function openPerfilModal(id = null) {
    let perfil = { strNombrePerfil: '', bitAdministrador: false };
    if (id) {
        perfil = await request(`/perfil/${id}`);
    }

    const formHtml = `
        <div class="form-group">
            <label>Nombre del Perfil</label>
            <input type="text" name="strNombrePerfil" value="${perfil.strNombrePerfil}" required>
        </div>
        <div class="form-group">
            <label>Tipo de Perfil</label>
            <select name="bitAdministrador">
                <option value="true" ${perfil.bitAdministrador ? 'selected' : ''}>Administrador</option>
                <option value="false" ${!perfil.bitAdministrador ? 'selected' : ''}>Estándar</option>
            </select>
        </div>
    `;

    showModal(id ? 'Editar Perfil' : 'Agregar Perfil', formHtml, async (formData) => {
        const modalForm = document.getElementById('modalForm');

        // --- Validaciones Perfil ---
        const isValid = validateForm(modalForm, [
            { name: 'strNombrePerfil', label: 'Nombre del Perfil', rules: ['required', 'minlength:3', 'maxlength:50'] }
        ]);
        if (!isValid) return;
        // --- Fin validaciones ---

        const data = Object.fromEntries(formData.entries());
        data.bitAdministrador = formData.get('bitAdministrador') === 'true';
        
        try {
            await request(`/perfil${id ? '/' + id : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(data)
            });
            closeModal();
            loadPerfilModule();
        } catch (err) {
            alert(err.message);
        }
    });
}

async function deletePerfil(id) {
    if (confirm('¿Está seguro de eliminar este perfil?')) {
        try {
            await request(`/perfil/${id}`, { method: 'DELETE' });
            loadPerfilModule();
        } catch (err) {
            alert(err.message);
        }
    }
}

// Expositing to global window for onclick handlers
window.loadPerfilModule = loadPerfilModule;
window.openPerfilModal = openPerfilModal;
window.deletePerfil = deletePerfil;
window.closeModal = closeModal;
