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
        minorItemLabel: "Minor: ",
        ageLabel: "Age: ",
        durationPlaceholder: "Duration (minutes)",
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
        minorItemLabel: "未成年者: ",
        ageLabel: "年齢: ",
        durationPlaceholder: "出演時間 (分)",
    }
};

// 現在の言語を設定
let currentLanguage = 'ja'; // 初期言語

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
    if (welcomeMessage) {
        const userEmail = auth.currentUser ? auth.currentUser.email : "";
        welcomeMessage.innerText = currentLanguage === 'ja' 
            ? `ようこそ, ${userEmail}さん！` 
            : `Welcome, ${userEmail}!`;
    }
    if (minorInfoTitle) {
        minorInfoTitle.innerText = languageData[currentLanguage].minorInfo;
    }
    if (vlogInfoTitle) {
        vlogInfoTitle.innerText = languageData[currentLanguage].vlogInfo;
    }
    if (minorParticipantsTitle) {
        minorParticipantsTitle.innerText = languageData[currentLanguage].minorParticipants;
    }
    if (addMinorButton) {
        addMinorButton.innerText = languageData[currentLanguage].addMinor;
    }
    if (addVlogButton) {
        addVlogButton.innerText = languageData[currentLanguage].addVlog;
    }
    if (downloadCSVButton) {
        downloadCSVButton.innerText = languageData[currentLanguage].downloadCSV;
    }
    if (logoutButton) {
        logoutButton.innerText = languageData[currentLanguage].logout;
    }

    // プレースホルダーのテキスト更新
    if (vlogTitleLabel) {
        vlogTitleLabel.placeholder = languageData[currentLanguage].vlogTitle;
    }
    if (totalEarningsLabel) {
        totalEarningsLabel.placeholder = languageData[currentLanguage].totalEarnings;
    }
    if (totalDurationLabel) {
        totalDurationLabel.placeholder = languageData[currentLanguage].totalDuration;
    }
    if (registeredMinorsTitle) {
        registeredMinorsTitle.innerText = languageData[currentLanguage].registeredMinors;
    }
    if (registeredVlogsTitle) {
        registeredVlogsTitle.innerText = languageData[currentLanguage].registeredVlogs;
    }
    if (minorNameInput) {
        minorNameInput.placeholder = languageData[currentLanguage].minorName;
    }
    if (minorAgeInput) {
        minorAgeInput.placeholder = languageData[currentLanguage].minorAge;
    }

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
        updateLanguage();
    }
}
