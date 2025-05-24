// floating-buttons.js - 웹사이트 플로팅 버튼 요소를 생성하는 스크립트

/**
 * 웹사이트 플로팅 버튼을 생성하고 페이지에 삽입하는 함수
 * @param {string} targetElementId - 플로팅 버튼을 삽입할 요소의 ID (기본값: 'floating-buttons-container')
 * @param {Array} buttons - 버튼 구성 배열 (기본값: 작업 보기, 연락하기 버튼)
 */
function createFloatingButtons(targetElementId = 'floating-buttons-container', buttons = null) {
    // 외부 CSS 로드
    const cssHref = './css/styles.css';
    const existingLink = document.querySelector(`link[href="${cssHref}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }

   // 기본 버튼 설정 (아이콘 추가)
const defaultButtons = [
    {
        id: 'work-btn',
        href: 'board_all.html',
        icon: '🗂️',
        text: '작업 보기'
    },
    {
        id: 'contact-btn',
        href: 'index.html#contact',
        icon: '✉️',
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
        background-color: var(--accent-color);
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: var(--background-color);
        font-weight: var(--font-bold);
        font-size: 14px;
        text-align: center;
        box-shadow: 0 4px 10px rgba(1, 255, 117, 0.3);
        transition: var(--transition);
        position: relative;
        border: 2px solid transparent;
        box-sizing: border-box;
        padding: 6px;
        overflow: hidden;
    }

    .floating-btn:hover {
        background-color: var(--background-color);
        color: var(--accent-color);
        border-color: var(--accent-color);
        transform: scale(1.05);
    }

    .floating-btn-icon {
        font-size: 18px;
        margin-bottom: 4px;
    }

    .floating-btn-text {
        line-height: 1.2;
        display: block;
        word-break: keep-all;
        white-space: normal;
    }

    @media (max-width: 768px) {
        .floating-buttons {
            right: 15px;
        }

        .floating-btn {
            width: 70px;
            height: 70px;
            font-size: 12px;
        }

        .floating-btn-icon {
            font-size: 14px;
            margin-bottom: 2px;
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