// floating-buttons.js - Firebase 실시간 방문자 카운터 버전

/**
 * Firebase 실시간 방문자 수를 관리하는 클래스
 */

class FirebaseVisitorCounter {
    constructor() {
        this.db = window.firebaseDB;
        this.firestoreUtils = window.firestoreUtils;
        this.todayKey = this.getTodayString();
        this.sessionKey = 'visitor_session_' + this.todayKey;
        
        // Firebase가 로드될 때까지 대기
        this.waitForFirebase();
    }

    // Firebase 로딩 대기
    async waitForFirebase() {
        let attempts = 0;
        while (!this.db && attempts < 50) { // 5초 대기
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

    // 오늘 날짜 문자열 반환 (YYYY-MM-DD)
    getTodayString() {
        const today = new Date();
        return today.getFullYear() + '-' + 
               String(today.getMonth() + 1).padStart(2, '0') + '-' + 
               String(today.getDate()).padStart(2, '0');
    }

    // Firebase에서 카운터 문서 참조 생성
    getCounterRef(type, date = null) {
        const { doc } = this.firestoreUtils;
        if (type === 'today') {
            return doc(this.db, 'visitors', `today_${date || this.todayKey}`);
        } else if (type === 'total') {
            return doc(this.db, 'visitors', 'total_count');
        }
    }

    // Firebase에서 방문자 수 조회
    async getCurrentCountFromFirebase() {
        try {
            const { getDoc } = this.firestoreUtils;
            
            // 오늘 방문자 수 조회
            const todayRef = this.getCounterRef('today');
            const todaySnap = await getDoc(todayRef);
            const todayCount = todaySnap.exists() ? todaySnap.data().count || 0 : 0;
            
            // 전체 방문자 수 조회
            const totalRef = this.getCounterRef('total');
            const totalSnap = await getDoc(totalRef);
            const totalCount = totalSnap.exists() ? totalSnap.data().count || 0 : 0;
            
            return {
                today: todayCount,
                total: totalCount
            };
        } catch (error) {
            console.error('Firebase에서 카운터 조회 실패:', error);
            // 에러 시 localStorage 폴백
            return this.getCurrentCountFromLocalStorage();
        }
    }

    // localStorage 폴백 메서드 (기존 로직)
    getCurrentCountFromLocalStorage() {
        const todayCount = parseInt(localStorage.getItem('visitor_today_' + this.todayKey) || '0');
        const totalCount = parseInt(localStorage.getItem('visitor_total') || '0');
        return {
            today: todayCount,
            total: totalCount
        };
    }

    // Firebase에 방문자 수 업데이트
    async updateVisitorCountInFirebase() {
        try {
            const { getDoc, setDoc, updateDoc, increment } = this.firestoreUtils;
            
            // 오늘 카운터 업데이트
            const todayRef = this.getCounterRef('today');
            const todaySnap = await getDoc(todayRef);
            
            if (todaySnap.exists()) {
                await updateDoc(todayRef, {
                    count: increment(1),
                    lastUpdated: new Date()
                });
            } else {
                await setDoc(todayRef, {
                    count: 1,
                    date: this.todayKey,
                    lastUpdated: new Date()
                });
            }
            
            // 전체 카운터 업데이트
            const totalRef = this.getCounterRef('total');
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
            console.error('Firebase 카운터 업데이트 실패:', error);
            // 에러 시 localStorage 폴백
            return this.updateVisitorCountInLocalStorage();
        }
    }

    // localStorage 폴백 업데이트 (기존 로직)
    updateVisitorCountInLocalStorage() {
        // 오늘 방문자 수 증가
        let todayCount = parseInt(localStorage.getItem('visitor_today_' + this.todayKey) || '0');
        todayCount++;
        localStorage.setItem('visitor_today_' + this.todayKey, todayCount.toString());

        // 전체 방문자 수 증가
        let totalCount = parseInt(localStorage.getItem('visitor_total') || '0');
        totalCount++;
        localStorage.setItem('visitor_total', totalCount.toString());

        return {
            today: todayCount,
            total: totalCount
        };
    }

    // 메인 방문자 수 업데이트 메서드
    async updateVisitorCount() {
        // 세션에서 이미 카운트했는지 확인
        const hasVisitedToday = sessionStorage.getItem(this.sessionKey);
        
        if (hasVisitedToday) {
            // 이미 카운트했으면 현재 카운트만 반환
            return await this.getCurrentCount();
        }

        // Firebase가 준비되었는지 확인
        const firebaseReady = await this.waitForFirebase();
        
        let result;
        if (firebaseReady) {
            // Firebase로 업데이트
            result = await this.updateVisitorCountInFirebase();
        } else {
            // localStorage로 폴백
            result = this.updateVisitorCountInLocalStorage();
        }
        
        // 세션에 방문 기록 저장
        sessionStorage.setItem(this.sessionKey, 'true');
        
        return result;
    }

    // 현재 카운트 조회 (Firebase 우선, localStorage 폴백)
    async getCurrentCount() {
        const firebaseReady = await this.waitForFirebase();
        
        if (firebaseReady) {
            return await this.getCurrentCountFromFirebase();
        } else {
            return this.getCurrentCountFromLocalStorage();
        }
    }

    // 최근 5일간 데이터 가져오기 (Firebase + localStorage 조합)
    async getLast5DaysData() {
        const data = [];
        const today = new Date();
        
        for (let i = 4; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.getFullYear() + '-' + 
                          String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(date.getDate()).padStart(2, '0');
            
            let count = 0;
            
            // Firebase에서 먼저 시도
            const firebaseReady = await this.waitForFirebase();
            if (firebaseReady) {
                try {
                    const { getDoc } = this.firestoreUtils;
                    const dayRef = this.getCounterRef('today', dateStr);
                    const daySnap = await getDoc(dayRef);
                    count = daySnap.exists() ? daySnap.data().count || 0 : 0;
                } catch (error) {
                    // Firebase 실패 시 localStorage 폴백
                    count = parseInt(localStorage.getItem('visitor_today_' + dateStr) || '0');
                }
            } else {
                // Firebase 없으면 localStorage 사용
                count = parseInt(localStorage.getItem('visitor_today_' + dateStr) || '0');
            }
            
            const dayNum = date.getDate();
            
            data.push({
                date: dateStr,
                day: dayNum,
                count: count
            });
        }
        
        return data;
    }

    // 오래된 데이터 정리 (Firebase + localStorage)
    async cleanOldData() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        // localStorage 정리 (기존 로직)
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('visitor_today_')) {
                const dateStr = key.replace('visitor_today_', '');
                const date = new Date(dateStr);
                if (date < sevenDaysAgo) {
                    localStorage.removeItem(key);
                }
            }
        });
        
        // Firebase 정리는 비용 때문에 생략 (자동 TTL 설정 권장)
    }
}

/**
 * 웹사이트 플로팅 버튼을 생성하고 페이지에 삽입하는 함수 (Firebase 버전)
 */
function createFloatingButtons(targetElementId = 'floating-buttons-container', buttons = null, showVisitorCounter = true) {
    // Firebase 방문자 카운터 인스턴스
    let counter = null;
    let visitorCount = { today: 0, total: 0 };
    
    // 5일간 차트 HTML 생성 함수
    // 🔥 이 함수만 복사 (라인 2~44)
async function generateChartHTML() {
    if (!showVisitorCounter || !counter) return '';
    
    try {
        const chartData = await counter.getLast5DaysData();
        
        // 🔧 개선된 높이 계산 로직
        const counts = chartData.map(d => d.count);
        const maxValue = Math.max(...counts);
        const minValue = Math.min(...counts);
        const range = maxValue - minValue;
        
        let chartHTML = '<div class="chart-bars">';
        
        chartData.forEach((data, index) => {
            let height;
            
            if (data.count === 0) {
                height = 3;
            } else if (range === 0) {
                height = 20;
            } else {
                const ratio = (data.count - minValue) / range;
                height = Math.max(8 + (ratio * 40), 12);
            }
            
            const isToday = index === chartData.length - 1;
            
            chartHTML += `
                <div class="bar-container">
                    <div class="bar-value">${data.count}</div>
                    <div class="bar" style="--bar-height: ${height}px;" data-is-today="${isToday}">
                        <div class="bar-fill"></div>
                    </div>
                    <div class="bar-label">${data.day}</div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        return chartHTML;
    } catch (error) {
        console.error('차트 생성 실패:', error);
        return '<div class="chart-error">차트 로딩 중...</div>';
    }
}

    // Firebase 카운터 초기화 및 차트 생성
    async function initializeCounter() {
        if (!showVisitorCounter) return;
        
        try {
            counter = new FirebaseVisitorCounter();
            visitorCount = await counter.updateVisitorCount();
            
            // 차트 HTML 재생성
            const chartContainer = document.querySelector('.chart-container');
            if (chartContainer) {
                chartContainer.innerHTML = await generateChartHTML();
            }
            
            // 카운터 숫자 업데이트
            updateCounterDisplay();
            
        } catch (error) {
            console.error('Firebase 카운터 초기화 실패:', error);
            // 에러 시에도 기본값으로 표시
            updateCounterDisplay();
        }
    }

    // 카운터 표시 업데이트
    function updateCounterDisplay() {
        // 심플 스타일 업데이트 (모바일)
        const todayElement = document.getElementById('today-count');
        const totalElement = document.getElementById('total-count');
        if (todayElement) todayElement.textContent = visitorCount.today;
        if (totalElement) totalElement.textContent = visitorCount.total;
        
        // 그래프 스타일 업데이트 (PC)
        const todayElementLg = document.getElementById('today-count-lg');
        const totalElementLg = document.getElementById('total-count-lg');
        if (todayElementLg) todayElementLg.textContent = visitorCount.today;
        if (totalElementLg) totalElementLg.textContent = visitorCount.total.toLocaleString();
    }

    // 외부 CSS 로드
    const cssHref = '/css/styles.css';
    const existingLink = document.querySelector(`link[href="${cssHref}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }

    // 기본 버튼 설정
    const defaultButtons = [
        {
            id: 'work-btn',
            href: '/posts/',
            icon: '<i class="fas fa-clipboard-list"></i>',
            text: '작업 보기'
        },
        {
            id: 'contact-btn',
            href: '/index.html#contact',
            icon: '<i class="fas fa-comment"></i>',
            text: '연락하기'
        }
    ];
    
    const buttonList = buttons || defaultButtons;
    
    // 버튼 HTML 생성
    let buttonsHtml = '';
    buttonList.forEach(button => {
        buttonsHtml += `
        <a href="${button.href}" class="floating-btn" id="${button.id}">
            <span class="floating-btn-icon">${button.icon}</span>
            <span class="floating-btn-text">${button.text}</span>
        </a>
        `;
    });

    // 방문자 카운터 HTML 생성 (초기값으로 생성, 나중에 업데이트)
    const visitorCounterHtml = showVisitorCounter ? `
        <div class="visitor-counter">
            <div class="visitor-stats-simple">
                <div class="stat-item">
                    <span class="stat-label">Today</span>
                    <span class="stat-count" id="today-count">${visitorCount.today}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total</span>
                    <span class="stat-count" id="total-count">${visitorCount.total.toLocaleString()}</span>
                </div>
            </div>
            
            <div class="visitor-stats-graph">
                <div class="chart-container">
                    <div class="chart-loading">로딩 중...</div>
                </div>
                <div class="stats-summary">
                    <div class="stat-today">
                        <span class="stat-label-lg">Today</span>
                        <span class="stat-count-lg" id="today-count-lg">${visitorCount.today}</span>
                    </div>
                    <div class="stat-total">
                        <span class="stat-label-lg">Total</span>
                        <span class="stat-count-lg" id="total-count-lg">${visitorCount.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    ` : '';
    
    // 플로팅 버튼 컨테이너 생성
    const floatingButtonsHtml = `
    <div class="floating-buttons">
        ${buttonsHtml}
    </div>
    ${visitorCounterHtml}
    `;
    
    // 플로팅 버튼 스타일 (기존과 동일)
    const floatingButtonsStyles = `
<style>
    .floating-buttons {
        position: fixed;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 15px;
        z-index: 999;
    }

    .floating-btn {
        width: 80px;
        height: 80px;
        background-color: transparent;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: var(--accent-color);
        font-weight: var(--font-bold);
        font-size: 14px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(1, 255, 117, 0.2);
        transition: all 0.3s ease;
        position: relative;
        border: 2px solid var(--accent-color);
        box-sizing: border-box;
        padding: 6px;
        overflow: hidden;
        backdrop-filter: blur(5px);
    }

    .floating-btn:hover {
        background-color: var(--accent-color);
        color: var(--background-color);
        border-color: var(--accent-color);
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(1, 255, 117, 0.4);
    }

    .floating-btn-icon {
        font-size: 18px;
        margin-bottom: 4px;
        transition: all 0.3s ease;
        color: var(--accent-color);
    }

    .floating-btn:hover .floating-btn-icon {
        color: var(--background-color);
        transform: scale(1.1);
    }

    .floating-btn-text {
        line-height: 1.2;
        display: block;
        word-break: keep-all;
        white-space: normal;
        transition: all 0.3s ease;
        opacity: 1;
        color: var(--accent-color);
    }

    .floating-btn:hover .floating-btn-text {
        opacity: 1;
        font-weight: 900;
        color: var(--background-color);
    }

    .visitor-counter {
        position: fixed;
        right: 30px;
        bottom: 70px;
        background-color: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--accent-color);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(1, 255, 117, 0.2);
        z-index: 998;
    }

    .visitor-counter:hover {
        background-color: rgba(0, 0, 0, 0.95);
        box-shadow: 0 6px 20px rgba(1, 255, 117, 0.5);
    }

    .visitor-stats-simple {
        display: none;
        flex-direction: column;
        gap: 8px;
    }

    .visitor-stats-simple .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background-color: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--accent-color);
        border-radius: 50px;
        min-width: 120px;
        backdrop-filter: blur(10px);
    }

    .visitor-stats-simple .stat-label {
        font-size: 12px;
        color: var(--accent-color);
        font-weight: 600;
    }

    .visitor-stats-simple .stat-count {
        font-size: 14px;
        font-weight: 900;
        color: #ffffff;
    }

    .visitor-stats-graph {
        display: block;
        padding: 16px;
        width: 200px;
    }

    .chart-container {
        margin-bottom: 16px;
        padding-top: 12px;
    }

    .chart-loading, .chart-error {
        text-align: center;
        color: var(--accent-color);
        font-size: 12px;
        padding: 20px 0;
    }

    .chart-bars {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        height: 65px;
        padding: 0 8px;
        gap: 6px;
        overflow: visible;
        margin-top: 8px;
        position: relative;
    }

    .bar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        max-width: 35px;
        position: relative;
        height: 100%;
    }

    .bar-value {
        font-size: 11px;
        font-weight: 700;
        color: var(--accent-color);
        text-align: center;
        opacity: 1;
        display: block;
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        line-height: 1;
        z-index: 10;
    }

    .bar {
        width: 10px;
        min-height: 3px;
        background: transparent;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 2px 2px 0 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
        height: var(--bar-height);
        max-height: 55px;
    }

    .bar-fill {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #01FF75 0%, #00cc5e 100%);
        border-radius: 2px 2px 0 0;
        animation: growUp 1.5s ease-out;
        min-height: 3px;
    }

    .bar[data-is-today="true"] .bar-fill {
        background: linear-gradient(180deg, #01FF75 0%, #01FF75 100%);
        box-shadow: 0 0 8px rgba(1, 255, 117, 0.6);
    }

    .bar-label {
        font-size: 12px;
        color: #ffffff;
        font-weight: 500;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
        line-height: 1;
    }

    @keyframes growUp {
        from {
            height: 0;
            opacity: 0.7;
        }
        to {
            height: 100%;
            opacity: 1;
        }
    }

    .stats-summary {
        display: flex;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid rgba(1, 255, 117, 0.2);
        gap: 16px;
    }

    .stat-today, .stat-total {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        flex: 1;
        min-width: 0;
    }

    .stat-label-lg {
        font-size: 12px;
        color: #ffffff;
        font-weight: 600;
    }

    .stat-count-lg {
        font-size: 18px;
        font-weight: 900;
        color: var(--accent-color);
        line-height: 1;
        text-align: center;
        word-break: break-all;
        overflow-wrap: break-word;
    }

    @media (max-width: 768px) {
        .floating-buttons {
            right: 15px !important;
            top: auto !important;
            bottom: 80px !important;
            transform: none !important;
        }

        .visitor-counter {
            display: none !important;
        }

        .floating-btn {
            width: 70px;
            height: 70px;
            font-size: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .floating-btn:hover {
            transform: scale(1.05);
        }

        .floating-btn-icon {
            font-size: 14px;
            margin-bottom: 2px;
        }
    }

    @media (max-width: 480px) {
        .floating-buttons {
            right: 10px !important;
            bottom: 70px !important;
        }

        .visitor-counter {
            display: none !important;
        }

        .floating-btn {
            width: 60px;
            height: 60px;
            font-size: 11px;
        }

        .floating-btn-icon {
            font-size: 12px;
        }
    }
</style>
`;
    
    // 페이지에 플로팅 버튼 삽입
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
        targetElement.innerHTML = floatingButtonsStyles + floatingButtonsHtml;
    } else {
        document.body.insertAdjacentHTML('beforeend', floatingButtonsStyles + floatingButtonsHtml);
    }

    // Firebase 카운터 초기화 (비동기)
    initializeCounter();

    // 실시간 업데이트 (30초마다)
    if (showVisitorCounter) {
        setInterval(async () => {
            try {
                if (counter) {
                    visitorCount = await counter.getCurrentCount();
                    updateCounterDisplay();
                }
            } catch (error) {
                console.error('실시간 업데이트 실패:', error);
            }
        }, 30000);
    }
}

// 사용 예시는 기존과 동일