async function loadUsuarioModule(page = 0) {
    const contentArea = document.getElementById('contentArea');
    updateBreadcrumbs(['Administración', 'Usuarios']);
    try {
        const data = await request(`/usuario?page=${page}&size=5`);
        contentArea.innerHTML = `
            <h1>Gestión de Usuarios</h1>
            <div class="action-bar">
                <button class="btn" onclick="openUsuarioModal()">+ Nuevo Usuario</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Perfil</th>
                        <th>Nombre Usuario</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th style="text-align: right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.content.map(u => `
                        <tr>
                            <td style="display: flex; align-items: center; gap: 1rem">
                                <img src="${u.imagen || 'https://ui-avatars.com/api/?name='+u.strNombreUsuario+'&background=ffdbe9&color=f06292'}" class="img-circle">
                                <div>
                                    <div style="font-weight: 600">${u.strNombreUsuario}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted)">${u.perfil.strNombrePerfil}</div>
                                </div>
                            </td>
                            <td>${u.strNombreUsuario}</td>
                            <td>${u.strCorreo || 'N/A'}</td>
                            <td><span class="status-pill ${u.idEstadoUsuario === 1 ? 'active' : 'inactive'}">${u.idEstadoUsuario === 1 ? 'Activo' : 'Inactivo'}</span></td>
                            <td class="actions-cell">
                                <button class="btn btn-secondary" onclick="openUsuarioModal(${u.id})">Editar</button>
                                <button class="btn btn-danger" onclick="deleteUsuario(${u.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        contentArea.appendChild(createPaginator(data, loadUsuarioModule));
    } catch (err) {
        contentArea.innerHTML = `<div class="login-card" style="max-width: 100%; border-color: #ffcdd2"><p style="color: #c62828">Error: ${err.message}</p></div>`;
    }
}

async function openUsuarioModal(id = null) {
    let usuario = { strNombreUsuario: '', idPerfil: '', strCorreo: '', strNumeroCelular: '', idEstadoUsuario: 1, imagen: '' };
    if (id) {
        usuario = await request(`/usuario/${id}`);
        usuario.idPerfil = usuario.perfil.id;
    }

    const perfiles = await request('/perfil');

    const formHtml = `
        <div class="form-group">
            <label>Nombre de Usuario</label>
            <input type="text" name="strNombreUsuario" value="${usuario.strNombreUsuario}" required>
        </div>
        <div class="form-group">
            <label>Contraseña ${id ? '(dejar vacío para no cambiar)' : ''}</label>
            <input type="password" name="password" ${id ? '' : 'required'}>
        </div>
        <div class="form-group">
            <label>Perfil</label>
            <select name="idPerfil">
                ${perfiles.content.map(p => `
                    <option value="${p.id}" ${p.id === usuario.idPerfil ? 'selected' : ''}>${p.strNombrePerfil}</option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Estado</label>
            <select name="idEstadoUsuario">
                <option value="1" ${usuario.idEstadoUsuario === 1 ? 'selected' : ''}>Activo</option>
                <option value="0" ${usuario.idEstadoUsuario === 0 ? 'selected' : ''}>Inactivo</option>
            </select>
        </div>
        <div class="form-group">
            <label>Imagen (URL Base64)</label>
            <input type="text" name="imagen" value="${usuario.imagen || ''}" placeholder="data:image/...">
        </div>
    `;

    showModal(id ? 'Editar Usuario' : 'Agregar Usuario', formHtml, async (formData) => {
        const data = Object.fromEntries(formData.entries());
        data.idPerfil = parseInt(data.idPerfil);
        data.idEstadoUsuario = parseInt(data.idEstadoUsuario);
        
        try {
            await request(`/usuario${id ? '/' + id : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(data)
            });
            closeModal();
            loadUsuarioModule();
        } catch (err) {
            alert(err.message);
        }
    });
}

window.loadUsuarioModule = loadUsuarioModule;
window.openUsuarioModal = openUsuarioModal;
window.deleteUsuario = async (id) => {
    if (confirm('¿Seguro?')) {
        await request(`/usuario/${id}`, { method: 'DELETE' });
        loadUsuarioModule();
    }
};
