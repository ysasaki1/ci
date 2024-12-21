import { fetchMinorsFromFirestore } from "./minors.js"; // 未成年者データを取得する関数をインポート
import { fetchVlogsFromFirestore } from "./vlogs.js"; // ブイログデータを取得する関数をインポート
import { initializeFirebase } from "./firebase.js";

const { db } = initializeFirebase(); // Firebaseの初期化とdbの取得

// CSV出力の関数
export async function downloadCSV(userId) {
    try {
        // Firestoreから未成年者データを取得
        const minors = await fetchMinorsFromFirestore(userId);
        console.log("Fetched Minors:", minors); // デバッグ用ログ

        // Firestoreからブイログデータを取得
        const vlogs = await fetchVlogsFromFirestore();
        console.log("Fetched Vlogs:", vlogs); // デバッグ用ログ

        // CSVのヘッダーを定義
        const minorsHeader = '名前,年齢,収益,出演ブイログ\n';
        const vlogsHeader = 'タイトル,総収益,総出演時間,出演未成年者\n';

        // 未成年者のデータをCSV形式に変換
        const minorsCSV = minors.map(minor => {
            return `${minor.name},${minor.age},${minor.earnings},${minor.vlogs.join('; ')}`;
        }).join('\n');

        // ブイログのデータをCSV形式に変換
        const vlogsCSV = vlogs.map(vlog => {
            const minorsText = vlog.minors.join(', ');
            return `${vlog.title},${vlog.totalEarnings},${vlog.totalDuration},${minorsText}`;
        }).join('\n');

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
    document.getElementById('downloadCSVButton').addEventListener('click', () => {
        downloadCSV(userId); // userIdを渡してCSVダウンロードを実行
    });
}
