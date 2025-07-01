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
            
            // 스튜디오 통합 페이지로 이동
            setTimeout(() => {
                window.location.href = '/studio/';
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
    if (appDownloadBtn) {
        appDownloadBtn.addEventListener('click', function() {
            // 클릭 효과
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // 앱 스토어 또는 다운로드 페이지로 이동
            setTimeout(() => {
                // iOS/Android 감지 후 해당 스토어로 이동
                const userAgent = navigator.userAgent || navigator.vendor || window.opera;
                
                if (/iPad|iPhone|iPod/.test(userAgent)) {
                    // iOS - App Store로 이동
                    window.open('https://apps.apple.com/app/nfp-studio', '_blank');
                } else if (/android/i.test(userAgent)) {
                    // Android - Google Play Store로 이동
                    window.open('https://play.google.com/store/apps/details?id=com.nfpstudio', '_blank');
                } else {
                    // PC - 앱 소개 페이지로 이동
                    window.location.href = '/app-download/';
                }
            }, 300);
        });
    }
});