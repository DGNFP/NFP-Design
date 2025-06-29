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
            // 비례적 높이 계산: 최대값 기준으로 0~35px 범위에서 계산
            const height = data.count === 0 ? 3 : Math.max((data.count / maxValue) * 35, 3);
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
                <div class="stat-item">
                    <span class="stat-label">Total</span>
                    <span class="stat-count" id="total-count">${visitorCount.total.toLocaleString()}</span>
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
        right: 30px; /* 오른쪽에서 30px 마진 (플로팅 버튼과 동일) */
        bottom: 70px; /* 연락하기 버튼 밑에 위치 */
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
        box-shadow: 0 6px 20px rgba(1, 255, 117, 0.5);
    }

    /* 모바일용 심플 스타일 (기본 숨김) */
    .visitor-stats-simple {
        display: none;
        flex-direction: column;
        gap: 8px; /* 두 컨테이너 사이 간격 */
    }

    .visitor-stats-simple .stat-item {
        display: flex;
        justify-content: space-between; /* 좌우 배치 */
        align-items: center;
        padding: 8px 16px;
        background-color: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--accent-color);
        border-radius: 50px; /* 최대한 둥글게 (캡슐 모양) */
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
        color: #ffffff; /* 숫자는 흰색 */
    }

    .visitor-stats-simple .stat-divider {
        display: none; /* 구분선 제거 */
    }

    /* PC용 그래프 스타일 */
    .visitor-stats-graph {
        display: block;
        padding: 16px; /* 패딩 줄임 */
        width: 200px; /* 폭 대폭 축소 (300px → 200px) */
    }

    .chart-container {
        margin-bottom: 16px; /* 간격 줄임 */
        padding-top: 12px; /* 상단 패딩 추가로 방문자 수 공간 확보 */
    }

    .chart-bars {
        display: flex;
        justify-content: space-between;
        align-items: stretch; /* 모든 컨테이너 높이 동일하게 */
        height: 65px; /* 전체 차트 영역 높이 */
        padding: 0 8px;
        gap: 6px;
        overflow: visible; /* 방문자 수가 위로 나올 수 있게 */
        margin-top: 8px;
        position: relative; /* 절대 위치 요소들의 기준점 */
    }

    .bar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        max-width: 35px; /* 컨테이너 폭 (막대 10px + 여백) */
        position: relative; /* 방문자 수 위치 조정을 위해 */
        height: 100%; /* 전체 높이 사용 */
    }

    .bar-value {
        font-size: 11px;
        font-weight: 700;
        color: var(--accent-color);
        text-align: center;
        opacity: 1;
        display: block;
        position: absolute;
        top: -20px; /* 고정된 높이로 되돌림 */
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        line-height: 1;
        z-index: 10;
    }

    .bar {
        width: 10px; /* 막대 폭 정확히 10px */
        min-height: 3px; /* 최소 높이 */
        background: transparent;
        position: absolute; /* 절대 위치로 정확한 센터 배치 */
        bottom: 20px; /* 날짜 라벨 위쪽에 위치 */
        left: 50%;
        transform: translateX(-50%); /* 정확한 중앙 정렬 */
        border-radius: 2px 2px 0 0; /* 모서리 2px */
        transition: all 0.3s ease;
        display: flex;
        align-items: flex-end; /* 하단 정렬 */
        overflow: hidden; /* 넘치는 부분 숨김 */
        height: var(--bar-height); /* CSS 변수로 동적 높이 */
        max-height: 35px; /* 컨테이너 내부 최대 높이 제한 */
    }

    .bar-fill {
        width: 100%; /* 막대 전체 폭 */
        height: 100%; /* 부모의 높이를 모두 사용 */
        background: linear-gradient(180deg, #01FF75 0%, #00cc5e 100%);
        border-radius: 2px 2px 0 0; /* 모서리 2px */
        animation: growUp 1.5s ease-out;
        min-height: 3px; /* 최소 높이 */
    }

    .bar[data-is-today="true"] .bar-fill {
        background: linear-gradient(180deg, #01FF75 0%, #01FF75 100%);
        box-shadow: 0 0 8px rgba(1, 255, 117, 0.6); /* 글로우 효과 */
    }

    .bar-label {
        font-size: 12px;
        color: #ffffff; /* 날짜 텍스트 흰색으로 변경 */
        font-weight: 500;
        position: absolute; /* 절대 위치로 조정 */
        bottom: 0; /* 컨테이너 맨 아래 */
        left: 50%;
        transform: translateX(-50%); /* 중앙 정렬 */
        width: 100%;
        text-align: center;
        line-height: 1;
    }

    @keyframes growUp {
        from {
            height: 0; /* 0에서 시작 */
            opacity: 0.7;
        }
        to {
            height: 100%; /* 부모 높이까지 */
            opacity: 1;
        }
    }

    .stats-summary {
        display: flex;
        justify-content: space-between;
        padding-top: 16px; /* 패딩 줄임 */
        border-top: 1px solid rgba(1, 255, 117, 0.2);
        gap: 16px; /* 간격 줄임 */
    }

    .stat-today, .stat-total {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px; /* 간격 줄임 */
        flex: 1; /* 균등 분할 */
        min-width: 0; /* flexbox 자식 요소 최소 크기 제한 해제 */
    }

    .stat-label-lg {
        font-size: 12px; /* 폰트 크기 축소 (16px → 12px) */
        color: #ffffff;
        font-weight: 600; /* 폰트 굵기 증가 */
    }

    .stat-count-lg {
        font-size: 18px; /* 폰트 크기 축소 (32px → 18px) */
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

        /* 모바일에서는 방문자 카운터 완전히 숨김 */
        .visitor-counter {
            display: none !important; /* 완전히 숨김 */
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
            display: none !important; /* 완전히 숨김 */
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