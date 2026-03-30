document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const simulatedCaptcha = document.getElementById('simulatedCaptcha').checked;
    const captchaResponse = simulatedCaptcha ? "SIMULATED_TOKEN" : "";

    if (!captchaResponse) {
        document.getElementById('message').textContent = 'Por favor, marque el reCAPTCHA';
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
            document.getElementById('message').textContent = error.message || 'Error de autenticación';
        }
    } catch (err) {
        document.getElementById('message').textContent = 'Error de red';
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
