import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // getDocsをインポート
import { auth } from "./firebase.js"; // authをインポート
import { languageData, getCurrentLanguage } from "./language.js"; // 言語データをインポート

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
        querySnapshot.forEach((doc) => {
            const minor = doc.data();
            if (minor.userId === userId) { // ユーザーIDでフィルター
                minors.push(minor); // ローカルの minors 配列に追加
            }
        });
        displayMinors(); // 取得したデータを表示
    } catch (error) {
        console.error("Error fetching minors: ", error);
    }
}

// 登録された未成年者情報を表示する関数
export function displayMinors() {
    const infoList = document.getElementById('infoList');
    infoList.innerHTML = ""; // 既存のリストをクリア

    const currentLanguage = getCurrentLanguage(); // 現在の言語を取得

    // Minor Participantsのタイトルを表示
    const title = document.createElement('h3');
    title.textContent = languageData[currentLanguage].minorParticipants; // 言語に応じたタイトル
    infoList.appendChild(title);

    minors.forEach(minor => {
        const listItem = document.createElement('li');
        listItem.textContent = `${languageData[currentLanguage].minorItemLabel} ${minor.name}, ${languageData[currentLanguage].ageLabel} ${minor.age}`; // 言語に応じた表示

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
            } catch (error) {
                console.error("未成年者の削除中にエラーが発生しました:", error);
            }
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem); // 言語に応じた内容を持つリストアイテムを追加
    });
}

// 未成年者の追加ボタンのイベントリスナーを設定
export function addMinorEventListener() {
    document.getElementById('addMinorInfoButton').addEventListener('click', async () => {
        const name = document.getElementById('minorName').value;
        const age = document.getElementById('minorAge').value;

        if (!name || !age) {
            // 言語に応じたエラーメッセージを表示
            alert(languageData[getCurrentLanguage()].errorMessage); 
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
        const checkbox = document.createElement('div');
        checkbox.className = 'minor-checkbox';
        checkbox.innerHTML = `
            <input type="checkbox" name="minorSelect" value="${name}" id="${name}">
            <label for="${name}">${name}</label>
            <input type="number" id="duration_${name}" placeholder="${languageData[getCurrentLanguage()].durationPlaceholder}" min="0"> <!-- 言語に応じたプレースホルダー -->
        `;
        checkboxContainer.appendChild(checkbox);

        // 登録された未成年者リストに追加
        const infoList = document.getElementById('infoList');
        const listItem = document.createElement('li');
        // 言語に応じた表示
        listItem.textContent = `${languageData[getCurrentLanguage()].minorItemLabel} ${name}, ${languageData[getCurrentLanguage()].ageLabel} ${age}`;

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        // 言語に応じた削除ボタンラベル
        deleteButton.textContent = languageData[getCurrentLanguage()].delete; 
        deleteButton.classList.add('delete-button');

        // 削除ボタンのクリックイベント
        deleteButton.addEventListener('click', async () => {
            try {
                await deleteDoc(docRef); // Firestoreから未成年者データを削除
                infoList.removeChild(listItem);
                minors.splice(minors.indexOf(minor), 1); // 未成年者をローカル配列から削除
                checkboxContainer.removeChild(checkbox); // チェックボックスも削除
            } catch (error) {
                console.error("未成年者の削除中にエラーが発生しました:", error);
            }
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem); // 言語に応じた内容を持つリストアイテムを追加

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
}
