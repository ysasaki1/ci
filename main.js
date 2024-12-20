import { initializeApp } from "./firebase.js";
import { updateLanguage } from "./language.js";
import { fetchMinorsFromFirestore, addMinorEventListener } from "./minors.js";
import { addVlogEventListener } from "./vlogs.js";
import { setupLogout } from "./firebase.js";

const app = initializeApp();
const auth = app.auth;
const db = app.db;

// DOMContentLoadedイベントを使用して、DOMが読み込まれてから実行
document.addEventListener('DOMContentLoaded', async () => {
    // ユーザーの認証状態を監視
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            document.getElementById('welcomeMessage').innerText = `ようこそ, ${user.email}さん！`;
            const userId = user.uid; // ユーザーIDを取得

            // Firestoreから未成年者データを取得
            await fetchMinorsFromFirestore(userId);
        } else {
            // ユーザーがログインしていない場合、ログインページにリダイレクト
            window.location.href = 'index.html';
        }
    });

    // 言語切り替えボタンのイベントリスナー
    document.getElementById('lang-en').addEventListener('click', () => {
        currentLanguage = 'en';
        updateLanguage();
    });

    document.getElementById('lang-ja').addEventListener('click', () => {
        currentLanguage = 'ja';
        updateLanguage();
    });

    // 初回の言語設定
    updateLanguage();

    // 未成年者の情報を追加
    addMinorEventListener();

    // 収益化ブイログ情報を追加
    addVlogEventListener();

    // ログアウト処理
    setupLogout();
});
