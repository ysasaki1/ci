body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #eef2f3;
    padding: 20px;
}

.container {
    max-width: 600px;
    margin: auto;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    text-align: center; /* コンテナ内のテキストを中央寄せ */
}

.form-section {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    text-align: center; /* セクション内のテキストを中央寄せ */
}

h1 {
    font-size: 120%; /* タイトルサイズ */
}

h2 {
    font-size: 100%; /* セクションタイトルサイズ */
}

input {
    width: calc(100% - 20px);
    padding: 12px;
    margin: 10px auto; /* 上下のマージンを追加 */
    border-radius: 5px;
    border: 1px solid #ccc;
}

.small-button {
    width: 33.33%; /* ボタンの幅を1/3に設定 */
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-sizing: border-box; /* パディングとボーダーを含めたサイズ計算 */
    display: inline-block; /* インラインブロック要素にして中央寄せ可能に */
    margin: 10px auto; /* 上下のマージンを追加し、中央寄せ */
}

.small-button:hover {
    background-color: #0056b3;
}

/* モーダルのスタイル */
.modal {
    display: none; /* 初期状態では非表示 */
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background-color: #fff;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.delete-button {
    margin-left: 10px; /* ボタンとテキストの間にスペースを追加 */
    background-color: #ff4d4d; /* 削除ボタンの背景色 */
    color: white; /* 削除ボタンの文字色 */
    border: none; /* ボーダーをなしに */
    border-radius: 5px; /* 角を丸くする */
    cursor: pointer; /* カーソルをポインターに */
}

.delete-button:hover {
    background-color: #ff1a1a; /* ホバー時の色 */
}

/* 未成年者のチェックボックスのスタイル */
.minor-container {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    background-color: #fff;
    margin-top: 10px; /* 上部マージン */
}

.minor-checkbox {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.minor-checkbox input[type="number"] {
    margin-left: 5px;
    width: 60px; /* 出演時間の幅を指定 */
    padding: 5px;
}

/* ログアウトボタンのスタイル */
#logoutButton {
    display: block; /* ブロック要素として表示 */
    margin: 20px auto; /* 上下のマージンを追加し、中央寄せ */
    width: 200px; /* ボタンの幅を指定 */
}
