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

// 컬러 카드 데이터
const colorCards = [
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
    }
];

// 전역 변수
let currentCard = null;

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
    // 단색 카드 이벤트
    const singlePickBtn = document.getElementById('single-pick-btn');
    const singleCopyBtn = document.getElementById('single-copy-btn');
    const singleNewBtn = document.getElementById('single-new-btn');
    
    if (singlePickBtn) singlePickBtn.addEventListener('click', pickSingleCard);
    if (singleCopyBtn) singleCopyBtn.addEventListener('click', copySingleColor);
    if (singleNewBtn) singleNewBtn.addEventListener('click', resetSingleCard);
    
    // 5색 팔레트 이벤트
    const palette5Btn = document.getElementById('palette-5-btn');
    if (palette5Btn) palette5Btn.addEventListener('click', generate5ColorPalette);
    
    // 그라디언트 이벤트
    const gradient2Btn = document.getElementById('gradient-2-btn');
    const gradient3Btn = document.getElementById('gradient-3-btn');
    if (gradient2Btn) gradient2Btn.addEventListener('click', () => generateGradient(2));
    if (gradient3Btn) gradient3Btn.addEventListener('click', () => generateGradient(3));
    
    // 초기 상태에서 결과 숨기기
    resetAllGeneratorResults();
    
    // 초기 카드 상태 설정 (물음표만 표시)
    resetSingleCardToInitial();
}

function resetAllGeneratorResults() {
    const palette5Result = document.getElementById('palette-5-result');
    const gradient2Result = document.getElementById('gradient-2-result');
    const gradient3Result = document.getElementById('gradient-3-result');
    
    if (palette5Result) palette5Result.style.display = 'none';
    if (gradient2Result) gradient2Result.style.display = 'none';
    if (gradient3Result) gradient3Result.style.display = 'none';
}

function resetSingleCardToInitial() {
    const card = document.getElementById('single-card-element');
    const button = document.getElementById('single-pick-btn');
    const actions = document.getElementById('single-card-actions');
    
    if (!card) return;
    
    // 카드 초기 상태로 설정 (물음표만 표시)
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
    
    // 버튼 상태 초기화
    if (button) {
        button.style.display = 'inline-block';
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-magic"></i> 컬러 카드 뽑기';
    }
    
    // 액션 버튼 숨기기
    if (actions) actions.style.display = 'none';
    
    currentCard = null;
}

function pickSingleCard() {
    const card = document.getElementById('single-card-element');
    const button = document.getElementById('single-pick-btn');
    const actions = document.getElementById('single-card-actions');
    
    if (!card || currentCard) return;
    
    currentCard = colorCards[Math.floor(Math.random() * colorCards.length)];
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    
    card.classList.add('flipping');
    
    setTimeout(() => {
        card.innerHTML = `
            <div class="card-color">
                <div class="color-display-area" style="background-color: ${currentCard.hex}"></div>
                <div class="color-info-area">
                    <div class="color-brand-name">MIKADO</div>
                    <div class="color-hex-code">${currentCard.hex}</div>
                    <div class="color-korean-name">${currentCard.name}</div>
                    <div class="color-description">${currentCard.description}</div>
                </div>
            </div>
        `;
    }, 600);
    
    setTimeout(() => {
        card.classList.remove('flipping');
        button.style.display = 'none';
        actions.style.display = 'flex';
    }, 1200);
}

function pickSingleCard() {
    const card = document.getElementById('single-card-element');
    const button = document.getElementById('single-pick-btn');
    const actions = document.getElementById('single-card-actions');
    
    if (!card || currentCard) return;
    
    currentCard = colorCards[Math.floor(Math.random() * colorCards.length)];
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    
    card.classList.add('flipping');
    
    setTimeout(() => {
        card.innerHTML = `
            <div class="card-color">
                <div class="color-display-area" style="background-color: ${currentCard.hex}"></div>
                <div class="color-info-area">
                    <div class="color-brand-name">MIKADO</div>
                    <div class="color-hex-code">${currentCard.hex}</div>
                    <div class="color-korean-name">${currentCard.name}</div>
                    <div class="color-description">${currentCard.description}</div>
                </div>
            </div>
        `;
    }, 600);
    
    setTimeout(() => {
        card.classList.remove('flipping');
        button.style.display = 'none';
        actions.style.display = 'flex';
    }, 1200);
}

function resetSingleCard() {
    const card = document.getElementById('single-card-element');
    
    if (!currentCard) return;
    
    const newCard = colorCards[Math.floor(Math.random() * colorCards.length)];
    
    let attempts = 0;
    while (newCard.hex === currentCard.hex && attempts < 10) {
        newCard = colorCards[Math.floor(Math.random() * colorCards.length)];
        attempts++;
    }
    
    currentCard = newCard;
    
    card.classList.add('flipping');
    
    setTimeout(() => {
        card.innerHTML = `
            <div class="card-color">
                <div class="color-display-area" style="background-color: ${currentCard.hex}"></div>
                <div class="color-info-area">
                    <div class="color-brand-name">MIKADO</div>
                    <div class="color-hex-code">${currentCard.hex}</div>
                    <div class="color-korean-name">${currentCard.name}</div>
                    <div class="color-description">${currentCard.description}</div>
                </div>
            </div>
        `;
    }, 600);
    
    setTimeout(() => {
        card.classList.remove('flipping');
    }, 1200);
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
                    <div class="palette-5-color" style="background-color: ${color}" onclick="copyColorWithFeedback('${color}')"></div>
                `).join('')}
            </div>
            <div style="display: flex; gap: 15px; justify-content: center;">
                ${colors.map(color => `
                    <div class="palette-5-color-code">${color}</div>
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
                    <div class="gradient-color" style="background-color: ${color}" onclick="copyColorWithFeedback('${color}')"></div>
                `).join('')}
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 10px;">
                ${colors.map(color => `
                    <div class="gradient-color-code">${color}</div>
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
    }, 200);
}

function calculateAndVisualizeGrid() {
    const maxWidth = parseInt(document.getElementById('calc-max-width')?.value) || 800;
    const columns = parseInt(document.getElementById('calc-columns')?.value) || 4;
    const gutter = parseInt(document.getElementById('calc-gutter')?.value) || 20;
    const margin = parseInt(document.getElementById('calc-margin')?.value) || 20;
    
    const totalGutters = (columns - 1) * gutter;
    const totalMargins = margin * 2;
    const availableWidth = maxWidth - totalGutters - totalMargins;
    const columnWidth = Math.floor(availableWidth / columns);
    const actualPageWidth = (columnWidth * columns) + totalGutters + totalMargins;
    
    const pageWidthEl = document.getElementById('calc-page-width');
    const columnWidthEl = document.getElementById('calc-column-width');
    
    if (pageWidthEl) pageWidthEl.textContent = `${actualPageWidth}px`;
    if (columnWidthEl) columnWidthEl.textContent = `${columnWidth}px`;
    
    visualizeGrid(actualPageWidth, columnWidth, columns, gutter, margin);
}

function visualizeGrid(pageWidth, columnWidth, columns, gutter, margin) {
    const preview = document.getElementById('calc-grid-preview');
    
    if (!preview) return;
    
    preview.innerHTML = '';
    
    // 컨테이너 여백을 최소화하고 더 넓은 프리뷰 제공
    const containerPadding = 10;
    const previewRect = preview.getBoundingClientRect();
    const availableWidth = Math.max(previewRect.width - containerPadding, 320);
    
    // 더 넓은 최대 너비 설정
    let maxWidth;
    if (window.innerWidth <= 480) {
        maxWidth = Math.min(availableWidth, 300);
    } else if (window.innerWidth <= 768) {
        maxWidth = Math.min(availableWidth, 500);
    } else {
        maxWidth = Math.min(availableWidth, 800);
    }
    
    const scale = Math.min(maxWidth / pageWidth, 1);
    const scaledWidth = pageWidth * scale;
    const scaledColumnWidth = columnWidth * scale;
    const scaledGutter = gutter * scale;
    const scaledMargin = margin * scale;
    
    const container = document.createElement('div');
    container.className = 'studio-grid-container';
    
    const baseHeight = window.innerWidth <= 480 ? 100 : window.innerWidth <= 768 ? 120 : 140;
    container.style.height = `${baseHeight}px`;
    container.style.width = `${scaledWidth}px`;
    container.style.position = 'relative';
    container.style.margin = '0 auto';
    
    // 마진 표시 (마진이 0보다 클 때만)
    if (margin > 0 && scaledMargin >= 1) {
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