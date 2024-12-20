import { initializeFirebase } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { languageData, getCurrentLanguage } from "./language.js"; // 言語データをインポート
import { auth } from "./firebase.js"; // authをインポート

const { db } = initializeFirebase(); // Firebaseの初期化とdbの取得

// データを格納するオブジェクト
export const data = {
    vlogs: [],
    minors: []
};

// 収益化ブイログ情報をFirestoreに追加する関数
export async function addVlogToFirestore(vlog) {
    try {
        const docRef = await addDoc(collection(db, "vlogs"), vlog);
        console.log("Vlog added with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding vlog: ", e);
    }
}

// 収益化ブイログ情報をFirestoreから取得する関数
export async function fetchVlogsFromFirestore() {
    try {
        const querySnapshot = await getDocs(collection(db, "vlogs"));
        data.vlogs = []; // 配列をクリア
        querySnapshot.forEach((doc) => {
            data.vlogs.push({ id: doc.id, ...doc.data() });
        });
        return data.vlogs; // 取得したデータを返す
    } catch (error) {
        console.error("Error fetching vlogs: ", error);
    }
}

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
        data.minors = []; // 配列をクリア
        querySnapshot.forEach((doc) => {
            const minor = doc.data();
            if (minor.userId === userId) {
                data.minors.push({ ...minor, id: doc.id }); // IDを含めてローカルの配列に追加
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

    data.minors.forEach(minor => {
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
                data.minors.splice(data.minors.indexOf(minor), 1); // 未成年者をローカル配列から削除
            } catch (error) {
                console.error("未成年者の削除中にエラーが発生しました:", error);
            }
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem); // リストに追加
    });
}

// 収益化ブイログ情報を追加するイベントリスナー
export function addVlogEventListener() {
    document.getElementById('addVlogInfoButton').addEventListener('click', async () => {
        const vlogTitle = document.getElementById('vlogTitle').value.trim();
        const totalEarnings = parseFloat(document.getElementById('totalEarnings').value);
        const totalDuration = parseFloat(document.getElementById('totalDuration').value);

        // バリデーション
        if (!vlogTitle || isNaN(totalEarnings) || isNaN(totalDuration) || totalDuration <= 0) {
            alert(languageData[getCurrentLanguage()].errorMessage); // エラーメッセージを言語に応じて表示
            return;
        }

        const selectedMinors = Array.from(document.querySelectorAll('input[name="minorSelect"]:checked')).map(input => input.value);
        const selectedDurations = selectedMinors.map(minorName => parseFloat(document.getElementById(`duration_${minorName}`).value));

        const vlog = { title: vlogTitle, totalEarnings, totalDuration, minors: selectedMinors, selectedDurations };

        // Firestoreに新しいコレクション「vlogs」を作成し、データを追加
        await addVlogToFirestore(vlog);
        data.vlogs.push(vlog); // ローカルのvlogs配列に追加

        // 結果を表示
        displayVlogInfo(vlog);

        // 入力フィールドをクリア
        document.getElementById('vlogTitle').value = '';
        document.getElementById('totalEarnings').value = '';
        document.getElementById('totalDuration').value = '';
        selectedMinors.forEach(minorName => {
            document.getElementById(`duration_${minorName}`).value = '';
        });

        // Firestore からのブイログを再読み込みして表示
        const allVlogs = await fetchVlogsFromFirestore();
        displayVlogs(allVlogs); // すべてのブイログを表示
    });
}

// 結果を表示する関数
function displayVlogInfo(vlog) {
    const vlogList = document.getElementById('vlogList');
    const currentLanguage = getCurrentLanguage(); // 現在の言語を取得

    const minorsText = vlog.minors && vlog.minors.length > 0 
        ? vlog.minors.join(', ') 
        : languageData[currentLanguage].registeredMinors; // 未成年者がいない場合のテキスト

    const vlogItem = document.createElement('li');
    vlogItem.textContent = `${languageData[currentLanguage].vlogTitle}: ${vlog.title}, ${languageData[currentLanguage].totalEarnings}: ¥${vlog.totalEarnings}, ${languageData[currentLanguage].registeredMinors}: ${minorsText}`;
    
    vlogList.appendChild(vlogItem);
}
