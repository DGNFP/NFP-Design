// ========================================
// 라이트박스 인라인 스타일 방지 + 기본 기능 유지
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // 🎯 1단계: 라이트박스가 실행되기 전에 이미지 스타일 고정
    const images = document.querySelectorAll('.post-body img[src^="/img/uploads/"]');
    
    images.forEach(function(img, index) {
        // 🎯 로딩 최적화
        img.loading = index === 0 ? 'eager' : 'lazy';
        img.decoding = 'async';
        
        // 🎯 즉시 올바른 크기 적용
        applyCorrectSize(img);
        
        // 🎯 라이트박스가 인라인 스타일을 추가하는 것을 지속적으로 방지
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // 인라인 스타일이 추가되면 즉시 올바른 크기로 되돌리기
                    applyCorrectSize(img);
                }
            });
        });
        
        // 스타일 속성 변화 감지
        observer.observe(img, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    });
    
    // 🎯 올바른 크기 적용 함수
    function applyCorrectSize(img) {
        const windowWidth = window.innerWidth;
        let targetWidth;
        
        if (windowWidth <= 576 || windowWidth <= 991) {
            targetWidth = '75%';
        } else {
            targetWidth = '70%';
        }
        
        // 인라인 스타일 완전 제거 후 CSS가 적용되도록
        img.removeAttribute('style');
        
        // 필요시 강제 적용 (다른 스크립트가 덮어쓸 경우 대비)
        img.style.setProperty('max-width', targetWidth, 'important');
        img.style.setProperty('width', 'auto', 'important');
        img.style.setProperty('height', 'auto', 'important');
        img.style.setProperty('display', 'block', 'important');
        img.style.setProperty('margin-bottom', '20px', 'important');
        img.style.setProperty('border-radius', '4px', 'important');
    }
    
    // 🎯 윈도우 리사이즈 시 크기 재조정
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const images = document.querySelectorAll('.post-body img[src^="/img/uploads/"]');
            images.forEach(applyCorrectSize);
        }, 250);
    });
});

// ========================================
// 라이트박스 실행 후 추가 보정 (안전장치)
// ========================================

// 🎯 라이트박스가 초기화된 후 실행되는 안전장치
setTimeout(function() {
    const images = document.querySelectorAll('.post-body img[src^="/img/uploads/"][data-lightbox]');
    
    images.forEach(function(img) {
        // 라이트박스 속성이 추가된 후에도 올바른 크기 유지
        const windowWidth = window.innerWidth;
        let targetWidth = (windowWidth <= 576 || windowWidth <= 991) ? '75%' : '70%';
        
        img.style.setProperty('max-width', targetWidth, 'important');
        img.style.setProperty('width', 'auto', 'important');
    });
}, 100); // 라이트박스 초기화 후 실행

// ========================================
// 주기적 검사 (최후 보루)
// ========================================

// 🎯 3초마다 이미지 크기 검사 및 복구
setInterval(function() {
    const images = document.querySelectorAll('.post-body img[src^="/img/uploads/"]');
    
    images.forEach(function(img) {
        const computedStyle = window.getComputedStyle(img);
        const currentMaxWidth = computedStyle.maxWidth;
        
        // 100%로 변경되었거나 예상 크기가 아니면 복구
        if (currentMaxWidth === '100%' || currentMaxWidth === 'none') {
            const windowWidth = window.innerWidth;
            let targetWidth = (windowWidth <= 576 || windowWidth <= 991) ? '75%' : '70%';
            
            img.style.setProperty('max-width', targetWidth, 'important');
            img.style.setProperty('width', 'auto', 'important');
        }
    });
}, 3000);