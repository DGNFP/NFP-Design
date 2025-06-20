// 웹데모 전체화면 기능
function openFullscreen() {
    const modal = document.getElementById('fullscreen-modal');
    const iframe = document.getElementById('fullscreen-iframe');
    const originalIframe = document.getElementById('demo-iframe');
    
    // 원본 iframe의 src를 복사
    iframe.src = originalIframe.src;
    
    // 모달 표시
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ESC 키로 닫기 이벤트 추가
    document.addEventListener('keydown', handleEscKey);
    
    // 애니메이션 효과
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreen-modal');
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }, 300);
    
    // ESC 키 이벤트 제거
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeFullscreen();
    }
}

function refreshDemo() {
    const iframe = document.getElementById('fullscreen-iframe');
    const originalIframe = document.getElementById('demo-iframe');
    
    // 로딩 인디케이터 표시 (선택사항)
    showLoadingIndicator();
    
    // iframe 새로고침
    iframe.src = iframe.src;
    originalIframe.src = originalIframe.src;
    
    // 로딩 완료 후 인디케이터 숨김
    iframe.onload = () => {
        hideLoadingIndicator();
    };
}

function openInNewTab() {
    const demoData = document.getElementById('demo-data');
    if (!demoData) return;
    
    const data = JSON.parse(demoData.textContent);
    const base64Code = data.code;
    
    // 새 창에서 열기
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${data.title} - Web Demo</title>
                <style>
                    body { 
                        margin: 0; 
                        padding: 0; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    }
                    iframe { 
                        width: 100vw; 
                        height: 100vh; 
                        border: none; 
                        display: block; 
                    }
                    .demo-header {
                        background: #1a1a1a;
                        color: white;
                        padding: 8px 16px;
                        font-size: 14px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 1000;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    }
                    .demo-content {
                        margin-top: 40px;
                        height: calc(100vh - 40px);
                    }
                    .close-btn {
                        background: #dc2626;
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    }
                    .close-btn:hover {
                        background: #b91c1c;
                    }
                </style>
            </head>
            <body>
                <div class="demo-header">
                    <span>${data.title} - Web Demo</span>
                    <button class="close-btn" onclick="window.close()">닫기</button>
                </div>
                <div class="demo-content">
                    <iframe src="data:text/html;charset=utf-8;base64,${base64Code}" 
                            sandbox="allow-scripts allow-same-origin">
                    </iframe>
                </div>
            </body>
            </html>
        `);
        newWindow.document.close();
    }
}

// 로딩 인디케이터 함수들
function showLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
    }
}

function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// 모달 외부 클릭 시 닫기
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('fullscreen-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeFullscreen();
            }
        });
        
        // 초기 투명도 설정
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
    }
});

// 전체화면 API 지원 확인 및 사용
function toggleBrowserFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// 키보드 단축키 지원
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Shift + F로 전체화면 토글
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        if (document.getElementById('demo-iframe')) {
            openFullscreen();
        }
    }
    
    // Ctrl/Cmd + Shift + N으로 새 탭에서 열기
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        if (document.getElementById('demo-iframe')) {
            openInNewTab();
        }
    }
});

// 성능 최적화: Intersection Observer로 iframe 로딩 지연
document.addEventListener('DOMContentLoaded', function() {
    const demoIframes = document.querySelectorAll('.demo-iframe');
    
    if ('IntersectionObserver' in window && demoIframes.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.dataset.src && !iframe.src) {
                        iframe.src = iframe.dataset.src;
                        observer.unobserve(iframe);
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        demoIframes.forEach(iframe => {
            // 이미 src가 있으면 관찰하지 않음
            if (!iframe.src && iframe.dataset.src) {
                observer.observe(iframe);
            }
        });
    }
});

// 터치 디바이스 지원
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const modal = document.getElementById('fullscreen-modal');
    if (modal && modal.classList.contains('active')) {
        // 아래로 스와이프하면 전체화면 닫기
        if (touchEndY - touchStartY > 100) {
            closeFullscreen();
        }
    }
}

// 디버그 모드 (개발용)
const DEBUG_MODE = false;

function debugLog(message) {
    if (DEBUG_MODE) {
        console.log('[WebDemo Debug]:', message);
    }
}

// 에러 핸들링
window.addEventListener('error', function(event) {
    if (event.target.tagName === 'IFRAME') {
        debugLog('Iframe loading error:', event);
        // iframe 로딩 실패 시 대체 콘텐츠 표시 등의 처리
    }
});