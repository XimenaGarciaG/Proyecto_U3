// ================================================================
//  PERMISOS-PERFIL MODULE
//  Shows a profile selector + full module-permission matrix table
//  Matching the credential-card-style design from the reference image
// ================================================================

async function loadPermisoPerfilModule() {
    const contentArea = document.getElementById('contentArea');
    updateBreadcrumbs(['Configuración', 'Permisos por Perfil']);

    let perfiles = [];
    try {
        const res = await request('/perfil');
        perfiles = res.content || [];
    } catch (err) {
        contentArea.innerHTML = `<p style="color:#c62828">Error al cargar perfiles: ${err.message}</p>`;
        return;
    }

    contentArea.innerHTML = `
        <h1>Permisos por Perfil</h1>

        <div class="permiso-card">
            <div class="permiso-section-label">[Datos Perfil]</div>

            <div class="permiso-profile-row">
                <label class="permiso-profile-label">Perfil:</label>
                <select id="permisoPerfilSelect" class="permiso-profile-select">
                    <option value="">-- Seleccione un perfil --</option>
                    ${perfiles.map(p => `<option value="${p.id}">${p.strNombrePerfil.toUpperCase()}</option>`).join('')}
                </select>
                <button class="btn permiso-buscar-btn" onclick="buscarPermisos()">Buscar</button>
            </div>

            <div id="permisoMatrizContainer"></div>
        </div>
    `;
}

async function buscarPermisos() {
    const perfilSelect = document.getElementById('permisoPerfilSelect');
    const perfilId = parseInt(perfilSelect.value);
    const container = document.getElementById('permisoMatrizContainer');

    // Limpiar error previo del select
    perfilSelect.classList.remove('field-error');
    const prevErr = perfilSelect.parentElement.querySelector('.field-error-msg');
    if (prevErr) prevErr.remove();

    if (!perfilId) {
        perfilSelect.classList.add('field-error');
        const errMsg = document.createElement('span');
        errMsg.className = 'field-error-msg';
        errMsg.textContent = 'Debe seleccionar un perfil antes de buscar.';
        perfilSelect.parentElement.appendChild(errMsg);
        // Limpiar error al cambiar la selección
        perfilSelect.addEventListener('change', () => {
            perfilSelect.classList.remove('field-error');
            const e = perfilSelect.parentElement.querySelector('.field-error-msg');
            if (e) e.remove();
        }, { once: true });
        return;
    }

    container.innerHTML = `<p style="margin-top:1rem; color:var(--text-muted)">Cargando módulos...</p>`;

    try {
        const [modulosRes, permisosRes] = await Promise.all([
            request('/modulo?size=1000'),
            request('/permisos_perfil?page=0&size=1000')
        ]);

        const modulos = modulosRes.content || [];
        const todosPermisos = permisosRes.content || [];

        const permisoMap = {};
        todosPermisos
            .filter(p => p && p.perfil && p.perfil.id === perfilId)
            .forEach(p => { 
                if (p.modulo && p.modulo.id) {
                    permisoMap[p.modulo.id] = p; 
                }
            });

        const canEdit = hasPermission('Permisos-Perfil', 'bitEditar');

        container.innerHTML = `
            <div class="permiso-section-label" style="margin-top:1.5rem">[Módulos web]</div>

            <div class="permiso-table-wrapper">
                <table class="permiso-matrix-table">
                    <thead>
                        <tr>
                            <th>Módulo</th>
                            <th>Agregar</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                            <th>Consultar</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${modulos.map(m => {
                            const p = permisoMap[m.id] || {};
                            return `
                            <tr data-modulo-id="${m.id}" data-permiso-id="${p.id || ''}">
                                <td class="permiso-modulo-name">${m.strNombreModulo.toUpperCase()}</td>
                                <td class="permiso-check-cell"><input type="checkbox" class="permiso-checkbox" data-field="agregar" ${p.bitAgregar ? 'checked' : ''} ${!canEdit ? 'disabled' : ''}></td>
                                <td class="permiso-check-cell"><input type="checkbox" class="permiso-checkbox" data-field="editar"   ${p.bitEditar ? 'checked' : ''} ${!canEdit ? 'disabled' : ''}></td>
                                <td class="permiso-check-cell"><input type="checkbox" class="permiso-checkbox" data-field="eliminar" ${p.bitEliminar ? 'checked' : ''} ${!canEdit ? 'disabled' : ''}></td>
                                <td class="permiso-check-cell"><input type="checkbox" class="permiso-checkbox" data-field="consulta" ${p.bitConsulta ? 'checked' : ''} ${!canEdit ? 'disabled' : ''}></td>
                                <td class="permiso-check-cell"><input type="checkbox" class="permiso-checkbox" data-field="detalle"  ${p.bitDetalle ? 'checked' : ''} ${!canEdit ? 'disabled' : ''}></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="permiso-actions">
                ${canEdit ? `<button class="btn permiso-guardar-btn" onclick="guardarPermisos(${perfilId})">Guardar</button>` : ''}
                <button class="btn btn-secondary permiso-cancelar-btn" onclick="loadPermisoPerfilModule()">Cancelar</button>
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<p style="color:#c62828; margin-top:1rem;">Error: ${err.message}</p>`;
    }
}

async function guardarPermisos(perfilId) {
    const btn = document.querySelector('.permiso-guardar-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Guardando...';
    }

    const rows = document.querySelectorAll('#permisoMatrizContainer tbody tr');
    const saves = [];

    rows.forEach(row => {
        const moduloId   = parseInt(row.dataset.moduloId);
        const permisoId  = row.dataset.permisoId ? parseInt(row.dataset.permisoId) : null;
        const checkboxes = row.querySelectorAll('.permiso-checkbox');

        const data = {
            idPerfil:    perfilId,
            idModulo:    moduloId,
            bitAgregar:  checkboxes[0].checked,
            bitEditar:   checkboxes[1].checked,
            bitEliminar: checkboxes[2].checked,
            bitConsulta: checkboxes[3].checked,
            bitDetalle:  checkboxes[4].checked
        };

        if (permisoId) {
            saves.push(request(`/permisos_perfil/${permisoId}`, { method: 'PUT',  body: JSON.stringify(data) }));
        } else {
            saves.push(request(`/permisos_perfil`,                { method: 'POST', body: JSON.stringify(data) }));
        }
    });

    try {
        await Promise.all(saves);
        
        // Determinar si los cambios afectar al usuario actual
        const user = JSON.parse(localStorage.getItem('user'));
        const isOwnProfile = user && user.perfilId === perfilId;

        const btn = document.querySelector('.permiso-guardar-btn');
        btn.textContent = '✓ Guardado';
        btn.style.background = '#43a047';
        
        if (isOwnProfile) {
            alert('Tus permisos han sido actualizados. La página se recargará para aplicar los cambios.');
            window.location.reload();
        } else {
            setTimeout(() => buscarPermisos(), 1200);
        }
    } catch (err) {
        alert('Error al guardar: ' + err.message);
        const btn = document.querySelector('.permiso-guardar-btn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Guardar';
        }
    }
}

window.loadPermisoPerfilModule = loadPermisoPerfilModule;
window.buscarPermisos = buscarPermisos;
window.guardarPermisos = guardarPermisos;
