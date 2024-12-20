import { initializeFirebase, setupLogout } from "./firebase.js";
import { setLanguage } from "./language.js"; // setLanguage をインポート
import { fetchVlogsFromFirestore, displayVlogs, addVlogEventListener } from "./vlogs.js"; // vlogs.jsをインポート

const { auth } = initializeFirebase(); // Firebaseの初期化

// ユーザーの認証状態を監視
auth.onAuthStateChanged(async (user) => {
    if (user) {
        document.getElementById('welcomeMessage').innerText = `ようこそ, ${user.email}さん！`;
        
        // Firestoreからブイログデータを取得して表示
        await loadVlogs(); // vlogs のみを読み込む
    } else {
        // ユーザーがログインしていない場合、ログインページにリダイレクト
        window.location.href = 'index.html';
    }
});

// ブイログデータをロードする関数
async function loadVlogs() {
    try {
        const vlogs = await fetchVlogsFromFirestore();
        displayVlogs(vlogs); // 取得したブイログを表示
    } catch (error) {
        console.error("ブイログデータの取得に失敗しました:", error);
        alert("データの取得に失敗しました。再試行してください。"); // ユーザーへのフィードバック
    }
}

// 言語切り替えボタンの設定
document.getElementById('lang-en').addEventListener('click', async () => {
    setLanguage('en'); // 言語を英語に設定
    await loadVlogs(); // 言語切り替え後に再表示
});

document.getElementById('lang-ja').addEventListener('click', async () => {
    setLanguage('ja'); // 言語を日本語に設定
    await loadVlogs(); // 言語切り替え後に再表示
});

// 収益化ブイログ情報を追加
addVlogEventListener(); // vlogs.jsの処理を呼び出す

// ログアウト処理
setupLogout();
