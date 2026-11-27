/**
 * Cinevia - Movie Ticket Booking & Cinema Management System
 * Universal Master Script (script.js)
 * Supports Authentication (Login/Signup, Passwords, Tabs, Console Logging, Complexity Validation)
 * and Ticket Confirmation (Printing, User Greeting, Ticket Details).
 */

// ==========================================
// 1. DATA INITIALIZATION & LOCALSTORAGE
// ==========================================
(function initDefaultUsers() {
    if (!localStorage.getItem('cinevia_users')) {
        const defaultUsers = [
            {
                id: 'USR-1001',
                name: 'Alex Johnson',
                email: 'alex@example.com',
                password: 'Pass@123',
                createdAt: new Date().toISOString(),
                formattedDate: new Date().toLocaleString()
            }
        ];
        localStorage.setItem('cinevia_users', JSON.stringify(defaultUsers));
    }
})();

// ==========================================
// 2. PASSWORD COMPLEXITY VALIDATION
// ==========================================
/**
 * Validate password requirements:
 * 1. Minimum 6 characters
 * 2. At least 1 capital letter (A-Z)
 * 3. At least 1 small letter (a-z)
 * 4. At least 1 special symbol (!@#$%)
 */
function validatePassword(password) {
    const missing = [];

    if (!password || password.length < 6) {
        missing.push("at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
        missing.push("1 capital letter (A-Z)");
    }
    if (!/[a-z]/.test(password)) {
        missing.push("1 small letter (a-z)");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
        missing.push("1 special symbol (e.g. !@#$%)");
    }

    if (missing.length > 0) {
        return {
            isValid: false,
            message: `Password is missing: ${missing.join(', ')}.`,
            missing: missing
        };
    }

    return {
        isValid: true,
        message: "Password meets all requirements.",
        missing: []
    };
}

function updatePasswordChecklist(password) {
    const reqLength = document.getElementById('req-length');
    const reqCapital = document.getElementById('req-capital');
    const reqSmall = document.getElementById('req-small');
    const reqSpecial = document.getElementById('req-special');

    if (!reqLength) return;

    const hasLength = (password || '').length >= 6;
    const hasCapital = /[A-Z]/.test(password || '');
    const hasSmall = /[a-z]/.test(password || '');
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password || '');

    setRequirementStatus(reqLength, hasLength, 'Minimum 6 characters');
    setRequirementStatus(reqCapital, hasCapital, '1 capital letter (A-Z)');
    setRequirementStatus(reqSmall, hasSmall, '1 small letter (a-z)');
    setRequirementStatus(reqSpecial, hasSpecial, '1 special symbol (!@#$%)');
}

function setRequirementStatus(element, isValid, label) {
    if (!element) return;
    if (isValid) {
        element.className = 'valid';
        element.innerHTML = `<span>✓</span> ${label}`;
    } else {
        element.className = 'invalid';
        element.innerHTML = `<span>✕</span> ${label}`;
    }
}

window.validatePassword = validatePassword;

// ==========================================
// 3. TAB SWITCHING (LOGIN / SIGN UP)
// ==========================================
function switchTab(tab) {
    const loginTabBtn = document.getElementById('loginTabBtn');
    const signupTabBtn = document.getElementById('signupTabBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    clearAllAlerts();

    if (tab === 'login') {
        if (loginTabBtn) loginTabBtn.classList.add('active');
        if (signupTabBtn) signupTabBtn.classList.remove('active');
        if (loginForm) loginForm.classList.add('active');
        if (signupForm) signupForm.classList.remove('active');
        console.log("🔄 Active Tab: Login");
    } else if (tab === 'signup') {
        if (signupTabBtn) signupTabBtn.classList.add('active');
        if (loginTabBtn) loginTabBtn.classList.remove('active');
        if (signupForm) signupForm.classList.add('active');
        if (loginForm) loginForm.classList.remove('active');
        console.log("🔄 Active Tab: Sign Up");
    }
}

// ==========================================
// 4. PASSWORD VISIBILITY TOGGLE (SEEN / UNSEEN)
// ==========================================
let lastToggleTime = 0;
function togglePass(inputId, clickedBtn) {
    const now = Date.now();
    // Guard against duplicate execution within 150ms
    if (now - lastToggleTime < 150) {
        return;
    }
    lastToggleTime = now;

    const input = document.getElementById(inputId);
    if (!input) {
        console.warn(`Toggle password: input #${inputId} not found`);
        return;
    }

    const wrapper = input.closest('.password-wrapper');
    const toggleBtn = clickedBtn || (wrapper ? wrapper.querySelector('.toggle-password') : null);

    if (input.type === 'password') {
        input.type = 'text';
        if (toggleBtn) {
            toggleBtn.textContent = '🙈';
            toggleBtn.setAttribute('title', 'Hide password');
            toggleBtn.setAttribute('aria-label', 'Hide password');
            toggleBtn.classList.add('visible');
        }
        console.log(`👁️ Password for #${inputId} is now VISIBLE`);
    } else {
        input.type = 'password';
        if (toggleBtn) {
            toggleBtn.textContent = '👁️';
            toggleBtn.setAttribute('title', 'Show password');
            toggleBtn.setAttribute('aria-label', 'Show password');
            toggleBtn.classList.remove('visible');
        }
        console.log(`🔒 Password for #${inputId} is now HIDDEN`);
    }
}

window.togglePass = togglePass;
window.switchTab = switchTab;

// ==========================================
// 5. UI ALERTS & NOTIFICATIONS
// ==========================================
function showAlert(form, message, type = 'success') {
    if (!form) return;
    let alertBox = form.querySelector('.auth-alert');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.className = 'auth-alert';
        const titleEl = form.querySelector('.subtitle') || form.querySelector('h2');
        if (titleEl && titleEl.nextSibling) {
            form.insertBefore(alertBox, titleEl.nextSibling);
        } else {
            form.prepend(alertBox);
        }
    }

    alertBox.className = `auth-alert ${type}`;
    const icon = type === 'success' ? '✅' : '⚠️';
    alertBox.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    alertBox.style.display = 'flex';
}

function clearAllAlerts() {
    document.querySelectorAll('.auth-alert').forEach(alert => {
        alert.style.display = 'none';
        alert.innerHTML = '';
    });
}

// ==========================================
// 6. SIGN UP LOGIC & CONSOLE LOGGING
// ==========================================
function handleSignup(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const signupForm = document.getElementById('signupForm');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!name || !email || !password) {
        showAlert(signupForm, 'Please fill in all fields.', 'error');
        console.warn('⚠️ Sign up attempt failed: Incomplete fields.');
        return;
    }

    // STRICT PASSWORD COMPLEXITY VALIDATION
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        showAlert(signupForm, passwordValidation.message, 'error');
        console.warn('⚠️ Sign up rejected - Password requirements not met:', passwordValidation.missing);
        return;
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('cinevia_users')) || [];
    } catch (e) {
        users = [];
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showAlert(signupForm, 'An account with this email already exists. Switching to Login...', 'error');
        console.warn(`⚠️ User already exists: ${email}`);
        setTimeout(() => {
            switchTab('login');
            const loginEmail = document.getElementById('loginEmail');
            if (loginEmail) loginEmail.value = email;
        }, 1200);
        return;
    }

    // Create user object
    const newUser = {
        id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
    };

    // Store in localStorage
    users.push(newUser);
    localStorage.setItem('cinevia_users', JSON.stringify(users));
    localStorage.setItem('cinevia_last_registered', JSON.stringify(newUser));

    // ==========================================
    // 📢 PRINT USER DATA DIRECTLY TO JS CONSOLE
    // ==========================================
    console.log("%c=======================================================", "color: #4A7FA7; font-weight: bold;");
    console.log("%c🎉 NEW USER SIGNED UP SUCCESSFULLY!", "color: #B3CFE5; font-size: 15px; font-weight: bold;");
    console.log("%c=======================================================", "color: #4A7FA7; font-weight: bold;");
    console.log("👤 Full Name:      ", newUser.name);
    console.log("📧 Email Address:  ", newUser.email);
    console.log("🔑 Password:       ", newUser.password);
    console.log("🆔 User ID:        ", newUser.id);
    console.log("📅 Registered At:  ", newUser.formattedDate);
    console.log("📊 Complete User Object Data:");
    console.table([newUser]);
    console.log("%c=======================================================", "color: #4A7FA7; font-weight: bold;");

    // UI feedback
    showAlert(signupForm, `Account created for ${newUser.name}! Entering password and logging in...`, 'success');

    // Automatically transition to login and directly enter pass & email
    setTimeout(() => {
        switchTab('login');

        // DIRECTLY ENTER CREDENTIALS INTO LOGIN FORM
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');

        if (loginEmail) loginEmail.value = newUser.email;
        if (loginPassword) loginPassword.value = newUser.password;

        const loginForm = document.getElementById('loginForm');
        showAlert(loginForm, `Credentials loaded for ${newUser.name}. Click 'Login' or press Enter to proceed!`, 'success');

        console.log(`✨ Automatically entered credentials into Login Form for: ${newUser.email}`);

        if (signupForm) signupForm.reset();
        updatePasswordChecklist('');
    }, 1000);
}

// ==========================================
// 7. LOGIN LOGIC & AUTHENTICATION
// ==========================================
function handleLogin(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMeCheckbox = document.querySelector('.remember-me input[type="checkbox"]');
    const loginForm = document.getElementById('loginForm');

    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
        showAlert(loginForm, 'Please enter your email and password.', 'error');
        console.warn('⚠️ Login failed: Empty email or password.');
        return;
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('cinevia_users')) || [];
    } catch (e) {
        users = [];
    }

    // Authenticate user
    const authenticatedUser = users.find(u => u.email === email && u.password === password);

    if (authenticatedUser) {
        localStorage.setItem('cinevia_current_user', JSON.stringify(authenticatedUser));

        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
            localStorage.setItem('cinevia_remembered_email', email);
        } else {
            localStorage.removeItem('cinevia_remembered_email');
        }

        // ==========================================
        // 📢 PRINT LOGIN SUCCESS TO JS CONSOLE
        // ==========================================
        console.log("%c=======================================================", "color: #5cb85c; font-weight: bold;");
        console.log("%c✅ USER LOGIN SUCCESSFUL!", "color: #B3CFE5; font-size: 15px; font-weight: bold;");
        console.log("%c=======================================================", "color: #5cb85c; font-weight: bold;");
        console.log("👤 Logged In User: ", authenticatedUser.name);
        console.log("📧 User Email:     ", authenticatedUser.email);
        console.log("🕒 Login Timestamp:", new Date().toLocaleString());
        console.log("%c=======================================================", "color: #5cb85c; font-weight: bold;");

        showAlert(loginForm, `Welcome back, ${authenticatedUser.name}! Directing to your ticket...`, 'success');

        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 1000);

    } else {
        showAlert(loginForm, 'Invalid email or password. Please try again or create an account.', 'error');
        console.warn(`❌ Login failed for ${email}: Incorrect credentials.`);
    }
}

// ==========================================
// 8. HELPER ACTIONS (FORGOT PASS & SOCIAL)
// ==========================================
function handleForgotPassword(event) {
    if (event) event.preventDefault();
    const loginEmail = document.getElementById('loginEmail');
    const email = loginEmail && loginEmail.value.trim() ? loginEmail.value.trim() : prompt("Enter your registered email address:");

    if (email) {
        console.log("%c🔑 PASSWORD RESET REQUESTED", "color: #4A7FA7; font-weight: bold;");
        console.log(`Password reset link sent to: ${email}`);
        alert(`A password reset link has been simulated and sent to ${email}. Check your console for details!`);
    }
}

function handleSocialLogin(provider) {
    console.log(`🌐 Initiating ${provider} authentication...`);
    const demoSocialUser = {
        id: 'USR-SOC-' + Math.floor(1000 + Math.random() * 9000),
        name: `${provider} User`,
        email: `${provider.toLowerCase()}.user@example.com`,
        password: 'Social@Pass123',
        provider: provider,
        formattedDate: new Date().toLocaleString()
    };

    console.log(`✅ Successfully authenticated via ${provider}:`, demoSocialUser);
    localStorage.setItem('cinevia_current_user', JSON.stringify(demoSocialUser));
    alert(`Logged in with ${provider} as ${demoSocialUser.email}! Redirecting...`);
    window.location.href = 'confirmation.html';
}

// ==========================================
// 9. TICKET CONFIRMATION ENHANCEMENTS
// ==========================================
function initConfirmationPage() {
    const currentUserJson = localStorage.getItem('cinevia_current_user') || localStorage.getItem('cinevia_last_registered');

    if (currentUserJson) {
        try {
            const currentUser = JSON.parse(currentUserJson);
            if (currentUser && currentUser.name) {
                const bannerP = document.querySelector('.success-banner p');
                if (bannerP) {
                    bannerP.innerHTML = `Welcome <strong>${currentUser.name}</strong>! Your ticket and invoice details have been emailed to <em>${currentUser.email}</em>.`;
                }
                const bookingIdEl = document.getElementById('ticketBookingId');
                if (bookingIdEl && currentUser.id) {
                    bookingIdEl.textContent = '#' + currentUser.id.replace('USR-', 'CV-');
                }
            }
        } catch (e) {
            console.warn("Could not parse current user data:", e);
        }
    }

    const ticketDateEl = document.getElementById('ticketDate');
    if (ticketDateEl) {
        const today = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        ticketDateEl.textContent = today.toLocaleDateString('en-GB', options);
    }

    const printBtn = document.getElementById('printTicketBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            console.log("🖨️ Printing Ticket...");
            window.print();
        });
    }
}

// ==========================================
// 10. DOM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("🎬 Cinevia Cinema Management System Script Initialized.");

    // Check if on Auth page
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm || signupForm) {
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (signupForm) signupForm.addEventListener('submit', handleSignup);

        // Real-time password requirements listener
        const signupPasswordInput = document.getElementById('signupPassword');
        if (signupPasswordInput) {
            signupPasswordInput.addEventListener('input', () => {
                updatePasswordChecklist(signupPasswordInput.value);
            });
        }

        const loginTabBtn = document.getElementById('loginTabBtn');
        const signupTabBtn = document.getElementById('signupTabBtn');

        if (loginTabBtn) {
            loginTabBtn.onclick = (e) => {
                e.preventDefault();
                switchTab('login');
            };
        }
        if (signupTabBtn) {
            signupTabBtn.onclick = (e) => {
                e.preventDefault();
                switchTab('signup');
            };
        }

        document.querySelectorAll('.toggle-password').forEach(button => {
            button.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const wrapper = button.closest('.password-wrapper');
                const input = wrapper ? wrapper.querySelector('input') : null;
                if (input) togglePass(input.id, button);
            };
        });

        const forgotPassLink = document.querySelector('.forgot-pass');
        if (forgotPassLink) {
            forgotPassLink.addEventListener('click', handleForgotPassword);
        }

        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent || '';
                const provider = text.includes('Google') ? 'Google' : 'Apple';
                handleSocialLogin(provider);
            });
        });

        // Auto-fill remembered email or last registered credentials
        const rememberedEmail = localStorage.getItem('cinevia_remembered_email');
        const loginEmail = document.getElementById('loginEmail');
        const rememberMeCheckbox = document.querySelector('.remember-me input[type="checkbox"]');

        if (rememberedEmail && loginEmail) {
            loginEmail.value = rememberedEmail;
            if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
            console.log(`📌 Remembered email loaded: ${rememberedEmail}`);
        } else {
            const lastUserJson = localStorage.getItem('cinevia_last_registered');
            if (lastUserJson) {
                try {
                    const lastUser = JSON.parse(lastUserJson);
                    if (lastUser && lastUser.email && loginEmail) {
                        loginEmail.value = lastUser.email;
                        const loginPassword = document.getElementById('loginPassword');
                        if (loginPassword && lastUser.password) {
                            loginPassword.value = lastUser.password;
                        }
                        console.log(`💡 Pre-loaded last registered user credentials: ${lastUser.email}`);
                    }
                } catch (err) {}
            }
        }
    }

    // Check if on Confirmation page
    const printableTicket = document.getElementById('printableTicket');
    if (printableTicket) {
        initConfirmationPage();
    }
});
