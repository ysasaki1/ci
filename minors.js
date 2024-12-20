import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { languageData } from "./language.js";

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

                // チェックボックスを生成
                const checkboxContainer = document.getElementById('minorCheckboxContainer');
                const checkbox = document.createElement('div');
                checkbox.className = 'minor-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="minorSelect" value="${minor.name}" id="${minor.name}">
                    <label for="${minor.name}">${minor.name}</label>
                    <input type="number" id="duration_${minor.name}" placeholder="${languageData[currentLanguage].durationPlaceholder}" min="0">
                `;
                checkboxContainer.appendChild(checkbox);

                // 登録された未成年者リストに追加
                const infoList = document.getElementById('infoList');
                const listItem = document.createElement('li');
                listItem.textContent = `${languageData[currentLanguage].minorItemLabel}${minor.name}, ${languageData[currentLanguage].ageLabel}${minor.age}`;

                // 削除ボタンを作成
                const deleteButton = document.createElement('button');
                deleteButton.textContent = languageData[currentLanguage].delete;
                deleteButton.classList.add('delete-button');

                // 削除ボタンのクリックイベント
                deleteButton.addEventListener('click', async () => {
                    try {
                        await deleteDoc(doc.ref); // Firestoreから未成年者データを削除
                        infoList.remove
