// 안전한 Firebase 카드 카운터 클래스 (조건부 초기화)
class FirebaseCardCounter {
    constructor() {
        // 서버사이드 렌더링 환경에서는 아무것도 하지 않음
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            this.isServerSide = true;
            return;
        }
        
        this.isServerSide = false;
        this.db = null;
        this.firestoreUtils = null;
        this.isReady = false;
    }

    // 실제 초기화는 브라우저에서만
    async initialize() {
        if (this.isServerSide) return false;
        
        // 이미 초기화되었으면 바로 반환
        if (this.isReady) return true;
        
        this.db = window.firebaseDB;
        this.firestoreUtils = window.firestoreUtils;
        
        // Firebase가 아직 로드되지 않았다면 잠시 대기
        if (!this.db) {
            let attempts = 0;
            while (!this.db && attempts < 10) { // 최대 2초 대기
                await new Promise(resolve => setTimeout(resolve, 200));
                this.db = window.firebaseDB;
                this.firestoreUtils = window.firestoreUtils;
                attempts++;
            }
        }
        
        this.isReady = !!this.db;
        return this.isReady;
    }

    // 기본 카운트 반환
    getDefaultCounts() {
        return {
            single: 0,
            gradient: 0,
            single_special: 0,
            gradient_special: 0,
            single_dark: 0,
            gradient_dark: 0,
            total: 0
        };
    }

    // 카운터 문서 참조
    getCardCounterRef(type) {
        if (!this.isReady || !this.firestoreUtils) return null;
        
        const { doc } = this.firestoreUtils;
        return doc(this.db, 'card_draws', type);
    }

    // Firebase에서 현재 카운트 조회
    async getCurrentCountFromFirebase() {
        if (!this.isReady) return this.getDefaultCounts();
        
        try {
            const { getDoc } = this.firestoreUtils;
            
            const counters = this.getDefaultCounts();

            // 모든 카운터 조회
            for (const type of Object.keys(counters)) {
                const ref = this.getCardCounterRef(type);
                if (ref) {
                    const snap = await getDoc(ref);
                    counters[type] = snap.exists() ? snap.data().count || 0 : 0;
                }
            }
            
            return counters;
        } catch (error) {
            console.error('Firebase에서 카드 카운터 조회 실패:', error);
            return this.getDefaultCounts();
        }
    }

    // Firebase에 카드 카운트 업데이트
    async updateCardCountInFirebase(cardType, cardData) {
        if (!this.isReady) return this.getDefaultCounts();
        
        try {
            // 기본 카드 타입 카운터 업데이트
            await this.incrementCounter(cardType);
            
            // 스페셜 카드 카운터 업데이트 (cardData가 있을 때만)
            if (cardData !== null && cardData !== undefined) {
                // 다크 스페셜 카드 체크 (우선순위)
                if (cardData.isDarkSpecial === true || cardData.isSpecial === 'dark' || cardData.specialType === 'dark') {
                    await this.incrementCounter(`${cardType}_dark`);
                }
                // 일반 스페셜 카드 체크
                else if (cardData.isSpecial === true || cardData.isSpecial === 'special' || cardData.specialType === 'special') {
                    await this.incrementCounter(`${cardType}_special`);
                }
                // 백업: cardData가 문자열인 경우
                else if (typeof cardData === 'string') {
                    if (cardData.includes('dark') || cardData.includes('Dark')) {
                        await this.incrementCounter(`${cardType}_dark`);
                    } else if (cardData.includes('special') || cardData.includes('Special')) {
                        await this.incrementCounter(`${cardType}_special`);
                    }
                }
            }
            
            // 전체 카운터 업데이트
            await this.incrementCounter('total');
            
            const updatedCounts = await this.getCurrentCountFromFirebase();
            
            return updatedCounts;
            
        } catch (error) {
            console.error('Firebase 카드 카운터 업데이트 실패:', error);
            return this.getDefaultCounts();
        }
    }

    // 카운터 증가 헬퍼 함수
    async incrementCounter(type) {
        if (!this.isReady || !this.firestoreUtils) return;
        
        try {
            const { getDoc, setDoc, updateDoc, increment } = this.firestoreUtils;
            const ref = this.getCardCounterRef(type);
            
            if (!ref) return;
            
            const snap = await getDoc(ref);
            
            if (snap.exists()) {
                await updateDoc(ref, {
                    count: increment(1),
                    lastUpdated: new Date()
                });
            } else {
                await setDoc(ref, {
                    count: 1,
                    type: type,
                    lastUpdated: new Date()
                });
            }
        } catch (error) {
            console.error(`카운터 증가 실패 (${type}):`, error);
        }
    }

    // 메인 카드 카운트 업데이트 메서드
    async drawCard(cardType, cardData = null) {
        // 서버사이드에서는 기본값 반환
        if (this.isServerSide) {
            return this.getDefaultCounts();
        }
        
        // 초기화되지 않았다면 초기화 시도
        if (!this.isReady) {
            await this.initialize();
        }
        
        // 초기화 실패시 기본값 반환
        if (!this.isReady) {
            console.warn('Firebase 초기화 실패, 기본값 사용');
            return this.getDefaultCounts();
        }
        
        return await this.updateCardCountInFirebase(cardType, cardData);
    }

    // 현재 카운트 조회
    async getCurrentCount() {
        // 서버사이드에서는 기본값 반환
        if (this.isServerSide) {
            return this.getDefaultCounts();
        }
        
        // 초기화되지 않았다면 초기화 시도
        if (!this.isReady) {
            await this.initialize();
        }
        
        // 초기화 실패시 기본값 반환
        if (!this.isReady) {
            console.warn('Firebase 초기화 실패, 기본값 사용');
            return this.getDefaultCounts();
        }
        
        return await this.getCurrentCountFromFirebase();
    }
}

// 카드 카운터 표시 UI (FontAwesome 아이콘)
function createCardCounterDisplay() {
    // 서버사이드에서는 빈 문자열 반환
    if (typeof window === 'undefined') {
        return { singleCard: '', gradientCard: '' };
    }
    
    const counterHTML = `
        <div class="card-counter-display">
            <div class="card-counter-header">
                <span class="counter-icon"><i class="fas fa-chart-bar"></i></span>
                <span class="counter-text">누적 통계: <span id="total-card-count">-</span>회</span>
            </div>
            <div class="card-counter-grid">
                <div class="card-counter-item">
                    <span class="counter-icon"><i class="fas fa-square"></i></span>
                    <span class="counter-text">그라데이션 카드: <span id="gradient-card-count">-</span>회</span>
                </div>
                <div class="card-counter-item">
                    <span class="counter-icon"><i class="fas fa-dice"></i></span>
                    <span class="counter-text">총뽑기 횟수: <span id="draw-count">-</span>회</span>
                </div>
                <div class="card-counter-item">
                    <span class="counter-icon special"><i class="fas fa-star"></i></span>
                    <span class="counter-text">스페셜 카드: <span id="single-special-count">-</span>회</span>
                </div>
                <div class="card-counter-item">
                    <span class="counter-icon dark"><i class="fas fa-moon"></i></span>
                    <span class="counter-text">다크 스페셜 카드: <span id="single-dark-count">-</span>회</span>
                </div>
            </div>
        </div>
    `;

    const gradientCounterHTML = `
        <div class="card-counter-display">
            <div class="card-counter-header">
                <span class="counter-icon"><i class="fas fa-chart-bar"></i></span>
                <span class="counter-text">누적 통계: <span id="total-card-count-gradient">-</span>회</span>
            </div>
            <div class="card-counter-grid">
                <div class="card-counter-item">
                    <span class="counter-icon"><i class="fas fa-square"></i></span>
                    <span class="counter-text">그라데이션 카드: <span id="gradient-card-count">-</span>회</span>
                </div>
                <div class="card-counter-item">
                    <span class="counter-icon"><i class="fas fa-dice"></i></span>
                    <span class="counter-text">총뽑기 횟수: <span id="draw-count-gradient">-</span>회</span>
                </div>
                <div class="card-counter-item">
                    <span class="counter-icon special"><i class="fas fa-star"></i></span>
                    <span class="counter-text">스페셜 카드: <span id="gradient-special-count">-</span>회</span>
                </div>
                <div class="card-counter-item">
                    <span class="counter-icon dark"><i class="fas fa-moon"></i></span>
                    <span class="counter-text">다크 스페셜 카드: <span id="gradient-dark-count">-</span>회</span>
                </div>
            </div>
        </div>
    `;

    const counterStyles = `
        <style>
        .card-counter-display {
            background: rgba(1, 255, 117, 0.08);
            border: 1px solid rgba(1, 255, 117, 0.2);
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .card-counter-display:hover {
            background: rgba(1, 255, 117, 0.12);
            border-color: rgba(1, 255, 117, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(1, 255, 117, 0.15);
        }
        
        .card-counter-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(1, 255, 117, 0.2);
        }
        
        .card-counter-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px 16px;
        }
        
        .card-counter-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
        }
        
        .counter-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            color: var(--accent-color);
            font-size: 14px;
        }
        
        .counter-icon.special {
            color: #FFD700;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
        
        .counter-icon.dark {
            color: #8A2BE2;
            text-shadow: 0 0 8px rgba(138, 43, 226, 0.6);
        }
        
        .counter-text {
            color: var(--text-color);
            font-weight: 500;
            white-space: nowrap;
        }
        
        .counter-text span {
            color: var(--accent-color);
            font-weight: 700;
            font-size: 14px;
        }
        
        .card-counter-header .counter-text span {
            font-size: 16px;
        }
        
        @media (max-width: 768px) {
            .card-counter-display {
                font-size: 11px;
                padding: 12px 16px;
                max-width: 100%;
                width: calc(100% - 32px);
                margin: 16px auto;
                box-sizing: border-box;
            }
            
            .card-counter-header {
                font-size: 13px;
                margin-bottom: 12px;
                padding-bottom: 8px;
            }
            
            .card-counter-grid {
                gap: 8px 12px;
            }
            
            .card-counter-item {
                font-size: 11px;
            }
            
            .counter-icon {
                font-size: 11px;
                width: 16px;
            }
            
            .counter-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .counter-text span {
                font-size: 12px;
            }
            
            .card-counter-header .counter-text span {
                font-size: 14px;
            }
        }
        
        @media (max-width: 480px) {
            .card-counter-display {
                padding: 10px 14px;
                max-width: 100%;
                width: calc(100% - 28px);
                margin: 14px auto;
                font-size: 10px;
            }
            
            .card-counter-header {
                font-size: 12px;
                margin-bottom: 10px;
                padding-bottom: 6px;
            }
            
            .card-counter-grid {
                gap: 6px 10px;
            }
            
            .card-counter-item {
                font-size: 10px;
            }
            
            .counter-icon {
                font-size: 10px;
                width: 14px;
            }
            
            .counter-text {
                font-size: 10px;
            }
            
            .counter-text span {
                font-size: 11px;
            }
            
            .card-counter-header .counter-text span {
                font-size: 13px;
            }
        }
        
        @media (max-width: 360px) {
            .card-counter-display {
                padding: 8px 12px;
                max-width: 100%;
                width: calc(100% - 24px);
                margin: 12px auto;
                font-size: 9px;
            }
            
            .card-counter-header {
                font-size: 11px;
            }
            
            .card-counter-grid {
                gap: 5px 8px;
            }
            
            .counter-text {
                font-size: 9px;
            }
            
            .counter-text span {
                font-size: 10px;
            }
            
            .card-counter-header .counter-text span {
                font-size: 12px;
            }
        }
        </style>
    `;

    return {
        singleCard: counterStyles + counterHTML,
        gradientCard: gradientCounterHTML
    };
}

// 카드 카운터 표시 업데이트
function updateCardCounterDisplay(counts) {
    // 서버사이드에서는 아무것도 하지 않음
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }
    
    try {
        // 각 타입별 총 뽑기 횟수 계산
        const singleTotalDraws = counts.single + counts.single_special + counts.single_dark;
        const gradientTotalDraws = counts.gradient + counts.gradient_special + counts.gradient_dark;
        
        // 단색 페이지에서는 실제로는 그라데이션 카드 개수를 표시 (스크린샷 기준)
        const singleCountEl = document.getElementById('single-card-count');
        const gradientCountEl = document.getElementById('gradient-card-count');
        
        // 그라데이션 카드 카운터들
        if (gradientCountEl) gradientCountEl.textContent = counts.gradient.toLocaleString();
        
        // 스페셜 카드 카운터들
        const singleSpecialEl = document.getElementById('single-special-count');
        const gradientSpecialEl = document.getElementById('gradient-special-count');
        
        if (singleSpecialEl) singleSpecialEl.textContent = counts.single_special.toLocaleString();
        if (gradientSpecialEl) gradientSpecialEl.textContent = counts.gradient_special.toLocaleString();
        
        // 다크 스페셜 카드 카운터들
        const singleDarkEl = document.getElementById('single-dark-count');
        const gradientDarkEl = document.getElementById('gradient-dark-count');
        
        if (singleDarkEl) singleDarkEl.textContent = counts.single_dark.toLocaleString();
        if (gradientDarkEl) gradientDarkEl.textContent = counts.gradient_dark.toLocaleString();
        
        // 누적 통계 (전체 합계)
        const totalCountEl1 = document.getElementById('total-card-count');
        const totalCountEl2 = document.getElementById('total-card-count-gradient');
        if (totalCountEl1) totalCountEl1.textContent = counts.total.toLocaleString();
        if (totalCountEl2) totalCountEl2.textContent = counts.total.toLocaleString();
        
        // 각 타입별 총 뽑기 횟수
        const drawCountEl1 = document.getElementById('draw-count');
        const drawCountEl2 = document.getElementById('draw-count-gradient');
        if (drawCountEl1) drawCountEl1.textContent = singleTotalDraws.toLocaleString();
        if (drawCountEl2) drawCountEl2.textContent = gradientTotalDraws.toLocaleString();
    } catch (error) {
        console.error('카드 카운터 표시 업데이트 실패:', error);
    }
}

// 카드 뽑기 시 호출 함수
async function onCardDrawn(cardType, cardData = null) {
    // 서버사이드에서는 아무것도 하지 않음
    if (typeof window === 'undefined') {
        return;
    }
    
    if (!window.cardCounter) {
        console.error('window.cardCounter가 없습니다.');
        return;
    }
    
    try {
        const updatedCounts = await window.cardCounter.drawCard(cardType, cardData);
        updateCardCounterDisplay(updatedCounts);
    } catch (error) {
        console.error('카드 카운트 업데이트 실패:', error);
    }
}

// 카드 카운터 초기화
async function initializeCardCounter() {
    // 서버사이드에서는 아무것도 하지 않음
    if (typeof window === 'undefined') {
        return;
    }
    
    try {
        window.cardCounter = new FirebaseCardCounter();
        
        // 브라우저 환경에서만 초기화 시도
        if (!window.cardCounter.isServerSide) {
            await window.cardCounter.initialize();
            const counts = await window.cardCounter.getCurrentCount();
            updateCardCounterDisplay(counts);
        }
    } catch (error) {
        console.error('카드 카운터 초기화 실패:', error);
    }
}

// 전역으로 내보내기 (브라우저에서만)
if (typeof window !== 'undefined') {
    window.initializeCardCounter = initializeCardCounter;
    window.createCardCounterDisplay = createCardCounterDisplay;
    window.onCardDrawn = onCardDrawn;
}