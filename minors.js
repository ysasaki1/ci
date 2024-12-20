import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // getDocsをインポート
import { auth } from "./firebase.js"; // authをインポート
import { languageData } from "./language.js";

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
        const querySnapshot = await getDocs(collection(db, "minors")); // getDocsを使用
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
                    <input type="number" id="duration_${minor.name}" placeholder="期間" min="0">
                `;
                checkboxContainer.appendChild(checkbox);

                // 登録された未成年者リストに追加
                const infoList = document.getElementById('infoList');
                const listItem = document.createElement('li');
                listItem.textContent = `未成年者: ${minor.name}, 年齢: ${minor.age}`;

                // 削除ボタンを作成
                const deleteButton = document.createElement('button');
                deleteButton.textContent = "削除"; // 削除ボタンラベル
                deleteButton.classList.add('delete-button');

                // 削除ボタンのクリックイベント
                deleteButton.addEventListener('click', async () => {
                    try {
                        await deleteDoc(doc.ref); // Firestoreから未成年者データを削除
                        infoList.removeChild(listItem);
                        minors.splice(minors.indexOf(minor), 1); // 未成年者をローカル配列から削除
                        checkboxContainer.removeChild(checkbox); // チェックボックスも削除
                    } catch (error) {
                        console.error("未成年者の削除中にエラーが発生しました:", error);
                    }
                });

                listItem.appendChild(deleteButton);
                infoList.appendChild(listItem);
            }
        });
    } catch (error) {
        console.error("Error fetching minors: ", error);
    }
}

// 未成年者の追加ボタンのイベントリスナーを設定
export function addMinorEventListener() {
    document.getElementById('addMinorInfoButton').addEventListener('click', async () => {
        const name = document.getElementById('minorName').value;
        const age = document.getElementById('minorAge').value;

        if (!name || !age) {
            alert("名前と年齢を入力してください。");
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
            <input type="number" id="duration_${name}" placeholder="期間" min="0">
        `;
        checkboxContainer.appendChild(checkbox);

        // 登録された未成年者リストに追加
        const infoList = document.getElementById('infoList');
        const listItem = document.createElement('li');
        listItem.textContent = `未成年者: ${name}, 年齢: ${age}`;

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "削除"; // 言語に応じた削除ボタンラベル
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
        infoList.appendChild(listItem);

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
}
