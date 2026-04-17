async function loadUsuarioModule(page = 0) {
    const contentArea = document.getElementById('contentArea');
    updateBreadcrumbs(['Administración', 'Usuarios']);
    try {
        const data = await request(`/usuario?page=${page}&size=5`);
        const canAdd = hasPermission('Usuario', 'bitAgregar');
        const canEdit = hasPermission('Usuario', 'bitEditar');
        const canDelete = hasPermission('Usuario', 'bitEliminar');

        contentArea.innerHTML = `
            <h1>Gestión de Usuarios</h1>
            <div class="action-bar">
                ${canAdd ? '<button class="btn" onclick="openUsuarioModal()">+ Nuevo Usuario</button>' : ''}
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
                                <img src="${u.imagen || 'https://ui-avatars.com/api/?name='+encodeURIComponent(u.strNombreUsuario)+'&background=ffdbe9&color=f06292'}" class="img-circle" onerror="this.src='https://ui-avatars.com/api/?name=U&background=ffdbe9&color=f06292'">
                                <div>
                                    <div style="font-weight: 600">${u.strNombreUsuario}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted)">${u.perfil.strNombrePerfil}</div>
                                </div>
                            </td>
                            <td>${u.strNombreUsuario}</td>
                            <td>${u.strCorreo || 'N/A'}</td>
                            <td><span class="status-pill ${u.idEstadoUsuario === 1 ? 'active' : 'inactive'}">${u.idEstadoUsuario === 1 ? 'Activo' : 'Inactivo'}</span></td>
                            <td class="actions-cell">
                                ${canEdit ? `<button class="btn btn-secondary" onclick="openUsuarioModal(${u.id})">Editar</button>` : ''}
                                ${canDelete ? `<button class="btn btn-danger" onclick="deleteUsuario(${u.id})">Eliminar</button>` : ''}
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
            <label>Correo Electrónico</label>
            <input type="email" name="strCorreo" value="${usuario.strCorreo || ''}" placeholder="correo@ejemplo.com">
        </div>
        <div class="form-group">
            <label>Contraseña ${id ? '(dejar vacío para no cambiar)' : ''}</label>
            <input type="password" name="password" ${id ? '' : 'required'}>
        </div>
        <div class="form-group">
            <label>Número de Celular</label>
            <input type="text" name="strNumeroCelular" value="${usuario.strNumeroCelular || ''}" placeholder="+502 0000-0000">
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
            <label>Imagen de Perfil</label>
            <div style="display: flex; align-items: start; gap: 1rem;">
                <div class="image-preview-container" id="imagePreviewContainer">
                    <img src="${usuario.imagen || 'https://ui-avatars.com/api/?name='+(usuario.strNombreUsuario||'U')+'&background=ffdbe9&color=f06292'}" id="userImagePreview" onerror="this.src='https://ui-avatars.com/api/?name=U&background=ffdbe9&color=f06292'">
                </div>
                <div style="flex: 1">
                    <input type="file" id="imageInput" accept="image/*" style="width: 100%; border: none; padding: 0;">
                    <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">Seleccione una imagen de su dispositivo para subirla a la nube.</p>
                </div>
            </div>
            <input type="hidden" name="imagen" id="imagenUrl" value="${usuario.imagen || ''}">
        </div>
    `;

    showModal(id ? 'Editar Usuario' : 'Agregar Usuario', formHtml, async (formData) => {
        const modalForm = document.getElementById('modalForm');

        // --- Validaciones Usuario ---
        const validationRules = [
            { name: 'strNombreUsuario', label: 'Nombre de Usuario',  rules: ['required', 'no-spaces', 'minlength:3', 'maxlength:50'] },
            { name: 'strCorreo',        label: 'Correo Electrónico', rules: ['required', 'email', 'maxlength:50'] },
            { name: 'strNumeroCelular', label: 'Número de Celular',  rules: ['required', 'phone'] }
        ];
        // Contraseña: obligatoria solo en creación, pero si se ingresa en edición se valida igual
        if (!id) {
            validationRules.push({ name: 'password', label: 'Contraseña', rules: ['required', 'password', 'maxlength:50'] });
        } else {
            const pwField = modalForm.querySelector('[name="password"]');
            if (pwField && pwField.value) {
                validationRules.push({ name: 'password', label: 'Contraseña', rules: ['password', 'maxlength:50'] });
            }
        }

        const isValid = validateForm(modalForm, validationRules);
        if (!isValid) return;
        // --- Fin validaciones ---

        const imageInput = document.getElementById('imageInput');
        const imagenUrlInput = document.getElementById('imagenUrl');
        
        if (imageInput.files.length > 0) {
            try {
                const btn = document.querySelector('#modalForm button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Subiendo...';
                btn.disabled = true;
                
                const uploadedUrl = await uploadToImgBB(imageInput.files[0]);
                imagenUrlInput.value = uploadedUrl;
                
                btn.textContent = originalText;
                btn.disabled = false;
            } catch (err) {
                alert('Error al subir la imagen: ' + err.message);
                return;
            }
        }

        const data = Object.fromEntries(formData.entries());
        // IMPORTANT: FormData is a snapshot from submit time (before the async upload).
        // We must read imagenUrl's current DOM value to get the freshly uploaded URL.
        data.imagen = document.getElementById('imagenUrl').value;
        data.idPerfil = parseInt(data.idPerfil);
        data.idEstadoUsuario = parseInt(data.idEstadoUsuario);
        
        try {
            await request(`/usuario${id ? '/' + id : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(data)
            });
            closeModal();
            loadUsuarioModule();
            // Update header if we edited ourselves
            const loggedUser = JSON.parse(localStorage.getItem('user'));
            if (id === loggedUser?.id) {
                loadUserInfo();
            }
        } catch (err) {
            alert(err.message);
        }
    });

    // Add preview logic
    document.getElementById('imageInput').onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('userImagePreview').src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
}

window.loadUsuarioModule = loadUsuarioModule;
window.openUsuarioModal = openUsuarioModal;
window.deleteUsuario = async (id) => {
    if (confirm('¿Seguro?')) {
        await request(`/usuario/${id}`, { method: 'DELETE' });
        loadUsuarioModule();
    }
};
