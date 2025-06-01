// floating-buttons.js - 웹사이트 플로팅 버튼 요소를 생성하는 스크립트

/**
 * 웹사이트 플로팅 버튼을 생성하고 페이지에 삽입하는 함수
 * @param {string} targetElementId - 플로팅 버튼을 삽입할 요소의 ID (기본값: 'floating-buttons-container')
 * @param {Array} buttons - 버튼 구성 배열 (기본값: 작업 보기, 연락하기 버튼)
 */
function createFloatingButtons(targetElementId = 'floating-buttons-container', buttons = null) {
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
    
    // 플로팅 버튼 컨테이너 생성
    const floatingButtonsHtml = `
    <div class="floating-buttons">
        ${buttonsHtml}
    </div>
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

    @media (max-width: 768px) {
        .floating-buttons {
            right: 15px !important;
            top: auto !important;
            bottom: 80px !important; /* 모바일에서 하단 고정 - !important로 강제 적용 */
            transform: none !important;
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
    }

    @media (max-width: 480px) {
        .floating-buttons {
            right: 10px !important;
            bottom: 70px !important;
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
        // targetElement가 없으면 body에 직접 삽입
        document.body.insertAdjacentHTML('beforeend', floatingButtonsStyles + floatingButtonsHtml);
    }
}

// 페이지 로드 시 플로팅 버튼 자동 생성 (선택적으로 사용)
// document.addEventListener('DOMContentLoaded', function() {
//     createFloatingButtons();
// });