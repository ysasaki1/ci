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
const minors = [
    {
        name: "未成年者A",
        age: 15,
        earnings: 0,
        videos: [] // 出演した動画の情報
    },
    {
        name: "未成年者B",
        age: 14,
        earnings: 0,
        videos: []
    }
];

// ブイログのデータ構造
const vlogData = {
    totalEarnings: 100000, // 総収益
    minorsInVideo: ["未成年者A", "未成年者B"], // 出演している未成年者の名前
};

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

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('delete-button');

        // 削除ボタンのクリックイベント
        deleteButton.addEventListener('click', () => {
            infoList.removeChild(listItem);
        });

        listItem.appendChild(deleteButton);
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

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('delete-button');

        // 削除ボタンのクリックイベント
        deleteButton.addEventListener('click', () => {
            infoList.removeChild(listItem);
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem);

        // 入力フィールドをクリア
        document.getElementById('vlogCount').value = '';
        document.getElementById('totalDuration').value = '';
        document.getElementById('featuredDuration').value = '';
        document.getElementById('totalEarnings').value = '';
        document.getElementById('trustAccount').value = '';
    });

    // 収益の計算
    calculateTrustAccount(minors, vlogData);
});

// 収益の計算関数
function calculateTrustAccount(minors, vlogData) {
    const totalEarnings = vlogData.totalEarnings;
    const minorsInVideo = vlogData.minorsInVideo;

    if (minorsInVideo.length === 0) {
        console.log("出演している未成年者がいません。");
        return;
    }

    // 各未成年者の収益計算
    const earningsPerMinor = totalEarnings / minorsInVideo.length;

    minors.forEach(minor => {
        if (minorsInVideo.includes(minor.name)) {
            minor.earnings += earningsPerMinor; // 各未成年者に均等に収益を分配
        }
    });

    // 信託口座預金額の計算
    const trustAccountDeposits = minors.map(minor => ({
        name: minor.name,
        earnings: minor.earnings,
        sharePercentage: (minor.earnings / totalEarnings) * 100 // 収益の割合
    }));

    // 結果を表示
    trustAccountDeposits.forEach(({name, earnings, sharePercentage}) => {
        console.log(`${name} の収益: ¥${earnings} (${sharePercentage.toFixed(2)}%)`);
    });

    // 収益の割合条件のチェック
    checkEarningsCondition(minors, vlogData);
}

// 収益の割合条件のチェック
function checkEarningsCondition(minors, vlogData) {
    const totalEarnings = vlogData.totalEarnings;
    const minorsInVideo = vlogData.minorsInVideo;

    if (minorsInVideo.length === 1) {
        const singleMinor = minors.find(minor => minor.name === minorsInVideo[0]);
        if (singleMinor.earnings / totalEarnings < 0.5) {
            console.log(`${singleMinor.name} の収益割合が50%未満です。`);
        } else {
            console.log(`${singleMinor.name} の収益割合が条件を満たしています。`);
        }
    } else if (minorsInVideo.length > 1) {
        const totalShares = minorsInVideo.reduce((sum, name) => {
            const minor = minors.find(minor => minor.name === name);
            return sum + (minor.earnings / totalEarnings);
        }, 0);

        if (totalShares < 1) {
            console.log("未成年者間で均等に分配されていません。");
        } else {
            console.log("収益配分が条件を満たしています。");
        }
    }
}
