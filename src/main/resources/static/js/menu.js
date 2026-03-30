async function loadMenu() {
    const menuEl = document.getElementById('dynamicMenu');
    try {
        const menus = await request('/menu');
        menuEl.innerHTML = menus.map(renderMenuItem).join('');
    } catch (err) {
        menuEl.innerHTML = '<p style="color: red;">Error de menú</p>';
    }
}

function renderMenuItem(menu) {
    if (menu.subMenus && menu.subMenus.length > 0) {
        return `
            <li class="menu-item-parent">
                <div class="menu-group-label" onclick="toggleSubmenu(this)">
                    ${menu.nombreMenu || 'Menú'} <span>▼</span>
                </div>
                <ul class="submenu">
                    ${menu.subMenus.map(renderMenuItem).join('')}
                </ul>
            </li>
        `;
    } else {
        return `
            <li><a href="#" onclick='loadModule(${JSON.stringify(menu)})'>${menu.nombreModulo || menu.nombreMenu}</a></li>
        `;
    }
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

async function loadModule(menu) {
    // Current hierarchy context
    const breadcrumbs = [];
    if (menu.idMenuPadre !== 0) {
        // Simple hack for breadcrumbs
        breadcrumbs.push('Seguridad'); // Or find the parent name
    }
    breadcrumbs.push(menu.nombreModulo || menu.nombreMenu);
    updateBreadcrumbs(breadcrumbs);

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<p>Cargando...</p>';

    const name = menu.nombreModulo;
    
    // Set active link in sidebar
    document.querySelectorAll('#dynamicMenu a').forEach(a => a.classList.remove('active'));
    const link = Array.from(document.querySelectorAll('#dynamicMenu a')).find(a => a.textContent === (menu.nombreModulo || menu.nombreMenu));
    if (link) link.classList.add('active');

    if (name === 'Perfil') loadPerfilModule();
    else if (name === 'Usuario') loadUsuarioModule();
    else if (name === 'Modulo') loadModuloModule();
    else if (name === 'Permisos-Perfil') loadPermisoPerfilModule();
    else if (name && name.startsWith('Principal')) loadStaticModule(name);
    else contentArea.innerHTML = `<h1>${name}</h1><p>Módulo en desarrollo.</p>`;
}

// Breadcrumbs logic removed here, moved to utils.js exclusively to avoid collision

function loadStaticModule(name) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <h1>${name}</h1>
        <div class="header">
            <button class="btn" onclick="alert('Estático - Solo lectura en demo')">Agregar</button>
        </div>
        <p>Módulo estático para visualización.</p>
        <table class="data-table">
            <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
            <tbody>
                <tr><td>1</td><td>Ejemplo Estático</td><td>
                    <button class="btn" style="width: auto; padding: 0.2rem 0.5rem" onclick="alert('Demo')">Detalle</button>
                    <button class="btn" style="width: auto; padding: 0.2rem 0.5rem" onclick="alert('Demo')">Editar</button>
                    <button class="btn" style="width: auto; padding: 0.2rem 0.5rem; background: var(--pastel-pink)" onclick="alert('Demo')">Eliminar</button>
                </td></tr>
            </tbody>
        </table>
    `;
}

if (document.getElementById('dynamicMenu')) {
    loadMenu();
    loadUserInfo();
}

async function loadUserInfo() {
    try {
        const user = await request('/api/auth/me');
        if (user) {
            document.getElementById('headerUserName').textContent = user.username;
            document.getElementById('headerUserRole').textContent = user.perfilNombre || 'Usuario';
            document.getElementById('headerUserAvatar').src = user.imagen || `https://ui-avatars.com/api/?name=${user.username}&background=ffdbe9&color=f06292`;
        }
    } catch (err) {
        console.error('Error loading user info', err);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

window.logout = logout;
