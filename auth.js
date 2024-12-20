import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { initializeFirebase } from "./firebase.js";

const { auth } = initializeFirebase(); // Firebaseの初期化とauthの取得

// ユーザー登録処理
document.getElementById('registerButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("ユーザー登録が成功しました。");
    } catch (error) {
        console.error("ユーザー登録中のエラー:", error);
        alert("登録に失敗しました。");
    }
});

// ログイン処理
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("ログイン成功");
        window.location.href = 'user.html'; // ユーザーページにリダイレクト
    } catch (error) {
        console.error("ログイン中のエラー:", error);
        alert("ログインに失敗しました。");
    }
});
