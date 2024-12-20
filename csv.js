// CSV出力機能を管理するファイル

// CSV出力の関数
export function downloadCSV(minors, vlogs) {
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
export function setupCSVDownload(minors, vlogs) {
    document.getElementById('downloadCSVButton').addEventListener('click', () => {
        downloadCSV(minors, vlogs);
    });
}
