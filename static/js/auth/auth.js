/**
 * Authentication JavaScript
 * 
 * Handles login, register, and form validation
 */

class AuthController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializePasswordStrength();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Forgot password form
        const forgotForm = document.getElementById('forgotForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        // Password validation
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearError(input);
                if (input.id === 'password') {
                    this.updatePasswordStrength(input.value);
                }
                if (input.id === 'confirmPassword') {
                    this.validatePasswordMatch();
                }
            });
        });

        // Text inputs validation
        const textInputs = document.querySelectorAll('input[type="text"], input[type="tel"]');
        textInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateTextField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    setupFormValidation() {
        // Add validation to required fields
        const requiredFields = document.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                if (!field.value.trim()) {
                    this.showError(field, 'Este campo es obligatorio');
                }
            });
        });
    }

    // Login handler
    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        // Validate form
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        // Show loading state
        this.setButtonLoading('loginBtn', true);

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Success
            this.showSuccess('¡Inicio de sesión exitoso!');
            
            // Store session if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberUser', email);
            }
            
            // Redirect to dashboard or main page
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1500);

        } catch (error) {
            this.showError(document.getElementById('email'), 'Email o contraseña incorrectos');
        } finally {
            this.setButtonLoading('loginBtn', false);
        }
    }

    // Register handler
    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            acceptTerms: formData.get('acceptTerms'),
            newsletter: formData.get('newsletter')
        };

        // Validate form
        if (!this.validateRegisterForm(userData)) {
            return;
        }

        // Show loading state
        this.setButtonLoading('registerBtn', true);

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Success
            this.showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);

        } catch (error) {
            this.showError(document.getElementById('email'), 'Este email ya está registrado');
        } finally {
            this.setButtonLoading('registerBtn', false);
        }
    }

    // Forgot password handler
    async handleForgotPassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('forgotEmail');

        if (!this.validateEmail(document.getElementById('forgotEmail'))) {
            return;
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            this.showSuccess('Se ha enviado un enlace de recuperación a tu email');
            closeForgotPassword();
            
        } catch (error) {
            this.showError(document.getElementById('forgotEmail'), 'Error al enviar el email');
        }
    }

    // Form validation methods
    validateLoginForm(email, password) {
        let isValid = true;

        if (!email || !this.isValidEmail(email)) {
            this.showError(document.getElementById('email'), 'Ingresa un email válido');
            isValid = false;
        }

        if (!password || password.length < 6) {
            this.showError(document.getElementById('password'), 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(userData) {
        let isValid = true;

        // Name validation
        if (!userData.firstName || userData.firstName.length < 2) {
            this.showError(document.getElementById('firstName'), 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }

        if (!userData.lastName || userData.lastName.length < 2) {
            this.showError(document.getElementById('lastName'), 'El apellido debe tener al menos 2 caracteres');
            isValid = false;
        }

        // Email validation
        if (!userData.email || !this.isValidEmail(userData.email)) {
            this.showError(document.getElementById('email'), 'Ingresa un email válido');
            isValid = false;
        }

        // Phone validation (optional but if provided, must be valid)
        if (userData.phone && !this.isValidPhone(userData.phone)) {
            this.showError(document.getElementById('phone'), 'Ingresa un teléfono válido');
            isValid = false;
        }

        // Password validation
        if (!userData.password || userData.password.length < 8) {
            this.showError(document.getElementById('password'), 'La contraseña debe tener al menos 8 caracteres');
            isValid = false;
        }

        // Confirm password validation
        if (userData.password !== userData.confirmPassword) {
            this.showError(document.getElementById('confirmPassword'), 'Las contraseñas no coinciden');
            isValid = false;
        }

        // Terms acceptance
        if (!userData.acceptTerms) {
            this.showError(document.getElementById('acceptTerms').parentElement, 'Debes aceptar los términos y condiciones');
            isValid = false;
        }

        return isValid;
    }

    // Individual field validation
    validateEmail(input) {
        const email = input.value.trim();
        if (!email) {
            this.showError(input, 'El email es obligatorio');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showError(input, 'Ingresa un email válido');
            return false;
        }
        
        this.clearError(input);
        return true;
    }

    validateTextField(input) {
        const value = input.value.trim();
        const fieldName = input.getAttribute('placeholder') || 'Este campo';
        
        if (input.hasAttribute('required') && !value) {
            this.showError(input, `${fieldName} es obligatorio`);
            return false;
        }
        
        if (value && value.length < 2) {
            this.showError(input, `${fieldName} debe tener al menos 2 caracteres`);
            return false;
        }
        
        this.clearError(input);
        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (!password || !confirmPassword) return;
        
        if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
            this.showError(confirmPassword, 'Las contraseñas no coinciden');
            return false;
        }
        
        this.clearError(confirmPassword);
        return true;
    }

    // Validation helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Simple phone validation - can be enhanced
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Error handling
    showError(element, message) {
        // Find the error element
        let errorElement;
        if (element.tagName === 'INPUT') {
            errorElement = element.parentElement.querySelector('.error-message');
            element.style.borderColor = '#ef4444';
        } else {
            errorElement = element.querySelector('.error-message');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(element) {
        // Find the error element
        let errorElement;
        if (element.tagName === 'INPUT') {
            errorElement = element.parentElement.querySelector('.error-message');
            element.style.borderColor = '';
        } else {
            errorElement = element.querySelector('.error-message');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    showSuccess(message) {
        // Create or update success message
        let successDiv = document.querySelector('.success-message');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                z-index: 1000;
                font-weight: 600;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(successDiv);
        }
        
        successDiv.textContent = message;
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 3000);
    }

    // Password strength
    initializePasswordStrength() {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value);
            });
        }
    }

    updatePasswordStrength(password) {
        const strengthElement = document.getElementById('passwordStrength');
        if (!strengthElement) return;

        const strength = this.calculatePasswordStrength(password);
        const strengthText = strengthElement.querySelector('.strength-text');
        
        // Remove all strength classes
        strengthElement.classList.remove('weak', 'fair', 'good', 'strong');
        
        if (password.length === 0) {
            strengthText.textContent = 'Muy débil';
            return;
        }
        
        switch (strength.level) {
            case 1:
                strengthElement.classList.add('weak');
                strengthText.textContent = 'Débil';
                break;
            case 2:
                strengthElement.classList.add('fair');
                strengthText.textContent = 'Regular';
                break;
            case 3:
                strengthElement.classList.add('good');
                strengthText.textContent = 'Buena';
                break;
            case 4:
                strengthElement.classList.add('strong');
                strengthText.textContent = 'Muy fuerte';
                break;
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) score += 1;
        else feedback.push('Al menos 8 caracteres');

        // Lowercase check
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Letras minúsculas');

        // Uppercase check
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Letras mayúsculas');

        // Number check
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('Números');

        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('Caracteres especiales');

        // Calculate level (1-4)
        let level = 1;
        if (score >= 3) level = 2;
        if (score >= 4) level = 3;
        if (score >= 5) level = 4;

        return { level, score, feedback };
    }

    // Button loading state
    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Simulate API call
    simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 2000);
        });
    }
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle');
    const icon = button.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
    } else {
        input.type = 'password';
        icon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        `;
    }
}

// Modal functions
function showForgotPassword() {
    const modal = document.getElementById('forgotModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeForgotPassword() {
    const modal = document.getElementById('forgotModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Clear form
        const form = document.getElementById('forgotForm');
        if (form) form.reset();
    }
}

function showTerms() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeTerms() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showPrivacy() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePrivacy() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Social login functions
function loginWithGoogle() {
    alert('Iniciar sesión con Google\n\nEsta funcionalidad se implementaría con la API de Google OAuth.');
}

function loginWithFacebook() {
    alert('Iniciar sesión con Facebook\n\nEsta funcionalidad se implementaría con la API de Facebook Login.');
}

function registerWithGoogle() {
    alert('Registrarse con Google\n\nEsta funcionalidad se implementaría con la API de Google OAuth.');
}

function registerWithFacebook() {
    alert('Registrarse con Facebook\n\nEsta funcionalidad se implementaría con la API de Facebook Login.');
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthController();
    
    // Pre-fill email if remembered
    const rememberedEmail = localStorage.getItem('rememberUser');
    if (rememberedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = rememberedEmail;
            const rememberCheckbox = document.getElementById('rememberMe');
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthController };
}
