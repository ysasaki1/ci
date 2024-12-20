import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { languageData, getCurrentLanguage } from "./language.js"; // 言語データをインポート
import { auth } from "./firebase.js"; // authをインポート

const { db } = initializeFirebase(); // Firebaseの初期化とdbの取得

export const minors = [];

// 未成年者のデータをFirestoreに追加する関数
export async function addMinorToFirestore(minor) {
    try {
        const docRef = await addDoc(collection(db, "minors"), minor);
        console.log("Minor added with ID: ", docRef.id);
        return docRef; // 追加したドキュメントの参照を返す
    } catch (e) {
        console.error("Error adding minor: ", e);
    }
}

// Firestoreから未成年者データを取得する関数
export async function fetchMinorsFromFirestore(userId) {
    try {
        const querySnapshot = await getDocs(collection(db, "minors"));
        minors.length = 0; // 配列をクリア
        querySnapshot.forEach((doc) => {
            const minor = doc.data();
            if (minor.userId === userId) {
                minors.push({ ...minor, id: doc.id }); // IDを含めてローカルの配列に追加
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

    // 未成年者情報をリスト表示
    minors.forEach(minor => {
        const listItem = document.createElement('li');
        listItem.textContent = `${languageData[currentLanguage].minorItemLabel} ${minor.name}, ${languageData[currentLanguage].ageLabel} ${minor.age}`;

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
        infoList.appendChild(listItem); // リストに追加
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

        const minor = { userId, name, age, createdDate }; // 未成年者オブジェクトを作成
        minors.push(minor); // 未成年者をローカル配列に追加

        // Firestoreにデータを追加
        const docRef = await addMinorToFirestore(minor);

        // リストに追加
        displayMinors(); // 再表示して最新の情報を反映

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
}
