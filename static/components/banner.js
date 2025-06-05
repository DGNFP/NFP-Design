document.addEventListener('DOMContentLoaded', function() {
    // NFP 배너 슬라이드 관련 변수 - 올바른 순서로 선언
    const bannerContainer = document.querySelector('.banner-container');
    const bannerSlider = document.querySelector('.banner-slider');
    const slides = document.querySelectorAll('.banner');
    const navDots = document.querySelectorAll('.banner-dots .banner-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    

    
    // 각 도트 요소 확인
    navDots.forEach((dot, index) => {
    });
    
    if (!bannerContainer) {
        return;
    }
    
    if (!bannerSlider) {
        return;
    }
    
    if (slides.length === 0) {
        return;
    }
    
    if (navDots.length === 0) {
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;
    
    // NFP 배너 슬라이드 함수
    function goToSlide(index, forceUpdate = false) {
        
        // 유효한 인덱스 범위 확인 및 정규화
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        
        // 같은 슬라이드면 무시 (단, 강제 업데이트가 아닐 때만)
        if (index === currentSlide && !forceUpdate) {
            return;
        }
        
        // NFP 슬라이더 이동 (올바른 계산: 5개 슬라이드용)
        const movePercent = index * (100 / slides.length); // index * 20%
        bannerSlider.style.transform = `translateX(-${movePercent}%)`;
        
        // 현재 슬라이드 업데이트
        currentSlide = index;
        
        // NFP 네비게이션 도트만 업데이트
        updateDots();
    }
    
    // 도트 업데이트 전용 함수
    function updateDots() {
        
        // 강제로 모든 도트 클래스 제거
        navDots.forEach((dot, i) => {
            dot.className = 'banner-dot';
        });
        
        // 현재 슬라이드 도트만 활성화
        if (navDots[currentSlide]) {
            navDots[currentSlide].className = 'banner-dot active';
        }
        
    }
    
    // NFP 이전 슬라이드 이동
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // NFP 다음 슬라이드 이동
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // NFP 자동 슬라이드 설정
    function startSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // 10초마다 슬라이드 변경 (팝업과 동일)
    }
    
    // NFP 자동 슬라이드 정지
    function stopSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // NFP 이벤트 리스너 설정
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            startSlideInterval(); // 클릭 후 타이머 재설정
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            startSlideInterval(); // 클릭 후 타이머 재설정
        });
    }
    
    // NFP 도트 클릭 이벤트
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const slideIndex = dot.dataset.index ? parseInt(dot.dataset.index) : index;
            goToSlide(slideIndex);
            startSlideInterval(); // 클릭 후 타이머 재설정
        });
    });
    
  
    
    // NFP 초기 설정 및 자동 슬라이드 시작
    // 첫 번째 슬라이드 강제 초기화
    currentSlide = 0;
    const movePercent = 0 * (100 / slides.length);
    bannerSlider.style.transform = `translateX(-${movePercent}%)`;
    updateDots(); // 첫 번째 도트 활성화
    
    
    // 즉시 자동 슬라이드 시작 (팝업과 동일한 타이밍)
    startSlideInterval();
    
});