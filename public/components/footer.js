// footer.js - 웹사이트 푸터 요소를 생성하는 스크립트

/**
 * 웹사이트 푸터를 생성하고 페이지에 삽입하는 함수
 * @param {string} targetElementId - 푸터를 삽입할 요소의 ID (기본값: 'footer-container')
 * @param {number} year - 저작권 연도 (기본값: 현재 연도)
 * @param {string} companyName - 회사명 (기본값: 'NFP DESIGN 전인혁')
 */
function createFooter(targetElementId = 'footer-container', year = new Date().getFullYear(), companyName = 'NFP DESIGN 전인혁') {
    // 외부 CSS 로드
    const cssHref = './css/styles.css';
    const existingLink = document.querySelector(`link[href="${cssHref}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }

    // 푸터 요소 생성
    const footerHtml = `
    <footer>
        <div class="container">
            <div class="social-links">
                <a href="index.html#" class="social-link_B">B</a>
                <a href="index.html#" class="social-link_Y">Y</a>
                <a href="index.html#" class="social-link_I">I</a>
                <a href="./admin/index.html" class="social-link">G</a>
            </div>
            <p class="copyright">© ${year} ${companyName}. All rights reserved.</p>
        </div>
    </footer>
    `;
    
    // 푸터 스타일 삽입
    const footerStyles = `
    <style>
        /* 푸터 스타일 */
        footer {
            padding: 50px 0;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .social-links {
            margin-bottom: 20px;
        }
        
        .social-links a {
            margin: 0 10px;
            font-size: 18px;
            transition: var(--transition);
        }
        
        .social-links a:hover {
            color: var(--accent-color);
        }
        
        .copyright {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
        }
    </style>
    `;
    
    // 페이지에 푸터 삽입
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
        targetElement.innerHTML = footerStyles + footerHtml;
    } else {
        // targetElement가 없으면 body 끝 부분에 삽입
        document.body.insertAdjacentHTML('beforeend', footerStyles + footerHtml);
    }
}

// 페이지 로드 시 푸터 자동 생성 (선택적으로 사용)
// document.addEventListener('DOMContentLoaded', function() {
//     createFooter();
// });