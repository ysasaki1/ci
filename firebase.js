import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBG0oI4oX6Bllv9uwNS1SevG45G92rA5Qc",
    authDomain: "ci00-122f7.firebaseapp.com",
    projectId: "ci00-122f7",
    storageBucket: "ci00-122f7.firebasestorage.app",
    messagingSenderId: "611111120777",
    appId: "1:611111120777:web:a754047ec66d5bc3093b58",
    measurementId: "G-XENL409WZ7"
};

// Firebaseの初期化関数
export function initializeFirebase() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db }; // app, auth, dbを含めて返す
}

// 直接的にauthとdbをエクスポートする場合
const { auth, db } = initializeFirebase();
export { auth, db }; // authとdbをエクスポート

// ログアウト処理の設定
export function setupLogout() {
    document.getElementById('logoutButton').addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("ログアウトしました。");
            window.location.href = 'index.html'; // ログインページにリダイレクト
        } catch (error) {
            console.error("ログアウト中のエラー:", error);
            alert("ログアウトに失敗しました。");
        }
    });
}
