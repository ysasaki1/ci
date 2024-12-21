import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { initializeFirebase } from "./firebase.js";

const { auth } = initializeFirebase(); // Firebaseの初期化とauthの取得

// 言語データの定義
const languageData = {
    ja: {
        registrationSuccess: "ユーザー登録が成功しました。",
        registrationError: "登録に失敗しました。",
        loginSuccess: "ログイン成功",
        loginError: "ログインに失敗しました。",
    },
    en: {
        registrationSuccess: "User registration was successful.",
        registrationError: "Registration failed.",
        loginSuccess: "Login successful.",
        loginError: "Login failed.",
    }
};

// 現在の言語を取得
let currentLanguage = localStorage.getItem('language') || 'ja'; // ローカルストレージから取得

// ユーザー登録処理
document.getElementById('registerButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert(languageData[currentLanguage].registrationSuccess); // 言語に応じたメッセージ
    } catch (error) {
        console.error("ユーザー登録中のエラー:", error);
        alert(languageData[currentLanguage].registrationError); // 言語に応じたメッセージ
    }
});

// ログイン処理
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert(languageData[currentLanguage].loginSuccess); // 言語に応じたメッセージ
        window.location.href = 'user.html'; // ユーザーページにリダイレクト
    } catch (error) {
        console.error("ログイン中のエラー:", error);
        alert(languageData[currentLanguage].loginError); // 言語に応じたメッセージ
    }
});
