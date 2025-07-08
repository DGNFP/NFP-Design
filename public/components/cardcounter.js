// Firebase 카드 카운터 클래스 (기존 방문자 카운터와 유사한 구조)
class FirebaseCardCounter {
    constructor() {
        this.db = window.firebaseDB;
        this.firestoreUtils = window.firestoreUtils;
        this.waitForFirebase();
    }

    // Firebase 로딩 대기 (기존 코드와 동일)
    async waitForFirebase() {
        let attempts = 0;
        while (!this.db && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.db = window.firebaseDB;
            this.firestoreUtils = window.firestoreUtils;
            attempts++;
        }
        
        if (!this.db) {
            console.error('Firebase가 로드되지 않았습니다. localStorage로 폴백합니다.');
            return false;
        }
        return true;
    }

    // 카드 카운터 문서 참조 생성
    getCardCounterRef(type) {
        const { doc } = this.firestoreUtils;
        if (type === 'single') {
            return doc(this.db, 'card_draws', 'single_cards');
        } else if (type === 'gradient') {
            return doc(this.db, 'card_draws', 'gradient_cards');
        } else if (type === 'total') {
            return doc(this.db, 'card_draws', 'total_draws');
        }
    }

    // Firebase에서 현재 카운트 조회
    async getCurrentCountFromFirebase() {
        try {
            const { getDoc } = this.firestoreUtils;
            
            // 단색 카드 수 조회
            const singleRef = this.getCardCounterRef('single');
            const singleSnap = await getDoc(singleRef);
            const singleCount = singleSnap.exists() ? singleSnap.data().count || 0 : 0;
            
            // 그라데이션 카드 수 조회
            const gradientRef = this.getCardCounterRef('gradient');
            const gradientSnap = await getDoc(gradientRef);
            const gradientCount = gradientSnap.exists() ? gradientSnap.data().count || 0 : 0;
            
            // 전체 카드 수 조회
            const totalRef = this.getCardCounterRef('total');
            const totalSnap = await getDoc(totalRef);
            const totalCount = totalSnap.exists() ? totalSnap.data().count || 0 : 0;
            
            return {
                single: singleCount,
                gradient: gradientCount,
                total: totalCount
            };
        } catch (error) {
            console.error('Firebase에서 카드 카운터 조회 실패:', error);
            return { single: 0, gradient: 0, total: 0 };
        }
    }

    // Firebase에 카드 카운트 업데이트
    async updateCardCountInFirebase(cardType) {
        try {
            const { getDoc, setDoc, updateDoc, increment } = this.firestoreUtils;
            
            // 카드 타입별 카운터 업데이트
            const cardRef = this.getCardCounterRef(cardType);
            const cardSnap = await getDoc(cardRef);
            
            if (cardSnap.exists()) {
                await updateDoc(cardRef, {
                    count: increment(1),
                    lastUpdated: new Date()
                });
            } else {
                await setDoc(cardRef, {
                    count: 1,
                    type: cardType,
                    lastUpdated: new Date()
                });
            }
            
            // 전체 카운터 업데이트
            const totalRef = this.getCardCounterRef('total');
            const totalSnap = await getDoc(totalRef);
            
            if (totalSnap.exists()) {
                await updateDoc(totalRef, {
                    count: increment(1),
                    lastUpdated: new Date()
                });
            } else {
                await setDoc(totalRef, {
                    count: 1,
                    lastUpdated: new Date()
                });
            }
            
            // 업데이트된 카운트 반환
            return await this.getCurrentCountFromFirebase();
            
        } catch (error) {
            console.error('Firebase 카드 카운터 업데이트 실패:', error);
            return { single: 0, gradient: 0, total: 0 };
        }
    }

    // 메인 카드 카운트 업데이트 메서드
    async drawCard(cardType) {
        const firebaseReady = await this.waitForFirebase();
        
        if (firebaseReady) {
            return await this.updateCardCountInFirebase(cardType);
        } else {
            // Firebase 실패 시 기본값 반환
            return { single: 0, gradient: 0, total: 0 };
        }
    }

    // 현재 카운트 조회
    async getCurrentCount() {
        const firebaseReady = await this.waitForFirebase();
        
        if (firebaseReady) {
            return await this.getCurrentCountFromFirebase();
        } else {
            return { single: 0, gradient: 0, total: 0 };
        }
    }
}

// 카드 카운터 표시 UI 생성
// 개선된 카드 카운터 표시 UI 생성
function createCardCounterDisplay() {
    // 카운터 HTML 생성 (개선된 스타일)
    const counterHTML = `
        <div class="card-counter-display">
            <div class="card-counter-item">
                <span class="counter-emoji">🎯</span>
                <span class="counter-text">단색 카드: <span id="single-card-count">-</span>회</span>
            </div>
            <div class="card-counter-item">
                <span class="counter-emoji">📊</span>
                <span class="counter-text">전체: <span id="total-card-count">-</span>회</span>
            </div>
        </div>
    `;

    // 그라데이션 카운터 HTML
    const gradientCounterHTML = `
        <div class="card-counter-display">
            <div class="card-counter-item">
                <span class="counter-emoji">🌈</span>
                <span class="counter-text">그라데이션: <span id="gradient-card-count">-</span>회</span>
            </div>
            <div class="card-counter-item">
                <span class="counter-emoji">📊</span>
                <span class="counter-text">전체: <span id="total-card-count-gradient">-</span>회</span>
            </div>
        </div>
    `;

    // CSS 스타일
    const counterStyles = `
        <style>
            .card-counter-display {
            background: rgba(1, 255, 117, 0.08);
            border: 1px solid rgba(1, 255, 117, 0.2);
            border-radius: 16px;
            padding: 16px 20px;
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            max-width: 320px;  /* 400px → 320px로 변경 */
            margin-left: auto;
            margin-right: auto;
        }
        
        .card-counter-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }
        
        .counter-emoji {
            font-size: 16px;
            width: 20px;
            text-align: center;
        }
        
        .counter-text {
            color: var(--text-color);
            font-weight: 500;
        }
        
        .counter-text span {
            color: var(--accent-color);
            font-weight: 700;
        }
        
        @media (max-width: 768px) {
            .card-counter-display {
                font-size: 13px;
                padding: 10px 14px;
            }
            
            .counter-emoji {
                font-size: 14px;
            }
        }
        </style>
    `;

    return {
        singleCard: counterStyles + counterHTML,
        gradientCard: gradientCounterHTML // 스타일은 이미 추가됨
    };
}

// 카드 카운터 초기화 및 업데이트 함수
async function initializeCardCounter() {
    // Firebase 카드 카운터 인스턴스 생성
    window.cardCounter = new FirebaseCardCounter();
    
    // 현재 카운트 조회하여 표시
    try {
        const counts = await window.cardCounter.getCurrentCount();
        updateCardCounterDisplay(counts);
    } catch (error) {
        console.error('카드 카운터 초기화 실패:', error);
    }
}

// 카드 카운터 표시 업데이트
function updateCardCounterDisplay(counts) {
    // 단색 카드 카운터 업데이트
    const singleCountEl = document.getElementById('single-card-count');
    if (singleCountEl) {
        singleCountEl.textContent = counts.single.toLocaleString();
    }
    
    // 그라데이션 카드 카운터 업데이트
    const gradientCountEl = document.getElementById('gradient-card-count');
    if (gradientCountEl) {
        gradientCountEl.textContent = counts.gradient.toLocaleString();
    }
    
    // 전체 카운터 업데이트 (두 곳 모두)
    const totalCountEl1 = document.getElementById('total-card-count');
    const totalCountEl2 = document.getElementById('total-card-count-gradient');
    if (totalCountEl1) {
        totalCountEl1.textContent = counts.total.toLocaleString();
    }
    if (totalCountEl2) {
        totalCountEl2.textContent = counts.total.toLocaleString();
    }
}

// 카드를 뽑을 때 호출할 함수
async function onCardDrawn(cardType) {
    if (!window.cardCounter) return;
    
    try {
        const updatedCounts = await window.cardCounter.drawCard(cardType);
        updateCardCounterDisplay(updatedCounts);
    } catch (error) {
        console.error('카드 카운트 업데이트 실패:', error);
    }
}

// 전역으로 내보내기
window.initializeCardCounter = initializeCardCounter;
window.createCardCounterDisplay = createCardCounterDisplay;
window.onCardDrawn = onCardDrawn;