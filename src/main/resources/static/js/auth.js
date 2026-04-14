document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const msgEl = document.getElementById('message');
    msgEl.textContent = '';

    // --- Validaciones de login ---
    const usernameField = form.querySelector('#username');
    const passwordField = form.querySelector('#password');

    // Limpiar errores previos manualmente (utils.js no está cargado en login)
    form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    form.querySelectorAll('.field-error-msg').forEach(el => el.remove());

    let valid = true;

    const showLoginError = (field, msg) => {
        field.classList.add('field-error');
        let err = field.parentElement.querySelector('.field-error-msg');
        if (!err) {
            err = document.createElement('span');
            err.className = 'field-error-msg';
            field.parentElement.appendChild(err);
        }
        err.textContent = msg;
    };

    if (!usernameField.value.trim()) {
        showLoginError(usernameField, 'El nombre de usuario es obligatorio.');
        valid = false;
    } else if (usernameField.value.trim().length < 3) {
        showLoginError(usernameField, 'El usuario debe tener al menos 3 caracteres.');
        valid = false;
    } else if (usernameField.value.trim().length > 50) {
        showLoginError(usernameField, 'El usuario no puede superar 50 caracteres.');
        valid = false;
    }

    if (!passwordField.value) {
        showLoginError(passwordField, 'La contraseña es obligatoria.');
        valid = false;
    } else if (passwordField.value.length > 50) {
        showLoginError(passwordField, 'La contraseña no puede superar 50 caracteres.');
        valid = false;
    }

    if (!valid) return;
    // --- Fin validaciones ---

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const simulatedCaptcha = document.getElementById('simulatedCaptcha').checked;
    const captchaResponse = simulatedCaptcha ? "SIMULATED_TOKEN" : "";

    if (!captchaResponse) {
        msgEl.textContent = 'Por favor, marque el reCAPTCHA';
        return;
    }

    data.captchaResponse = captchaResponse;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result));
            window.location.href = 'dashboard.html';
        } else {
            const error = await response.json();
            msgEl.textContent = error.message || 'Error de autenticación';
        }
    } catch (err) {
        msgEl.textContent = 'Error de red';
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Global check
if (window.location.pathname.endsWith('dashboard.html') && !localStorage.getItem('token')) {
    window.location.href = 'login.html';
}
