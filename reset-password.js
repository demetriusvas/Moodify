document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÃO DO FIREBASE (COPIADA DO SEU SCRIPT PRINCIPAL) ---
    const firebaseConfig = {
        apiKey: "AIzaSyCawoj9RaQ3RtF2PInrytkpggIf0bKMA9o",
        authDomain: "moodify-app-a399a.firebaseapp.com",
        projectId: "moodify-app-a399a",
        storageBucket: "moodify-app-a399a.firebasestorage.app",
        messagingSenderId: "694714006480",
        appId: "1:694714006480:web:7943ac89885dcea20f17d5"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // --- ELEMENTOS DA UI ---
    const resetPasswordForm = document.getElementById('reset-password-form');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorElement = document.getElementById('reset-error');
    const infoElement = document.getElementById('reset-info');

    let oobCode = null;

    // --- LÓGICA DE REDEFINIÇÃO DE SENHA ---

    // 1. Extrair o código de redefinição (oobCode) da URL
    try {
        const urlParams = new URLSearchParams(window.location.search);
        oobCode = urlParams.get('oobCode');
        if (!oobCode) {
            throw new Error("Código de redefinição inválido ou ausente.");
        }
    } catch (e) {
        showError("Não foi possível processar sua solicitação. O link pode ser inválido.");
        return;
    }

    // 2. Verificar a validade do código
    auth.verifyPasswordResetCode(oobCode).then(email => {
        infoElement.textContent = `Redefinindo a senha para: ${email}`;
    }).catch(err => {
        showError("O link de redefinição é inválido ou expirou. Por favor, solicite um novo.");
    });

    // 3. Lidar com o envio do formulário
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validação básica
        if (newPassword.length < 6) {
            showError("A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (newPassword !== confirmPassword) {
            showError("As senhas não coincidem.");
            return;
        }

        // 4. Confirmar a nova senha no Firebase
        auth.confirmPasswordReset(oobCode, newPassword).then(() => {
            alert("Senha redefinida com sucesso! Você será redirecionado para a página de login.");
            window.location.href = 'index.html'; // Redireciona para a página principal
        }).catch(err => {
            showError(`Erro ao redefinir a senha: ${err.message}`);
        });
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        infoElement.style.display = 'none';
    }
});