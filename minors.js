import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { auth } from "./firebase.js";
import { languageData } from "./language.js";

export const minors = []; // 未成年者の配列をエクスポート

class MinorManager {
    constructor() {
        this.db = initializeFirebase().db;
        this.currentLanguage = 'ja'; // 初期言語の設定
        this.init();
    }

    async init() {
        if (!auth.currentUser) {
            console.error("User is not authenticated.");
            return; // ユーザーが認証されていない場合は処理を中止
        }

        const userId = auth.currentUser.uid;
        await this.fetchMinorsFromFirestore(userId);
        this.setupEventListeners();
    }

    async fetchMinorsFromFirestore(userId) {
        try {
            const querySnapshot = await getDocs(collection(this.db, "minors"));
            minors.length = 0; // 配列をクリア
            querySnapshot.forEach((doc) => {
                const minor = doc.data();
                if (minor.userId === userId) {
                    minors.push({ ...minor, id: doc.id });
                    this.displayMinor(minor, doc.id);
                }
            });
        } catch (error) {
            console.error("Error fetching minors: ", error);
        }
    }

    displayMinor(minor, docId) {
        const checkboxContainer = document.getElementById('minorCheckboxContainer');
        const listItem = this.createMinorListItem(minor, docId);

        checkboxContainer.appendChild(listItem.checkboxDiv);
        document.getElementById('infoList').appendChild(listItem.listItem);
    }

    createMinorListItem(minor, docId) {
        const currentLanguage = this.currentLanguage;
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'minor-checkbox';
        checkboxDiv.innerHTML = `
            <input type="checkbox" name="minorSelect" value="${minor.name}" id="${minor.name}">
            <label for="${minor.name}">${minor.name}</label>
            <input type="number" id="duration_${minor.name}" placeholder="${languageData[currentLanguage].adurationPlaceholder}" min="0">
        `;

        const listItem = document.createElement('li');
        listItem.textContent = `${languageData[currentLanguage].aminorItemLabel} ${minor.name}, ${languageData[currentLanguage].aageLabel} ${minor.age}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = languageData[currentLanguage].delete;
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', async () => {
            await this.deleteMinor(docId, listItem, checkboxDiv);
        });

        listItem.appendChild(deleteButton);
        return { checkboxDiv, listItem };
    }

    async deleteMinor(docId, listItem, checkboxDiv) {
        try {
            await deleteDoc(docId);
            document.getElementById('infoList').removeChild(listItem);
            document.getElementById('minorCheckboxContainer').removeChild(checkboxDiv);
        } catch (error) {
            console.error("Error deleting minor: ", error);
            alert(languageData[this.currentLanguage].errorMessage);
        }
    }

    async addMinor(name, age) {
        const userId = auth.currentUser.uid;
        const minorId = `${userId}-${Date.now()}`;
        const minor = { id: minorId, userId, name, age, createdDate: new Date().toISOString() };

        try {
            const docRef = await addDoc(collection(this.db, "minors"), minor);
            minors.push({ ...minor, id: docRef.id });
            this.displayMinor(minor, docRef.id);
            this.clearInputFields();
        } catch (error) {
            console.error("Error adding minor: ", error);
            alert(languageData[this.currentLanguage].errorMessage);
        }
    }

    clearInputFields() {
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    }

    setupEventListeners() {
        document.getElementById('addMinorInfoButton').addEventListener('click', () => {
            const name = document.getElementById('minorName').value.trim();
            const age = document.getElementById('minorAge').value.trim();

            if (!name || !age) {
                alert(languageData[this.currentLanguage].errorMessage);
                return;
            }

            this.addMinor(name, age);
        });

        document.getElementById('languageToggle').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
    }

    setLanguage(lang) {
        if (languageData[lang]) {
            this.currentLanguage = lang;
            this.updateLanguage();
        }
    }

    updateLanguage() {
        const currentLanguage = this.currentLanguage;
        const infoList = document.getElementById('infoList');
        const listItems = infoList.querySelectorAll('li');

        listItems.forEach((item, index) => {
            const minor = minors[index];
            if (minor) {
                item.textContent = `${languageData[currentLanguage].aminorItemLabel} ${minor.name}, ${languageData[currentLanguage].aageLabel} ${minor.age}`;
            }
        });

        const durationInputs = document.querySelectorAll('input[type="number"]');
        durationInputs.forEach(input => {
            input.placeholder = languageData[currentLanguage].adurationPlaceholder;
        });

        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.innerText = languageData[currentLanguage].delete;
        });

        // 新しいコンテナに三要素を表示
        this.updateMinorDisplay();
    }


    setupEventListeners() {
    document.getElementById('addMinorInfoButton').addEventListener('click', () => {
        const name = document.getElementById('minorName').value.trim();
        const age = document.getElementById('minorAge').value.trim();

        if (!name || !age) {
            alert(languageData[this.currentLanguage].errorMessage);
            return;
        }

        this.addMinor(name, age);
    });

    document.getElementById('languageToggle').addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
    });
}


    updateMinorDisplay() {
        const displayContainer = document.getElementById('minorDisplay');
        displayContainer.innerHTML = ''; // クリア

        minors.forEach(minor => {
            const minorInfo = document.createElement('div');
            minorInfo.textContent = `
                ${languageData[this.currentLanguage].aminorItemLabel} ${minor.name}, 
                ${languageData[this.currentLanguage].aageLabel} ${minor.age}, 
                ${languageData[this.currentLanguage].adurationPlaceholder}
            `;
            displayContainer.appendChild(minorInfo);
        });
    }
}

export default MinorManager;
