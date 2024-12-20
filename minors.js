import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // Firestoreのインポート
import { auth } from "./firebase.js"; // authのインポート
import { languageData, getCurrentLanguage } from "./language.js"; // 言語データのインポート

const { db } = initializeFirebase(); // Firebaseの初期化とdbの取得

export const minors = [];

// 未成年者のデータをFirestoreに追加する関数
export async function addMinorToFirestore(minor) {
    try {
        const docRef = await addDoc(collection(db, "minors"), minor);
        console.log("Document written with ID: ", docRef.id);
        return docRef; // 追加したドキュメントの参照を返す
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Firestoreから未成年者データを取得する関数
export async function fetchMinorsFromFirestore(userId) {
    try {
        const querySnapshot = await getDocs(collection(db, "minors"));
        minors.length = 0; // 配列をクリア
        querySnapshot.forEach((doc) => {
            const minor = doc.data();
            if (minor.userId === userId) { // ユーザーIDでフィルター
                minors.push(minor); // ローカルの minors 配列に追加
                displayMinor(minor); // 未成年者情報を表示
            }
        });
    } catch (error) {
        console.error("Error fetching minors: ", error);
    }
}

// 未成年者情報を表示する関数
function displayMinor(minor) {
    const currentLanguage = getCurrentLanguage();
    const checkboxContainer = document.getElementById('minorCheckboxContainer');
    
    // チェックボックスを生成
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'minor-checkbox';
    checkboxDiv.innerHTML = `
        <input type="checkbox" name="minorSelect" value="${minor.name}" id="${minor.name}">
        <label for="${minor.name}">${minor.name}</label>
        <input type="number" id="duration_${minor.name}" placeholder="${languageData[currentLanguage].adurationPlaceholder}" min="0">
    `;
    checkboxContainer.appendChild(checkboxDiv);

    // 登録された未成年者リストに追加
    const infoList = document.getElementById('infoList');
    const listItem = document.createElement('li');
    listItem.textContent = `${languageData[currentLanguage].aminorItemLabel} ${minor.name}, ${languageData[currentLanguage].aageLabel} ${minor.age}`;

    // 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = languageData[currentLanguage].delete; // 言語に応じた削除ボタンラベル
    deleteButton.classList.add('delete-button');

    // 削除ボタンのクリックイベント
    deleteButton.addEventListener('click', async () => {
        try {
            await deleteDoc(doc.ref); // Firestoreから未成年者データを削除
            infoList.removeChild(listItem);
            minors.splice(minors.indexOf(minor), 1); // 未成年者をローカル配列から削除
            checkboxContainer.removeChild(checkboxDiv); // チェックボックスも削除
        } catch (error) {
            console.error("未成年者の削除中にエラーが発生しました:", error);
        }
    });

    listItem.appendChild(deleteButton);
    infoList.appendChild(listItem);
}

// 未成年者の追加ボタンのイベントリスナーを設定
export function addMinorEventListener() {
    document.getElementById('addMinorInfoButton').addEventListener('click', async () => {
        const currentLanguage = getCurrentLanguage(); // 現在の言語を取得
        
        const minorItemLabel = languageData[currentLanguage].aminorItemLabel; // 取得
        const ageLabel = languageData[currentLanguage].aageLabel; // 取得
        const durationPlaceholder = languageData[currentLanguage].adurationPlaceholder; // 取得

        const name = document.getElementById('minorName').value;
        const age = document.getElementById('minorAge').value;

        if (!name || !age) {
            alert(languageData[currentLanguage].errorMessage); // 言語に応じたエラーメッセージ
            return;
        }

        const userId = auth.currentUser.uid; // 現在のユーザーIDを取得
        const createdDate = new Date().toISOString(); // 登録日を取得
        const minorId = `${userId}-${Date.now()}`; // ユニークな未成年者IDを生成

        const minor = { id: minorId, userId, name, age, createdDate, earnings: 0, vlogs: [] };
        minors.push(minor); // 未成年者を追加

        // Firestoreにデータを追加
        const docRef = await addMinorToFirestore(minor);

        // チェックボックスを生成
        const checkboxContainer = document.getElementById('minorCheckboxContainer');
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'minor-checkbox';
        checkboxDiv.innerHTML = `
            <input type="checkbox" name="minorSelect" value="${name}" id="${name}">
            <label for="${name}">${name}</label>
            <input type="number" id="duration_${name}" placeholder="${durationPlaceholder}" min="0">
        `;
        checkboxContainer.appendChild(checkboxDiv);

        // 登録された未成年者リストに追加
        const infoList = document.getElementById('infoList');
        const listItem = document.createElement('li');
        listItem.textContent = `${minorItemLabel} ${name}, ${ageLabel} ${age}`;

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = languageData[currentLanguage].delete; // 言語に応じた削除ボタンラベル
        deleteButton.classList.add('delete-button');

        // 削除ボタンのクリックイベント
        deleteButton.addEventListener('click', async () => {
            try {
                await deleteDoc(docRef); // Firestoreから未成年者データを削除
                infoList.removeChild(listItem);
                minors.splice(minors.indexOf(minor), 1); // 未成年者をローカル配列から削除
                checkboxContainer.removeChild(checkboxDiv); // チェックボックスも削除
            } catch (error) {
                console.error("未成年者の削除中にエラーが発生しました:", error);
            }
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem);

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
}

// 言語を切り替える関数
export function setLanguage(lang) {
    if (languageData[lang]) {
        currentLanguage = lang;
        updateLanguage(); // UIを更新
        refreshMinors(); // 未成年者情報を再表示
    }
}

// UIを更新する関数
export function updateLanguage() {
    const currentLanguage = getCurrentLanguage();
    
    // 言語に基づいて各要素を更新
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.innerText = languageData[currentLanguage].delete; // 削除ボタンのラベルを更新
    });
    
    // 各未成年者リストのラベルを更新
    const infoList = document.getElementById('infoList');
    const listItems = infoList.querySelectorAll('li');
    listItems.forEach((item, index) => {
        const minor = minors[index];
        if (minor) {
            item.textContent = `${languageData[currentLanguage].aminorItemLabel} ${minor.name}, ${languageData[currentLanguage].aageLabel} ${minor.age}`;
        }
    });
    
    // チェックボックスのプレースホルダーを更新
    const durationInputs = document.querySelectorAll('input[type="number"]');
    durationInputs.forEach(input => {
        input.placeholder = languageData[currentLanguage].adurationPlaceholder; // プレースホルダーを更新
    });
}
