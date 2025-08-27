// ==================== 카드 데이터 ====================

// 확장된 컬러 카드 데이터
const colorCards = [
    {
        name: "미드나이트 블루",
        hex: "#0F1419",
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
        hex: "#2E4B89",
        description: "깊이 있는 지혜의 색상으로, 통찰력과 직관을 개발시킵니다."
    },
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
        hex: "#0A0A0A",
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
    },
    {
        name: "NFP 디자인 네온 그린",
        hex: "#01FF75",
        description: "창의적 디자인의 정수를 담은 시그니쳐 네온 그린으로, 무한한 상상력과 혁신적 아이디어가 발광하는 프리미엄 에디션입니다.",
        isSpecial: true,
        isDarkSpecial: true
    },
    {
        name: "NFP 게임 네온 옐로우",
        hex: "#FFF200",
        description: "게임 개발의 열정과 승부욕을 상징하는 강렬한 네온 옐로우로, 플레이어의 아드레날린과 창조적 코딩이 만나는 특별한 컬렉션입니다.",
        isSpecial: true,
        isDarkSpecial: true
    },
    {
        name: "NFP 프로그래밍 네온 블루",
        hex: "#00F0FF",
        description: "순수한 코드의 논리와 알고리즘의 아름다움을 담은 사이버틱 네온 블루로, 디지털 세계를 구축하는 개발자의 영혼이 깃든 마스터피스입니다.",
        isSpecial: true,
        isDarkSpecial: true
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
        name: "NFP 시그니쳐 오로라",
        gradient: "linear-gradient(45deg, #01FF75, #00FFCC, #01FF75)",
        description: "NFP만의 독창적인 오로라 그라데이션입니다. 끝없는 창의성과 혁신의 여정을 상징하는 특별한 색채입니다.",
        isSpecial: true
    },
    {
        name: "NFP 에메랄드 심포니",
        gradient: "linear-gradient(135deg, #00CC5E, #01FF75, #4FFFB0)",
        description: "NFP 에메랄드 심포니 그라데이션을 발견하셨습니다. 조화로운 성장과 지속가능한 혁신을 표현하는 프리미엄 컬렉션입니다.",
        isSpecial: true
    },
    {
        name: "NFP 디자인 네온 오로라",
        gradient: "linear-gradient(45deg, #01FF75, #4DFFAA, #01FF75, #00FF88)",
        description: "디자인 스튜디오의 창조적 에너지가 만들어내는 네온 오로라로, 예술적 영감이 끊임없이 순환하는 무한 크리에이티브 스펙트럼입니다.",
        isSpecial: true,
        isDarkSpecial: true
    },
    {
        name: "NFP 게임 네온 스파클",
        gradient: "linear-gradient(135deg, #FFF200, rgb(208, 255, 0))",
        description: "게임 개발의 번개같은 아이디어와 폭발적인 재미가 응축된 네온 썬더볼트로, 플레이어의 심장을 뛰게 만드는 황금빛 전율의 시그니쳐입니다.",
        isSpecial: true,
        isDarkSpecial: true
    },
    {
        name: "Studio NFP 네온 트리니티",
        gradient: "linear-gradient(135deg, #FFF200, #01FF75, #00F0FF)",
        description: "디자인, 게임, 프로그래밍 세 영역의 완벽한 조화인 Studio NFP의 시그니쳐 입니다. 창조와 기술, 혁신이 하나로 융합된 삼위일체를 담고 있습니다.",
        isSpecial: true,
        isDarkSpecial: true
    }
];

// ==================== 상태 변수들 ====================
let isFlipped = false;
let currentColor = null;
let isAnimating = false;

// 그라데이션 카드 관련 변수들
let gradientIsFlipped = false;
let gradientCurrentColor = null;
let gradientIsAnimating = false;

// ==================== 특별 효과 함수 ====================
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
    
    // CSS 애니메이션 정의
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
    
    // 2. 카드에 글로우 효과 추가
    const cardElement = document.getElementById('single-card-element');
    if (cardElement) {
        cardElement.classList.add('nfp-special-card');
    }
    
    const gradientCardElement = document.getElementById('gradient-card-element');
    if (gradientCardElement) {
        gradientCardElement.classList.add('nfp-special-card');
    }
    
    // 3. 특별 축하 사운드 효과
    try {
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
    
    // 4. 2초 후 특별 효과 제거
    setTimeout(() => {
        if (flashOverlay.parentNode) {
            flashOverlay.remove();
        }
        if (cardElement) {
            cardElement.classList.remove('nfp-special-card');
        }
        if (gradientCardElement) {
            gradientCardElement.classList.remove('nfp-special-card');
        }
    }, 2000);
    
    // 0.5초 후 플래시 오버레이 제거
    setTimeout(() => {
        if (flashOverlay.parentNode) {
            flashOverlay.remove();
        }
    }, 500);
}

// 다크 스페셜 카드 스타일 적용 함수
function applyDarkSpecialStyle(cardElement) {
    cardElement.classList.add('dark-special-card');
    
    const brandName = cardElement.querySelector('.color-brand-name');
    const hexCode = cardElement.querySelector('.color-hex-code');
    const colorName = cardElement.querySelector('.color-korean-name');
    const description = cardElement.querySelector('.color-description');
    
    if (brandName) {
        brandName.innerHTML = '<span class="studio-text">STUDIO</span> <span class="nfp-text">NFP</span>';
    }
    
    if (hexCode) hexCode.classList.add('dark-hex-code');
    if (colorName) colorName.classList.add('dark-color-name');
    if (description) description.classList.add('dark-description');
}

// ==================== 단색 카드 기능 ====================
function drawCard() {
    if (isAnimating) return;
    
    isAnimating = true;
    const pickBtn = document.getElementById('single-pick-btn');
    pickBtn.disabled = true;
    pickBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 뽑는 중...';
    
    const cardElement = document.getElementById('single-card-element');
    cardElement.classList.add('card-flip');
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * colorCards.length);
        currentColor = colorCards[randomIndex];
        
        // 카드 내용 업데이트
        const colorDisplay = document.getElementById('color-display');
        const colorHex = document.getElementById('color-hex');
        const colorName = document.getElementById('color-name');
        const colorDescription = document.getElementById('color-description');
        
        colorDisplay.style.backgroundColor = currentColor.hex;
        colorHex.textContent = currentColor.hex;
        colorName.textContent = currentColor.name;
        colorDescription.textContent = currentColor.description;
        
        // 다크 스페셜 카드인지 확인하고 스타일 적용
        if (currentColor.isDarkSpecial) {
            applyDarkSpecialStyle(cardElement);
        } else {
            // 일반 카드로 리셋
            cardElement.classList.remove('dark-special-card');
            const brandName = cardElement.querySelector('.color-brand-name');
            if (brandName) {
                brandName.innerHTML = 'STUDIO NFP';
            }
        }
        
        // 특별 효과
        if (currentColor.isSpecial) {
            triggerSpecialEffect();
        }
        
        // 카드 상태 변경
        const cardQuestion = document.getElementById('card-question');
        const cardResult = document.getElementById('card-result');
        cardQuestion.style.display = 'none';
        cardResult.style.display = 'flex';
        
        // 버튼 상태 변경
        pickBtn.style.display = 'none';
        const cardActions = document.getElementById('single-card-actions');
        cardActions.style.display = 'flex';
        
        isFlipped = true;
        isAnimating = false;
        
        cardElement.classList.remove('card-flip');

        // 카드 카운터 업데이트
        if (typeof onCardDrawn === 'function') {
            onCardDrawn('single', currentColor);
        }

    }, 800);
}

// 단색 카드 리셋 함수
function resetCard() {
    if (isAnimating) return;
    
    isAnimating = true;
    
    const cardElement = document.getElementById('single-card-element');
    cardElement.classList.add('card-fade');
    
    setTimeout(() => {
        // 카드 상태 리셋
        const cardResult = document.getElementById('card-result');
        const cardQuestion = document.getElementById('card-question');
        cardResult.style.display = 'none';
        cardQuestion.style.display = 'flex';
        
        // 버튼 상태 리셋
        const cardActions = document.getElementById('single-card-actions');
        const pickBtn = document.getElementById('single-pick-btn');
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

// 단색 카드 색상 코드 복사 함수
function copyColorCode() {
    if (!currentColor) return;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentColor.hex).then(() => {
            showCopyToast();
            
            const copyBtn = document.getElementById('single-copy-btn');
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

// ==================== 그라데이션 카드 기능 ====================
function drawGradientCard() {
    if (gradientIsAnimating) return;
    
    gradientIsAnimating = true;
    const gradientPickBtn = document.getElementById('gradient-pick-btn');
    gradientPickBtn.disabled = true;
    gradientPickBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 뽑는 중...';
    
    const gradientCardElement = document.getElementById('gradient-card-element');
    gradientCardElement.classList.add('card-flip');
    
    setTimeout(() => {
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
        
        // 다크 스페셜 카드인지 확인하고 스타일 적용
        if (gradientCurrentColor.isDarkSpecial) {
            applyDarkSpecialStyle(gradientCardElement);
        } else {
            // 일반 카드로 리셋
            gradientCardElement.classList.remove('dark-special-card');
            const brandName = gradientCardElement.querySelector('.color-brand-name');
            if (brandName) {
                brandName.innerHTML = 'STUDIO NFP';
            }
        }
        
        // 특별 효과
        if (gradientCurrentColor.isSpecial) {
            triggerSpecialEffect();
        }
        
        // 카드 상태 변경
        const gradientCardQuestion = document.getElementById('gradient-card-question');
        const gradientCardResult = document.getElementById('gradient-card-result');
        gradientCardQuestion.style.display = 'none';
        gradientCardResult.style.display = 'flex';
        
        gradientPickBtn.style.display = 'none';
        const gradientCardActions = document.getElementById('gradient-card-actions');
        gradientCardActions.style.display = 'flex';
        
        gradientIsFlipped = true;
        gradientIsAnimating = false;
        
        gradientCardElement.classList.remove('card-flip');
        
        // 카드 카운터 업데이트
        if (typeof onCardDrawn === 'function') {
            onCardDrawn('gradient', gradientCurrentColor);
        }
        
    }, 800);
}

// 그라데이션 카드 리셋 함수
function resetGradientCard() {
    if (gradientIsAnimating) return;
    
    gradientIsAnimating = true;
    
    const gradientCardElement = document.getElementById('gradient-card-element');
    gradientCardElement.classList.add('card-fade');
    
    setTimeout(() => {
        const gradientCardResult = document.getElementById('gradient-card-result');
        const gradientCardQuestion = document.getElementById('gradient-card-question');
        gradientCardResult.style.display = 'none';
        gradientCardQuestion.style.display = 'flex';
        
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
            showCopyToast();
            
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

// ==================== 카드 저장 기능 ====================

// html2canvas 라이브러리 동적 로딩
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (typeof html2canvas !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
    });
}

// 일별 카운트 관리
function getTodayCount() {
    const today = new Date();
    const dateKey = `${today.getFullYear().toString().slice(-2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    
    const savedData = localStorage.getItem('nfp-card-count');
    let countData = {};
    
    if (savedData) {
        countData = JSON.parse(savedData);
    }
    
    if (!countData[dateKey]) {
        countData[dateKey] = 0;
    }
    
    countData[dateKey]++;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cleanupDate = `${thirtyDaysAgo.getFullYear().toString().slice(-2)}${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`;
    
    Object.keys(countData).forEach(date => {
        if (date < cleanupDate) {
            delete countData[date];
        }
    });
    
    localStorage.setItem('nfp-card-count', JSON.stringify(countData));
    
    return {
        date: dateKey,
        count: countData[dateKey]
    };
}

// 위치를 지정할 수 있는 로고 그리기 함수
function drawLogoAtPosition(canvas, ctx, logoY) {
    ctx.font = '900 48px Pretendard, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    const nfpText = 'NFP';
    const designText = ' DESIGN';
    const nfpWidth = ctx.measureText(nfpText).width;
    const designWidth = ctx.measureText(designText).width;
    const totalWidth = nfpWidth + designWidth;
    
    const logoX = (canvas.width - totalWidth) / 2;
    
    ctx.fillStyle = '#01FF75';
    ctx.fillText(nfpText, logoX, logoY);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(designText, logoX + nfpWidth, logoY);
}

// 위치를 지정할 수 있는 크레딧 그리기 함수
function drawFooterCreditAtPosition(canvas, ctx, startY) {
    const canvasWidth = canvas.width;
    
    const copyrightY = startY;
    const creditY = startY + 30;
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.font = '500 18px Pretendard, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('© 2025 NFP DESIGN. All rights reserved.', canvasWidth / 2, copyrightY);
    
    ctx.font = '500 16px Pretendard, sans-serif';
    ctx.fillStyle = '#01FF75';
    ctx.fillText('Creative by Studio NFP', canvasWidth / 2, creditY);
}

// 색상 코드에서 # 제거
function cleanColorCode(colorCode) {
    return colorCode.replace('#', '');
}

// 단색 카드 저장
async function saveSingleCard() {
    if (!currentColor) {
        alert('저장할 카드가 없습니다. 먼저 카드를 뽑아주세요.');
        return;
    }
    
    try {
        await loadHtml2Canvas();
        
        const cardElement = document.getElementById('single-card-element');
        const cardCanvas = await html2canvas(cardElement, {
            scale: 2,
            backgroundColor: null,
            useCORS: true
        });
        
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        finalCanvas.width = 640;
        finalCanvas.height = 1000;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 640, 1000);
        
        const scaledWidth = cardCanvas.width * 0.75;
        const scaledHeight = cardCanvas.height * 0.75;
        
        const cardX = (640 - scaledWidth) / 2;
        const cardY = (1000 - scaledHeight) / 2;
        
        ctx.drawImage(cardCanvas, 0, 0, cardCanvas.width, cardCanvas.height, 
                     cardX, cardY, scaledWidth, scaledHeight);
        
        const logoY = cardY - 55;
        drawLogoAtPosition(finalCanvas, ctx, logoY);
        
        const creditY = cardY + scaledHeight + 50;
        drawFooterCreditAtPosition(finalCanvas, ctx, creditY);
        
        const countInfo = getTodayCount();
        const colorCode = cleanColorCode(currentColor.hex);
        const fileName = `nfpdesign_${colorCode}_${countInfo.date}_${countInfo.count}.jpg`;
        
        finalCanvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            showSaveSuccessToast(fileName);
        }, 'image/jpeg', 0.9);
        
    } catch (error) {
        console.error('카드 저장 실패:', error);
        alert('카드 저장 중 오류가 발생했습니다.');
    }
}

// 그라데이션 카드 저장
async function saveGradientCard() {
    if (!gradientCurrentColor) {
        alert('저장할 카드가 없습니다. 먼저 카드를 뽑아주세요.');
        return;
    }
    
    try {
        await loadHtml2Canvas();
        
        const cardElement = document.getElementById('gradient-card-element');
        const cardCanvas = await html2canvas(cardElement, {
            scale: 2,
            backgroundColor: null,
            useCORS: true
        });
        
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        finalCanvas.width = 640;
        finalCanvas.height = 1000;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 640, 1000);
        
        const scaledWidth = cardCanvas.width * 0.75;
        const scaledHeight = cardCanvas.height * 0.75;
        
        const cardX = (640 - scaledWidth) / 2;
        const cardY = (1000 - scaledHeight) / 2;
        
        ctx.drawImage(cardCanvas, 0, 0, cardCanvas.width, cardCanvas.height, 
                     cardX, cardY, scaledWidth, scaledHeight);
        
        const logoY = cardY - 55;
        drawLogoAtPosition(finalCanvas, ctx, logoY);
        
        const creditY = cardY + scaledHeight + 50;
        drawFooterCreditAtPosition(finalCanvas, ctx, creditY);
        
        const countInfo = getTodayCount();
        const fileName = `nfpdesign_GRADIENT_${countInfo.date}_${countInfo.count}.jpg`;
        
        finalCanvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            showSaveSuccessToast(fileName);
        }, 'image/jpeg', 0.9);
        
    } catch (error) {
        console.error('카드 저장 실패:', error);
        alert('카드 저장 중 오류가 발생했습니다.');
    }
}

// ==================== 유틸리티 함수 ====================

// 토스트 메시지 함수들
function showCopyToast() {
    const existingToast = document.querySelector('.copy-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
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
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastShow 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 2000);
}

function showSaveSuccessToast(fileName) {
    const existingToast = document.querySelector('.save-success-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'save-success-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> 카드가 저장되었습니다!<br><small>${fileName}</small>`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #01ff75, #00e066);
        color: black;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10000;
        animation: saveToastShow 0.3s ease;
        text-align: center;
        box-shadow: 0 8px 25px rgba(1, 255, 117, 0.4);
    `;
    
    if (!document.querySelector('#save-toast-style')) {
        const style = document.createElement('style');
        style.id = 'save-toast-style';
        style.textContent = `
            @keyframes saveToastShow {
                from { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.8); }
                to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }
            .save-success-toast small {
                opacity: 0.8;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'saveToastShow 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// ==================== 카드 카운터 초기화 ====================
async function initializeAndDisplayCardCounter() {
    try {
        if (typeof initializeCardCounter === 'function') {
            await initializeCardCounter();
        }
        
        const { singleCard, gradientCard } = createCardCounterDisplay();
        
        const singleCardContainer = document.querySelector('#single-card .single-card-container');
        if (singleCardContainer) {
            singleCardContainer.insertAdjacentHTML('afterend', singleCard);
        }

        const gradientCardContainer = document.querySelector('#gradient-card .single-card-container');
        if (gradientCardContainer) {
            gradientCardContainer.insertAdjacentHTML('afterend', gradientCard);
        }
        
        if (window.cardCounter) {
            const counts = await window.cardCounter.getCurrentCount();
            updateCardCounterDisplay(counts);
        }
        
    } catch (error) {
        console.error('카드 카운터 초기화 실패:', error);
    }
}

// ==================== 이벤트 리스너 등록 ====================
function initCardDrawEvents() {
    // 단색 카드 이벤트
    const cardElement = document.getElementById('single-card-element');
    const pickBtn = document.getElementById('single-pick-btn');
    const copyBtn = document.getElementById('single-copy-btn');
    const newBtn = document.getElementById('single-new-btn');
    const saveBtn = document.getElementById('single-save-btn');
    
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
    if (saveBtn) saveBtn.addEventListener('click', saveSingleCard);
    
    // 그라데이션 카드 이벤트
    const gradientCardElement = document.getElementById('gradient-card-element');
    const gradientPickBtn = document.getElementById('gradient-pick-btn');
    const gradientCopyBtn = document.getElementById('gradient-copy-btn');
    const gradientNewBtn = document.getElementById('gradient-new-btn');
    const gradientSaveBtn = document.getElementById('gradient-save-btn');

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
    if (gradientSaveBtn) gradientSaveBtn.addEventListener('click', saveGradientCard);
}

// ==================== 초기화 ====================
document.addEventListener('DOMContentLoaded', function() {
    initCardDrawEvents();
    initializeAndDisplayCardCounter();
});

// ==================== 전역 함수 등록 (HTML onclick용) ====================
window.drawCard = drawCard;
window.resetCard = resetCard;
window.copyColorCode = copyColorCode;
window.saveSingleCard = saveSingleCard;
window.drawGradientCard = drawGradientCard;
window.resetGradientCard = resetGradientCard;
window.copyGradientCode = copyGradientCode;
window.saveGradientCard = saveGradientCard;