import { initializeFirebase, setupLogout } from "./firebase.js";
import { setLanguage } from "./language.js"; 
import { fetchMinorsFromFirestore, addMinorEventListener } from "./minors.js";
import { fetchVlogsFromFirestore, displayVlogs, addVlogEventListener } from "./vlogs.js"; 

import { setupCSVDownload } from "./csv.js"; // CSV出力機能を管理するファイルをインポート




const { auth, db } = initializeFirebase(); // Firebaseの初期化

// ユーザーの認証状態を監視
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userId = user.uid;

        // Firestoreから未成年者データを取得
        const minors = await fetchMinorsFromFirestore(userId); // userIdをここで使用
        // Firestoreからブイログデータを取得して表示
        const vlogs = await fetchVlogsFromFirestore();
        displayVlogs(vlogs); // 取得したブイログを表示

        // CSVダウンロードのセットアップ
        setupCSVDownload(userId); // userIdを渡してCSVダウンロード機能を設定

        // ログアウト処理を設定
        setupLogout(); // ユーザーがログインしている場合にログアウト処理を設定
    } else {
        // ユーザーがログインしていない場合、ログインページにリダイレクト
        window.location.href = 'index.html';
    }
});

// 言語切り替えボタンの設定
document.getElementById('lang-en').addEventListener('click', async () => {
    setLanguage('en'); // 言語を英語に設定
    const allVlogs = await fetchVlogsFromFirestore();
    displayVlogs(allVlogs); // 言語切り替え後に再表示

    // 未成年者情報も再取得して表示
    const user = auth.currentUser;
    if (user) {
        const minors = await fetchMinorsFromFirestore(user.uid);
        // ここで未成年者情報を表示する処理が必要なら追加
    }
});

document.getElementById('lang-ja').addEventListener('click', async () => {
    setLanguage('ja'); // 言語を日本語に設定
    const allVlogs = await fetchVlogsFromFirestore();
    displayVlogs(allVlogs); // 言語切り替え後に再表示

    // 未成年者情報も再取得して表示
    const user = auth.currentUser;
    if (user) {
        const minors = await fetchMinorsFromFirestore(user.uid);
        // ここで未成年者情報を表示する処理が必要なら追加
    }
});

// 未成年者の情報を追加
addMinorEventListener();

// 収益化ブイログ情報を追加
addVlogEventListener();

// ログアウト処理は onAuthStateChanged 内で設定済み
