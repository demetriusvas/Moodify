document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANTE: Cole aqui a configuração do seu projeto Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCawoj9RaQ3RtF2PInrytkpggIf0bKMA9o",
        authDomain: "moodify-app-a399a.firebaseapp.com",
        projectId: "moodify-app-a399a",
        storageBucket: "moodify-app-a399a.firebasestorage.app",
        messagingSenderId: "694714006480",
        appId: "1:694714006480:web:7943ac89885dcea20f17d5"
    };

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // --- ELEMENTOS DA UI ---
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const userView = document.getElementById('user-view');
    const forgotPasswordView = document.getElementById('forgot-password-view');
    const emailSentView = document.getElementById('email-sent-view');
    const resetPasswordSuccessView = document.getElementById('reset-password-success-view');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    const googleLoginBtn = document.getElementById('google-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    // --- ROTEAMENTO DAS PÁGINAS DE AUTENTICAÇÃO ---
    if (showSignup) {
        showSignup.addEventListener('click', (e) => { e.preventDefault(); loginView.style.display = 'none'; signupView.style.display = 'block'; });
    }
    if (showLogin) {
        showLogin.addEventListener('click', (e) => { e.preventDefault(); signupView.style.display = 'none'; loginView.style.display = 'block'; });
    }

    const showForgotPassword = document.getElementById('show-forgot-password');
