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

    // --- Spotify API Credentials and Token Management (Implicit Grant Flow) ---
    const spotifyClientId = 'b4ab666dc3b541d5bea4b8970e39f499';
    const redirectUri = 'https://moodify-nine-chi.vercel.app/';
    let spotifyAccessToken = null;
    let tokenExpiresIn = 0;
    let tokenObtainedTime = 0;

    // Function to redirect to Spotify for authorization
    function redirectToSpotifyAuth() {
        const scopes = 'user-read-private user-read-email user-top-read'; // Add necessary scopes
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
        window.location = authUrl;
    }

    // Function to parse access token from URL hash
    function getSpotifyAccessTokenFromUrl() {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');

        if (accessToken && expiresIn) {
            spotifyAccessToken = accessToken;
            tokenExpiresIn = parseInt(expiresIn, 10);
            tokenObtainedTime = Date.now();
            console.log('Spotify Access Token obtained from URL:', spotifyAccessToken);
            // Clear hash from URL
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
            return true;
        }
        return false;
    }

    // Check for token on page load
    if (!getSpotifyAccessTokenFromUrl()) {
        // If no token in URL, check if we have one in localStorage (for persistence)
        const storedToken = localStorage.getItem('spotifyAccessToken');
        const storedExpiresIn = localStorage.getItem('spotifyTokenExpiresIn');
        const storedObtainedTime = localStorage.getItem('spotifyTokenObtainedTime');

        if (storedToken && storedExpiresIn && storedObtainedTime) {
            const now = Date.now();
            const expiryTime = parseInt(storedObtainedTime, 10) + (parseInt(storedExpiresIn, 10) * 1000);
            if (now < expiryTime) {
                spotifyAccessToken = storedToken;
                tokenExpiresIn = parseInt(storedExpiresIn, 10);
                tokenObtainedTime = parseInt(storedObtainedTime, 10);
                console.log('Spotify Access Token restored from localStorage:', spotifyAccessToken);
            } else {
                console.log('Stored Spotify token expired.');
                localStorage.removeItem('spotifyAccessToken');
                localStorage.removeItem('spotifyTokenExpiresIn');
                localStorage.removeItem('spotifyTokenObtainedTime');
            }
        }
    } else {
        // If token was just obtained from URL, store it
        localStorage.setItem('spotifyAccessToken', spotifyAccessToken);
        localStorage.setItem('spotifyTokenExpiresIn', tokenExpiresIn);
        localStorage.setItem('spotifyTokenObtainedTime', tokenObtainedTime);
    }

    // Function to check if token is valid
    function isSpotifyTokenValid() {
        if (!spotifyAccessToken) return false;
        const now = Date.now();
        const expiryTime = tokenObtainedTime + (tokenExpiresIn * 1000);
        return now < expiryTime;
    }

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

    // --- Hamburger Menu Logic ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (hamburgerMenu && sidebar && mainContent) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside of it on mobile
        mainContent.addEventListener('click', (e) => {
            // Check if the sidebar is active and the click is outside the sidebar itself
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // Close sidebar if window is resized to a larger size (desktop view)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) { // Assuming 768px is the breakpoint
                sidebar.classList.remove('active');
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

        // Mood to Spotify Genre Mapping
        const moodGenreMap = {
            feliz: 'pop,dance',
            triste: 'sad,acoustic',
            animado: 'party,edm',
            foco: 'ambient,classical',
            relaxado: 'chill,jazz',
            energico: 'rock,metal',
            pensativo: 'folk,indie',
            irritado: 'punk,heavy-metal'
        };

        // 1. Preenche informações do usuário
        welcomeMessage.textContent = `Bem-vindo(a), ${user.displayName || 'Usuário'}!`;
        profileInfo.innerHTML = `
            <p><strong>Nome:</strong> ${user.displayName || 'Não definido'}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>UID:</strong> ${user.uid}</p>
        `;

        // --- Spotify Connect Elements ---
        const spotifyConnectArea = document.getElementById('spotify-connect-area');
        const connectSpotifyBtn = document.getElementById('connect-spotify-btn');

        if (connectSpotifyBtn) {
            connectSpotifyBtn.addEventListener('click', redirectToSpotifyAuth);
        }

        // Function to update Spotify UI visibility
        function updateSpotifyUI() {
            if (isSpotifyTokenValid()) {
                spotifyConnectArea.style.display = 'none';
                moodButtonsContainer.style.display = 'grid'; // Show mood buttons
            } else {
                spotifyConnectArea.style.display = 'block';
                moodButtonsContainer.style.display = 'none'; // Hide mood buttons
                moodContent.innerHTML = '<p>Conecte-se ao Spotify para gerar músicas!</p>';
            }
        }

        // Initial UI update
        updateSpotifyUI();

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

        // 3. Lógica do seletor de humor e integração Spotify
        moodButtonsContainer.addEventListener('click', async (e) => {
            const target = e.target.closest('.mood-btn');
            if (target) {
                // Remove 'selected' class from all mood buttons
                document.querySelectorAll('.mood-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });

                // Add 'selected' class to the clicked button
                target.classList.add('selected');

                const selectedMood = target.dataset.mood;
                const genres = moodGenreMap[selectedMood];

                if (!genres) {
                    moodContent.innerHTML = '<p>Nenhuma sugestão de gênero encontrada para este humor.</p>';
                    return;
                }

                if (!isSpotifyTokenValid()) {
                    moodContent.innerHTML = '<p>Seu token do Spotify expirou ou não está disponível. Por favor, conecte-se novamente.</p>';
                    updateSpotifyUI(); // Show connect button
                    return;
                }

                moodContent.innerHTML = '<p>Buscando músicas...</p>';

                try {
                    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${genres}`,
                        {
                            headers: {
                                'Authorization': 'Bearer ' + spotifyAccessToken
                            }
                        }
                    );

                    if (response.status === 401) { // Token expired or invalid
                        console.warn("Spotify token expired or invalid. Prompting re-authentication.");
                        moodContent.innerHTML = '<p>Seu token do Spotify expirou ou é inválido. Por favor, conecte-se novamente.</p>';
                        updateSpotifyUI(); // Show connect button
                        return;
                    } else if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    } else {
                        const data = await response.json();
                        displaySongs(data.tracks);
                    }

                } catch (error) {
                    console.error("Error fetching Spotify recommendations:", error);
                    moodContent.innerHTML = '<p>Erro ao buscar sugestões de músicas. Tente novamente.</p>';
                }
            }
        });

        function displaySongs(tracks) {
            moodContent.innerHTML = ''; // Clear previous content
            if (tracks.length === 0) {
                moodContent.innerHTML = '<p>Nenhuma música encontrada para este humor.</p>';
                return;
            }

            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';

            tracks.forEach(track => {
                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.style.borderBottom = '1px solid var(--border-color)';
                li.style.paddingBottom = '10px';

                const trackName = track.name;
                const artistName = track.artists.map(artist => artist.name).join(', ');
                const externalUrl = track.external_urls.spotify;

                li.innerHTML = `
                    <p><strong><a href="${externalUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${trackName}</a></strong></p>
                    <p style="font-size: 0.9em; color: var(--text-color-secondary);">${artistName}</p>
                `;
                ul.appendChild(li);
            });
            moodContent.appendChild(ul);
        }
    }

    
});