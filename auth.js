import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { initializeFirebase } from "./firebase.js";
import { languageData, getCurrentLanguage } from './language.js'; // language.jsをインポート

const { auth } = initializeFirebase(); // Firebaseの初期化とauthの取得

// ユーザー登録処理
document.getElementById('registerButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert(getCurrentMessage('registrationSuccess')); // 言語に応じたメッセージ
        window.location.href = 'user.html'; // ユーザー登録後にリダイレクト
    } catch (error) {
        console.error("ユーザー登録中のエラー:", error);
        alert(getCurrentMessage('registrationError')); // 言語に応じたメッセージ
    }
});

// ログイン処理
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert(getCurrentMessage('loginSuccess')); // 言語に応じたメッセージ
        window.location.href = 'user.html'; // ユーザーページにリダイレクト
    } catch (error) {
        console.error("ログイン中のエラー:", error);
        alert(getCurrentMessage('loginError')); // 言語に応じたメッセージ
    }
});

// 言語に応じたメッセージを取得する関数
function getCurrentMessage(key) {
    const currentLanguage = getCurrentLanguage(); // 現在の言語を取得
    return languageData[currentLanguage][key]; // メッセージを返す
}
