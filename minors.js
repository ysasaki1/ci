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
            if (minor.userId === userId) {
                minors.push({ ...minor, id: doc.id });
            }
        });
        displayMinors();
    } catch (error) {
        console.error("Error fetching minors: ", error);
    }
}

// 登録された未成年者情報を表示する関数
export function displayMinors() {
    const infoList = document.getElementById('infoList');
    infoList.innerHTML = "";

    const currentLanguage = getCurrentLanguage();

    const title = document.createElement('h3');
    title.textContent = languageData[currentLanguage].minorParticipants;
    infoList.appendChild(title);

    minors.forEach(minor => {
        const listItem = document.createElement('li');
        listItem.textContent = `${languageData[currentLanguage].minorItemLabel} ${minor.name}, ${languageData[currentLanguage].ageLabel} ${minor.age}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = languageData[currentLanguage].delete;
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', async () => {
            try {
                await deleteDoc(collection(db, "minors").doc(minor.id));
                infoList.removeChild(listItem);
                minors.splice(minors.indexOf(minor), 1);
            } catch (error) {
                console.error("未成年者の削除中にエラーが発生しました:", error);
            }
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem);
    });
}

// 未成年者の追加ボタンのイベントリスナーを設定
export function addMinorEventListener() {
    document.getElementById('addMinorInfoButton').addEventListener('click', async () => {
        const name = document.getElementById('minorName').value;
        const age = document.getElementById('minorAge').value;

        if (!name || !age) {
            alert(languageData[getCurrentLanguage()].errorMessage); 
            return;
        }

        const userId = auth.currentUser.uid; 
        const createdDate = new Date().toISOString(); 
        const minorId = `${userId}-${Date.now()}`;

        const minor = { id: minorId, userId, name, age, createdDate, earnings: 0, vlogs: [] };
        
        const docRef = await addMinorToFirestore(minor);
        minors.push({ ...minor, id: docRef.id });

        const checkboxContainer = document.getElementById('minorCheckboxContainer');
        const checkbox = document.createElement('div');
        checkbox.className = 'minor-checkbox';
        checkbox.innerHTML = `
            <input type="checkbox" name="minorSelect" value="${name}" id="${name}">
            <label for="${name}">${name}</label>
            <input type="number" id="duration_${name}" placeholder="${languageData[getCurrentLanguage()].durationPlaceholder}" min="0"> <!-- プレースホルダーを設定 -->
        `;
        checkboxContainer.appendChild(checkbox);

        const infoList = document.getElementById('infoList');
        const listItem = document.createElement('li');
        listItem.textContent = `${languageData[getCurrentLanguage()].minorItemLabel} ${name}, ${languageData[getCurrentLanguage()].ageLabel} ${age}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = languageData[getCurrentLanguage()].delete;
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', async () => {
            try {
                await deleteDoc(docRef);
                infoList.removeChild(listItem);
                minors.splice(minors.indexOf(minor), 1);
                checkboxContainer.removeChild(checkbox);
            } catch (error) {
                console.error("未成年者の削除中にエラーが発生しました:", error);
            }
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem);

        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
}
