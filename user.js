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

// 言語データの定義
const languageData = {
    en: {
        title: "Vlog Information Management",
        minorInfo: "Minor Information",
        vlogInfo: "Monetized Vlog Information",
        addMinor: "Add Minor",
        addVlog: "Add Vlog",
        downloadCSV: "Download CSV",
        logout: "Logout",
    },
    ja: {
        title: "ブイログ情報管理",
        minorInfo: "未成年者の情報",
        vlogInfo: "収益化ブイログ情報",
        addMinor: "追加",
        addVlog: "追加",
        downloadCSV: "CSV出力",
        logout: "ログアウト",
    }
};

// 現在の言語を設定
let currentLanguage = 'ja'; // 初期言語

function updateLanguage() {
    document.getElementById('welcomeMessage').innerText = languageData[currentLanguage].title;
    document.getElementById('minorInfoTitle').innerText = languageData[currentLanguage].minorInfo;
    document.getElementById('vlogInfoTitle').innerText = languageData[currentLanguage].vlogInfo;
    document.getElementById('addMinorInfoButton').innerText = languageData[currentLanguage].addMinor;
    document.getElementById('addVlogInfoButton').innerText = languageData[currentLanguage].addVlog;
    document.getElementById('downloadCSVButton').innerText = languageData[currentLanguage].downloadCSV;
    document.getElementById('logoutButton').innerText = languageData[currentLanguage].logout;
}

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
    document.getElementById('addMinorInfoButton').addEventListener('click', () => {
        const name = document.getElementById('minorName').value;
        const age = document.getElementById('minorAge').value;

        const minor = { name, age, earnings: 0, vlogs: [] };
        minors.push(minor); // 未成年者を追加

        // チェックボックスを生成
        const checkboxContainer = document.getElementById('minorCheckboxContainer');
        const checkbox = document.createElement('div');
        checkbox.className = 'minor-checkbox'; // クラス名を追加
        checkbox.innerHTML = `
            <input type="checkbox" name="minorSelect" value="${name}" id="${name}">
            <label for="${name}">${name}</label>
            <input type="number" id="duration_${name}" placeholder="出演時間 (分)" min="0">
        `;
        checkboxContainer.appendChild(checkbox);

        // 登録された未成年者リストに追加
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
            checkboxContainer.removeChild(checkbox); // チェックボックスも削除
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
        const totalDuration = parseFloat(document.getElementById('totalDuration').value); // 総出演時間
        const selectedMinors = Array.from(document.querySelectorAll('input[name="minorSelect"]:checked')).map(input => input.value);
        const selectedDurations = selectedMinors.map(minorName => parseFloat(document.getElementById(`duration_${minorName}`).value)); // 各未成年者の出演時間

        const vlog = { title: vlogTitle, totalEarnings, minors: selectedMinors, selectedDurations };
        vlogs.push(vlog); // ブイログを追加

        // 各未成年者の収益を計算
        selectedMinors.forEach((minorName, index) => {
            const minor = minors.find(m => m.name === minorName);
            const individualDuration = selectedDurations[index];
            let earnings;

            if (selectedMinors.length === 1) {
                // 未成年者が1名の場合
                earnings = (individualDuration / totalDuration) < 0.5 ? 0 : totalEarnings * (individualDuration / totalDuration);
            } else {
                // 未成年者が2名以上の場合
                earnings = totalEarnings / selectedMinors.length;
            }

            minor.earnings += earnings; // 各未成年者の収益を加算
            minor.vlogs.push(vlogTitle); // ブイログタイトルを追加
        });

        // 結果を表示
        displayVlogInfo(vlog);
        
        // 入力フィールドをクリア
        document.getElementById('vlogTitle').value = '';
        document.getElementById('totalEarnings').value = '';
        document.getElementById('totalDuration').value = '';
        selectedMinors.forEach(minorName => {
            document.getElementById(`duration_${minorName}`).value = ''; // 各未成年者の出演時間をクリア
        });
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

// CSV出力の関数
function downloadCSV() {
    // 未成年者のデータをCSV形式に変換
    const minorsCSV = minors.map(minor => `${minor.name},${minor.age},${minor.earnings},${minor.vlogs.join('; ')}`).join('\n');
    const vlogsCSV = vlogs.map(vlog => `${vlog.title},${vlog.totalEarnings},${vlog.totalDuration},${vlog.minors.join('; ')}`).join('\n');

    const csvContent = `未成年者データ\n名前,年齢,収益,出演ブイログ\n${minorsCSV}\n\nブイログデータ\nタイトル,総収益,総出演時間,出演未成年者\n${vlogsCSV}`;

    // CSVファイルを生成してダウンロード
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'data.csv');
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// CSV出力ボタンを設定
document.getElementById('downloadCSVButton').addEventListener('click', downloadCSV);

// サムネイルを取得する関数
function getThumbnailFromUrl(url) {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
    if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// サムネイルを追加するためのイベントリスナー
document.getElementById('addVlogInfoButton').addEventListener('click', () => {
    const vlogTitle = document.getElementById('vlogTitle').value;
    const videoUrl = document.getElementById('videoUrl').value; // YouTubeの動画URL
    const thumbnailUrl = getThumbnailFromUrl(videoUrl); // サムネイルのURLを取得

    // ここでサムネイルを表示するコードを追加
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    thumbnailContainer.innerHTML = `<img src="${thumbnailUrl}" alt="サムネイル" style="width: 100%; max-width: 300px;"/>`;

    // 追加の処理...
});
