import { initializeFirebase, setupLogout } from "./firebase.js";
import { updateLanguage } from "./language.js";
import { fetchMinorsFromFirestore, addMinorEventListener } from "./minors.js";
import { addVlogEventListener } from "./vlogs.js";

const { auth, db } = initializeFirebase(); // Firebaseの初期化

let currentLanguage = 'ja'; // 初期言語を日本語に設定

// ユーザーの認証状態を監視
auth.onAuthStateChanged(async (user) => {
    if (user) {
        document.getElementById('welcomeMessage').innerText = `ようこそ, ${user.email}さん！`;
        const userId = user.uid;

        // Firestoreから未成年者データを取得
        await fetchMinorsFromFirestore(userId);
    } else {
        // ユーザーがログインしていない場合、ログインページにリダイレクト
        window.location.href = 'index.html';
    }
});

// 言語切り替えボタンの設定
document.getElementById('lang-en').addEventListener('click', () => {
    currentLanguage = 'en';
    updateLanguage();
});

document.getElementById('lang-ja').addEventListener('click', () => {
    currentLanguage = 'ja';
    updateLanguage();
});

// 未成年者の情報を追加
addMinorEventListener();

// 収益化ブイログ情報を追加
addVlogEventListener();

// ログアウト処理
setupLogout();
