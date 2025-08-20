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
    console.log("Inicializando Firebase...");
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    console.log("Firebase inicializado.");

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

    const bodyElement = document.body; // Obter referência ao body

    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    const themeToggle = document.getElementById('theme-toggle');

    // --- LÓGICA DE TEMA --- 
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        bodyElement.classList.add(currentTheme);
        if (currentTheme === 'dark-theme') {
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        } else {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    } else {
        // Default to dark theme if no preference is found
        bodyElement.classList.add('dark-theme');
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (bodyElement.classList.contains('dark-theme')) {
                bodyElement.classList.replace('dark-theme', 'light-theme');
                themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light-theme');
            } else {
                bodyElement.classList.replace('light-theme', 'dark-theme');
                themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark-theme');
            }
        });
    }

    // --- LÓGICA DE AUTENTICAÇÃO ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => userCredential.user.updateProfile({ displayName: name }))
            .catch(err => alert(err.message));
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Formulário de login submetido.");
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');

        // Esconde o erro anterior
        errorElement.style.display = 'none';

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log("Login bem-sucedido!", userCredential.user);
            })
            .catch(err => {
                console.error("Erro no login:", err);
                // Mapeia códigos de erro para mensagens amigáveis
                let message = 'Ocorreu um erro desconhecido.';
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    message = 'E-mail ou senha incorretos. Verifique e tente novamente.';
                    break;
                case 'auth/invalid-email':
                    message = 'O formato do e-mail é inválido.';
                    break;
                default:
                    message = 'Ocorreu um erro ao tentar fazer o login.'; // Mensagem genérica para outros erros
            }
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        });
    });

    googleLoginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => alert(err.message));
    });

    logoutBtn.addEventListener('click', () => auth.signOut());

    // --- ROTEAMENTO DAS PÁGINAS DE AUTENTICAÇÃO ---
    if (showSignup) {
        showSignup.addEventListener('click', (e) => { e.preventDefault(); bodyElement.classList.add('auth-layout'); loginView.style.display = 'none'; signupView.style.display = 'block'; });
    }
    if (showLogin) {
        showLogin.addEventListener('click', (e) => { e.preventDefault(); bodyElement.classList.add('auth-layout'); signupView.style.display = 'none'; loginView.style.display = 'block'; });
    }

    const showForgotPassword = document.getElementById('show-forgot-password');
    if (showForgotPassword) {
        showForgotPassword.addEventListener('click', (e) => { e.preventDefault(); bodyElement.classList.add('auth-layout'); loginView.style.display = 'none'; forgotPasswordView.style.display = 'block'; });
    }

    const backToLoginFromForgot = document.getElementById('back-to-login-from-forgot');
    if (backToLoginFromForgot) {
        backToLoginFromForgot.addEventListener('click', (e) => { e.preventDefault(); bodyElement.classList.add('auth-layout'); forgotPasswordView.style.display = 'none'; loginView.style.display = 'block'; });
    }

    const backToLoginFromEmailSent = document.getElementById('back-to-login-from-email-sent');
    if (backToLoginFromEmailSent) {
        backToLoginFromEmailSent.addEventListener('click', (e) => { e.preventDefault(); bodyElement.classList.add('auth-layout'); emailSentView.style.display = 'none'; loginView.style.display = 'block'; });
    }

    const backToLoginFromSuccess = document.getElementById('back-to-login-from-success');
    if (backToLoginFromSuccess) {
        backToLoginFromSuccess.addEventListener('click', (e) => { e.preventDefault(); bodyElement.classList.add('auth-layout'); resetPasswordSuccessView.style.display = 'none'; loginView.style.display = 'block'; });
    }

    // --- LÓGICA DO FORMULÁRIO DE ESQUECI A SENHA ---
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        auth.sendPasswordResetEmail(email)
            .then(() => {
                forgotPasswordView.style.display = 'none';
                emailSentView.style.display = 'block';
            })
            .catch(err => alert(err.message));
    });


    // --- OBSERVADOR GERAL E ROTEAMENTO DE PÁGINA ---
    auth.onAuthStateChanged((user) => {
        console.log("auth.onAuthStateChanged disparado. Usuário:", user);
        if (user) {
            // Usuário logado: mostra a interface principal
            bodyElement.classList.remove('auth-layout'); // Remove a classe de layout de autenticação
            loginView.style.display = 'none';
            signupView.style.display = 'none';
            forgotPasswordView.style.display = 'none';
            emailSentView.style.display = 'none';
            resetPasswordSuccessView.style.display = 'none';
            userView.style.display = 'block';
            setupApp(user);
        } else {
            // Usuário deslogado: mostra a tela de login
            bodyElement.classList.add('auth-layout'); // Adiciona a classe de layout de autenticação
            loginView.style.display = 'block';
            signupView.style.display = 'none';
            forgotPasswordView.style.display = 'none';
            emailSentView.style.display = 'none';
            resetPasswordSuccessView.style.display = 'none';
            userView.style.display = 'none';
        }
    });

    // --- LÓGICA DO APLICATIVO PRINCIPAL ---
    function setupApp(user) {
        console.log("setupApp chamado. Usuário:", user);
        // Elementos da UI principal
        const welcomeMessage = document.getElementById('welcome-message');
        const moodButtonsContainer = document.querySelector('.mood-buttons');
        const moodContent = document.getElementById('mood-content');
        const profileInfo = document.getElementById('profile-info');
        const sidebarNav = document.querySelector('.sidebar-nav');
        const pages = document.querySelectorAll('.page');

        // 1. Preenche informações do usuário
        welcomeMessage.textContent = `Bem-vindo(a), ${user.displayName || 'Usuário'}!`;
        profileInfo.innerHTML = `
            <p><strong>Nome:</strong> ${user.displayName || 'Não definido'}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>UID:</strong> ${user.uid}</p>
        `;

        // 2. Lógica de navegação
        sidebarNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                const pageId = e.target.dataset.page;

                // Esconde todas as páginas e remove a classe ativa dos links
                pages.forEach(p => p.style.display = 'none');
                sidebarNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));

                // Mostra a página clicada e ativa o link
                document.getElementById(`page-${pageId}`).style.display = 'block';
                e.target.classList.add('active');
            }
        });

        // 3. Lógica do seletor de humor
        const moodSuggestions = {
            feliz: "Que ótimo! Que tal ouvir uma playlist de pop animado para manter a energia?",
            triste: "Tudo bem não se sentir bem. Uma música ambiente calma pode ajudar a relaxar.",
            animado: "Excelente! É um ótimo dia para músicas dançantes. Vamos agitar!",
            foco: "Hora de produzir! Músicas instrumentais ou lo-fi são perfeitas para concentração."
        };

        moodButtonsContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.mood-btn');
            if (target) {
                const selectedMood = target.dataset.mood;
                moodContent.innerHTML = `<p>${moodSuggestions[selectedMood]}</p>`;
            }
        });
    }

    
});