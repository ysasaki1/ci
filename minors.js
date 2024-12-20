import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { auth } from "./firebase.js";
import { languageData, getCurrentLanguage } from "./language.js";

const { db } = initializeFirebase();
export const minors = [];

// 未成年者のデータをFirestoreに追加する関数
export async function addMinorToFirestore(minor) {
    try {
        const docRef = await addDoc(collection(db, "minors"), minor);
        console.log("Document written with ID: ", docRef.id);
        return docRef;
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
        displayMinor(minor); // 新しい未成年者を表示

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
}
