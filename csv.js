import { fetchMinorsFromFirestore } from './minors.js'; // 未成年者データを取得する関数をインポート
import { fetchVlogsFromFirestore } from './vlogs.js'; // ブイログデータを取得する関数をインポート

// CSV出力の関数
export async function downloadCSV(userId) {
    // 未成年者データを取得
    const minors = await fetchMinorsFromFirestore(userId);
    // ブイログデータを取得
    const vlogs = await fetchVlogsFromFirestore();


    // CSVのヘッダーを定義
    const minorsHeader = '名前,年齢,収益,出演ブイログ\n';
    const vlogsHeader = 'タイトル,総収益,総出演時間,出演未成年者,未成年者の出演時間\n';

    // 未成年者のデータをCSV形式に変換
    const minorsCSV = minors.map(minor => {
        const vlogsForMinor = minor.vlogs.map(vlogId => {
            const vlog = vlogs.find(v => v.id === vlogId);
            return vlog ? vlog.title : '';
        }).join('; ');

        return `${minor.name},${minor.age},${minor.earnings},${vlogsForMinor}`;
    }).join('\n');

    // ブイログのデータをCSV形式に変換
    const vlogsCSV = vlogs.map(vlog => {
        const minorsText = vlog.minors.join(', ');
        const selectedDurationsText = vlog.selectedDurations.join(', ');

        return `${vlog.title},${vlog.totalEarnings},${vlog.totalDuration},${minorsText},${selectedDurationsText}`;
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
}

// CSV出力ボタンを設定
export function setupCSVDownload(userId) {
    document.getElementById('downloadCSVButton').addEventListener('click', () => {
        downloadCSV(userId);
    });
}
