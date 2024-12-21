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
        welcomeMessage: "Welcome, {user}!", // ウェルカムメッセージ
        registerTitle: "User Registration",
        loginTitle: "Login",
        registerButton: "Register",
        loginButton: "Login",
        modalClose: "Close",
        registrationSuccess: "User registration was successful.",
        registrationError: "Registration failed.",
        loginSuccess: "Login successful.",
        loginError: "Login failed.",
        emailPlaceholder: "Email Address",
        passwordPlaceholder: "Password",
        loginemailPlaceholder: "Email Address",
        loginpasswordPlaceholder: "Password",
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
        errorMessage: "すべてのフィールドを正しく入力してください。", // エラーメッセージ
        welcomeMessage: "ようこそ, {user}さん！", // ウェルカムメッセージ
        registerTitle: "ユーザー登録",
        loginTitle: "ログイン",
        registerButton: "登録",
        loginButton: "ログイン",
        modalClose: "閉じる",
        registrationSuccess: "ユーザー登録が成功しました。",
        registrationError: "登録に失敗しました。",
        loginSuccess: "ログイン成功",
        loginError: "ログインに失敗しました。",
        emailPlaceholder: "メールアドレス",
        passwordPlaceholder: "パスワード",
        loginemailPlaceholder: "メールアドレス",
        loginpasswordPlaceholder: "パスワード",
    }
};

// 現在の言語を設定
let currentLanguage = localStorage.getItem('language') || 'ja'; // デフォルトは日本語

// UIを更新する関数
export function updateLanguage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userEmail = auth.currentUser ? auth.currentUser.email : "ゲスト"; // ユーザー名を取得

    // ウェルカムメッセージの更新
    updateTextContent(welcomeMessage, languageData[currentLanguage].welcomeMessage.replace("{user}", userEmail));

    // 各要素の取得
    const minorInfoTitle = document.getElementById('minorInfoTitle');
    const vlogInfoTitle = document.getElementById('vlogInfoTitle');
    const addMinorButton = document.getElementById('addMinorInfoButton');
    const addVlogButton = document.getElementById('addVlogButton');
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
    const registerTitle = document.getElementById('registerTitle');
    const loginTitle = document.getElementById('loginTitle');
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
    const modalClose = document.getElementById('modalClose');
    const emailPlaceholder = document.getElementById('email');
    const passwordPlaceholder = document.getElementById('password');
        const loginemailPlaceholder = document.getElementById('loginEmail');
    const loginpasswordPlaceholder = document.getElementById('loginPassword');

    // 各要素のテキストを更新
    updateTextContent(minorInfoTitle, languageData[currentLanguage].minorInfo);
    updateTextContent(vlogInfoTitle, languageData[currentLanguage].vlogInfo);
    updateTextContent(registeredMinorsTitle, languageData[currentLanguage].registeredMinors);
    updateTextContent(registeredVlogsTitle, languageData[currentLanguage].registeredVlogs);
    updateTextContent(minorParticipantsTitle, languageData[currentLanguage].minorParticipants);
    updateTextContent(addMinorButton, languageData[currentLanguage].addMinor);
    updateTextContent(addVlogButton, languageData[currentLanguage].addVlog);
    updateTextContent(downloadCSVButton, languageData[currentLanguage].downloadCSV);
    updateTextContent(logoutButton, languageData[currentLanguage].logout);
    updateTextContent(vlogTitleLabel, languageData[currentLanguage].vlogTitle);
    updatePlaceholder(totalEarningsLabel, languageData[currentLanguage].totalEarnings);
    updatePlaceholder(totalDurationLabel, languageData[currentLanguage].totalDuration);
    updatePlaceholder(minorNameInput, languageData[currentLanguage].minorName);
    updateTextContent(minorAgeInput, languageData[currentLanguage].minorAge);
    updateTextContent(registerTitle, languageData[currentLanguage].registerTitle);
    updateTextContent(loginTitle, languageData[currentLanguage].loginTitle);
    updateTextContent(registerButton, languageData[currentLanguage].registerButton);
    updateTextContent(loginButton, languageData[currentLanguage].loginButton);
    updateTextContent(modalClose, languageData[currentLanguage].modalClose);

    // プレースホルダーの更新
    updatePlaceholder(minorAgeLabel, languageData[currentLanguage].minorAge);
    updatePlaceholder(document.getElementById('email'), languageData[currentLanguage].emailPlaceholder);
    updatePlaceholder(document.getElementById('password'), languageData[currentLanguage].passwordPlaceholder);
        updatePlaceholder(document.getElementById('loginEmail'), languageData[currentLanguage].loginemailPlaceholder);
    updatePlaceholder(document.getElementById('loginPassword'), languageData[currentLanguage].loginpasswordPlaceholder);
}

// テキストを更新する関数
function updateTextContent(element, text) {
    if (element) {
        element.innerText = text;
    }
}

// プレースホルダーを更新する関数
function updatePlaceholder(element, placeholder) {
    if (element) {
        element.placeholder = placeholder;
    }
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
