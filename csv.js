import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeFirebase } from "./firebase.js";

const { db } = initializeFirebase(); // Firebaseの初期化とdbの取得

// CSV出力の関数
export async function downloadCSV(userId) {
    try {
        // Firestoreから未成年者データを取得
        const minorsSnapshot = await getDocs(collection(db, "minors"));
        const minors = minorsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(minor => minor.userId === userId); // userIdでフィルター

        // Firestoreからブイログデータを取得
        const vlogsSnapshot = await getDocs(collection(db, "vlogs"));
        const vlogs = vlogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // CSVのヘッダーを定義
        const minorsHeader = '名前,年齢,収益,出演ブイログ\n';
        const vlogsHeader = 'タイトル,総収益,総出演時間,出演未成年者\n';

        // 未成年者のデータをCSV形式に変換
        const minorsCSV = minors.map(minor => 
            `${minor.name},${minor.age},${minor.earnings},${minor.vlogs.join('; ')}`
        ).join('\n');

        // ブイログのデータをCSV形式に変換
        const vlogsCSV = vlogs.map(vlog => 
            `${vlog.title},${vlog.totalEarnings},${vlog.totalDuration},${vlog.minors.join('; ')}`
        ).join('\n');

        // CSVコンテンツを作成
        const csvContent = `${minorsHeader}${minorsCSV}\n\n${vlogsHeader}${vlogsCSV}`;

        // CSVファイルを生成してダウンロード
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'data.csv');
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("CSV出力中にエラーが発生しました:", error);
    }
}

// CSV出力ボタンを設定
export function setupCSVDownload(userId) {
    const downloadButton = document.getElementById('downloadCSVButton');

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            downloadCSV(userId);
        });
    } else {
        console.error("Download button not found.");
    }
}
