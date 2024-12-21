// CSV出力機能を管理するファイル
import { fetchMinorsFromFirestore } from './minors.js'; // 未成年者データを取得する関数をインポート
import { fetchVlogsFromFirestore } from './vlogs.js'; // ブイログデータを取得する関数をインポート

// CSV出力の関数
export async function downloadCSV(userId) {
    // 未成年者データを取得
    const minors = await fetchMinorsFromFirestore(userId);
    // ブイログデータを取得
    const vlogs = await fetchVlogsFromFirestore();

    // データの存在チェック
    if (!minors || !Array.isArray(minors) || minors.length === 0) {
        console.error("未成年者データがありません:", minors);
        return;
    }
    if (!vlogs || !Array.isArray(vlogs) || vlogs.length === 0) {
        console.error("ブイログデータがありません:", vlogs);
        return;
    }

    // 未成年者のデータをCSV形式に変換
    const minorsCSV = minors.map(minor => `${minor.name},${minor.age},${minor.earnings},${minor.vlogs.join('; ')}`).join('\n');
    const vlogsCSV = vlogs.map(vlog => `${vlog.title},${vlog.totalEarnings},${vlog.totalDuration},${vlog.minors.join('; ')}`).join('\n');

    const csvContent = `未成年者データ\n名前,年齢,収益,出演ブイログ\n${minorsCSV}\n\nブイログデータ\nタイトル,総収益,総出演時間,出演未成年者\n${vlogsCSV}`;

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
}

// CSV出力ボタンを設定
export function setupCSVDownload(userId) {
    document.getElementById('downloadCSVButton').addEventListener('click', () => {
        downloadCSV(userId);
    });
}
