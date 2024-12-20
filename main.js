import { initializeFirebase, setupLogout } from "./firebase.js";
import { setLanguage } from "./language.js"; // 言語設定をインポート
import { fetchVlogsFromFirestore, displayVlogs, addVlogEventListener } from "./vlogs.js"; 
import MinorManager from './minors.js';

const minorManager = new MinorManager();
const { auth } = initializeFirebase(); // Firebaseの初期化

// ユーザーの認証状態を監視
auth.onAuthStateChanged(async (user) => {
    if (user) {
        document.getElementById('welcomeMessage').innerText = `ようこそ, ${user.email}さん！`;
        const userId = user.uid;

        // Firestoreから未成年者データを取得
        await minorManager.fetchMinorsFromFirestore(userId);

        // Firestoreからブイログデータを取得して表示
        const vlogs = await fetchVlogsFromFirestore();
        displayVlogs(vlogs); // 取得したブイログを表示
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
    minorManager.updateLanguage(); // 未成年者の表示も更新
});

document.getElementById('lang-ja').addEventListener('click', async () => {
    setLanguage('ja'); // 言語を日本語に設定
    const allVlogs = await fetchVlogsFromFirestore();
    displayVlogs(allVlogs); // 言語切り替え後に再表示
    minorManager.updateLanguage(); // 未成年者の表示も更新
});

// 未成年者の情報を追加
minorManager.addMinorEventListener(); // MinorManager のメソッドを呼び出す

// 収益化ブイログ情報を追加
addVlogEventListener();

// ログアウト処理
setupLogout();
