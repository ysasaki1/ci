import { auth } from "./firebase.js"; // authをインポート

// 言語データの定義
export const languageData = {
    en: {
        title: "Vlog Information Management",
        minorInfo: "Minor Information",
        vlogInfo: "Monetized Vlog Information",
        addMinor: "Add Minor",
        addVlog: "Add Vlog",
        downloadCSV: "Download CSV",
        logout: "Logout",
        vlogTitle: "Vlog Title",
        totalEarnings: "Total Earnings",
        totalDuration: "Total Duration (minutes)",
        registeredMinors: "Registered Minors",
        registeredVlogs: "Registered Vlogs",
        minorName: "Name",
        minorAge: "Age",
        delete: "Delete",
        minorParticipants: "Minor Participants",
        errorMessage: "Please fill in all fields correctly.", // エラーメッセージ
    },
    ja: {
        title: "ブイログ情報管理",
        minorInfo: "未成年者の情報",
        vlogInfo: "収益化ブイログ情報",
        addMinor: "追加",
        addVlog: "追加",
        downloadCSV: "CSV出力",
        logout: "ログアウト",
        vlogTitle: "ブイログタイトル",
        totalEarnings: "総収益",
        totalDuration: "総出演時間 (分)",
        registeredMinors: "登録された未成年者",
        registeredVlogs: "登録されたブイログ",
        minorName: "名前",
        minorAge: "年齢",
        delete: "削除",
        minorParticipants: "出演未成年者",
        errorMessage: "すべてのフィールドを正しく入力してください。" // エラーメッセージ
    }
};

// 現在の言語を設定
let currentLanguage = localStorage.getItem('language') || 'ja'; // ローカルストレージから取得、初期言語は日本語

// 要素の存在を確認してテキストを更新する関数
function updateTextContent(element, text) {
    if (element) {
        element.innerText = text;
    }
}

// 要素の存在を確認してプレースホルダーを更新する関数
function updatePlaceholder(element, placeholder) {
    if (element) {
        element.placeholder = placeholder;
    }
}

// 言語を更新する関数
export function updateLanguage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const minorInfoTitle = document.getElementById('minorInfoTitle');
    const vlogInfoTitle = document.getElementById('vlogInfoTitle');
    const addMinorButton = document.getElementById('addMinorInfoButton');
    const addVlogButton = document.getElementById('addVlogInfoButton');
    const downloadCSVButton = document.getElementById('downloadCSVButton');
    const logoutButton = document.getElementById('logoutButton');

    const vlogTitleLabel = document.getElementById('vlogTitle');
    const totalEarningsLabel = document.getElementById('totalEarnings');
    const totalDurationLabel = document.getElementById('totalDuration');
    const registeredMinorsTitle = document.getElementById('registeredMinorsTitle');
    const registeredVlogsTitle = document.getElementById('registeredVlogsTitle');
    const minorAgeLabel = document.getElementById('minorAge');
    const minorParticipantsTitle = document.getElementById('minorParticipantsTitle');
    const minorNameInput = document.getElementById('minorName');
    const minorAgeInput = document.getElementById('minorAge');

    // 各要素のテキストを更新
    const userEmail = auth.currentUser ? auth.currentUser.email : "";
    updateTextContent(welcomeMessage, currentLanguage === 'ja' 
        ? `ようこそ, ${userEmail}さん！` 
        : `Welcome, ${userEmail}!`);
    updateTextContent(minorInfoTitle, languageData[currentLanguage].minorInfo);
    updateTextContent(vlogInfoTitle, languageData[currentLanguage].vlogInfo);
    updateTextContent(registeredMinorsTitle, languageData[currentLanguage].registeredMinors);
    updateTextContent(registeredVlogsTitle, languageData[currentLanguage].registeredVlogs);
    updateTextContent(minorParticipantsTitle, languageData[currentLanguage].minorParticipants);
    updateTextContent(addMinorButton, languageData[currentLanguage].addMinor);
    updateTextContent(addVlogButton, languageData[currentLanguage].addVlog);
    updateTextContent(downloadCSVButton, languageData[currentLanguage].downloadCSV);
    updateTextContent(logoutButton, languageData[currentLanguage].logout);
    updatePlaceholder(vlogTitleLabel, languageData[currentLanguage].vlogTitle);
    updatePlaceholder(totalEarningsLabel, languageData[currentLanguage].totalEarnings);
    updatePlaceholder(totalDurationLabel, languageData[currentLanguage].totalDuration);
    updatePlaceholder(minorNameInput, languageData[currentLanguage].minorName);
    updatePlaceholder(minorAgeInput, languageData[currentLanguage].minorAge);

    // 削除ボタンのラベルを更新
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.innerText = languageData[currentLanguage].delete;
    });
}

// 言語を切り替える関数
export function setLanguage(lang) {
    if (languageData[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang); // 言語をローカルストレージに保存
        updateLanguage(); // UIを更新
    }
}

// 現在の言語を取得する関数
export function getCurrentLanguage() {
    return currentLanguage;
}

// 初期UIの更新
updateLanguage();
