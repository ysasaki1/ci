import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // Firestoreのインポート
import { auth } from "./firebase.js"; // authのインポート
import { languageData, getCurrentLanguage } from "./language.js"; // 言語データのインポート

const { db } = initializeFirebase(); // Firebaseの初期化とdbの取得

export const minors = [];

// 新しい変数を定義
const minorLabelJa = "未成年者: ";
const ageLabelJa = "年齢: ";
const durationPlaceholderJa = "出演時間 (分)";

const minorLabelEn = "Minor: ";
const ageLabelEn = "Age: ";
const durationPlaceholderEn = "Duration (minutes)";

// 現在の言語に応じたラベルを取得する関数
function getLabels() {
    const currentLanguage = getCurrentLanguage();
    if (currentLanguage === "ja") {
        return {
            minorLabel: minorLabelJa,
            ageLabel: ageLabelJa,
            durationPlaceholder: durationPlaceholderJa,
        };
    } else {
        return {
            minorLabel: minorLabelEn,
            ageLabel: ageLabelEn,
            durationPlaceholder: durationPlaceholderEn,
        };
    }
}

import { getDocs, addDoc, deleteDoc, doc, collection } from "firebase/firestore"; // Firestore関連のインポート
import { db, auth } from "./firebase.js"; // Firebaseの初期化をインポート
import { getCurrentLanguage, languageData, getLabels } from "./language.js"; // 言語関連のインポート

const minors = []; // 未成年者データを格納する配列

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

        // 既存のリストをクリア
        const infoList = document.getElementById('infoList');
        infoList.innerHTML = ''; // ここでリストをクリア

        querySnapshot.forEach((doc) => {
            const minor = doc.data();
            if (minor.userId === userId) { // ユーザーIDでフィルター
                minors.push({ ...minor, id: doc.id }); // ドキュメントIDを追加
                displayMinor(minor, doc.id); // 未成年者情報を表示
            }
        });
    } catch (error) {
        console.error("Error fetching minors: ", error);
    }
}

// 未成年者情報を表示する関数
function displayMinor(minor, docId) {
    const labels = getLabels(); // 現在の言語に応じたラベルを取得
    const checkboxContainer = document.getElementById('minorCheckboxContainer');

    // チェックボックスを生成
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'minor-checkbox';
    checkboxDiv.innerHTML = `
        <input type="checkbox" name="minorSelect" value="${minor.name}" id="${minor.name}">
        <label for="${minor.name}">${minor.name}</label>
        <input type="number" id="duration_${minor.name}" placeholder="${labels.durationPlaceholder}" min="0">
    `;
    checkboxContainer.appendChild(checkboxDiv);

    // 登録された未成年者リストに追加
    const infoList = document.getElementById('infoList');
    const listItem = document.createElement('li');
    listItem.textContent = `${labels.minorLabel} ${minor.name}, ${labels.ageLabel} ${minor.age}`;

    // 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = languageData[getCurrentLanguage()].delete; // 言語に応じた削除ボタンラベル
    deleteButton.classList.add('delete-button');

    // 削除ボタンのクリックイベント
    deleteButton.addEventListener('click', async () => {
        try {
            await deleteDoc(doc(db, "minors", docId)); // Firestoreから未成年者データを削除
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

        const name = document.getElementById('minorName').value.trim();
        const age = document.getElementById('minorAge').value.trim();

        // バリデーション
        if (!name || !age) {
            alert(languageData[currentLanguage].errorMessage); // エラーメッセージを言語に応じて表示
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
        const labels = getLabels(); // 新しいラベルを取得
        checkboxDiv.innerHTML = `
            <input type="checkbox" name="minorSelect" value="${name}" id="${name}">
            <label for="${name}">${name}</label>
            <input type="number" id="duration_${name}" placeholder="${labels.durationPlaceholder}" min="0">
        `;
        checkboxContainer.appendChild(checkboxDiv);

        // 登録された未成年者リストに追加
        const infoList = document.getElementById('infoList');
        const listItem = document.createElement('li');
        listItem.textContent = `${labels.minorLabel} ${name}, ${labels.ageLabel} ${age}`;

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
                alert(languageData[currentLanguage].errorMessage); // エラー時にユーザーへのフィードバック
            }
        });

        // リストアイテムにボタンを追加
        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem);

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
}

// 各要素のテキストを一括更新
export function updateUI() {
    const currentLanguage = getCurrentLanguage();
    const infoList = document.getElementById('infoList');
    const listItems = infoList.querySelectorAll('li');

    listItems.forEach((item, index) => {
        const minor = minors[index];
        if (minor) {
            const labels = getLabels(); // ラベルを取得
            item.textContent = `${labels.minorLabel} ${minor.name}, ${labels.ageLabel} ${minor.age}`;
        }
    });

    // チェックボックスのプレースホルダーを更新
    const durationInputs = document.querySelectorAll('input[type="number"]');
    durationInputs.forEach(input => {
        input.placeholder = getLabels().durationPlaceholder; // プレースホルダーを更新
    });

    // 削除ボタンのラベルを更新
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.innerText = languageData[currentLanguage].delete; // 削除ボタンのラベルを更新
    });
}
