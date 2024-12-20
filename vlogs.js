import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { minors } from "./minors.js";
import { languageData } from "./language.js";

export const vlogs = [];

// 収益化ブイログ情報をFirestoreに追加する関数
export async function addVlogToFirestore(vlog) {
    try {
        const docRef = await addDoc(collection(db, "vlogs"), vlog);
        console.log("Vlog added with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding vlog: ", e);
    }
}

// 収益化ブイログ情報を追加するイベントリスナー
export function addVlogEventListener() {
    document.getElementById('addVlogInfoButton').addEventListener('click', async () => {
        const vlogTitle = document.getElementById('vlogTitle').value.trim();
        const totalEarnings = parseFloat(document.getElementById('totalEarnings').value);
        const totalDuration = parseFloat(document.getElementById('totalDuration').value);

        // バリデーション
        if (!vlogTitle || isNaN(totalEarnings) || isNaN(totalDuration) || totalDuration <= 0) {
            alert("すべてのフィールドを正しく入力してください。");
            return;
        }

        const selectedMinors = Array.from(document.querySelectorAll('input[name="minorSelect"]:checked')).map(input => input.value);
        const selectedDurations = selectedMinors.map(minorName => parseFloat(document.getElementById(`duration_${minorName}`).value));

        const vlog = { title: vlogTitle, totalEarnings, totalDuration, minors: selectedMinors, selectedDurations };

        // Firestoreに新しいコレクション「vlogs」を作成し、データを追加
        await addVlogToFirestore(vlog);
        vlogs.push(vlog); // ローカルのvlogs配列に追加

        // 各未成年者の収益を計算
        selectedMinors.forEach((minorName, index) => {
            const minor = minors.find(m => m.name === minorName);
            const individualDuration = selectedDurations[index];
            let earnings;

            if (selectedMinors.length === 1) {
                earnings = (individualDuration / totalDuration) < 0.5 ? 0 : totalEarnings * (individualDuration / totalDuration);
            } else {
                earnings = totalEarnings / selectedMinors.length;
            }

            // 各未成年者の収益を加算
            minor.earnings = (minor.earnings || 0) + earnings;
            minor.vlogs = minor.vlogs || [];
            minor.vlogs.push(vlogTitle);
        });

        // 結果を表示
        displayVlogInfo(vlog);

        // 入力フィールドをクリア
        document.getElementById('vlogTitle').value = '';
        document.getElementById('totalEarnings').value = '';
        document.getElementById('totalDuration').value = '';
        selectedMinors.forEach(minorName => {
            document.getElementById(`duration_${minorName}`).value = '';
        });
    });
}

// 結果を表示する関数
function displayVlogInfo(vlog) {
    const vlogList = document.getElementById('vlogList');
    const vlogItem = document.createElement('li');
    vlogItem.textContent = `ブイログタイトル: ${vlog.title}, 総収益: ¥${vlog.totalEarnings}, 出演未成年者: ${vlog.minors.join(', ')}`;
    
    vlogList.appendChild(vlogItem);
}
