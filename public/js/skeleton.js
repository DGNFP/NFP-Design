// ========================================
// 레이아웃 시프트 방지 + 깔끔한 이미지 관리
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.post-body img[src^="/img/uploads/"]');
    
    images.forEach(function(img, index) {
        // 🎯 로딩 최적화
        img.loading = index === 0 ? 'eager' : 'lazy';
        img.decoding = 'async';
        
        // 🎯 1단계: 스켈레톤 준비 - CSS 클래스로 관리
        img.classList.add('image-skeleton');
        
        // 🎯 2단계: 이미지 로드 완료 감지
        if (img.complete && img.naturalHeight !== 0) {
            // 이미 로드된 이미지
            handleImageLoaded(img);
        } else {
            // 로드 대기 중인 이미지
            img.addEventListener('load', () => handleImageLoaded(img));
            img.addEventListener('error', () => handleImageError(img));
        }
        
        // 🎯 3단계: 라이트박스 간섭 방지 (가벼운 접근)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // 라이트박스가 문제되는 스타일을 추가했는지 확인
                    if (img.style.maxWidth === '100%' || img.style.maxWidth === 'none') {
                        // CSS 클래스로 해결 (인라인 스타일 대신)
                        img.classList.add('image-size-fix');
                        
                        // 잠깐 후 제거 (라이트박스 초기화 완료 후)
                        setTimeout(() => {
                            img.classList.remove('image-size-fix');
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(img, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
        
        // 메모리 정리
        window.addEventListener('beforeunload', () => observer.disconnect());
    });
    
    // 🎯 이미지 로드 완료 처리
    function handleImageLoaded(img) {
        // 스켈레톤 → 실제 이미지로 전환
        img.classList.remove('image-skeleton');
        img.classList.add('image-loaded');
        
        // 부드러운 전환 효과
        img.style.opacity = '0';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 50);
    }
    
    // 🎯 이미지 로드 실패 처리
    function handleImageError(img) {
        img.classList.remove('image-skeleton');
        img.classList.add('image-error');
    }
    
    // 🎯 반응형 처리 (리사이즈 시)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // CSS가 자동으로 처리하므로 JavaScript 개입 최소화
            const loadedImages = document.querySelectorAll('.image-loaded');
            loadedImages.forEach(img => {
                // 단순히 클래스 토글로 리플로우 트리거
                img.classList.toggle('resize-trigger');
                setTimeout(() => img.classList.remove('resize-trigger'), 10);
            });
        }, 250);
    });
});

// ========================================
// 최소한의 안전장치 (비상용)
// ========================================

// 🎯 극단적인 경우에만 작동하는 백업 시스템
let emergencyCheckCount = 0;
const maxEmergencyChecks = 10;

const emergencyInterval = setInterval(function() {
    emergencyCheckCount++;
    
    // 최대 체크 횟수 도달 시 중단
    if (emergencyCheckCount >= maxEmergencyChecks) {
        clearInterval(emergencyInterval);
        return;
    }
    
    // 페이지가 보이지 않으면 건너뛰기
    if (document.hidden) return;
    
    const problematicImages = document.querySelectorAll('.post-body img[src^="/img/uploads/"]:not(.image-loaded):not(.image-skeleton)');
    
    if (problematicImages.length === 0) {
        // 문제없으면 조기 종료
        clearInterval(emergencyInterval);
        return;
    }
    
    problematicImages.forEach(function(img) {
        // CSS 클래스로만 해결 시도
        if (!img.classList.contains('image-size-fix')) {
            img.classList.add('image-size-fix');
        }
    });
    
}, 3000); // 3초 간격, 최대 10회 (30초 후 자동 종료)