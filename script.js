// グローバル変数
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const baseImage = document.getElementById('baseImage');
const clearBtn = document.getElementById('clearBtn');
const completeBtn = document.getElementById('completeBtn');
const gallery = document.getElementById('gallery');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let randomRotation = 0; // ランダムな回転角度を保存

// 定数
const PEN_COLOR = '#606258';
const PEN_SIZE = 10;
const STORAGE_KEY = 'mascotCharacters';
const LEAF_COUNT = 5; // 葉っぱ画像の枚数

// キャラクター紹介文（100通り）
const CHARACTER_DESCRIPTIONS = [
    '趣味：B級ホラー鑑賞',
    '趣味：深夜のコンビニ徘徊',
    '趣味：雨音の収集',
    '趣味：古地図研究',
    '趣味：電線ウォッチング',
    '趣味：自動販売機巡り',
    '趣味：影踏み',
    '趣味：月の観察（満月限定）',
    '趣味：水たまりジャンプ',
    '趣味：風速測定',
    '趣味：落ち葉アート',
    '趣味：光合成（夜は不機嫌）',
    '趣味：朝露集め',
    '趣味：カラス語の勉強',
    '趣味：雲の形当て',
    '趣味：錆びた看板コレクション',
    '趣味：階段の段数カウント',
    '趣味：エレベーターの音楽鑑賞',
    '趣味：マンホールの蓋鑑賞',
    '趣味：街灯の下で読書',
    '趣味：葉脈占い',
    '趣味：風に乗る練習',
    '趣味：苔観察',
    '趣味：木漏れ日浴び',
    '趣味：秘密基地探し',
    '趣味：廃墟散策',
    '趣味：レトロ自販機巡礼',
    '趣味：終電ウォッチング',
    '趣味：都市伝説収集',
    '趣味：古い喫茶店巡り',
    '特技：3秒で眠れる',
    '特技：風向きを当てる',
    '特技：虫の声の聞き分け',
    '特技：完璧な三点倒立',
    '特技：瞬きしない（記録：3分）',
    '特技：階段を一段飛ばし',
    '特技：雨雲を匂いで察知',
    '特技：木登り（降りるのは苦手）',
    '特技：片足立ち（12時間記録保持）',
    '特技：無表情',
    '特技：透明人間の真似',
    '特技：葉っぱ回転',
    '特技：完全無音移動',
    '特技：影に溶け込む',
    '特技：朝5時起き（毎日）',
    '特技：においで季節を当てる',
    '特技：10秒で仮眠',
    '特技：石段を目をつぶって上る',
    '特技：鳥の鳴きまね（カラス限定）',
    '特技：葉っぱ一枚で傘代わり',
    '好物：朝露',
    '好物：霧',
    '好物：夕立の後の空気',
    '好物：コンビニの肉まん',
    '好物：自販機の温かいコーン茶',
    '好物：湿度70%の日',
    '好物：曇り空',
    '好物：小雨',
    '好物：新聞紙の匂い',
    '好物：古本屋の空気',
    '好物：夜の公園',
    '好物：早朝の静けさ',
    '好物：銭湯帰りの風',
    '好物：木造アパートの階段',
    '好物：扇風機の風（弱）',
    '好物：図書館の静寂',
    '好物：秋の金木犀の香り',
    '好物：土の匂い',
    '好物：墨汁の香り',
    '好物：線香花火',
    '苦手：直射日光（5分が限界）',
    '苦手：乾燥',
    '苦手：台風',
    '苦手：人混み',
    '苦手：大きな音',
    '苦手：朝の挨拶',
    '苦手：電話',
    '苦手：SNS',
    '苦手：自撮り',
    '苦手：ダンス',
    '嫌いなもの：除草剤',
    '天敵：毛虫',
    '弱点：強風',
    '苦手：早口',
    '天敵：剪定バサミ',
    '性格：人見知り（慣れると饒舌）',
    '性格：夜型',
    '性格：引きこもりがち',
    '座右の銘：「明日やる」',
    '口癖：「別に...」',
    '夢：いつか世界樹になる',
    '悩み：虫に食われやすい体質',
    '自慢：樹齢300年の木の出身',
    '最近の悩み：葉っぱが少し茶色い',
    '密かな特技：葉っぱで音楽を奏でる',
    '将来の夢：盆栽になる',
    'あだ名：「そよかぜ」',
    '前世：たぶん石',
    'チャームポイント：葉脈',
    'モットー：「揺れて生きる」'
];

// 葉っぱ画像のプリロード
const preloadedLeafImages = [];
for (let i = 1; i <= LEAF_COUNT; i++) {
    const img = new Image();
    img.src = `img/leaf${i}.png`;
    preloadedLeafImages.push(img);
}

// Canvas描画設定
ctx.strokeStyle = PEN_COLOR;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// マウスイベント（PC用）
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// タッチイベント（スマホ・タブレット用）
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.lineWidth = PEN_SIZE;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    ctx.lineWidth = PEN_SIZE;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

// クリアボタン
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setRandomLeafImage(); // 葉っぱ画像をランダムに変更
    setRandomRotation(); // 回転角度もランダムに変更
});

// 完成ボタン
completeBtn.addEventListener('click', () => {
    // ベース画像と描画を合成
    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = 400;
    mergedCanvas.height = 400;
    const mergedCtx = mergedCanvas.getContext('2d');

    // 画像が読み込まれていることを確認してから描画
    if (baseImage.complete && baseImage.naturalHeight !== 0) {
        // キャンバスの中心を基準に回転させる
        mergedCtx.save();
        mergedCtx.translate(200, 200); // キャンバスの中心に移動
        mergedCtx.rotate(randomRotation * Math.PI / 180); // ラジアンに変換して回転

        // ベース画像を中心を基準に描画
        mergedCtx.drawImage(baseImage, -200, -200, 400, 400);
        mergedCtx.restore();

        // 描画レイヤーを重ねる
        mergedCtx.drawImage(canvas, 0, 0);

        // PNG形式でデータURLに変換
        const imageData = mergedCanvas.toDataURL('image/png');

        // localStorageに保存
        const newCharacter = saveCharacter(imageData);

        // 落下アニメーションを開始
        startFallingAnimation(imageData, newCharacter.id);

        // 描画をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ギャラリーを更新
        loadGallery();

        // 新しい葉っぱ画像を設定
        setRandomLeafImage();

        // 新しいランダム角度を設定
        setRandomRotation();
    } else {
        alert('画像の読み込み中です。もう一度お試しください。');
    }
});

// 落下アニメーション
function startFallingAnimation(imageData, characterId) {
    // 作成エリアのcanvasの位置を取得
    const canvasRect = canvas.getBoundingClientRect();

    // わらわらエリアのcanvasの位置を取得
    const animationCanvasRect = animationCanvas.getBoundingClientRect();

    // 落下する画像要素を作成
    const fallingImg = document.createElement('img');
    fallingImg.src = imageData;
    fallingImg.className = 'falling-character';
    fallingImg.style.width = '400px';
    fallingImg.style.height = '400px';
    fallingImg.style.left = canvasRect.left + 'px';
    fallingImg.style.top = canvasRect.top + 'px';

    // 移動距離を計算
    const fallX = (animationCanvasRect.left + animationCanvasRect.width / 2) - (canvasRect.left + 200);
    const fallY = (animationCanvasRect.top + animationCanvasRect.height / 2) - (canvasRect.top + 200);

    // CSS変数を設定
    fallingImg.style.setProperty('--fall-x', fallX + 'px');
    fallingImg.style.setProperty('--fall-y', fallY + 'px');

    document.body.appendChild(fallingImg);

    // アニメーション開始
    setTimeout(() => {
        fallingImg.style.animation = 'fallAndShrink 1s ease-in forwards';
    }, 10);

    // アニメーション終了後に削除し、わらわらに追加
    setTimeout(() => {
        fallingImg.remove();

        // 作成エリアのX座標をわらわらエリアの座標系に変換
        const creatorCenterX = canvasRect.left + canvasRect.width / 2;
        const animationCanvasLeft = animationCanvasRect.left;
        const characterX = creatorCenterX - animationCanvasLeft - CHARACTER_SIZE / 2;

        addAnimationCharacter(imageData, characterX, characterId);
    }, 1000);
}

// localStorage保存
function saveCharacter(imageData) {
    let characters = getCharacters();
    // ランダムに紹介文を選択
    const randomDescription = CHARACTER_DESCRIPTIONS[Math.floor(Math.random() * CHARACTER_DESCRIPTIONS.length)];
    const newCharacter = {
        id: Date.now(),
        data: imageData,
        description: randomDescription,
        createdAt: new Date().toISOString()
    };
    characters.push(newCharacter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));

    return newCharacter; // 新しく作成されたキャラクターを返す
}

// localStorage読み込み
function getCharacters() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// 既存のキャラクターに紹介文を追加
function addDescriptionsToExistingCharacters() {
    let characters = getCharacters();
    let updated = false;

    characters.forEach(character => {
        if (!character.description) {
            // ランダムに紹介文を選択
            character.description = CHARACTER_DESCRIPTIONS[Math.floor(Math.random() * CHARACTER_DESCRIPTIONS.length)];
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }
}

// キャラクター削除
function deleteCharacter(id) {
    let characters = getCharacters();
    characters = characters.filter(char => char.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    loadGallery();

    // わらわらエリアからも削除
    animationCharacters = animationCharacters.filter(char => char.id !== id);
}

// ギャラリー表示
function loadGallery() {
    const characters = getCharacters();
    gallery.innerHTML = '';

    if (characters.length === 0) {
        gallery.innerHTML = '<div class="gallery-empty">まだキャラクターがありません。<br>上で作成してみましょう！</div>';
        return;
    }

    // 新しい順に表示
    characters.reverse().forEach(character => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = character.data;
        img.alt = 'マスコットキャラクター';

        // ツールチップを追加
        const tooltip = document.createElement('div');
        tooltip.className = 'character-tooltip';
        tooltip.textContent = character.description || '趣味：謎';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('このキャラクターを削除しますか？')) {
                deleteCharacter(character.id);
            }
        };

        item.appendChild(img);
        item.appendChild(tooltip);
        item.appendChild(deleteBtn);
        gallery.appendChild(item);
    });
}

// ランダムな回転角度を設定する関数
function setRandomRotation() {
    randomRotation = Math.floor(Math.random() * 360);
    baseImage.style.transform = `rotate(${randomRotation}deg)`;
}

// ランダムな葉っぱ画像を設定する関数
function setRandomLeafImage() {
    const randomLeafNumber = Math.floor(Math.random() * LEAF_COUNT) + 1; // 1-5のランダムな数値
    baseImage.src = `img/leaf${randomLeafNumber}.png`;
}

// ========================================
// わらわらアニメーション機能
// ========================================

// アニメーション用Canvas設定
const animationCanvas = document.getElementById('animationCanvas');
const animationCtx = animationCanvas.getContext('2d');

// Canvas サイズを設定する
function resizeAnimationCanvas() {
    // CSSで設定された実際の表示サイズを取得
    const rect = animationCanvas.getBoundingClientRect();
    animationCanvas.width = rect.width;
    animationCanvas.height = rect.height;
}

// 初期化時とリサイズ時にcanvasサイズを設定
window.addEventListener('resize', resizeAnimationCanvas);

// アニメーション用定数
const CHARACTER_SIZE = 80;
const MOUSE_INFLUENCE_RADIUS = 150;
const REST_INTERVAL_MIN = 2000; // 休憩の最小間隔（ミリ秒）
const REST_INTERVAL_MAX = 8000; // 休憩の最大間隔（ミリ秒）
const REST_DURATION_MIN = 1000; // 休憩時間の最小（ミリ秒）
const REST_DURATION_MAX = 3000; // 休憩時間の最大（ミリ秒）
const GRAVITY = 0.3; // 重力加速度（ゆっくりジャンプ）
const JUMP_POWER = -10; // ジャンプ力（負の値で上向き）

// マウス位置
let animationMouseX = -1000;
let animationMouseY = -1000;

// キャラクタークラス
class Character {
    constructor(imageData, isFalling = false, initialX = null, characterId = null) {
        this.image = new Image();
        this.image.src = imageData;
        this.id = characterId; // キャラクターID

        // X座標の設定（initialXが指定されていればそれを使用、なければランダム）
        if (initialX !== null) {
            this.x = initialX;
        } else {
            this.x = Math.random() * (animationCanvas.width - CHARACTER_SIZE);
        }

        this.size = CHARACTER_SIZE;
        this.groundY = animationCanvas.height - this.size; // 地面のY座標

        // 落下アニメーション用
        this.isFalling = isFalling;

        if (isFalling) {
            // 落下する場合は画面上部から開始
            this.y = -this.size - 100; // 画面外の上から
            this.vy = 0; // 初速度0
        } else {
            // 通常は地面に配置
            this.y = this.groundY;
            this.vy = 0;
        }

        this.vx = (Math.random() - 0.5) * 2; // X方向の速度
        this.idleSwayOffset = Math.random() * Math.PI * 2; // アイドル時の揺れオフセット

        // 速度のランダム化（各キャラごとに異なる速度係数）
        this.speedMultiplier = 0.3 + Math.random() * 0.7;

        // 休憩状態
        this.isResting = false;
        this.lastRestTime = Date.now() + Math.random() * REST_INTERVAL_MAX;
        this.nextRestInterval = this.getRandomRestInterval();
        this.restDuration = 0;

        // ジャンプ状態
        this.isJumping = false;
    }

    update() {
        // マウスとの距離を計算
        const dx = animationMouseX - this.x;
        const dy = animationMouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // マウスカーソルの影響（逃げる動作）X方向のみ
        if (distance < MOUSE_INFLUENCE_RADIUS && distance > 0) {
            const force = (MOUSE_INFLUENCE_RADIUS - distance) / MOUSE_INFLUENCE_RADIUS;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 0.8;
        }

        // 休憩管理
        const now = Date.now();
        if (this.isResting) {
            if (now - this.lastRestTime > this.restDuration) {
                this.isResting = false;
                this.lastRestTime = now;
                this.nextRestInterval = this.getRandomRestInterval();
            }
        } else {
            if (now - this.lastRestTime > this.nextRestInterval) {
                this.isResting = true;
                this.lastRestTime = now;
                this.restDuration = this.getRandomRestDuration();
            }
        }

        // ランダムウォーク（X方向のみ、休憩中は無効）
        if (!this.isResting) {
            this.vx += (Math.random() - 0.5) * 0.15;
        }

        // 速度制限（X方向のみ）
        const maxSpeed = 2.5 * this.speedMultiplier;
        if (Math.abs(this.vx) > maxSpeed) {
            this.vx = (this.vx / Math.abs(this.vx)) * maxSpeed;
        }

        // 重力を適用（落下中は強い重力）
        if (this.isFalling) {
            this.vy += GRAVITY * 6; // 落下中は重力を6倍に
        } else {
            this.vy += GRAVITY;
        }

        // 位置更新
        this.x += this.vx;
        this.y += this.vy;

        // 着地判定（常に行う）
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.isJumping = false;
            // 落下アニメーション終了
            if (this.isFalling) {
                this.isFalling = false;
            }
        }

        // 画面端でバウンス（X方向のみ）
        if (this.x <= 0 || this.x >= animationCanvas.width - this.size) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(this.x, animationCanvas.width - this.size));
        }

        // 摩擦（X方向のみ）
        const friction = this.isResting ? 0.85 : 0.98;
        this.vx *= friction;
    }

    getRandomRestInterval() {
        return REST_INTERVAL_MIN + Math.random() * (REST_INTERVAL_MAX - REST_INTERVAL_MIN);
    }

    getRandomRestDuration() {
        return REST_DURATION_MIN + Math.random() * (REST_DURATION_MAX - REST_DURATION_MIN);
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.vy = JUMP_POWER;
        }
    }

    draw() {
        animationCtx.save();

        // アイドル時の揺れ
        const idleSwayX = Math.sin(Date.now() / 1000 + this.idleSwayOffset) * 2;
        const idleSwayY = Math.cos(Date.now() / 800 + this.idleSwayOffset) * 3;

        // キャラクターの中心に移動
        animationCtx.translate(
            this.x + this.size / 2 + idleSwayX,
            this.y + this.size / 2 + idleSwayY
        );

        // 画像を描画
        animationCtx.drawImage(
            this.image,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        animationCtx.restore();
    }
}

// キャラクターの配列
let animationCharacters = [];

// localStorageからキャラクターを読み込み
function loadAnimationCharacters() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        animationCharacters = [];
        return;
    }

    const characterData = JSON.parse(data);
    animationCharacters = characterData.map(char => new Character(char.data, false, null, char.id));
}

// 新しいキャラクターをアニメーションに追加（落下アニメーション付き）
function addAnimationCharacter(imageData, initialX = null, characterId = null) {
    const newChar = new Character(imageData, true, initialX, characterId); // 落下フラグをtrueに、初期X座標とIDを指定
    animationCharacters.push(newChar);
}

// アニメーションループ
function animate() {
    // 背景を完全にクリア
    animationCtx.fillStyle = 'white';
    animationCtx.fillRect(0, 0, animationCanvas.width, animationCanvas.height);

    // すべてのキャラクターを更新・描画
    animationCharacters.forEach(character => {
        character.update();
        character.draw();
    });

    requestAnimationFrame(animate);
}

// マウス移動イベント
animationCanvas.addEventListener('mousemove', (e) => {
    const rect = animationCanvas.getBoundingClientRect();
    animationMouseX = e.clientX - rect.left;
    animationMouseY = e.clientY - rect.top;
});

// マウスが離れたら影響を消す
animationCanvas.addEventListener('mouseleave', () => {
    animationMouseX = -1000;
    animationMouseY = -1000;
});

// クリックで全キャラクターをジャンプさせる
animationCanvas.addEventListener('click', () => {
    animationCharacters.forEach(character => {
        character.jump();
    });
});

// ========================================
// トグル機能
// ========================================

const showGalleryBtn = document.getElementById('showGalleryBtn');
const showCreatorBtn = document.getElementById('showCreatorBtn');
const creatorSection = document.querySelector('.creator-section');
const gallerySection = document.querySelector('.gallery-section');

// メンバー紹介を表示
showGalleryBtn.addEventListener('click', () => {
    creatorSection.style.display = 'none';
    gallerySection.style.display = 'block';
    showGalleryBtn.classList.add('active');
    showCreatorBtn.classList.remove('active');
    localStorage.setItem('currentTab', 'gallery'); // タブの状態を保存
});

// 新メンバー加入を表示
showCreatorBtn.addEventListener('click', () => {
    creatorSection.style.display = 'block';
    gallerySection.style.display = 'none';
    showCreatorBtn.classList.add('active');
    showGalleryBtn.classList.remove('active');
    localStorage.setItem('currentTab', 'creator'); // タブの状態を保存
});

// タブの状態を復元する関数
function restoreTabState() {
    const currentTab = localStorage.getItem('currentTab');
    if (currentTab === 'gallery') {
        creatorSection.style.display = 'none';
        gallerySection.style.display = 'block';
        showGalleryBtn.classList.add('active');
        showCreatorBtn.classList.remove('active');
    }
    // デフォルトは新メンバー（creator）なので、それ以外の場合のみ処理
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    addDescriptionsToExistingCharacters(); // 既存キャラクターに紹介文を追加
    setRandomLeafImage(); // ランダムな葉っぱ画像を設定
    loadGallery();
    setRandomRotation(); // 初回のランダム角度を設定
    resizeAnimationCanvas(); // canvasサイズを設定
    loadAnimationCharacters(); // アニメーションキャラクターを読み込み
    animate(); // アニメーション開始
    restoreTabState(); // タブの状態を復元
});