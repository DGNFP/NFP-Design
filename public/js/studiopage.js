// ==================== 전역 함수 등록 (HTML onclick용) ====================
window.generateQR = function() {
    if (typeof QRious === 'undefined') {
        alert('QR 라이브러리를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }
    
    const input = document.getElementById('studio-qr-input');
    const size = document.getElementById('studio-qr-size');
    const canvas = document.getElementById('studio-qr-canvas');
    
    if (!input || !size || !canvas) return;
    
    const inputValue = input.value;
    const sizeValue = parseInt(size.value);
    
    try {
        const qr = new QRious({
            element: canvas,
            value: inputValue,
            size: sizeValue,
            foreground: '#000000',
            background: '#FFFFFF'
        });

        const downloadBtn = document.getElementById('studio-download-btn');
        if (downloadBtn) {
            downloadBtn.style.display = 'inline-block';
        }
        
    } catch (error) {
        alert('QR 코드 생성 중 오류가 발생했습니다.');
    }
};

window.downloadQR = function() {
    const canvas = document.getElementById('studio-qr-canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
};

window.applyColorCode = function() {
    const colorCodeInput = document.getElementById('studio-color-code-input');
    if (!colorCodeInput) return;
    
    let hex = colorCodeInput.value.trim();
    
    // # 추가
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    // 유효성 검사
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        alert('올바른 색상 코드를 입력해주세요. (예: #01FF75)');
        return;
    }
    
    // 컬러 피커 업데이트
    const colorPicker = document.getElementById('studio-base-color');
    if (colorPicker) {
        colorPicker.value = hex;
    }
    
    // RGB 슬라이더 업데이트
    updateRGBFromHex(hex);
    
    colorCodeInput.value = hex;
    
    // 실시간 팔레트 업데이트
    generatePalette();
};

window.generatePalette = function() {
    const baseColor = document.getElementById('studio-base-color');
    const type = document.querySelector('input[name="palette-type"]:checked');
    const result = document.getElementById('studio-palette-result');
    
    if (!baseColor || !type || !result) return;
    
    let colors = [];
    const hsl = hexToHsl(baseColor.value);
    
    switch(type.value) {
        case 'monochrome':
            colors = generateMonochrome(hsl);
            break;
        case 'analogous':
            colors = generateAnalogous(hsl);
            break;
        case 'complementary':
            colors = generateComplementary(hsl);
            break;
        case 'triadic':
            colors = generateTriadic(hsl);
            break;
    }
    
    displayColors(colors, result);
};

// ==================== 전역 변수 및 설정 ====================

// 확장된 컬러 카드 데이터 (기존 10개 + 신규 20개)
const colorCards = [
    // === 기존 데이터 ===
    {
        name: "미드나이트 블루",
        hex: "#191970",
        description: "깊은 밤하늘처럼 신비로운 색상으로, 집중력과 안정감을 가져다줍니다."
    },
    {
        name: "코랄 핑크",
        hex: "#FF7F7F",
        description: "따뜻하고 친근한 에너지를 가진 색상으로, 창의성과 열정을 자극합니다."
    },
    {
        name: "포레스트 그린",
        hex: "#228B22",
        description: "자연의 생명력을 담은 색상으로, 평온함과 성장을 상징합니다."
    },
    {
        name: "골든 옐로우",
        hex: "#FFD700",
        description: "태양의 빛을 닮은 밝은 색상으로, 활력과 행복을 불러일으킵니다."
    },
    {
        name: "라벤더 퍼플",
        hex: "#E6E6FA",
        description: "우아하고 고요한 색상으로, 내면의 평화와 직관력을 높여줍니다."
    },
    {
        name: "터키쉬 블루",
        hex: "#40E0D0",
        description: "맑은 바다처럼 상쾌한 색상으로, 소통과 치유의 에너지를 전달합니다."
    },
    {
        name: "로즈 골드",
        hex: "#E8B4B8",
        description: "고급스럽고 온화한 색상으로, 사랑과 조화를 상징합니다."
    },
    {
        name: "슬레이트 그레이",
        hex: "#708090",
        description: "균형잡힌 중성 색상으로, 안정감과 전문성을 나타냅니다."
    },
    {
        name: "피치 오렌지",
        hex: "#FFCBA4",
        description: "부드럽고 따뜻한 색상으로, 친밀감과 편안함을 제공합니다."
    },
    {
        name: "인디고 블루",
        hex: "#4B0082",
        description: "깊이 있는 지혜의 색상으로, 통찰력과 직관을 개발시킵니다."
    },
    
    // === 신규 색다른 명칭 ===
    {
        name: "네온사인 핑크",
        hex: "#FF1493",
        description: "도시의 밤을 밝히는 네온사인처럼 강렬하고 역동적인 에너지를 발산합니다."
    },
    {
        name: "우주먼지 퍼플",
        hex: "#6A0DAD",
        description: "은하수 너머 우주의 신비로운 먼지 같은 색상으로, 무한한 상상력을 자극합니다."
    },
    {
        name: "카페라떼 브라운",
        hex: "#D2B48C",
        description: "향긋한 아침 커피처럼 따뜻하고 포근한 기운으로 하루를 시작하게 합니다."
    },
    {
        name: "형광등 화이트",
        hex: "#F8F8FF",
        description: "깔끔한 사무실 조명처럼 명확하고 집중력을 높여주는 순수한 빛입니다."
    },
    {
        name: "전기뱀장어 옐로우",
        hex: "#FFFF00",
        description: "강력한 전기 에너지처럼 눈부시고 강렬한 임팩트를 전달하는 색상입니다."
    },
    {
        name: "용암폭발 레드",
        hex: "#DC143C",
        description: "화산의 뜨거운 용암처럼 폭발적인 열정과 강인한 의지를 보여줍니다."
    },
    {
        name: "구름속 실버",
        hex: "#C0C0C0",
        description: "높은 하늘 구름 사이로 스며드는 은빛처럼 몽환적이고 세련된 분위기입니다."
    },
    {
        name: "심해어 블랙",
        hex: "#2F4F4F",
        description: "깊은 바닷속 미지의 세계처럼 신비롭고 깊이 있는 사색을 불러일으킵니다."
    },
    {
        name: "샐러드믹스 그린",
        hex: "#90EE90",
        description: "신선한 채소처럼 생기발랄하고 건강한 에너지로 활력을 불어넣어줍니다."
    },
    {
        name: "로켓연료 블루",
        hex: "#4169E1",
        description: "우주로 향하는 로켓처럼 미래지향적이고 도전적인 정신을 상징합니다."
    },
    {
        name: "벚꽃눈보라 핑크",
        hex: "#FFB6C1",
        description: "봄날 흩날리는 벚꽃잎처럼 로맨틱하고 꿈같은 순간을 연출합니다."
    },
    {
        name: "사이버펑크 시안",
        hex: "#00FFFF",
        description: "미래도시 홀로그램처럼 디지털하고 첨단 기술의 세련됨을 표현합니다."
    },
    {
        name: "마카롱상자 민트",
        hex: "#98FB98",
        description: "달콤한 디저트처럼 부드럽고 상큼한 기분으로 일상에 소소한 즐거움을 더합니다."
    },
    {
        name: "번개칠 옐로우",
        hex: "#FFEA00",
        description: "천둥번개처럼 순간적이고 강력한 영감과 아이디어의 번뜩임을 나타냅니다."
    },
    {
        name: "갤럭시 바이올렛",
        hex: "#8A2BE2",
        description: "광활한 은하계처럼 무한한 가능성과 창조적 상상력의 경계를 넘나듭니다."
    },
    {
        name: "콘크리트 정글 그레이",
        hex: "#696969",
        description: "도시의 건축물처럼 견고하고 현실적인 실용성과 모던함을 대표합니다."
    },
    {
        name: "열대과일 오렌지",
        hex: "#FF8C00",
        description: "태양 가득한 남국의 과일처럼 에너지 넘치고 즐거운 휴가 기분을 선사합니다."
    },
    {
        name: "홀로그램 무지개",
        hex: "#9370DB",
        description: "빛이 만들어내는 스펙트럼처럼 다채롭고 신비로운 변화의 가능성을 품고 있습니다."
    },
    {
        name: "스모키바베큐 브라운",
        hex: "#A0522D",
        description: "향긋한 훈제 향처럼 깊이 있고 진중한 맛과 여유로운 시간을 의미합니다."
    },
    {
        name: "오로라 스카이",
        hex: "#87CEEB",
        description: "북극의 신비로운 오로라처럼 환상적이고 경이로운 자연의 아름다움을 담았습니다."
    }
    ,

      // === NFP 특별 색상들 ===
    {
        name: "NFP 시그니쳐 그린",
        hex: "#01FF75",
        description: "창의적 혁신과 무한한 가능성을 상징하는 NFP의 시그니쳐 컬러입니다. 새로운 아이디어와 도전 정신을 불러일으킵니다.",
        isSpecial: true
    },
    {
        name: "NFP 에메랄드 에디션",
        hex: "#00CC5E",
        description: "깊이 있는 성장과 지속가능한 성공을 의미하는 NFP 에메랄드 에디션입니다. 신뢰와 안정성 위에 구축된 혁신을 나타냅니다.",
        isSpecial: true
    }

];

// 그라데이션 카드 데이터
const gradientColorCards = [
    {
        name: "일몰 스카이라인",
        gradient: "linear-gradient(45deg, #FF6B6B, #FFE66D, #FF8E53)",
        description: "하루의 끝을 알리는 황금빛 노을처럼 따뜻하고 로맨틱한 감성을 불러일으킵니다."
    },
    {
        name: "은하수 터널",
        gradient: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)",
        description: "우주를 관통하는 신비로운 통로처럼 무한한 상상력과 모험심을 자극합니다."
    },
    {
        name: "네온시티 나이트",
        gradient: "linear-gradient(90deg, #ff0080, #00ffff, #8000ff)",
        description: "사이버펑크 도시의 밤처럼 미래적이고 역동적인 디지털 에너지를 발산합니다."
    },
    {
        name: "열대우림 미스트",
        gradient: "linear-gradient(180deg, #11998e, #38ef7d, #a8e6cf)",
        description: "신비로운 정글 안개처럼 생명력 넘치고 치유의 기운을 전달하는 자연의 힘입니다."
    },
    {
        name: "오로라 윈터",
        gradient: "linear-gradient(45deg, #4facfe, #00f2fe, #43e97b)",
        description: "극지방의 오로라처럼 환상적이고 순수한 겨울 밤의 마법을 담고 있습니다."
    },
    {
        name: "화산폭발 마그마",
        gradient: "linear-gradient(135deg, #ff9a9e, #fad0c4, #ff6b6b)",
        description: "뜨거운 용암의 분출처럼 폭발적인 열정과 강인한 생명력을 상징합니다."
    },
    {
        name: "심해 바이오",
        gradient: "linear-gradient(90deg, #0f0c29, #302b63, #24243e)",
        description: "깊은 바다의 신비로운 생명체처럼 고요하면서도 강렬한 내면의 힘을 보여줍니다."
    },
    {
        name: "캔디팝 드림",
        gradient: "linear-gradient(45deg, #a8edea, #fed6e3, #ffecd2)",
        description: "달콤한 솜사탕처럼 포근하고 꿈같은 행복감으로 마음을 어루만져줍니다."
    },
    {
        name: "전광석화 썬더",
        gradient: "linear-gradient(180deg, #fdbb2d, #22c1c3, #4facfe)",
        description: "번개의 순간적 번쩍임처럼 강력한 영감과 번뜩이는 아이디어를 선사합니다."
    },
    {
        name: "로켓발사 플레임",
        gradient: "linear-gradient(135deg, #fa709a, #fee140, #ff6b6b)",
        description: "우주로 향하는 로켓 추진체처럼 미래를 향한 강력한 추진력과 도전정신을 나타냅니다."
    }
    ,
      {
        name: "NFP 시그니쳐 오로라",
        gradient: "linear-gradient(45deg, #01FF75, #00FFCC, #01FF75)",
        description: "NFP만의 독창적인 오로라 그라데이션입니다. 끝없는 창의성과 혁신의 여정을 상징하는 특별한 색채입니다.",
        isSpecial: true
    }
    ,
    {
        name: "NFP 에메랄드 심포니",
        gradient: "linear-gradient(135deg, #00CC5E, #01FF75, #4FFFB0)",
        description: "NFP 에메랄드 심포니 그라데이션을 발견하셨습니다. 조화로운 성장과 지속가능한 혁신을 표현하는 프리미엄 컬렉션입니다.",
        isSpecial: true
    }
];

// 상태 변수들
let isFlipped = false;
let currentColor = null;
let isAnimating = false;

// 그라데이션 카드 관련 변수들
let gradientIsFlipped = false;
let gradientCurrentColor = null;
let gradientIsAnimating = false;

// ==================== QR 라이브러리 로드 ====================

function loadQRLibrary() {
    return new Promise((resolve, reject) => {
        if (typeof QRious !== 'undefined') {
            resolve();
            return;
        }
        
        const cdnUrls = [
            'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js',
            'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js'
        ];
        
        let currentCdnIndex = 0;
        
        function tryLoadFromCdn() {
            if (currentCdnIndex >= cdnUrls.length) {
                reject();
                return;
            }
            
            const url = cdnUrls[currentCdnIndex];
            const newScript = document.createElement('script');
            newScript.src = url;
            newScript.onload = () => resolve();
            newScript.onerror = () => {
                currentCdnIndex++;
                if (newScript.parentNode) {
                    newScript.parentNode.removeChild(newScript);
                }
                setTimeout(tryLoadFromCdn, 500);
            };
            
            document.head.appendChild(newScript);
        }
        
        tryLoadFromCdn();
    });
}

// ==================== 스튜디오 메인 초기화 ====================

function initStudio() {
    // 메인 탭 전환 기능
    const tabs = document.querySelectorAll('.studio-page-tab');
    const panels = document.querySelectorAll('.studio-tab-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            const targetPanel = document.getElementById(this.dataset.tab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // 디자인 계산기 탭이 활성화될 때 그리드 다시 계산
                if (this.dataset.tab === 'design-calculator') {
                    setTimeout(() => {
                        if (document.getElementById('calc-max-width')) {
                            calculateAndVisualizeGrid();
                        }
                    }, 100);
                }
            }
        });
    });

    // 서브 탭 전환 기능
    const subTabs = document.querySelectorAll('.studio-sub-tab');
    
    subTabs.forEach(subTab => {
        subTab.addEventListener('click', function() {
            const parentContainer = this.closest('.studio-tab-panel');
            const siblingTabs = parentContainer.querySelectorAll('.studio-sub-tab');
            const subPanels = parentContainer.querySelectorAll('.studio-sub-panel');
            
            siblingTabs.forEach(t => t.classList.remove('active'));
            subPanels.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            const targetSubPanel = parentContainer.querySelector(`#${this.dataset.subtab}`);
            if (targetSubPanel) {
                targetSubPanel.classList.add('active');
            }
        });
    });

    // 각 탭별 초기화
    initQRGenerator();
    initColorPalette();
    initColorGenerator();
    initImageExtractor();
    initDesignCalculator();
}

// ==================== QR 생성기 기능 ====================

function initQRGenerator() {
    // QR 생성기는 별도 초기화 불필요
}

// ==================== 개선된 컬러 팔레트 기능 (실시간 업데이트) ====================

function initColorPalette() {
    // 컬러 피커 이벤트
    const colorPicker = document.getElementById('studio-base-color');
    if (colorPicker) {
        colorPicker.addEventListener('input', syncColorFromPicker);
    }
    
    // RGB 슬라이더 이벤트
    ['red', 'green', 'blue'].forEach(color => {
        const slider = document.getElementById(`${color}-slider`);
        if (slider) {
            slider.addEventListener('input', syncColorFromRGB);
        }
    });
    
    // 팔레트 타입 라디오 버튼 이벤트
    const paletteRadios = document.querySelectorAll('input[name="palette-type"]');
    paletteRadios.forEach(radio => {
        radio.addEventListener('change', generatePalette);
    });
    
    // 초기 팔레트 생성
    generatePalette();
}

function syncColorFromPicker() {
    const colorPicker = document.getElementById('studio-base-color');
    const colorCodeInput = document.getElementById('studio-color-code-input');
    
    if (!colorPicker || !colorCodeInput) return;
    
    const hex = colorPicker.value;
    colorCodeInput.value = hex;
    updateRGBFromHex(hex);
    
    // 실시간 팔레트 업데이트
    generatePalette();
}

function syncColorFromRGB() {
    const r = parseInt(document.getElementById('red-slider').value);
    const g = parseInt(document.getElementById('green-slider').value);
    const b = parseInt(document.getElementById('blue-slider').value);
    
    // 값 표시 업데이트
    document.getElementById('red-value').textContent = r;
    document.getElementById('green-value').textContent = g;
    document.getElementById('blue-value').textContent = b;
    
    // HEX 변환
    const hex = rgbToHex(r, g, b);
    
    // 컬러 피커와 입력 필드 업데이트
    const colorPicker = document.getElementById('studio-base-color');
    const colorCodeInput = document.getElementById('studio-color-code-input');
    
    if (colorPicker) colorPicker.value = hex;
    if (colorCodeInput) colorCodeInput.value = hex;
    
    // 실시간 팔레트 업데이트
    generatePalette();
}

function updateRGBFromHex(hex) {
    const rgb = hexToRgbValues(hex);
    
    document.getElementById('red-slider').value = rgb.r;
    document.getElementById('green-slider').value = rgb.g;
    document.getElementById('blue-slider').value = rgb.b;
    
    document.getElementById('red-value').textContent = rgb.r;
    document.getElementById('green-value').textContent = rgb.g;
    document.getElementById('blue-value').textContent = rgb.b;
}

function applyColorCode() {
    const colorCodeInput = document.getElementById('studio-color-code-input');
    if (!colorCodeInput) return;
    
    let hex = colorCodeInput.value.trim();
    
    // # 추가
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    // 유효성 검사
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        alert('올바른 색상 코드를 입력해주세요. (예: #01FF75)');
        return;
    }
    
    // 컬러 피커 업데이트
    const colorPicker = document.getElementById('studio-base-color');
    if (colorPicker) {
        colorPicker.value = hex;
    }
    
    // RGB 슬라이더 업데이트
    updateRGBFromHex(hex);
    
    colorCodeInput.value = hex;
    
    // 실시간 팔레트 업데이트
    generatePalette();
}

function generatePalette() {
    const baseColor = document.getElementById('studio-base-color');
    const type = document.querySelector('input[name="palette-type"]:checked');
    const result = document.getElementById('studio-palette-result');
    
    if (!baseColor || !type || !result) return;
    
    let colors = [];
    const hsl = hexToHsl(baseColor.value);
    
    switch(type.value) {
        case 'monochrome':
            colors = generateMonochrome(hsl);
            break;
        case 'analogous':
            colors = generateAnalogous(hsl);
            break;
        case 'complementary':
            colors = generateComplementary(hsl);
            break;
        case 'triadic':
            colors = generateTriadic(hsl);
            break;
    }
    
    displayColors(colors, result);
}

// ==================== 수정된 컬러 생성기 기능 ====================

function initColorGenerator() {
    // DOM 요소들
    const cardElement = document.getElementById('single-card-element');
    const cardQuestion = document.getElementById('card-question');
    const cardResult = document.getElementById('card-result');
    const colorDisplay = document.getElementById('color-display');
    const colorHex = document.getElementById('color-hex');
    const colorName = document.getElementById('color-name');
    const colorDescription = document.getElementById('color-description');
    const pickBtn = document.getElementById('single-pick-btn');
    const cardActions = document.getElementById('single-card-actions');
    const copyBtn = document.getElementById('single-copy-btn');
    const newBtn = document.getElementById('single-new-btn');

    function drawCard() {
    if (isAnimating) return;
    
    isAnimating = true;
    pickBtn.disabled = true;
    pickBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 뽑는 중...';
    
    // 카드 뒤집기 애니메이션
    cardElement.classList.add('card-flip');
    
    setTimeout(() => {
        // 랜덤 색상 선택
        const randomIndex = Math.floor(Math.random() * colorCards.length);
        currentColor = colorCards[randomIndex];
        
        // 카드 내용 업데이트
        colorDisplay.style.backgroundColor = currentColor.hex;
        colorHex.textContent = currentColor.hex;
        colorName.textContent = currentColor.name;
        colorDescription.textContent = currentColor.description;
        
        // NFP 특별 색상인지 확인하고 특별 효과 적용
        if (currentColor.isSpecial) {
            triggerSpecialEffect();
        }
        
        // 카드 상태 변경
        cardQuestion.style.display = 'none';
        cardResult.style.display = 'flex';
        
        // 버튼 상태 변경
        pickBtn.style.display = 'none';
        cardActions.style.display = 'flex';
        
        isFlipped = true;
        isAnimating = false;
        
        cardElement.classList.remove('card-flip');
    }, 800);
}

// 특별 효과 함수 추가
// 수정된 특별 효과 함수 (글로우 + 번쩍임 + 사운드만)
function triggerSpecialEffect() {
    // 1. 화면 번쩍임 효과
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, #01FF75, #00FFCC);
        opacity: 0.3;
        z-index: 9999;
        pointer-events: none;
        animation: nfpFlash 0.5s ease-out;
    `;
    
    // CSS 애니메이션 정의 (글로우만 포함, 스케일업과 테두리 제거)
    if (!document.querySelector('#nfp-special-style')) {
        const style = document.createElement('style');
        style.id = 'nfp-special-style';
        style.textContent = `
            @keyframes nfpFlash {
                0% { opacity: 0; }
                50% { opacity: 0.3; }
                100% { opacity: 0; }
            }
            
            @keyframes nfpGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(1, 255, 117, 0.5); }
                50% { box-shadow: 0 0 40px rgba(1, 255, 117, 0.8), 0 0 60px rgba(1, 255, 117, 0.4); }
            }
            
            .nfp-special-card {
                animation: nfpGlow 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(flashOverlay);
    
    // 2. 카드에 글로우 효과만 추가 (테두리와 스케일업 제거)
    cardElement.classList.add('nfp-special-card');
    
    // 3. 특별 축하 사운드 효과
    try {
        // Web Audio API를 사용한 간단한 축하 사운드
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // 사운드 재생 실패 시 무시
    }
    
    // 4. 3초 후 특별 효과 제거
    setTimeout(() => {
        if (flashOverlay.parentNode) {
            flashOverlay.remove();
        }
        cardElement.classList.remove('nfp-special-card');
    }, 3000);
    
    // 0.5초 후 플래시 오버레이 제거
    setTimeout(() => {
        if (flashOverlay.parentNode) {
            flashOverlay.remove();
        }
    }, 500);
}

    // 카드 리셋 함수
    function resetCard() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // 페이드 아웃 애니메이션
        cardElement.classList.add('card-fade');
        
        setTimeout(() => {
            // 카드 상태 리셋
            cardResult.style.display = 'none';
            cardQuestion.style.display = 'flex';
            
            // 버튼 상태 리셋
            cardActions.style.display = 'none';
            pickBtn.style.display = 'inline-block';
            pickBtn.disabled = false;
            pickBtn.innerHTML = '<i class="fas fa-magic"></i> 컬러 카드 뽑기';
            
            isFlipped = false;
            currentColor = null;
            isAnimating = false;
            
            cardElement.classList.remove('card-fade');
        }, 300);
    }

    // 색상 코드 복사 함수
    function copyColorCode() {
        if (!currentColor) return;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(currentColor.hex).then(() => {
                // 토스트 메시지 표시
                showCopyToast();
                
                // 버튼 피드백
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
                copyBtn.style.borderColor = '#01FF75';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.borderColor = 'rgba(1, 255, 117, 0.3)';
                }, 1500);
            });
        }
    }

    // 이벤트 리스너 등록
    if (cardElement) {
        cardElement.addEventListener('click', () => {
            if (!isFlipped && !isAnimating) {
                drawCard();
            }
        });
    }
    
    if (pickBtn) pickBtn.addEventListener('click', drawCard);
    if (newBtn) newBtn.addEventListener('click', resetCard);
    if (copyBtn) copyBtn.addEventListener('click', copyColorCode);
    
    // 그라데이션 카드 이벤트 리스너
    const gradientCardElement = document.getElementById('gradient-card-element');
    const gradientPickBtn = document.getElementById('gradient-pick-btn');
    const gradientCopyBtn = document.getElementById('gradient-copy-btn');
    const gradientNewBtn = document.getElementById('gradient-new-btn');

    if (gradientCardElement) {
        gradientCardElement.addEventListener('click', () => {
            if (!gradientIsFlipped && !gradientIsAnimating) {
                drawGradientCard();
            }
        });
    }

    if (gradientPickBtn) gradientPickBtn.addEventListener('click', drawGradientCard);
    if (gradientNewBtn) gradientNewBtn.addEventListener('click', resetGradientCard);
    if (gradientCopyBtn) gradientCopyBtn.addEventListener('click', copyGradientCode);
    
    // 5색 팔레트 이벤트 (기존 코드 그대로 유지)
    const palette5Btn = document.getElementById('palette-5-btn');
    if (palette5Btn) palette5Btn.addEventListener('click', generate5ColorPalette);
    
    // 그라디언트 이벤트 (기존 코드 그대로 유지)
    const gradient2Btn = document.getElementById('gradient-2-btn');
    const gradient3Btn = document.getElementById('gradient-3-btn');
    if (gradient2Btn) gradient2Btn.addEventListener('click', () => generateGradient(2));
    if (gradient3Btn) gradient3Btn.addEventListener('click', () => generateGradient(3));
    
    // 초기 상태에서 결과 숨기기
}

// ==================== 그라데이션 카드 기능 ====================

// 그라데이션 카드 뽑기 함수
function drawGradientCard() {
    if (gradientIsAnimating) return;
    
    gradientIsAnimating = true;
    const gradientPickBtn = document.getElementById('gradient-pick-btn');
    gradientPickBtn.disabled = true;
    gradientPickBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 뽑는 중...';
    
    // 카드 뒤집기 애니메이션
    const gradientCardElement = document.getElementById('gradient-card-element');
    gradientCardElement.classList.add('card-flip');
    
    setTimeout(() => {
        // 랜덤 그라데이션 색상 선택
        const randomIndex = Math.floor(Math.random() * gradientColorCards.length);
        gradientCurrentColor = gradientColorCards[randomIndex];
        
        // 카드 내용 업데이트
        const gradientColorDisplay = document.getElementById('gradient-color-display');
        const gradientColorHex = document.getElementById('gradient-color-hex');
        const gradientColorName = document.getElementById('gradient-color-name');
        const gradientColorDescription = document.getElementById('gradient-color-description');
        
        gradientColorDisplay.style.background = gradientCurrentColor.gradient;
        gradientColorHex.textContent = "GRADIENT";
        gradientColorName.textContent = gradientCurrentColor.name;
        gradientColorDescription.textContent = gradientCurrentColor.description;
        
        // 카드 상태 변경
        const gradientCardQuestion = document.getElementById('gradient-card-question');
        const gradientCardResult = document.getElementById('gradient-card-result');
        gradientCardQuestion.style.display = 'none';
        gradientCardResult.style.display = 'flex';
        
        // 버튼 상태 변경
        gradientPickBtn.style.display = 'none';
        const gradientCardActions = document.getElementById('gradient-card-actions');
        gradientCardActions.style.display = 'flex';
        
        gradientIsFlipped = true;
        gradientIsAnimating = false;
        
        gradientCardElement.classList.remove('card-flip');
    }, 800);
}

// 그라데이션 카드 리셋 함수
function resetGradientCard() {
    if (gradientIsAnimating) return;
    
    gradientIsAnimating = true;
    
    const gradientCardElement = document.getElementById('gradient-card-element');
    gradientCardElement.classList.add('card-fade');
    
    setTimeout(() => {
        // 카드 상태 리셋
        const gradientCardResult = document.getElementById('gradient-card-result');
        const gradientCardQuestion = document.getElementById('gradient-card-question');
        gradientCardResult.style.display = 'none';
        gradientCardQuestion.style.display = 'flex';
        
        // 버튼 상태 리셋
        const gradientCardActions = document.getElementById('gradient-card-actions');
        const gradientPickBtn = document.getElementById('gradient-pick-btn');
        gradientCardActions.style.display = 'none';
        gradientPickBtn.style.display = 'inline-block';
        gradientPickBtn.disabled = false;
        gradientPickBtn.innerHTML = '<i class="fas fa-magic"></i> 그라데이션 카드 뽑기';
        
        gradientIsFlipped = false;
        gradientCurrentColor = null;
        gradientIsAnimating = false;
        
        gradientCardElement.classList.remove('card-fade');
    }, 300);
}

// 그라데이션 코드 복사 함수
function copyGradientCode() {
    if (!gradientCurrentColor) return;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(gradientCurrentColor.gradient).then(() => {
            // 토스트 메시지 표시
            showCopyToast();
            
            // 버튼 피드백
            const gradientCopyBtn = document.getElementById('gradient-copy-btn');
            const originalText = gradientCopyBtn.innerHTML;
            gradientCopyBtn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
            gradientCopyBtn.style.borderColor = '#01FF75';
            
            setTimeout(() => {
                gradientCopyBtn.innerHTML = originalText;
                gradientCopyBtn.style.borderColor = 'rgba(1, 255, 117, 0.3)';
            }, 1500);
        });
    }
}

function resetSingleCard() {
    const card = document.getElementById('single-card-element');
    const button = document.getElementById('single-pick-btn');
    const actions = document.getElementById('single-card-actions');
    
    if (!card) return;
    
    // 카드 회전 애니메이션
    card.classList.add('flipping');
    
    setTimeout(() => {
        // 물음표 카드로 되돌리기
        card.innerHTML = `
            <div class="card-question active">
                <div class="question-icon">
                    <i class="fas fa-question"></i>
                </div>
                <div class="question-text">
                    <h3>컬러 카드 뽑기</h3>
                    <p>클릭하여 새로운 컬러를 발견해보세요</p>
                </div>
            </div>
        `;
    }, 400);
    
    setTimeout(() => {
        card.classList.remove('flipping');
        
        // 버튼 복원
        if (button) {
            button.style.display = 'inline-block';
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-magic"></i> 컬러 카드 뽑기';
        }
        
        // 액션 버튼 숨기기
        if (actions) actions.style.display = 'none';
        
        currentCard = null;
    }, 800);
}

function copySingleColor() {
    if (!currentCard) return;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentCard.hex);
    }
    
    const btn = document.getElementById('single-copy-btn');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
    btn.style.background = '#00e066';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

function generate5ColorPalette() {
    const button = document.getElementById('palette-5-btn');
    const result = document.getElementById('palette-5-result');
    
    if (!button || !result) return;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    
    setTimeout(() => {
        // 랜덤 베이스 컬러 생성
        const baseHue = Math.floor(Math.random() * 360);
        const baseSat = 50 + Math.floor(Math.random() * 50);
        const baseLit = 40 + Math.floor(Math.random() * 40);
        
        const colors = generateRandomPalette([baseHue, baseSat, baseLit], 5);
        
        // 5색 팔레트 표시
       result.innerHTML = `
        <div class="palette-5-colors">
            ${colors.map(color => `
                <div class="palette-5-item">
                    <div class="palette-5-color" style="background-color: ${color}" onclick="copyColorWithFeedback('${color}')"></div>
                    <div class="palette-5-color-code">${color}</div>
                </div>
            `).join('')}
        </div>
    `;
        
        result.style.display = 'block';
        
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-magic"></i> 5색 팔레트 생성';
    }, 1000);
}

function generateGradient(colorCount) {
    const button = document.getElementById(`gradient-${colorCount}-btn`);
    const result = document.getElementById(`gradient-${colorCount}-result`);
    
    if (!button || !result) return;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    
    setTimeout(() => {
        // 랜덤 베이스 컬러 생성
        const baseHue = Math.floor(Math.random() * 360);
        const baseSat = 50 + Math.floor(Math.random() * 50);
        const baseLit = 40 + Math.floor(Math.random() * 40);
        
        const colors = generateRandomGradient([baseHue, baseSat, baseLit], colorCount);
        const gradientCSS = `linear-gradient(to right, ${colors.join(', ')})`;
        
      // 그라디언트 결과 표시
        result.innerHTML = `
            <div class="gradient-bar" style="background: ${gradientCSS}" onclick="copyColorWithFeedback('background: ${gradientCSS};')"></div>
            <div class="gradient-colors">
                ${colors.map(color => `
                    <div class="gradient-item">
                        <div class="gradient-color" style="background-color: ${color}" onclick="copyColorWithFeedback('${color}')"></div>
                        <div class="gradient-color-code">${color}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        result.style.display = 'block';
        
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-magic"></i> ${colorCount}색 그라디언트 생성`;
    }, 1000);
}

function copyColorWithFeedback(color) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(color);
    }
    
    // 토스트 알림 생성
    showCopyToast();
}

function showCopyToast() {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.copy-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.innerHTML = '<i class="fas fa-check"></i> 클립보드에 복사됨!';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #01ff75;
        color: black;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10000;
        animation: toastShow 0.3s ease;
    `;
    
    // CSS 애니메이션 추가
    if (!document.querySelector('#toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes toastShow {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 2초 후 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastShow 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 2000);
}

// ==================== 개선된 이미지 컬러 추출기 ====================

function initImageExtractor() {
    const imageFile = document.getElementById('studio-image-file');
    const uploadArea = document.getElementById('studio-image-upload');
    
    if (imageFile) {
        imageFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                extractColorsFromImage(file);
            }
        });
    }

    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                extractColorsFromImage(files[0]);
            }
        });
    }
}

function extractColorsFromImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('studio-extraction-canvas');
            if (!canvas) return;
            
            // willReadFrequently 속성 설정으로 콘솔 경고 해결
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // 이미지 크기 조정 (성능 최적화)
            const maxSize = 300;
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const colorsWithPercentage = extractDominantColorsWithPercentage(ctx, width, height);
            const container = document.getElementById('studio-extracted-colors');
            if (container) {
                displayExtractionResult(colorsWithPercentage, container);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function extractDominantColorsWithPercentage(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const colorCounts = {};
    let totalPixels = 0;
    
    // 개선된 색상 추출 로직
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];
        
        // 투명도가 높고 극단적인 색상이 아닌 경우만 포함
        if (alpha > 200) {
            // 색상 그룹화를 더 세밀하게 (10 단위로 그룹화)
            const groupedR = Math.floor(r / 10) * 10;
            const groupedG = Math.floor(g / 10) * 10;
            const groupedB = Math.floor(b / 10) * 10;
            
            const color = `${groupedR},${groupedG},${groupedB}`;
            colorCounts[color] = (colorCounts[color] || 0) + 1;
            totalPixels++;
        }
    }
    
    // 색상 빈도순 정렬 및 상위 5개 추출
    const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    // 퍼센트 정규화 (상위 5개 색상의 합계가 100%가 되도록)
    const top5TotalCount = sortedColors.reduce((sum, [, count]) => sum + count, 0);
    
    return sortedColors.map(([color, count]) => {
        const [r, g, b] = color.split(',').map(Number);
        const percentage = Math.round((count / top5TotalCount) * 100);
        return {
            hex: rgbToHex(r, g, b),
            rgb: `${r}, ${g}, ${b}`,
            percentage: percentage
        };
    });
}

function displayExtractionResult(colorsWithPercentage, container) {
    container.innerHTML = '';
    
    colorsWithPercentage.forEach(colorData => {
        const item = document.createElement('div');
        item.className = 'extraction-color-item';
        item.innerHTML = `
            <div class="extraction-color-left">
                <div class="extraction-color-square" style="background-color: ${colorData.hex}"></div>
                <div class="extraction-color-info">
                    <div class="extraction-color-code">${colorData.hex}</div>
                    <div class="extraction-color-rgb">RGB: ${colorData.rgb}</div>
                </div>
            </div>
            <div class="extraction-color-right">
                <div class="extraction-percentage-bar">
                    <div class="extraction-percentage-fill" style="width: ${colorData.percentage}%; background-color: ${colorData.hex};"></div>
                </div>
                <div class="extraction-percentage-text">${colorData.percentage}%</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(colorData.hex);
            }
            
            // 토스트 알림 표시
            showCopyToast();
            
            // 시각적 피드백
            const originalBorder = item.style.borderColor;
            item.style.borderColor = 'var(--accent-color)';
            item.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                item.style.borderColor = originalBorder;
                item.style.transform = 'translateY(-2px)';
            }, 200);
        });
        
        container.appendChild(item);
    });
    
    container.style.display = 'flex';
}

// ==================== 개선된 디자인 계산기 ====================

function initDesignCalculator() {
    // 그리드 계산기 이벤트
    const gridInputs = ['calc-max-width', 'calc-columns', 'calc-gutter', 'calc-margin'];
    gridInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateAndVisualizeGrid);
        }
    });
    
    // 폰트 사이즈 계산기 이벤트
    const pxInput = document.getElementById('calc-px-input');
    const ptInput = document.getElementById('calc-pt-input');
    
    if (pxInput) {
        pxInput.addEventListener('input', updateFontSizes);
    }
    
    if (ptInput) {
        ptInput.addEventListener('input', updateFontSizesFromPt);
    }
    
    // 초기 계산 실행
    setTimeout(() => {
        if (document.getElementById('calc-max-width')) {
            calculateAndVisualizeGrid();
        }
        if (document.getElementById('calc-px-input')) {
            updateFontSizes();
        }
         initSizeCalculator();
        initUnitConverter();
    }, 200);
}

function calculateAndVisualizeGrid() {
    const maxWidth = parseInt(document.getElementById('calc-max-width')?.value) || 1280;
    const columns = parseInt(document.getElementById('calc-columns')?.value) || 4;
    const gutter = parseInt(document.getElementById('calc-gutter')?.value) || 0;
    const margin = parseInt(document.getElementById('calc-margin')?.value) || 0;
    
    const totalGutters = (columns - 1) * gutter;
    const totalMargins = margin * 2;
    const availableWidth = maxWidth - totalGutters - totalMargins;
    const columnWidth = Math.floor(availableWidth / columns);
    const actualPageWidth = (columnWidth * columns) + totalGutters + totalMargins;
    
    const pageWidthEl = document.getElementById('calc-page-width');
    const columnWidthEl = document.getElementById('calc-column-width');
    const gutterDisplayEl = document.getElementById('calc-gutter-display');
    const marginDisplayEl = document.getElementById('calc-margin-display');
    
    if (pageWidthEl) pageWidthEl.textContent = `${actualPageWidth}px`;
    if (columnWidthEl) columnWidthEl.textContent = `${columnWidth}px`;
    if (gutterDisplayEl) gutterDisplayEl.textContent = `${gutter}px`;
    if (marginDisplayEl) marginDisplayEl.textContent = `${margin}px`;
    
    visualizeGrid(actualPageWidth, columnWidth, columns, gutter, margin);
}

function visualizeGrid(pageWidth, columnWidth, columns, gutter, margin) {
    const preview = document.getElementById('calc-grid-preview');
    if (!preview) return;
    
    preview.innerHTML = '';
    
    // 부모 컨테이너의 실제 너비 활용
    const previewRect = preview.getBoundingClientRect();
    const availableWidth = previewRect.width - 40; // 여백 최소화
    
    // 스케일 계산을 더 관대하게
    const scale = Math.min(availableWidth / pageWidth, 2); // 최대 2배까지 확대
    const scaledWidth = Math.min(pageWidth * scale, availableWidth); // 사용 가능한 너비 최대 활용
    
    const scaledColumnWidth = columnWidth * scale;
    const scaledGutter = gutter * scale;
    const scaledMargin = margin * scale;
    
    const container = document.createElement('div');
    container.className = 'studio-grid-container';
    
    const baseHeight = window.innerWidth <= 480 ? 100 : window.innerWidth <= 768 ? 120 : 140;
    container.style.height = `${baseHeight}px`;
    container.style.width = `${scaledWidth}px`; // 더 넓게 설정
    container.style.position = 'relative';
    container.style.margin = '0 auto'
    
   // 마진이 0 이하일 때는 표시하지 않음
if (margin > 0) {
    const leftMargin = document.createElement('div');
    leftMargin.className = 'studio-grid-margin left';
    leftMargin.style.width = `${Math.max(scaledMargin, 2)}px`;
    leftMargin.textContent = margin;
    container.appendChild(leftMargin);
    
    const rightMargin = document.createElement('div');
    rightMargin.className = 'studio-grid-margin right';
    rightMargin.style.width = `${Math.max(scaledMargin, 2)}px`;
    rightMargin.textContent = margin;
    container.appendChild(rightMargin);
}
    
// 컬럼 생성
for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'studio-grid-column';
    
    const left = scaledMargin + (i * (scaledColumnWidth + scaledGutter));
    const finalColumnWidth = Math.max(scaledColumnWidth, 4);
    
    column.style.left = `${left}px`;
    column.style.width = `${finalColumnWidth}px`;
    column.textContent = columnWidth;
    
    if (finalColumnWidth < 8) {
        column.style.opacity = '0.6';
        column.style.fontSize = '10px';
    }
    
    container.appendChild(column);
}

// 간격 시각화 추가
for (let i = 0; i < columns - 1; i++) {
    if (gutter > 0 && scaledGutter >= 1) {
        const gutterElement = document.createElement('div');
        gutterElement.className = 'studio-grid-gutter';
        
        // 간격 위치를 더 정확하게 계산
        const gutterLeft = scaledMargin + ((i + 1) * scaledColumnWidth) + (i * scaledGutter);
        gutterElement.style.left = `${gutterLeft}px`;
        gutterElement.style.width = `${Math.max(scaledGutter, 8)}px`;
        gutterElement.textContent = gutter;
        
        container.appendChild(gutterElement);
    }
}

preview.appendChild(container);

}

// 폰트 사이즈 계산 함수들
function convertPxToPt(px) {
    return Math.round((px * 0.75) * 10) / 10;
}

function convertPtToPx(pt) {
    return Math.round((pt / 0.75) * 10) / 10;
}

function updateFontSizes() {
    const pxInput = document.getElementById('calc-px-input');
    const ptInput = document.getElementById('calc-pt-input');
    
    if (!pxInput || !ptInput) return;
    
    const px = parseFloat(pxInput.value) || 16;
    const pt = convertPxToPt(px);
    
    ptInput.value = pt;
    updateResponsiveSizes(px);
    updateSizeGuide(px);
    updateFontPreview(px, pt);
}

function updateFontSizesFromPt() {
    const pxInput = document.getElementById('calc-px-input');
    const ptInput = document.getElementById('calc-pt-input');
    
    if (!pxInput || !ptInput) return;
    
    const pt = parseFloat(ptInput.value) || 12;
    const px = convertPtToPx(pt);
    
    pxInput.value = px;
    updateResponsiveSizes(px);
    updateSizeGuide(px);
    updateFontPreview(px, pt);
}

function updateResponsiveSizes(basePx) {
    const mobile = Math.round((basePx * 0.875) * 10) / 10;
    const tablet = basePx;
    const desktop = Math.round((basePx * 1.125) * 10) / 10;
    
    const mobileEl = document.getElementById('mobile-size');
    const tabletEl = document.getElementById('tablet-size');
    const desktopEl = document.getElementById('desktop-size');
    
    if (mobileEl) mobileEl.textContent = `${mobile}px`;
    if (tabletEl) tabletEl.textContent = `${tablet}px`;
    if (desktopEl) desktopEl.textContent = `${desktop}px`;
}

function updateSizeGuide(basePx) {
    const baseRatio = basePx / 16;
    
    const sizes = {
        body: Math.round(16 * baseRatio),
        subtitle: Math.round(20 * baseRatio),
        title: Math.round(24 * baseRatio),
        heading: Math.round(32 * baseRatio),
        caption: Math.round(14 * baseRatio)
    };
    
    const guideBody = document.getElementById('guide-body');
    const guideSubtitle = document.getElementById('guide-subtitle');
    const guideTitle = document.getElementById('guide-title');
    const guideHeading = document.getElementById('guide-heading');
    const guideCaption = document.getElementById('guide-caption');
    
    if (guideBody) guideBody.textContent = `웹: ${sizes.body}px 인쇄: ${convertPxToPt(sizes.body)}pt`;
    if (guideSubtitle) guideSubtitle.textContent = `웹: ${sizes.subtitle}px 인쇄: ${convertPxToPt(sizes.subtitle)}pt`;
    if (guideTitle) guideTitle.textContent = `웹: ${sizes.title}px 인쇄: ${convertPxToPt(sizes.title)}pt`;
    if (guideHeading) guideHeading.textContent = `웹: ${sizes.heading}px 인쇄: ${convertPxToPt(sizes.heading)}pt`;
    if (guideCaption) guideCaption.textContent = `웹: ${sizes.caption}px 인쇄: ${convertPxToPt(sizes.caption)}pt`;
}

function updateFontPreview(px, pt) {
    const preview = document.getElementById('font-preview-text');
    if (preview) {
        preview.style.fontSize = `${px}px`;
        preview.textContent = `이 텍스트는 ${px}px(${pt}pt) 크기입니다`;
    }
}

// ==================== 새로운 사이즈 계산기 기능 ====================

function initSizeCalculator() {
    // 비율 계산기 이벤트 리스너
    const ratioWidthInput = document.getElementById('ratio-width');
    const ratioHeightInput = document.getElementById('ratio-height');
    
    if (ratioWidthInput) {
        ratioWidthInput.addEventListener('input', calculateRatioResolutions);
    }
    if (ratioHeightInput) {
        ratioHeightInput.addEventListener('input', calculateRatioResolutions);
    }
    
    // 커스텀 사이즈 변환 이벤트 리스너
    const originalWidthInput = document.getElementById('original-width');
    const originalHeightInput = document.getElementById('original-height');
    const targetRatioWidthInput = document.getElementById('target-ratio-width');
    const targetRatioHeightInput = document.getElementById('target-ratio-height');
    
    const customInputs = [originalWidthInput, originalHeightInput, targetRatioWidthInput, targetRatioHeightInput];
    customInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateCustomSizeConversion);
        }
    });
    
    // 초기 계산 실행
    setTimeout(() => {
        calculateRatioResolutions();
    }, 100);
}

function calculateRatioResolutions() {
    const ratioWidth = parseFloat(document.getElementById('ratio-width')?.value) || 16;
    const ratioHeight = parseFloat(document.getElementById('ratio-height')?.value) || 9;
    
    // 기준 해상도들
    const baseResolutions = {
        '4k': 3840,
        'fhd': 1920,
        'hd': 1280,
        'sd': 854
    };
    
    // 비율에 맞춰 높이 계산
    Object.keys(baseResolutions).forEach(key => {
        const width = baseResolutions[key];
        const height = Math.round((width * ratioHeight) / ratioWidth);
        
        const resultElement = document.getElementById(`ratio-${key}`);
        if (resultElement) {
            resultElement.textContent = `${width}×${height}`;
        }
    });
}

function calculateCustomSizeConversion() {
    const originalWidth = parseFloat(document.getElementById('original-width')?.value);
    const originalHeight = parseFloat(document.getElementById('original-height')?.value);
    const targetRatioWidth = parseFloat(document.getElementById('target-ratio-width')?.value);
    const targetRatioHeight = parseFloat(document.getElementById('target-ratio-height')?.value);
    
    const cropResult = document.getElementById('crop-result');
    const fitResult = document.getElementById('fit-result');
    
    // 입력값이 모두 있는지 확인
    if (!originalWidth || !originalHeight || !targetRatioWidth || !targetRatioHeight) {
        if (cropResult) cropResult.textContent = '-';
        if (fitResult) fitResult.textContent = '-';
        return;
    }
    
    // 현재 비율과 목표 비율 계산
    const currentRatio = originalWidth / originalHeight;
    const targetRatio = targetRatioWidth / targetRatioHeight;
    
    let cropWidth, cropHeight, fitWidth, fitHeight;
    
    if (currentRatio > targetRatio) {
        // 현재가 더 가로로 긴 경우
        // 크롭: 높이 기준으로 가로를 줄임
        cropHeight = originalHeight;
        cropWidth = Math.round(originalHeight * targetRatio);
        
        // 핏: 가로 기준으로 높이를 늘림
        fitWidth = originalWidth;
        fitHeight = Math.round(originalWidth / targetRatio);
    } else {
        // 현재가 더 세로로 긴 경우
        // 크롭: 가로 기준으로 세로를 줄임
        cropWidth = originalWidth;
        cropHeight = Math.round(originalWidth / targetRatio);
        
        // 핏: 세로 기준으로 가로를 늘림
        fitHeight = originalHeight;
        fitWidth = Math.round(originalHeight * targetRatio);
    }
    
    // 결과 표시
    if (cropResult) {
        cropResult.textContent = `${cropWidth}×${cropHeight}`;
    }
    if (fitResult) {
        fitResult.textContent = `${fitWidth}×${fitHeight}`;
    }
}

// ==================== 새로운 단위 변환기 기능 ====================

function initUnitConverter() {
    // 단위 변환 상수 (96 DPI 기준)
    const CONVERSION_RATES = {
        // 모든 단위를 px 기준으로 변환
        px: 1,
        pt: 96 / 72,        // 1pt = 96/72 px (96 DPI 기준)
        mm: 96 / 25.4,      // 1mm = 96/25.4 px (96 DPI 기준)
        cm: 96 / 2.54,      // 1cm = 96/2.54 px (96 DPI 기준)
        inch: 96            // 1inch = 96px (96 DPI 기준)
    };
    
    // 라디오 버튼 이벤트 리스너
    const baseUnitRadios = document.querySelectorAll('input[name="base-unit"]');
    const targetUnitRadios = document.querySelectorAll('input[name="target-unit"]');
    
    baseUnitRadios.forEach(radio => {
        radio.addEventListener('change', updateUnitLabels);
    });
    
    targetUnitRadios.forEach(radio => {
        radio.addEventListener('change', updateUnitLabels);
    });
    
    // 입력 필드 이벤트 리스너
    const baseInput = document.getElementById('base-unit-input');
    const targetInput = document.getElementById('target-unit-input');
    
    if (baseInput) {
        baseInput.addEventListener('input', () => convertFromBase());
    }
    
    if (targetInput) {
        targetInput.addEventListener('input', () => convertFromTarget());
    }
    
    // 초기 라벨 설정
    updateUnitLabels();
}

function updateUnitLabels() {
    const baseUnit = document.querySelector('input[name="base-unit"]:checked')?.value || 'px';
    const targetUnit = document.querySelector('input[name="target-unit"]:checked')?.value || 'mm';
    
    // 단위 이름 맵핑
    const unitNames = {
        px: '픽셀 (px)',
        pt: '포인트 (pt)',
        mm: '밀리미터 (mm)',
        cm: '센티미터 (cm)',
        inch: '인치 (inch)'
    };
    
    // 라벨과 심볼 업데이트
    const baseLabel = document.getElementById('base-unit-label');
    const targetLabel = document.getElementById('target-unit-label');
    const baseSymbol = document.getElementById('base-unit-symbol');
    const targetSymbol = document.getElementById('target-unit-symbol');
    
    if (baseLabel) baseLabel.textContent = unitNames[baseUnit];
    if (targetLabel) targetLabel.textContent = unitNames[targetUnit];
    if (baseSymbol) baseSymbol.textContent = baseUnit;
    if (targetSymbol) targetSymbol.textContent = targetUnit;
    
    // 현재 값이 있으면 변환 실행
    const baseInput = document.getElementById('base-unit-input');
    if (baseInput && baseInput.value) {
        convertFromBase();
    }
}

function convertFromBase() {
    const baseUnit = document.querySelector('input[name="base-unit"]:checked')?.value || 'px';
    const targetUnit = document.querySelector('input[name="target-unit"]:checked')?.value || 'mm';
    const baseValue = parseFloat(document.getElementById('base-unit-input')?.value);
    
    if (isNaN(baseValue) || baseValue === '') {
        document.getElementById('target-unit-input').value = '';
        return;
    }
    
    const convertedValue = convertUnits(baseValue, baseUnit, targetUnit);
    document.getElementById('target-unit-input').value = formatConversionResult(convertedValue);
}

function convertFromTarget() {
    const baseUnit = document.querySelector('input[name="base-unit"]:checked')?.value || 'px';
    const targetUnit = document.querySelector('input[name="target-unit"]:checked')?.value || 'mm';
    const targetValue = parseFloat(document.getElementById('target-unit-input')?.value);
    
    if (isNaN(targetValue) || targetValue === '') {
        document.getElementById('base-unit-input').value = '';
        return;
    }
    
    const convertedValue = convertUnits(targetValue, targetUnit, baseUnit);
    document.getElementById('base-unit-input').value = formatConversionResult(convertedValue);
}

function convertUnits(value, fromUnit, toUnit) {
    const CONVERSION_RATES = {
        px: 1,
        pt: 96 / 72,
        mm: 96 / 25.4,
        cm: 96 / 2.54,
        inch: 96
    };
    
    // 먼저 px로 변환한 다음 목표 단위로 변환
    const pxValue = value * CONVERSION_RATES[fromUnit];
    const result = pxValue / CONVERSION_RATES[toUnit];
    
    return result;
}

function formatConversionResult(value) {
    // 소수점 3자리까지 표시하되, 불필요한 0은 제거
    return parseFloat(value.toFixed(3)).toString();
}

// ==================== 색상 변환 유틸리티 함수들 ====================

function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

function hexToRgbValues(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ==================== 팔레트 생성 함수들 ====================

function generateMonochrome(hsl) {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        const lightness = 20 + (i * 20);
        colors.push(hslToHex(hsl[0], hsl[1], lightness));
    }
    return colors;
}

function generateAnalogous(hsl) {
    const colors = [];
    for (let i = -2; i <= 2; i++) {
        const hue = (hsl[0] + i * 30) % 360;
        colors.push(hslToHex(hue, hsl[1], hsl[2]));
    }
    return colors;
}

function generateComplementary(hsl) {
    const colors = [];
    colors.push(hslToHex(hsl[0], hsl[1], hsl[2]));
    colors.push(hslToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]));
    colors.push(hslToHex(hsl[0], hsl[1] * 0.7, hsl[2] * 1.2));
    colors.push(hslToHex((hsl[0] + 180) % 360, hsl[1] * 0.7, hsl[2] * 1.2));
    colors.push(hslToHex(hsl[0], hsl[1] * 0.5, hsl[2] * 0.8));
    return colors;
}

function generateTriadic(hsl) {
    const colors = [];
    colors.push(hslToHex(hsl[0], hsl[1], hsl[2]));
    colors.push(hslToHex((hsl[0] + 120) % 360, hsl[1], hsl[2]));
    colors.push(hslToHex((hsl[0] + 240) % 360, hsl[1], hsl[2]));
    colors.push(hslToHex(hsl[0], hsl[1] * 0.6, hsl[2] * 1.1));
    colors.push(hslToHex((hsl[0] + 120) % 360, hsl[1] * 0.6, hsl[2] * 1.1));
    return colors;
}

function generateRandomPalette(baseHsl, count) {
    const colors = [];
    const [baseH, baseS, baseL] = baseHsl;
    
    for (let i = 0; i < count; i++) {
        const hueShift = (Math.random() - 0.5) * 60; // ±30도 범위
        const satShift = (Math.random() - 0.5) * 40; // ±20% 범위
        const litShift = (Math.random() - 0.5) * 40; // ±20% 범위
        
        const h = (baseH + hueShift + 360) % 360;
        const s = Math.max(20, Math.min(100, baseS + satShift));
        const l = Math.max(20, Math.min(80, baseL + litShift));
        
        colors.push(hslToHex(h, s, l));
    }
    
    return colors;
}

function generateRandomGradient(baseHsl, count) {
    const colors = [];
    const [baseH, baseS, baseL] = baseHsl;
    
    // 시작 색상
    colors.push(hslToHex(baseH, baseS, baseL));
    
    // 끝 색상 (보색 또는 유사색)
    const endHueShift = Math.random() > 0.5 ? 180 : 60 + Math.random() * 60;
    const endH = (baseH + endHueShift) % 360;
    const endS = Math.max(30, Math.min(100, baseS + (Math.random() - 0.5) * 40));
    const endL = Math.max(20, Math.min(80, baseL + (Math.random() - 0.5) * 40));
    
    if (count === 2) {
        colors.push(hslToHex(endH, endS, endL));
    } else {
        // 중간 색상 생성
        const midH = (baseH + endH) / 2;
        const midS = (baseS + endS) / 2;
        const midL = (baseL + endL) / 2;
        
        colors.push(hslToHex(midH, midS, midL));
        colors.push(hslToHex(endH, endS, endL));
    }
    
    return colors;
}

function displayColors(colors, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    const colorItemsContainer = document.createElement('div');
    colorItemsContainer.className = 'studio-color-items-row';
    
    colors.forEach(color => {
        const item = document.createElement('div');
        item.className = 'studio-color-item';
        item.innerHTML = `
            <div class="studio-color-preview" style="background-color: ${color}"></div>
            <div class="studio-color-info">
                <div class="studio-color-code">${color}</div>
                <div class="studio-color-code">RGB: ${hexToRgb(color)}</div>
            </div>
        `;
        item.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(color);
            }
            
            // 토스트 알림 표시
            showCopyToast();
            
            // 시각적 피드백
            const originalBorder = item.style.borderColor;
            item.style.borderColor = 'var(--accent-color)';
            item.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                item.style.borderColor = originalBorder;
                item.style.transform = 'translateY(-3px)';
            }, 200);
        });
        colorItemsContainer.appendChild(item);
    });
    
    container.appendChild(colorItemsContainer);
}

// ==================== 메인 초기화 ====================

document.addEventListener('DOMContentLoaded', function() {
    // Studio 기본 기능 초기화
    initStudio();
    
    // QRious 라이브러리 로드 시도
    loadQRLibrary().then(() => {
        // QR 라이브러리 로드 완료
    }).catch(() => {
        // QR 라이브러리 로드 실패 시 무시
    });
});