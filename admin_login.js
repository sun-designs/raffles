// Admin Login JavaScript
class AdminLogin {
    constructor() {
        this.form = document.getElementById('adminLoginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.loginBtn = document.getElementById('loginBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.rememberCheckbox = document.getElementById('rememberMe');
        
        this.isLoading = false;
        this.initEventListeners();
        this.loadRememberedCredentials();
    }

    initEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Toggle password visibility
        this.togglePasswordBtn.addEventListener('click', () => this.togglePassword());
        
        // Input validation on typing
        this.usernameInput.addEventListener('input', () => this.validateInputs());
        this.passwordInput.addEventListener('input', () => this.validateInputs());
        
        // Enter key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                this.handleSubmit(e);
            }
        });
        
        // Auto-hide error message when user starts typing
        [this.usernameInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', () => this.hideError());
        });
        
        // Prevent form submission on disabled state
        this.loginBtn.addEventListener('click', (e) => {
            if (this.isLoading) {
                e.preventDefault();
                return false;
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        // Basic validation
        if (!this.validateForm(username, password)) {
            return;
        }
        
        this.setLoading(true);
        this.hideError();
        
        try {
            const response = await this.submitLogin(username, password);
            
            if (response.success) {
                this.handleLoginSuccess(response);
            } else {
                this.handleLoginError(response.message || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.handleLoginError('Error de conexión. Intenta nuevamente.');
        } finally {
            this.setLoading(false);
        }
    }

    validateForm(username, password) {
        if (!username) {
            this.showError('El campo usuario es requerido');
            this.usernameInput.focus();
            return false;
        }
        
        if (username.length < 3) {
            this.showError('El usuario debe tener al menos 3 caracteres');
            this.usernameInput.focus();
            return false;
        }
        
        if (!password) {
            this.showError('El campo contraseña es requerido');
            this.passwordInput.focus();
            return false;
        }
        
        if (password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            this.passwordInput.focus();
            return false;
        }
        
        return true;
    }

    async submitLogin(username, password) {
        // Simular delay de red
        await this.delay(1000);
        
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('remember', this.rememberCheckbox.checked);
        
        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            // Si no hay endpoint real, simular respuesta para desarrollo
            if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
                return this.simulateLogin(username, password);
            }
            throw error;
        }
    }

    // Simulación para desarrollo (remover en producción)
    simulateLogin(username, password) {
        // Credenciales de prueba
        const validCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'superadmin', password: 'super123' },
            { username: 'root', password: 'root123' }
        ];
        
        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
        
        if (isValid) {
            return {
                success: true,
                message: 'Login exitoso',
                redirectUrl: '/admin/dashboard'
            };
        } else {
            return {
                success: false,
                message: 'Usuario o contraseña incorrectos'
            };
        }
    }

    handleLoginSuccess(response) {
        // Guardar credenciales si "recordar" está marcado
        if (this.rememberCheckbox.checked) {
            this.saveCredentials();
        } else {
            this.clearSavedCredentials();
        }
        
        // Mostrar feedback visual de éxito
        this.showSuccess('¡Login exitoso! Redirigiendo...');
        
        // Redireccionar después de un breve delay
        setTimeout(() => {
            const redirectUrl = response.redirectUrl || '/admin/dashboard';
            window.location.href = redirectUrl;
        }, 1500);
    }

    handleLoginError(message) {
        this.showError(message);
        
        // Limpiar contraseña por seguridad
        this.passwordInput.value = '';
        this.passwordInput.focus();
        
        // Agregar efecto de shake al formulario
        this.form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }

    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.loginBtn.classList.add('loading');
            this.loginBtn.disabled = true;
            this.usernameInput.disabled = true;
            this.passwordInput.disabled = true;
        } else {
            this.loginBtn.classList.remove('loading');
            this.loginBtn.disabled = false;
            this.usernameInput.disabled = false;
            this.passwordInput.disabled = false;
        }
    }

    togglePassword() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
        
        // Mantener focus en el input
        this.passwordInput.focus();
        
        // Posicionar cursor al final
        setTimeout(() => {
            this.passwordInput.setSelectionRange(
                this.passwordInput.value.length,
                this.passwordInput.value.length
            );
        }, 10);
    }

    validateInputs() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        // Habilitar/deshabilitar botón según validación
        const isValid = username.length >= 3 && password.length >= 6;
        this.loginBtn.style.opacity = isValid ? '1' : '0.7';
        
        // Ocultar error si hay input válido
        if (isValid && this.errorMessage.style.display !== 'none') {
            this.hideError();
        }
    }

    showError(message) {
        this.errorMessage.querySelector('.error-text').textContent = message;
        this.errorMessage.style.display = 'flex';
        
        // Auto-hide después de 5 segundos
        setTimeout(() => this.hideError(), 5000);
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }

    showSuccess(message) {
        // Crear elemento de éxito si no existe
        let successMessage = document.getElementById('successMessage');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.id = 'successMessage';
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <span class="success-icon">✅</span>
                <span class="success-text"></span>
            `;
            successMessage.style.cssText = `
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.2);
                border-radius: var(--border-radius);
                padding: 12px 16px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: slideDown 0.3s ease-out;
            `;
            this.errorMessage.parentNode.insertBefore(successMessage, this.errorMessage);
        }
        
        successMessage.querySelector('.success-text').textContent = message;
        successMessage.style.display = 'flex';
        this.hideError();
    }

    saveCredentials() {
        try {
            const credentials = {
                username: this.usernameInput.value.trim(),
                timestamp: Date.now()
            };
            localStorage.setItem('admin_credentials', JSON.stringify(credentials));
        } catch (error) {
            console.warn('No se pudieron guardar las credenciales:', error);
        }
    }

    loadRememberedCredentials() {
        try {
            const saved = localStorage.getItem('admin_credentials');
            if (saved) {
                const credentials = JSON.parse(saved);
                
                // Verificar que no sea muy antiguo (30 días)
                const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                if (Date.now() - credentials.timestamp < thirtyDays) {
                    this.usernameInput.value = credentials.username;
                    this.rememberCheckbox.checked = true;
                    this.passwordInput.focus();
                } else {
                    this.clearSavedCredentials();
                }
            }
        } catch (error) {
            console.warn('Error al cargar credenciales guardadas:', error);
        }
    }

    clearSavedCredentials() {
        try {
            localStorage.removeItem('admin_credentials');
        } catch (error) {
            console.warn('Error al limpiar credenciales:', error);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AdminLogin();
});

// Agregar estilos adicionales para mensajes de éxito
const additionalStyles = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .success-message .success-text {
        color: var(--success-color, #10b981);
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .success-message .success-icon {
        font-size: 1.1rem;
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);