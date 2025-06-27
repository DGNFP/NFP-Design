// floating-buttons.js - 웹사이트 플로팅 버튼 요소를 생성하는 스크립트 (방문자 카운터 포함)

/**
 * 방문자 수를 관리하는 클래스
 */
class VisitorCounter {
    constructor() {
        this.todayKey = 'visitor_today_' + this.getTodayString();
        this.totalKey = 'visitor_total';
        this.lastVisitKey = 'last_visit_date';
    }

    // 오늘 날짜 문자열 반환 (YYYY-MM-DD)
    getTodayString() {
        const today = new Date();
        return today.getFullYear() + '-' + 
               String(today.getMonth() + 1).padStart(2, '0') + '-' + 
               String(today.getDate()).padStart(2, '0');
    }

    // 방문자 수 증가 및 반환 (세션당 1회만)
    updateVisitorCount() {
        const today = this.getTodayString();
        const sessionKey = 'visitor_session_' + today;
        const hasVisitedToday = sessionStorage.getItem(sessionKey);

        // 이미 오늘 세션에서 카운트했다면 현재 카운트만 반환
        if (hasVisitedToday) {
            return this.getCurrentCount();
        }

        // 세션에서 처음 방문이면 카운트 증가
        // 오늘 방문자 수 증가
        let todayCount = parseInt(localStorage.getItem(this.todayKey) || '0');
        todayCount++;
        localStorage.setItem(this.todayKey, todayCount.toString());

        // 전체 방문자 수 증가
        let totalCount = parseInt(localStorage.getItem(this.totalKey) || '0');
        totalCount++;
        localStorage.setItem(this.totalKey, totalCount.toString());

        // 세션에 방문 기록 저장 (브라우저 종료시까지 유지)
        sessionStorage.setItem(sessionKey, 'true');

        // 마지막 방문 날짜 업데이트
        localStorage.setItem(this.lastVisitKey, today);

        // 어제 이전 데이터 정리 (선택적)
        this.cleanOldData();

        return {
            today: todayCount,
            total: totalCount
        };
    }

    // 현재 카운트 조회
    getCurrentCount() {
        const todayCount = parseInt(localStorage.getItem(this.todayKey) || '0');
        const totalCount = parseInt(localStorage.getItem(this.totalKey) || '0');
        return {
            today: todayCount,
            total: totalCount
        };
    }

    // 오래된 일별 데이터 정리 (7일 이전 데이터 삭제)
    cleanOldData() {
        const keys = Object.keys(localStorage);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        keys.forEach(key => {
            if (key.startsWith('visitor_today_')) {
                const dateStr = key.replace('visitor_today_', '');
                const date = new Date(dateStr);
                if (date < sevenDaysAgo) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    // 최근 5일간 데이터 가져오기
    getLast5DaysData() {
        const data = [];
        const today = new Date();
        
        for (let i = 4; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.getFullYear() + '-' + 
                          String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(date.getDate()).padStart(2, '0');
            
            const dayKey = 'visitor_today_' + dateStr;
            const count = parseInt(localStorage.getItem(dayKey) || '0');
            const dayNum = date.getDate();
            
            data.push({
                date: dateStr,
                day: dayNum,
                count: count
            });
        }
        
        return data;
    }
}

/**
 * 웹사이트 플로팅 버튼을 생성하고 페이지에 삽입하는 함수
 * @param {string} targetElementId - 플로팅 버튼을 삽입할 요소의 ID (기본값: 'floating-buttons-container')
 * @param {Array} buttons - 버튼 구성 배열 (기본값: 작업 보기, 연락하기 버튼)
 * @param {boolean} showVisitorCounter - 방문자 카운터 표시 여부 (기본값: true)
 */
function createFloatingButtons(targetElementId = 'floating-buttons-container', buttons = null, showVisitorCounter = true) {
    // 5일간 차트 HTML 생성 함수
    function generateChartHTML() {
        if (!showVisitorCounter) return '';
        
        const counter = new VisitorCounter();
        const chartData = counter.getLast5DaysData();
        const maxValue = Math.max(...chartData.map(d => d.count), 1);
        
        let chartHTML = '<div class="chart-bars">';
        
        chartData.forEach((data, index) => {
            const height = Math.max((data.count / maxValue) * 50, 3); // 최대 50px, 최소 3px
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
    }

    // 방문자 카운터 초기화 및 업데이트
    let visitorCount = { today: 0, total: 0 };
    if (showVisitorCounter) {
        const counter = new VisitorCounter();
        visitorCount = counter.updateVisitorCount();
    }

    // 외부 CSS 로드 (절대경로로 수정)
    const cssHref = '/css/styles.css';
    const existingLink = document.querySelector(`link[href="${cssHref}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }

    // 기본 버튼 설정 (폰트어썸 아이콘으로 변경)
    const defaultButtons = [
        {
            id: 'work-btn',
            href: '/posts/',
            icon: '<i class="fas fa-clipboard-list"></i>',
            text: '작업 보기'
        },
        {
            id: 'contact-btn',
            href: '/index.html#contact', // 절대경로로 수정
            icon: '<i class="fas fa-comment"></i>',
            text: '연락하기'
        }
    ];
    
    // 사용자 정의 버튼 또는 기본 버튼 사용
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

    // 방문자 카운터 HTML 생성
    const visitorCounterHtml = showVisitorCounter ? `
        <div class="visitor-counter">
            <!-- 모바일용 심플 스타일 -->
            <div class="visitor-stats-simple">
                <div class="stat-item">
                    <span class="stat-label">Today</span>
                    <span class="stat-count" id="today-count">${visitorCount.today}</span>
                </div>
                <div class="stat-divider">|</div>
                <div class="stat-item">
                    <span class="stat-label">Total</span>
                    <span class="stat-count" id="total-count">${visitorCount.total}</span>
                </div>
            </div>
            
            <!-- PC용 그래프 스타일 -->
            <div class="visitor-stats-graph">
                <div class="chart-container">
                    ${generateChartHTML()}
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

    // 5일간 차트 HTML 생성 함수
    function generateChartHTML() {
        if (!showVisitorCounter) return '';
        
        const counter = new VisitorCounter();
        const chartData = counter.getLast5DaysData();
        const maxValue = Math.max(...chartData.map(d => d.count), 1);
        
        let chartHTML = '<div class="chart-bars">';
        
        chartData.forEach((data, index) => {
            const height = (data.count / maxValue) * 100;
            const isToday = index === chartData.length - 1;
            
            chartHTML += `
                <div class="bar-container">
                    <div class="bar-value">${data.count}</div>
                    <div class="bar" style="--bar-height: ${height}%" data-is-today="${isToday}">
                        <div class="bar-fill"></div>
                    </div>
                    <div class="bar-label">${data.day}</div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        return chartHTML;
    }
    
    // 플로팅 버튼 컨테이너 생성 (방문자 카운터는 별도 위치)
    const floatingButtonsHtml = `
    <div class="floating-buttons">
        ${buttonsHtml}
    </div>
    ${visitorCounterHtml}
    `;
    
    // 플로팅 버튼 스타일 삽입
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
        background-color: transparent; /* 투명 배경 */
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: var(--accent-color); /* 액센트 컬러 텍스트 */
        font-weight: var(--font-bold);
        font-size: 14px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(1, 255, 117, 0.2);
        transition: all 0.3s ease;
        position: relative;
        border: 2px solid var(--accent-color); /* 액센트 컬러 테두리 */
        box-sizing: border-box;
        padding: 6px;
        overflow: hidden;
        backdrop-filter: blur(5px);
    }

    .floating-btn:hover {
        background-color: var(--accent-color); /* 호버시 배경 채움 */
        color: var(--background-color); /* 호버시 텍스트 색상 반전 */
        border-color: var(--accent-color);
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(1, 255, 117, 0.4);
    }

    .floating-btn-icon {
        font-size: 18px;
        margin-bottom: 4px;
        transition: all 0.3s ease;
        color: var(--accent-color); /* 기본 액센트 컬러 */
    }

    .floating-btn:hover .floating-btn-icon {
        color: var(--background-color); /* 호버시 배경색 */
        transform: scale(1.1);
    }

    .floating-btn-text {
        line-height: 1.2;
        display: block;
        word-break: keep-all;
        white-space: normal;
        transition: all 0.3s ease;
        opacity: 1;
        color: var(--accent-color); /* 기본 액센트 컬러 */
    }

    .floating-btn:hover .floating-btn-text {
        opacity: 1;
        font-weight: 900;
        color: var(--background-color); /* 호버시 배경색 */
    }

    /* 방문자 카운터 스타일 */
    .visitor-counter {
        position: fixed; /* PC에서도 독립적으로 위치 */
        left: 30px; /* 왼쪽에서 30px 마진 (플로팅 버튼과 동일) */
        bottom: 10%; /* 화면 하단에서 10% 위에 위치 */
        background-color: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--accent-color);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(1, 255, 117, 0.2);
        z-index: 998; /* 팝업보다는 낮지만 다른 요소보다는 높게 */
    }

    .visitor-counter:hover {
        background-color: rgba(0, 0, 0, 0.95);
        transform: scale(1.02);
        box-shadow: 0 6px 20px rgba(1, 255, 117, 0.3);
    }

    /* 모바일용 심플 스타일 (기본 숨김) */
    .visitor-stats-simple {
        display: none;
        padding: 12px 16px;
    }

    .visitor-stats-simple .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
    }

    .visitor-stats-simple .stat-label {
        font-size: 10px;
        opacity: 0.8;
        color: var(--accent-color);
    }

    .visitor-stats-simple .stat-count {
        font-size: 14px;
        font-weight: 900;
        color: var(--accent-color);
    }

    .visitor-stats-simple .stat-divider {
        font-size: 12px;
        opacity: 0.6;
        margin: 0 4px;
        color: var(--accent-color);
    }

    /* PC용 그래프 스타일 */
    .visitor-stats-graph {
        display: block;
        padding: 20px;
        width: 300px; /* 폭을 늘려서 큰 숫자 대비 */
    }

    .chart-container {
        margin-bottom: 20px;
    }

    .chart-bars {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 80px; /* 차트 영역 높이 줄임 */
        padding: 0 10px;
        gap: 12px; /* 막대 간격 조금 늘림 */
        overflow: hidden; /* 넘치는 부분 숨김 */
    }

    .bar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        max-width: 45px; /* 막대 폭 조금 늘림 */
    }

    .bar-value {
        font-size: 13px; /* 폰트 크기 조금 늘림 */
        font-weight: 600;
        color: var(--accent-color);
        margin-bottom: 8px;
        min-height: 18px; /* 높이 조금 늘림 */
        text-align: center;
    }

    .bar {
        width: 100%;
        min-height: 20px;
        background: transparent;
        position: relative;
        border-radius: 6px 6px 0 0; /* 모서리 조금 더 둥글게 */
        height: 60px; /* 막대 컨테이너 높이 줄임 */
        transition: all 0.3s ease;
        display: flex;
        align-items: flex-end; /* 하단 정렬 */
        overflow: hidden; /* 넘치는 부분 숨김 */
    }

    .bar-fill {
        width: 100%;
        height: var(--bar-height); /* CSS 변수 직접 사용 */
        background: linear-gradient(180deg, #01FF75 0%, #00cc5e 100%);
        border-radius: 6px 6px 0 0;
        animation: growUp 1.5s ease-out;
        min-height: 3px; /* 0일 때도 최소 높이 보장 */
        max-height: 50px; /* 최대 높이 강제 제한 */
    }

    .bar[data-is-today="true"] .bar-fill {
        background: linear-gradient(180deg, #01FF75 0%, #01FF75 100%);
        box-shadow: 0 0 15px rgba(1, 255, 117, 0.6); /* 글로우 효과 강화 */
    }

    .bar-label {
        font-size: 13px; /* 폰트 크기 조금 늘림 */
        color: var(--accent-color);
        margin-top: 8px;
        font-weight: 500;
    }

    @keyframes growUp {
        from {
            height: 3px; /* 최소 높이에서 시작 */
            opacity: 0.7;
        }
        to {
            height: var(--bar-height); /* 목표 높이까지 */
            opacity: 1;
        }
    }

    .stats-summary {
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
        border-top: 1px solid rgba(1, 255, 117, 0.2);
        gap: 20px; /* 간격 추가 */
    }

    .stat-today, .stat-total {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px; /* 간격 조금 늘림 */
        flex: 1; /* 균등 분할 */
        min-width: 0; /* flexbox 자식 요소 최소 크기 제한 해제 */
    }

    .stat-label-lg {
        font-size: 16px; /* 폰트 크기 늘림 */
        color: #ffffff;
        font-weight: 600; /* 폰트 굵기 증가 */
    }

    .stat-count-lg {
        font-size: 32px; /* 폰트 크기 크게 증가 (큰 숫자 대비) */
        font-weight: 900;
        color: var(--accent-color);
        line-height: 1; /* 줄 간격 조정 */
        text-align: center;
        word-break: break-all; /* 긴 숫자 줄바꿈 허용 */
        overflow-wrap: break-word;
    }

    @media (max-width: 768px) {
        .floating-buttons {
            right: 15px !important;
            top: auto !important;
            bottom: 80px !important; /* 모바일에서 하단 고정 - !important로 강제 적용 */
            transform: none !important;
        }

        /* 모바일에서는 방문자 카운터를 하단 왼쪽으로 재위치 + 심플 스타일 */
        .visitor-counter {
            position: fixed !important;
            left: 15px !important;
            bottom: 80px !important;
            top: auto !important; /* PC의 top 속성 무효화 */
            transform: none !important; /* PC의 transform 무효화 */
            width: auto !important;
            background-color: rgba(1, 255, 117, 0.1) !important;
            border-radius: 25px !important;
            padding: 12px 16px !important;
        }

        .visitor-stats-simple {
            display: flex !important;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: var(--accent-color);
            font-weight: var(--font-bold);
        }

        .visitor-stats-graph {
            display: none !important;
        }

        .floating-btn {
            width: 70px;
            height: 70px;
            font-size: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .floating-btn:hover {
            transform: scale(1.05); /* 모바일에서는 확대 효과 줄임 */
        }

        .floating-btn-icon {
            font-size: 14px;
            margin-bottom: 2px;
        }

        .visitor-counter {
            padding: 8px 12px;
            border-radius: 20px;
        }

        .visitor-stats {
            font-size: 10px;
            gap: 6px;
        }

        .stat-count {
            font-size: 12px;
        }

        .stat-label {
            font-size: 8px;
        }
    }

    @media (max-width: 480px) {
        .floating-buttons {
            right: 10px !important;
            bottom: 70px !important;
        }

        .visitor-counter {
            left: 10px !important;
            bottom: 70px !important;
            top: auto !important; /* PC의 top 속성 무효화 */
            transform: none !important; /* PC의 transform 무효화 */
        }

        .visitor-stats-simple {
            font-size: 10px !important;
            gap: 6px !important;
        }

        .visitor-stats-simple .stat-count {
            font-size: 12px !important;
        }

        .visitor-stats-simple .stat-label {
            font-size: 8px !important;
        }

        .floating-btn {
            width: 60px;
            height: 60px;
            font-size: 11px;
        }

        .floating-btn-icon {
            font-size: 12px;
        }

        .visitor-counter {
            padding: 6px 10px;
            border-radius: 18px;
        }

        .visitor-stats {
            font-size: 9px;
            gap: 4px;
        }

        .stat-count {
            font-size: 11px;
        }

        .stat-label {
            font-size: 7px;
        }

        .stat-divider {
            font-size: 10px;
        }
    }
</style>
`;
    
    // 페이지에 플로팅 버튼 삽입
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
        targetElement.innerHTML = floatingButtonsStyles + floatingButtonsHtml;
    } else {
        // targetElement가 없으면 body에 직접 삽입
        document.body.insertAdjacentHTML('beforeend', floatingButtonsStyles + floatingButtonsHtml);
    }

    // 방문자 카운터 실시간 업데이트 (선택적)
    if (showVisitorCounter) {
        setInterval(() => {
            const counter = new VisitorCounter();
            const currentCount = counter.getCurrentCount();
            
            // 심플 스타일 업데이트 (모바일)
            const todayElement = document.getElementById('today-count');
            const totalElement = document.getElementById('total-count');
            if (todayElement) todayElement.textContent = currentCount.today;
            if (totalElement) totalElement.textContent = currentCount.total;
            
            // 그래프 스타일 업데이트 (PC)
            const todayElementLg = document.getElementById('today-count-lg');
            const totalElementLg = document.getElementById('total-count-lg');
            if (todayElementLg) todayElementLg.textContent = currentCount.today;
            if (totalElementLg) totalElementLg.textContent = currentCount.total.toLocaleString();
            
        }, 30000); // 30초마다 업데이트
    }
}

// 페이지 로드 시 플로팅 버튼 자동 생성 (선택적으로 사용)
// document.addEventListener('DOMContentLoaded', function() {
//     createFloatingButtons();
// });

// 사용 예시:
// createFloatingButtons(); // 기본 설정으로 방문자 카운터 포함
// createFloatingButtons('my-container', null, false); // 방문자 카운터 제외
// createFloatingButtons('my-container', customButtons, true); // 커스텀 버튼 + 방문자 카운터