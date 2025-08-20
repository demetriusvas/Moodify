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
    const showForgotPassword = document.getElementById('show-forgot-password');
    const backToLoginFromForgot = document.getElementById('back-to-login-from-forgot');
    const backToLoginFromEmailSent = document.getElementById('back-to-login-from-email-sent');
    const backToLoginFromSuccess = document.getElementById('back-to-login-from-success');

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
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        auth.signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
    });

    googleLoginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => alert(err.message));
    });

    logoutBtn.addEventListener('click', () => auth.signOut());

    // --- ROTEAMENTO DAS PÁGINAS DE AUTENTICAÇÃO ---
    showSignup.addEventListener('click', (e) => { e.preventDefault(); loginView.style.display = 'none'; signupView.style.display = 'block'; });
    showLogin.addEventListener('click', (e) => { e.preventDefault(); signupView.style.display = 'none'; loginView.style.display = 'block'; });
    showForgotPassword.addEventListener('click', (e) => { e.preventDefault(); loginView.style.display = 'none'; forgotPasswordView.style.display = 'block'; });
    backToLoginFromForgot.addEventListener('click', (e) => { e.preventDefault(); forgotPasswordView.style.display = 'none'; loginView.style.display = 'block'; });
    backToLoginFromEmailSent.addEventListener('click', (e) => { e.preventDefault(); emailSentView.style.display = 'none'; loginView.style.display = 'block'; });
    backToLoginFromSuccess.addEventListener('click', (e) => { e.preventDefault(); resetPasswordSuccessView.style.display = 'none'; loginView.style.display = 'block'; });

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
        if (user) {
            // Usuário logado: mostra a interface principal
            loginView.style.display = 'none';
            signupView.style.display = 'none';
            forgotPasswordView.style.display = 'none';
            emailSentView.style.display = 'none';
            resetPasswordSuccessView.style.display = 'none';
            userView.style.display = 'block';
            setupApp(user);
        } else {
            // Usuário deslogado: mostra a tela de login
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
