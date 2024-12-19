// Firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// 未成年者のデータ構造
const minors = [];

// ブイログのデータ構造
const vlogs = [];

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

        const minor = { name, age, earnings: 0, vlogs: [] };
        minors.push(minor); // 未成年者を追加

        const infoList = document.getElementById('infoList');
        const listItem = document.createElement('li');
        listItem.textContent = `未成年者: ${name}, 年齢: ${age}`;
        
        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('delete-button');

        // 削除ボタンのクリックイベント
        deleteButton.addEventListener('click', () => {
            infoList.removeChild(listItem);
            minors.splice(minors.indexOf(minor), 1); // 未成年者を削除
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem);

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });

    // 収益化ブイログ情報を追加
    document.getElementById('addVlogInfoButton').addEventListener('click', () => {
        const vlogTitle = document.getElementById('vlogTitle').value; // ブイログのタイトル
        const totalEarnings = parseFloat(document.getElementById('totalEarnings').value); // 総収益
        const selectedMinors = Array.from(document.querySelectorAll('input[name="minorSelect"]:checked')).map(input => input.value);

        const vlog = { title: vlogTitle, totalEarnings, minors: selectedMinors };
        vlogs.push(vlog); // ブイログを追加

        // 各未成年者の収益を計算
        const earningsPerMinor = totalEarnings / selectedMinors.length;

        selectedMinors.forEach(minorName => {
            const minor = minors.find(m => m.name === minorName);
            if (minor) {
                minor.earnings += earningsPerMinor; // 各未成年者に均等に収益を分配
                minor.vlogs.push(vlogTitle); // ブイログタイトルを追加
            }
        });

        // 結果を表示
        displayVlogInfo(vlog);
        
        // 入力フィールドをクリア
        document.getElementById('vlogTitle').value = '';
        document.getElementById('totalEarnings').value = '';
    });

    // 結果を表示する関数
    function displayVlogInfo(vlog) {
        const vlogList = document.getElementById('vlogList');
        const vlogItem = document.createElement('li');
        vlogItem.textContent = `ブイログタイトル: ${vlog.title}, 総収益: ¥${vlog.totalEarnings}, 出演未成年者: ${vlog.minors.join(', ')}`;
        
        vlogList.appendChild(vlogItem);
    }

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
