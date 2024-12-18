// Firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyBG0oI4oX6Bllv9uwNS1SevG45G92rA5Qc",
    authDomain: "ci00-122f7.firebaseapp.com",
    projectId: "ci00-122f7",
    storageBucket: "ci00-122f7.firebasestorage.app",
    messagingSenderId: "611111120777",
    appId: "1:611111120777:web:a754047ec66d5bc3093b58",
    measurementId: "G-XENL409WZ7"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOMContentLoadedイベントを使用して、DOMが読み込まれてから実行
document.addEventListener('DOMContentLoaded', () => {
    // ユーザーの認証状態を監視
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('welcomeMessage').innerText = `ようこそ, ${user.email}さん！`;
        } else {
            // ユーザーがログインしていない場合、ログインページにリダイレクト
            window.location.href = 'index.html';
        }
    });

    // 未成年者の情報を追加
    document.getElementById('addMinorInfoButton').addEventListener('click', () => {
        const name = document.getElementById('minorName').value;
        const age = document.getElementById('minorAge').value;
        const infoList = document.getElementById('infoList');
        
        const listItem = document.createElement('li');
        listItem.textContent = `未成年者: ${name}, 年齢: ${age}`;
        infoList.appendChild(listItem);
        
        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });

    // 収益化ブイログ情報を追加
    document.getElementById('addVlogInfoButton').addEventListener('click', () => {
        const vlogCount = document.getElementById('vlogCount').value;
        const totalDuration = document.getElementById('totalDuration').value;
        const featuredDuration = document.getElementById('featuredDuration').value;
        const totalEarnings = document.getElementById('totalEarnings').value;
        const trustAccount = document.getElementById('trustAccount').value;
        const infoList = document.getElementById('infoList');
        
        const listItem = document.createElement('li');
        listItem.textContent = `収益化ブイログ数: ${vlogCount}, 総時間: ${totalDuration}分, 特集時間: ${featuredDuration}分, 総報酬: ¥${totalEarnings}, 信託口座: ¥${trustAccount}`;
        infoList.appendChild(listItem);
        
        // 入力フィールドをクリア
        document.getElementById('vlogCount').value = '';
        document.getElementById('totalDuration').value = '';
        document.getElementById('featuredDuration').value = '';
        document.getElementById('totalEarnings').value = '';
        document.getElementById('trustAccount').value = '';
    });

    // ログアウト処理
    document.getElementById('logoutButton').addEventListener('click', async () => {
        await auth.signOut(); // Firebaseのログアウト処理
        alert("ログアウトしました");
        window.location.href = 'index.html'; // ログインページにリダイレクト
    });

    // エラーメッセージの表示
    document.getElementById('closeModal').onclick = function() {
        document.getElementById('errorModal').style.display = 'none';
    }
});
