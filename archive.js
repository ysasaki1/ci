// Firebaseの初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyBG0oI4oX6Bllv9uwNS1SevG45G92rA5Qc",
    authDomain: "ci00-122f7.firebaseapp.com",
    projectId: "ci00-122f7",
    storageBucket: "ci00-122f7.firebasestorage.app",
    messagingSenderId: "611111120777",
    appId: "1:611111120777:web:a754047ec66d5bc3093b58",
    measurementId: "G-XENL409WZ7"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 未成年者のデータ構造
const minors = [];

// ブイログのデータ構造
const vlogs = [];

// 言語データの定義
const languageData = {
    en: {
        title: "Vlog Information Management",
        minorInfo: "Minor Information",
        vlogInfo: "Monetized Vlog Information",
        addMinor: "Add Minor",
        addVlog: "Add Vlog",
        downloadCSV: "Download CSV",
        logout: "Logout",
        vlogTitle: "Vlog Title",
        totalEarnings: "Total Earnings",
        totalDuration: "Total Duration (minutes)",
        registeredMinors: "Registered Minors",
        registeredVlogs: "Registered Vlogs",
        minorName: "Name", // 名前のラベル
        minorAge: "Age", // 年齢のラベル
        delete: "Delete", // 削除ボタンのラベル
        minorParticipants: "Minor Participants", // 出演未成年者のラベル
        minorItemLabel: "Minor: ", // 登録された未成年者のラベル
        ageLabel: "Age: ", // 年齢のラベル
        durationPlaceholder: "Duration (minutes)", // 出演時間のプレースホルダー
    },
    ja: {
        title: "ブイログ情報管理",
        minorInfo: "未成年者の情報",
        vlogInfo: "収益化ブイログ情報",
        addMinor: "追加",
        addVlog: "追加",
        downloadCSV: "CSV出力",
        logout: "ログアウト",
        vlogTitle: "ブイログタイトル",
        totalEarnings: "総収益",
        totalDuration: "総出演時間 (分)",
        registeredMinors: "登録された未成年者",
        registeredVlogs: "登録されたブイログ",
        minorName: "名前", // 名前のラベル
        minorAge: "年齢", // 年齢のラベル
        delete: "削除", // 削除ボタンのラベル
        minorParticipants: "出演未成年者", // 出演未成年者のラベル
        minorItemLabel: "未成年者: ", // 登録された未成年者のラベル
        ageLabel: "年齢: ", // 年齢のラベル
        durationPlaceholder: "出演時間 (分)", // 出演時間のプレースホルダー
    }
};

// 現在の言語を設定
let currentLanguage = 'ja'; // 初期言語

function updateLanguage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const minorInfoTitle = document.getElementById('minorInfoTitle');
    const vlogInfoTitle = document.getElementById('vlogInfoTitle');
    const addMinorButton = document.getElementById('addMinorInfoButton');
    const addVlogButton = document.getElementById('addVlogInfoButton');
    const downloadCSVButton = document.getElementById('downloadCSVButton');
    const logoutButton = document.getElementById('logoutButton');

    const vlogTitleLabel = document.getElementById('vlogTitle');
    const totalEarningsLabel = document.getElementById('totalEarnings');
    const totalDurationLabel = document.getElementById('totalDuration');
    const registeredMinorsTitle = document.getElementById('registeredMinorsTitle');
    const registeredVlogsTitle = document.getElementById('registeredVlogsTitle');
    const minorAgeLabel = document.getElementById('minorAge');
    const minorParticipantsTitle = document.getElementById('minorParticipantsTitle');
    const minorNameInput = document.getElementById('minorName');
    const minorAgeInput = document.getElementById('minorAge');


    const minorItemLabelInput = document.getElementById('minorItemLabel');
    const ageLabelInput = document.getElementById('ageLabel');
    const durationPlaceholderInput = document.getElementById('durationPlaceholder');
    

    // 各要素のテキストを更新
    if (welcomeMessage) {
        const userEmail = auth.currentUser ? auth.currentUser.email : "";
        welcomeMessage.innerText = currentLanguage === 'ja' 
            ? `ようこそ, ${userEmail}さん！` 
            : `Welcome, ${userEmail}!`;
    }
    if (minorInfoTitle) {
        minorInfoTitle.innerText = languageData[currentLanguage].minorInfo;
    }
    if (vlogInfoTitle) {
        vlogInfoTitle.innerText = languageData[currentLanguage].vlogInfo;
    }
    if (minorParticipantsTitle) {
        minorParticipantsTitle.innerText = languageData[currentLanguage].minorParticipants;
    }
    if (addMinorButton) {
        addMinorButton.innerText = languageData[currentLanguage].addMinor;
    }
    if (addVlogButton) {
        addVlogButton.innerText = languageData[currentLanguage].addVlog;
    }
    if (downloadCSVButton) {
        downloadCSVButton.innerText = languageData[currentLanguage].downloadCSV;
    }
    if (logoutButton) {
        logoutButton.innerText = languageData[currentLanguage].logout;
    }

    // プレースホルダーのテキスト更新
    if (vlogTitleLabel) {
        vlogTitleLabel.placeholder = languageData[currentLanguage].vlogTitle;
    }
    if (totalEarningsLabel) {
        totalEarningsLabel.placeholder = languageData[currentLanguage].totalEarnings;
    }
    if (totalDurationLabel) {
        totalDurationLabel.placeholder = languageData[currentLanguage].totalDuration;
    }
    if (registeredMinorsTitle) {
        registeredMinorsTitle.innerText = languageData[currentLanguage].registeredMinors;
    }
    if (registeredVlogsTitle) {
        registeredVlogsTitle.innerText = languageData[currentLanguage].registeredVlogs;
    }
    if (minorNameInput) {
        minorNameInput.placeholder = languageData[currentLanguage].minorName;
    }
    if (minorAgeInput) {
        minorAgeInput.placeholder = languageData[currentLanguage].minorAge;
    }

        if (minorItemLabelInput) {
        minorItemLabelInput.placeholder = languageData[currentLanguage].minorItemLabel;
    }
        if (ageLabelInput) {
        minorAgeInput.placeholder = languageData[currentLanguage].ageLabel;
    }
        if (durationPlaceholderInput) {
        durationPlaceholderInput.placeholder = languageData[currentLanguage].durationPlaceholder;
    }

    // 削除ボタンのラベルを更新
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.innerText = languageData[currentLanguage].delete;
    });
}

// 未成年者のデータをFirestoreに追加する関数
async function addMinorToFirestore(minor) {
    try {
        const docRef = await addDoc(collection(db, "minors"), minor);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Firestoreから未成年者データを取得する関数
async function fetchMinorsFromFirestore(userId) {
    try {
        const querySnapshot = await getDocs(collection(db, "minors"));
        querySnapshot.forEach((doc) => {
            const minor = doc.data();
            if (minor.userId === userId) { // ユーザーIDでフィルター
                minors.push(minor); // ローカルの minors 配列に追加

                // チェックボックスを生成
                const checkboxContainer = document.getElementById('minorCheckboxContainer');
                const checkbox = document.createElement('div');
                checkbox.className = 'minor-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="minorSelect" value="${minor.name}" id="${minor.name}">
                    <label for="${minor.name}">${minor.name}</label>
                    <input type="number" id="duration_${minor.name}" placeholder="${languageData[currentLanguage].durationPlaceholder}" min="0">
                `;
                checkboxContainer.appendChild(checkbox);

                // 登録された未成年者リストに追加
                const infoList = document.getElementById('infoList');
                const listItem = document.createElement('li');
                listItem.textContent = `${languageData[currentLanguage].minorItemLabel}${minor.name}, ${languageData[currentLanguage].ageLabel}${minor.age}`; // 言語に応じてテキストを設定

                // 削除ボタンを作成
                const deleteButton = document.createElement('button');
                deleteButton.textContent = languageData[currentLanguage].delete; // 言語に応じた削除ボタンラベル
                deleteButton.classList.add('delete-button');

                // 削除ボタンのクリックイベント
                deleteButton.addEventListener('click', () => {
                    infoList.removeChild(listItem);
                    minors.splice(minors.indexOf(minor), 1); // 未成年者を削除
                    checkboxContainer.removeChild(checkbox); // チェックボックスも削除
                });

                listItem.appendChild(deleteButton);
                infoList.appendChild(listItem);
            }
        });
    } catch (error) {
        console.error("Error fetching minors: ", error);
    }
}


// DOMContentLoadedイベントを使用して、DOMが読み込まれてから実行
document.addEventListener('DOMContentLoaded', async () => {
    // ユーザーの認証状態を監視
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById('welcomeMessage').innerText = `ようこそ, ${user.email}さん！`;
            const userId = user.uid; // ユーザーIDを取得

            // Firestoreから未成年者データを取得
            await fetchMinorsFromFirestore(userId);
        } else {
            // ユーザーがログインしていない場合、ログインページにリダイレクト
            window.location.href = 'index.html';
        }
    });

    // 言語切り替えボタンのイベントリスナー
    document.getElementById('lang-en').addEventListener('click', () => {
        currentLanguage = 'en';
        updateLanguage();
    });

    document.getElementById('lang-ja').addEventListener('click', () => {
        currentLanguage = 'ja';
        updateLanguage();
    });

    // 初回の言語設定
    updateLanguage();

    // 未成年者の情報を追加
    document.getElementById('addMinorInfoButton').addEventListener('click', async () => {
        const name = document.getElementById('minorName').value;
        const age = document.getElementById('minorAge').value;

        const userId = auth.currentUser.uid; // 現在のユーザーIDを取得
        const createdDate = new Date().toISOString(); // 登録日を取得
        const minorId = `${userId}-${Date.now()}`; // ユニークな未成年者IDを生成

        const minor = { id: minorId, userId, name, age, createdDate, earnings: 0, vlogs: [] };
        minors.push(minor); // 未成年者を追加

        // Firestoreにデータを追加
        await addMinorToFirestore(minor);

// チェックボックスを生成
const checkboxContainer = document.getElementById('minorCheckboxContainer');
const checkbox = document.createElement('div');
checkbox.className = 'minor-checkbox'; // クラス名を追加
checkbox.innerHTML = `
    <input type="checkbox" name="minorSelect" value="${name}" id="${name}">
    <label for="${name}">${name}</label>
    <input type="number" id="duration_${name}" placeholder="${languageData[currentLanguage].durationPlaceholder}" min="0">
`;
checkboxContainer.appendChild(checkbox);


        // 登録された未成年者リストに追加
        const infoList = document.getElementById('infoList');
        const listItem = document.createElement('li');
        listItem.textContent = `未成年者: ${name}, 年齢: ${age}`;

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = languageData[currentLanguage].delete; // 言語に応じた削除ボタンラベル
        deleteButton.classList.add('delete-button');

        // 削除ボタンのクリックイベント
        deleteButton.addEventListener('click', () => {
            infoList.removeChild(listItem);
            minors.splice(minors.indexOf(minor), 1); // 未成年者を削除
            checkboxContainer.removeChild(checkbox); // チェックボックスも削除
        });

        listItem.appendChild(deleteButton);
        infoList.appendChild(listItem);

        // 入力フィールドをクリア
        document.getElementById('minorName').value = '';
        document.getElementById('minorAge').value = '';
    });
// 収益化ブイログ情報を追加
document.getElementById('addVlogInfoButton').addEventListener('click', async () => {
    const vlogTitle = document.getElementById('vlogTitle').value.trim(); // ブイログのタイトル
    const totalEarnings = parseFloat(document.getElementById('totalEarnings').value); // 総収益
    const totalDuration = parseFloat(document.getElementById('totalDuration').value); // 総出演時間
    
    // バリデーション
    if (!vlogTitle || isNaN(totalEarnings) || isNaN(totalDuration) || totalDuration <= 0) {
        alert("すべてのフィールドを正しく入力してください。");
        return;
    }

    const selectedMinors = Array.from(document.querySelectorAll('input[name="minorSelect"]:checked')).map(input => input.value);
    const selectedDurations = selectedMinors.map(minorName => parseFloat(document.getElementById(`duration_${minorName}`).value)); // 各未成年者の出演時間

    // ブイログオブジェクトを作成
    const vlog = { title: vlogTitle, totalEarnings, totalDuration, minors: selectedMinors, selectedDurations };

    try {
        // Firestoreに新しいコレクション「vlogs」を作成し、データを追加
        const docRef = await addDoc(collection(db, "vlogs"), vlog);
        console.log("ブイログが追加されました。ID:", docRef.id);
        
        // 各未成年者の収益を計算
        selectedMinors.forEach((minorName, index) => {
            const minor = minors.find(m => m.name === minorName);
            const individualDuration = selectedDurations[index];
            let earnings;

            if (selectedMinors.length === 1) {
                // 未成年者が1名の場合
                earnings = (individualDuration / totalDuration) < 0.5 ? 0 : totalEarnings * (individualDuration / totalDuration);
            } else {
                // 未成年者が2名以上の場合
                earnings = totalEarnings / selectedMinors.length;
            }

            // 各未成年者の収益を加算
            minor.earnings = (minor.earnings || 0) + earnings; 
            minor.vlogs = minor.vlogs || []; // vlogs 配列が未定義の場合は初期化
            minor.vlogs.push(vlogTitle); // ブイログタイトルを追加
        });

        // 結果を表示
        displayVlogInfo(vlog);

        // 入力フィールドをクリア
        document.getElementById('vlogTitle').value = '';
        document.getElementById('totalEarnings').value = '';
        document.getElementById('totalDuration').value = '';
        selectedMinors.forEach(minorName => {
            document.getElementById(`duration_${minorName}`).value = ''; // 各未成年者の出演時間をクリア
        });
    } catch (error) {
        console.error("ブイログの追加中にエラーが発生しました:", error);
        alert("ブイログの追加に失敗しました。再試行してください。");
    }
});

// 結果を表示する関数
function displayVlogInfo(vlog) {
    const vlogList = document.getElementById('vlogList');
    const vlogItem = document.createElement('li');
    vlogItem.textContent = `ブイログタイトル: ${vlog.title}, 総収益: ¥${vlog.totalEarnings}, 出演未成年者: ${vlog.minors.join(', ')}`;
    
    vlogList.appendChild(vlogItem);
}

// ログアウト処理
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await auth.signOut(); // Firebaseのログアウト処理
            alert("ログアウトしました");
            window.location.href = 'index.html'; // ログインページにリダイレクト
        } catch (error) {
            console.error("ログアウト中にエラーが発生しました:", error);
            alert("ログアウトに失敗しました。再試行してください。");
        }
    });
}


    // エラーメッセージの表示
    const closeModalButton = document.getElementById('closeModal');
    if (closeModalButton) {
        closeModalButton.onclick = function() {
            const errorModal = document.getElementById('errorModal');
            if (errorModal) {
                errorModal.style.display = 'none';
            }
        };
    }

    // CSV出力の関数
    function downloadCSV() {
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
    document.getElementById('downloadCSVButton').addEventListener('click', downloadCSV);

    // サムネイルを取得する関数
    function getThumbnailFromUrl(url) {
        const videoId = url.split('v=')[1];
        const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // サムネイルを追加するためのイベントリスナー
    document.getElementById('addVlogInfoButton').addEventListener('click', () => {
        const vlogTitle = document.getElementById('vlogTitle').value;
        const videoUrl = document.getElementById('videoUrl').value; // YouTubeの動画URL
        const thumbnailUrl = getThumbnailFromUrl(videoUrl); // サムネイルのURLを取得

        // サムネイルを表示するコード
        const thumbnailContainer = document.getElementById('thumbnailContainer');
        if (thumbnailContainer) { // thumbnailContainerが存在するか確認
            thumbnailContainer.innerHTML = `<img src="${thumbnailUrl}" alt="サムネイル" style="width: 100%; max-width: 300px;"/>`;
        }
    });
});

