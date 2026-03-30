async function loadPermisoPerfilModule(page = 0) {
    const contentArea = document.getElementById('contentArea');
    updateBreadcrumbs(['Configuración', 'Permisos por Perfil']);
    try {
        const data = await request(`/permisos_perfil?page=${page}&size=5`);

        contentArea.innerHTML = `
            <h1>Gestión de Permisos</h1>
            <div class="action-bar">
                <button class="btn" onclick="openPermisoModal()">+ Asignar Permisos</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Perfil</th>
                        <th>Módulo</th>
                        <th>Permisos (A|E|C|X|D)</th>
                        <th style="text-align: right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.content.map(p => `
                        <tr>
                            <td style="font-weight: 600">${p.perfil.strNombrePerfil}</td>
                            <td><span class="status-pill active">${p.modulo.strNombreModulo}</span></td>
                            <td>
                                <div style="display: flex; gap: 0.3rem">
                                    <span title="Agregar" style="opacity: ${p.bitAgregar ? '1' : '0.2'}">➕</span>
                                    <span title="Editar" style="opacity: ${p.bitEditar ? '1' : '0.2'}">📝</span>
                                    <span title="Consultar" style="opacity: ${p.bitConsulta ? '1' : '0.2'}">🔍</span>
                                    <span title="Eliminar" style="opacity: ${p.bitEliminar ? '1' : '0.2'}">❌</span>
                                    <span title="Detalle" style="opacity: ${p.bitDetalle ? '1' : '0.2'}">📄</span>
                                </div>
                            </td>
                            <td class="actions-cell">
                                <button class="btn btn-secondary" onclick="openPermisoModal(${p.id})">Editar</button>
                                <button class="btn btn-danger" onclick="deletePermiso(${p.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        contentArea.appendChild(createPaginator(data, loadPermisoPerfilModule));
    } catch (err) {
        contentArea.innerHTML = `<div class="login-card" style="max-width: 100%; border-color: #ffcdd2"><p style="color: #c62828">Error: ${err.message}</p></div>`;
    }
}

async function openPermisoModal(id = null) {
    let permiso = { idPerfil: '', idModulo: '', bitAgregar: false, bitEditar: false, bitConsulta: false, bitEliminar: false, bitDetalle: false };
    if (id) {
        permiso = await request(`/permisos_perfil/${id}`);
        permiso.idPerfil = permiso.perfil.id;
        permiso.idModulo = permiso.modulo.id;
    }

    const perfiles = (await request('/perfil')).content;
    const modulos = (await request('/modulo')).content;

    const formHtml = `
        <div class="form-group">
            <label>Perfil</label>
            <select name="idPerfil" required>
                <option value="">Seleccione Perfil...</option>
                ${perfiles.map(p => `<option value="${p.id}" ${p.id === permiso.idPerfil ? 'selected' : ''}>${p.strNombrePerfil}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Módulo</label>
            <select name="idModulo" required>
                <option value="">Seleccione Módulo...</option>
                ${modulos.map(m => `<option value="${m.id}" ${m.id === permiso.idModulo ? 'selected' : ''}>${m.strNombreModulo}</option>`).join('')}
            </select>
        </div>
        <div class="checkbox-grid">
            <label class="checkbox-item"><input type="checkbox" name="bitAgregar" ${permiso.bitAgregar ? 'checked' : ''}> Agregar</label>
            <label class="checkbox-item"><input type="checkbox" name="bitEditar" ${permiso.bitEditar ? 'checked' : ''}> Editar</label>
            <label class="checkbox-item"><input type="checkbox" name="bitConsulta" ${permiso.bitConsulta ? 'checked' : ''}> Consultar</label>
            <label class="checkbox-item"><input type="checkbox" name="bitEliminar" ${permiso.bitEliminar ? 'checked' : ''}> Eliminar</label>
            <label class="checkbox-item"><input type="checkbox" name="bitDetalle" ${permiso.bitDetalle ? 'checked' : ''}> Detalle</label>
        </div>
    `;

    showModal(id ? 'Editar Permisos' : 'Asignar Permisos', formHtml, async (formData) => {
        const data = {
            idPerfil: parseInt(formData.get('idPerfil')),
            idModulo: parseInt(formData.get('idModulo')),
            bitAgregar: formData.get('bitAgregar') === 'on',
            bitEditar: formData.get('bitEditar') === 'on',
            bitConsulta: formData.get('bitConsulta') === 'on',
            bitEliminar: formData.get('bitEliminar') === 'on',
            bitDetalle: formData.get('bitDetalle') === 'on'
        };
        
        try {
            await request(`/permisos_perfil${id ? '/' + id : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(data)
            });
            closeModal();
            loadPermisoPerfilModule();
        } catch (err) {
            alert(err.message);
        }
    });
}

window.loadPermisoPerfilModule = loadPermisoPerfilModule;
window.openPermisoModal = openPermisoModal;
window.deletePermiso = async (id) => {
    if (confirm('¿Seguro?')) {
        await request(`/permisos_perfil/${id}`, { method: 'DELETE' });
        loadPermisoPerfilModule();
    }
};
