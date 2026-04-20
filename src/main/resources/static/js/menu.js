// =========================================================
// MOCK DATABASE for Static Modules (Principal 1, 2, etc.)
// =========================================================
const mockDB = {
    'Principal 1.1': [
        { id: 1, desc: 'Venta Mensual de Repuestos', status: 'Activo' },
        { id: 2, desc: 'Inventario de Bodega Central', status: 'Inactivo' }
    ],
    'Principal 1.2': [
        { id: 3, desc: 'Reporte de Compras Q1', status: 'Activo' }
    ],
    'Principal 2.1': [
        { id: 4, desc: 'Planilla de Empleados', status: 'Activo' }
    ],
    'Principal 2.2': [
        { id: 5, desc: 'Auditoría Externa 2026', status: 'Pendiente' }
    ]
};

// =========================================================
// MENU: Load from API and render sidebar
// =========================================================
async function loadMenu() {
    const menuEl = document.getElementById('dynamicMenu');
    try {
        // BUG FIX #1: request() already prepends '/api', so we only pass '/menu'
        const rootMenus = await request('/menu');
        menuEl.innerHTML = rootMenus.map(renderMenuItem).join('');
    } catch (err) {
        console.error('Menu load error:', err);
        menuEl.innerHTML = '<p style="color: #c62828; font-size: 0.8rem; padding: 1rem;">Error al cargar el menú</p>';
    }
}

function renderMenuItem(menu) {
    const parentName = menu.parentName || null;
    if (menu.subMenus && menu.subMenus.length > 0) {
        return `
            <li class="menu-item-parent">
                <div class="menu-group-label" onclick="toggleSubmenu(this)">
                    ${menu.nombreMenu || 'Sección'} <span>▼</span>
                </div>
                <ul class="submenu">
                    ${menu.subMenus.map(m => renderMenuItem({ ...m, parentName: menu.nombreMenu })).join('')}
                </ul>
            </li>
        `;
    } else if (menu.idModulo || menu.nombreModulo) {
        return `
            <li><a href="#" onclick='loadModule(${JSON.stringify(menu)}, "${parentName}")'>${menu.nombreMenu || menu.nombreModulo}</a></li>
        `;
    }
    return '';
}

function toggleSubmenu(el) {
    const submenu = el.nextElementSibling;
    const arrow = el.querySelector('span');
    if (submenu.style.display === 'none' || !submenu.style.display) {
        submenu.style.display = 'block';
        arrow.textContent = '▼';
    } else {
        submenu.style.display = 'none';
        arrow.textContent = '▶';
    }
}

// =========================================================
// MODULE: Load content area based on selected menu item
// =========================================================
async function loadModule(menu, parentName = null) {
    // SINCRO: Antes de cargar cualquier módulo, refrescamos la info del usuario
    // Esto asegura que tengamos los permisos más recientes del servidor.
    await loadUserInfo();

    const name = menu.nombreModulo || menu.nombreMenu;
    
    // GUARD: Verificar si el usuario aún tiene permiso de 'Consulta' (bitConsulta)
    // Si no lo tiene, denegamos el acceso y lo mandamos a bienvenida.
    if (!hasPermission(name, 'bitConsulta')) {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div style="text-align: center; margin-top: 3rem;">
                <h1 style="color: var(--primary-dark)">Acceso Denegado</h1>
                <p>Usted ya no tiene permisos para acceder al módulo <strong>${name}</strong>.</p>
                <button class="btn" onclick="window.location.reload()">Recargar Aplicación</button>
            </div>
        `;
        // Actualizar menú para que desaparezca la opción si es necesario
        loadMenu(); 
        return;
    }

    const breadcrumbs = [];
    if (parentName) {
        breadcrumbs.push(parentName);
    } else if (menu.idMenuPadre && menu.idMenuPadre !== 0) {
        breadcrumbs.push('Menú'); 
    }
    breadcrumbs.push(name);
    updateBreadcrumbs(breadcrumbs);

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<p>Cargando...</p>';

    document.querySelectorAll('#dynamicMenu a').forEach(a => a.classList.remove('active'));
    const link = Array.from(document.querySelectorAll('#dynamicMenu a')).find(
        a => a.textContent.trim() === (menu.nombreMenu || menu.nombreModulo || '').trim()
    );
    if (link) link.classList.add('active');

    const moduloName = menu.nombreModulo;

    if (moduloName === 'Perfil') loadPerfilModule();
    else if (moduloName === 'Usuario') loadUsuarioModule();
    else if (moduloName === 'Modulo') loadModuloModule();
    else if (moduloName === 'Permisos-Perfil') loadPermisoPerfilModule();
    else if (moduloName && (moduloName.startsWith('Principal') || moduloName.includes('1.') || moduloName.includes('2.'))) loadStaticModule(moduloName);
    else contentArea.innerHTML = `<h1>${moduloName}</h1><p>Módulo en desarrollo.</p>`;
}

function loadStaticModule(name) {
    if (!mockDB[name]) mockDB[name] = [];
    const items = mockDB[name];

    const canAdd = hasPermission(name, 'bitAgregar');
    const canEdit = hasPermission(name, 'bitEditar');
    const canDelete = hasPermission(name, 'bitEliminar');
    const canDetail = hasPermission(name, 'bitDetalle');
    const canView = hasPermission(name, 'bitConsulta');
    
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <h1>${name}</h1>
        <div class="action-bar">
            ${canAdd ? `<button class="btn" onclick="openStaticModal('${name}')">+ Agregar Nuevo</button>` : ''}
            ${canView ? `<button class="btn btn-secondary" onclick="alert('Estadísticas y reportes de ${name} generados correctamente.')">Generar Reporte</button>` : ''}
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th style="text-align: right">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${items.length === 0 ? '<tr><td colspan="4" style="text-align:center">No hay registros simulados.</td></tr>' : 
                  items.map(item => `
                    <tr>
                        <td>#${String(item.id).padStart(3, '0')}</td>
                        <td style="font-weight: 600">${item.desc}</td>
                        <td><span class="status-pill ${item.status === 'Activo' ? 'active' : 'inactive'}">${item.status}</span></td>
                        <td class="actions-cell">
                            ${canDetail ? `<button class="btn btn-secondary" style="background:var(--primary-light); color:var(--primary-color)" onclick="openStaticModal('${name}', ${item.id}, true)">Detalle</button>` : ''}
                            ${canEdit ? `<button class="btn btn-secondary" onclick="openStaticModal('${name}', ${item.id})">Editar</button>` : ''}
                            ${canDelete ? `<button class="btn btn-danger" onclick="deleteStaticItem('${name}', ${item.id})">Eliminar</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="pagination">
            <button disabled>Anterior</button>
            <button disabled>Siguiente</button>
        </div>
    `;
}

function openStaticModal(moduleName, id = null, isDetail = false) {
    const item = id ? mockDB[moduleName].find(i => i.id === id) : { desc: '', status: 'Activo' };
    
    const formHtml = `
        <div class="form-group">
            <label>Descripción del Registro</label>
            <input type="text" name="desc" value="${item.desc}" required ${isDetail ? 'readonly disabled' : ''}>
        </div>
        <div class="form-group">
            <label>Estado</label>
            <select name="status" ${isDetail ? 'readonly disabled' : ''}>
                <option value="Activo" ${item.status === 'Activo' ? 'selected' : ''}>Activo</option>
                <option value="Inactivo" ${item.status === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                <option value="Pendiente" ${item.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            </select>
        </div>
    `;

    showModal(isDetail ? 'Detalle (Simulado)' : (id ? 'Editar (Simulado)' : 'Agregar (Simulado)'), formHtml, (formData) => {
        if (isDetail) {
            closeModal();
            return;
        }
        const data = Object.fromEntries(formData.entries());
        if (id) {
            const index = mockDB[moduleName].findIndex(i => i.id === id);
            mockDB[moduleName][index] = { ...mockDB[moduleName][index], ...data };
        } else {
            const newId = Math.max(0, ...Object.values(mockDB).flat().map(i => i.id)) + 1;
            mockDB[moduleName].push({ id: newId, ...data });
        }
        closeModal();
        loadStaticModule(moduleName);
    });

    if (isDetail) {
        const saveBtn = document.querySelector('#modalForm button[type="submit"]');
        if (saveBtn) saveBtn.textContent = 'Cerrar';
    }
}

function deleteStaticItem(moduleName, id) {
    if (confirm('¿Desea eliminar este registro simulado?')) {
        mockDB[moduleName] = mockDB[moduleName].filter(i => i.id !== id);
        loadStaticModule(moduleName);
    }
}

window.openStaticModal = openStaticModal;
window.deleteStaticItem = deleteStaticItem;

// =========================================================
// PROFILE TOGGLE: click to show/hide credential card
// =========================================================
function setupProfileToggle() {
    const userProfile = document.getElementById('userProfile');
    const dropdown = document.querySelector('.profile-dropdown');

    if (userProfile && dropdown) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// =========================================================
// USER INFO: populate header and credential card
// =========================================================
async function loadUserInfo() {
    try {
        const user = await request('/auth/me');
        if (user) {
            // Sincronizar localStorage con la info más fresca del servidor (permisos incluidos)
            const localUserStr = localStorage.getItem('user');
            const localUser = localUserStr ? JSON.parse(localUserStr) : {};
            
            // Comparar permisos actuales con los nuevos para ver si necesitamos refrescar el menú
            const oldPermisos = JSON.stringify(localUser.permisos || []);
            const newPermisos = JSON.stringify(user.permisos || []);
            const adminStatusChanged = localUser.bitAdministrador !== user.bitAdministrador;
            
            const updatedUser = { ...localUser, ...user };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Si los permisos o el rol cambiaron, refrescamos el menú lateral automáticamente
            if (oldPermisos !== newPermisos || adminStatusChanged) {
                console.log("Detectado cambio en permisos, actualizando menú lateral...");
                loadMenu();
            }

            const avatarUrl = user.imagen
                || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=ffdbe9&color=f06292`;
            
            const headerNameEl = document.getElementById('headerUserName');
            const headerAvatarEl = document.getElementById('headerUserAvatar');
            if (headerNameEl) headerNameEl.textContent = user.username || 'Usuario';
            if (headerAvatarEl) headerAvatarEl.src = avatarUrl;

            const credAvatarEl = document.getElementById('credentialAvatar');
            const credNameEl = document.getElementById('credentialName');
            const credRoleEl = document.getElementById('credentialRole');
            const credEmailEl = document.getElementById('credentialEmail');
            const credIdEl = document.getElementById('credentialId');

            if (credAvatarEl) credAvatarEl.src = avatarUrl;
            if (credNameEl) credNameEl.textContent = user.username || 'Usuario';
            if (credRoleEl) credRoleEl.textContent = user.perfilNombre || 'Personal';
            if (credEmailEl) credEmailEl.textContent = user.email || 'No disponible';
            if (credIdEl) {
                const idVal = user.id ? String(user.id).padStart(3, '0') : '000';
                credIdEl.textContent = `ID: #${idVal}`;
            }
        }
    } catch (err) {
        console.error('Error loading user info', err);
    }
}

// =========================================================
// LOGOUT
// =========================================================
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

window.logout = logout;

// =========================================================
// BUG FIX #3: Initialize ONCE — there were two initialization
// blocks calling loadMenu/loadUserInfo/setupProfileToggle
// which caused duplicate functions and duplicate listeners.
// =========================================================
if (document.getElementById('dynamicMenu')) {
    loadMenu();
    loadUserInfo();
    setupProfileToggle();
}
