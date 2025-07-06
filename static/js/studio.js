// Studio NFP 섹션 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const studioItems = document.querySelectorAll('.studio-item');
    const studioMoreBtn = document.querySelector('.studio-more-btn');
    const appDownloadBtn = document.querySelector('.app-download-btn');
    
    // 스튜디오 아이템 클릭 이벤트
    studioItems.forEach(item => {
        item.addEventListener('click', function() {
            // 클릭 효과 애니메이션
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 해당 탭으로 스튜디오 페이지 이동
            const targetTab = this.dataset.app;
            
            setTimeout(() => {
                window.location.href = `/studio/#${targetTab}`;
            }, 200);
        });
        
        // 호버 시 커서 변경
        item.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
    
    // 더 많은 기능 버튼 클릭 이벤트
    if (studioMoreBtn) {
        studioMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/studio/';
        });
    }
    
    // 앱 다운로드 버튼 클릭 이벤트
    // 앱 다운로드 버튼 클릭 이벤트 (수정된 버전)
if (appDownloadBtn) {
    appDownloadBtn.addEventListener('click', function() {
        // 클릭 효과
        this.style.transform = 'translateY(-5px) scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 개발 중 알림창 표시
        setTimeout(() => {
            alert('NFP 디자인 어시스턴트 앱이 개발 중입니다.\n곧 만나보실 수 있어요!');
        }, 300);
    });
    }
});