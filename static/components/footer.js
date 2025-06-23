// footer.js - 웹사이트 푸터 요소를 생성하는 스크립트

/**
 * 웹사이트 푸터를 생성하고 페이지에 삽입하는 함수
 * @param {string} targetElementId - 푸터를 삽입할 요소의 ID (기본값: 'footer-container')
 * @param {number} year - 저작권 연도 (기본값: 현재 연도)
 * @param {string} companyName - 회사명 (기본값: 'NFP DESIGN')
 */
function createFooter(targetElementId = 'footer-container', year = new Date().getFullYear(), companyName = 'NFP DESIGN') {
    // 외부 CSS 로드 (절대 경로로 수정)
    const cssHref = '/css/styles.css';
    const existingLink = document.querySelector(`link[href="${cssHref}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }

    // 푸터 요소 생성 (카카오톡 버튼 추가)
    const footerHtml = `
    <footer>
        <div class="container">
            <div class="social-links">
                <a href="https://www.youtube.com/@NFP-DESIGN" target="_blank" class="social-link social-link-youtube">
                    <i class="fab fa-youtube"></i>
                </a>
                <a href="https://www.instagram.com/nfp_dg" target="_blank" class="social-link social-link-instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://open.kakao.com/me/nfp" target="_blank" class="social-link social-link-kakao">
                    <i class="fas fa-comment"></i>
                </a>
                <a href="#" target="_blank" class="social-link social-link-games">
                    <i class="fas fa-gamepad"></i>
                </a>
               <a href="/admin/" class="social-link social-link-admin" target="_blank" rel="noopener">
                    <i class="fas fa-cog"></i>
                </a>
            </div>
            <div class="footer-credits">
                <p class="copyright">© ${year} ${companyName}. All rights reserved.</p>
                <p class="creative-credit">Creative by Studio NFP</p>
            </div>
        </div>
    </footer>
    `;
    
    // 푸터 스타일 삽입 (카카오톡 호버 효과 포함)
    const footerStyles = `
    <style>
        /* 푸터 스타일 */
        footer {
            padding: 20px 0;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 60px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        
        .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            margin: 0 10px;
            transition: var(--transition);
            font-weight: var(--font-bold);
            color: var(--text-color);
            text-decoration: none;
        }
        
        /* 유튜브 호버 효과 */
        .social-link-youtube:hover {
            background-color: #FF0000;
            color: #ffffff;
        }
        
        /* 인스타그램 호버 효과 (부드러운 전환) */
        .social-link-instagram {
            position: relative;
            overflow: hidden;
        }
        
        .social-link-instagram::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }
        
        .social-link-instagram:hover::before {
            opacity: 1;
        }
        
        .social-link-instagram:hover {
            color: #ffffff;
        }
        
        /* 카카오톡 호버 효과 (부드러운 전환) */
        .social-link-kakao {
            position: relative;
            overflow: hidden;
        }
        
        .social-link-kakao::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #FEE500;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }
        
        .social-link-kakao:hover::before {
            opacity: 1;
        }
        
        .social-link-kakao:hover {
            color: #3C1E1E;
        }
        
        /* NFP-GAMES 호버 효과 (부드러운 전환) */
        .social-link-games {
            position: relative;
            overflow: hidden;
        }
        
        .social-link-games::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #00F0FF 0%, #FFF200 100%);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }
        
        .social-link-games:hover::before {
            opacity: 1;
        }
        
        .social-link-games:hover {
            color: #000000;
        }
        
        /* 관리자 호버 효과 (NFP 강조색) */
        .social-link-admin:hover {
            background-color: var(--accent-color);
            color: var(--background-color);
        }
        
        /* 푸터 크레딧 영역 */
        .footer-credits {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }
        
        .copyright {
            opacity: 1;
            font-size: 14px;
            font-weight: var(--font-medium);
            color: var(--text-color);
            margin: 0;
        }
        
        .creative-credit {
            opacity: 1;
            font-size: 12px;
            font-weight: var(--font-medium);
            color: var(--accent-color);
            margin: 0;
            letter-spacing: 0.5px;
            transition: opacity 0.3s ease;
        }
        
        .creative-credit:hover {
            opacity: 1;
        }
        
        /* 모바일에서는 크레딧을 세로로 정렬 */
        @media (max-width: 768px) {
            .footer-credits {
                gap: 8px;
            }
            
            .copyright {
                font-size: 13px;
            }
            
            .creative-credit {
                font-size: 11px;
            }
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