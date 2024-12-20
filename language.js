import { auth } from "./firebase.js"; // authをインポート

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

    // 追加: aminorItemLabel, aageLabel, adurationPlaceholder の更新
    const aminorItemLabel = document.getElementById('aminorItemLabel');
    const aageLabel = document.getElementById('aageLabel');
    const adurationPlaceholder = document.getElementById('adurationPlaceholder');

    updateTextContent(aminorItemLabel, languageData[currentLanguage].aminorItemLabel);
    updateTextContent(aageLabel, languageData[currentLanguage].aageLabel);
    updatePlaceholder(adurationPlaceholder, languageData[currentLanguage].adurationPlaceholder);

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

// 現在の言語を取得する関数
export function getCurrentLanguage() {
    return currentLanguage;
}
