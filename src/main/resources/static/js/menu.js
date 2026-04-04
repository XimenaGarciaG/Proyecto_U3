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
    if (menu.subMenus && menu.subMenus.length > 0) {
        return `
            <li class="menu-item-parent">
                <div class="menu-group-label" onclick="toggleSubmenu(this)">
                    ${menu.nombreMenu || 'Sección'} <span>▼</span>
                </div>
                <ul class="submenu">
                    ${menu.subMenus.map(renderMenuItem).join('')}
                </ul>
            </li>
        `;
    } else if (menu.idModulo || menu.nombreModulo) {
        return `
            <li><a href="#" onclick='loadModule(${JSON.stringify(menu)})'>${menu.nombreMenu || menu.nombreModulo}</a></li>
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
async function loadModule(menu) {
    const breadcrumbs = [];
    if (menu.idMenuPadre && menu.idMenuPadre !== 0) {
        breadcrumbs.push('Seguridad');
    }
    breadcrumbs.push(menu.nombreModulo || menu.nombreMenu);
    updateBreadcrumbs(breadcrumbs);

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<p>Cargando...</p>';

    const name = menu.nombreModulo;

    document.querySelectorAll('#dynamicMenu a').forEach(a => a.classList.remove('active'));
    const link = Array.from(document.querySelectorAll('#dynamicMenu a')).find(
        a => a.textContent.trim() === (menu.nombreMenu || menu.nombreModulo || '').trim()
    );
    if (link) link.classList.add('active');

    if (name === 'Perfil') loadPerfilModule();
    else if (name === 'Usuario') loadUsuarioModule();
    else if (name === 'Modulo') loadModuloModule();
    else if (name === 'Permisos-Perfil') loadPermisoPerfilModule();
    else if (name && name.startsWith('Principal')) loadStaticModule(name);
    else contentArea.innerHTML = `<h1>${name}</h1><p>Módulo en desarrollo.</p>`;
}

function loadStaticModule(name) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <h1>${name}</h1>
        <p>Módulo estático para visualización.</p>
        <table class="data-table">
            <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
            <tbody>
                <tr><td>1</td><td>Ejemplo Estático</td><td>
                    <button class="btn btn-secondary" style="width: auto; padding: 0.2rem 0.8rem" onclick="alert('Demo')">Detalle</button>
                </td></tr>
            </tbody>
        </table>
    `;
}

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
        // BUG FIX #2: request() already prepends '/api', so we only pass '/auth/me'
        const user = await request('/auth/me');
        if (user) {
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
