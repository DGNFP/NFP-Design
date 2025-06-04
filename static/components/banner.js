document.addEventListener('DOMContentLoaded', function() {
    // NFP 배너 슬라이드 관련 변수 - 올바른 순서로 선언
    const bannerContainer = document.querySelector('.banner-container');
    const bannerSlider = document.querySelector('.banner-slider');
    const slides = document.querySelectorAll('.banner');
    const navDots = document.querySelectorAll('.banner-dots .banner-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    console.log('NFP 배너 개수:', slides.length);
    console.log('NFP 도트 개수:', navDots.length);
    console.log('NFP 이전 버튼:', prevBtn ? '찾음' : '못찾음');
    console.log('NFP 다음 버튼:', nextBtn ? '찾음' : '못찾음');
    console.log('NFP 배너 컨테이너:', bannerContainer ? '찾음' : '못찾음');
    console.log('NFP 배너 슬라이더:', bannerSlider ? '찾음' : '못찾음');
    
    // 각 도트 요소 확인
    navDots.forEach((dot, index) => {
        console.log(`NFP 도트 ${index}:`, dot, dot.className);
    });
    
    if (!bannerContainer) {
        console.log('배너 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    if (!bannerSlider) {
        console.log('배너 슬라이더를 찾을 수 없습니다.');
        return;
    }
    
    if (slides.length === 0) {
        console.log('슬라이드가 없습니다.');
        return;
    }
    
    if (navDots.length === 0) {
        console.log('도트가 없습니다!');
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;
    
    // NFP 배너 슬라이드 함수
    function goToSlide(index, forceUpdate = false) {
        console.log(`NFP 슬라이드 이동 요청: ${currentSlide} → ${index}`);
        
        // 유효한 인덱스 범위 확인 및 정규화
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        console.log(`NFP 정규화된 인덱스: ${index}`);
        
        // 같은 슬라이드면 무시 (단, 강제 업데이트가 아닐 때만)
        if (index === currentSlide && !forceUpdate) {
            console.log('NFP 같은 슬라이드이므로 무시');
            return;
        }
        
        // NFP 슬라이더 이동 (올바른 계산: 5개 슬라이드용)
        const movePercent = index * (100 / slides.length); // index * 20%
        bannerSlider.style.transform = `translateX(-${movePercent}%)`;
        console.log(`NFP 슬라이더 이동: translateX(-${movePercent}%) (슬라이드 ${index})`);
        
        // 현재 슬라이드 업데이트
        currentSlide = index;
        console.log('NFP 현재 슬라이드 업데이트:', currentSlide);
        
        // NFP 네비게이션 도트만 업데이트
        updateDots();
    }
    
    // 도트 업데이트 전용 함수
    function updateDots() {
        console.log(`NFP 도트 업데이트 시작 - 현재 슬라이드: ${currentSlide}`);
        
        // 강제로 모든 도트 클래스 제거
        navDots.forEach((dot, i) => {
            dot.className = 'banner-dot';
            console.log(`NFP 도트 ${i}번 클래스 초기화`);
        });
        
        // 현재 슬라이드 도트만 활성화
        if (navDots[currentSlide]) {
            navDots[currentSlide].className = 'banner-dot active';
            console.log(`NFP 도트 ${currentSlide}번 강제 활성화`);
        }
        
        console.log(`NFP 도트 업데이트 완료`);
    }
    
    // NFP 이전 슬라이드 이동
    function prevSlide() {
        console.log('NFP 이전 버튼 클릭');
        goToSlide(currentSlide - 1);
    }
    
    // NFP 다음 슬라이드 이동
    function nextSlide() {
        console.log('NFP 다음 버튼 클릭');
        goToSlide(currentSlide + 1);
    }
    
    // NFP 자동 슬라이드 설정
    function startSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // 10초마다 슬라이드 변경 (팝업과 동일)
        console.log('NFP 자동 슬라이드 시작');
    }
    
    // NFP 자동 슬라이드 정지
    function stopSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
            console.log('NFP 자동 슬라이드 정지');
        }
    }
    
    // NFP 이벤트 리스너 설정
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            startSlideInterval(); // 클릭 후 타이머 재설정
        });
        console.log('NFP 이전 버튼 이벤트 등록됨');
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            startSlideInterval(); // 클릭 후 타이머 재설정
        });
        console.log('NFP 다음 버튼 이벤트 등록됨');
    }
    
    // NFP 도트 클릭 이벤트
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const slideIndex = dot.dataset.index ? parseInt(dot.dataset.index) : index;
            console.log('NFP 도트 클릭:', slideIndex);
            goToSlide(slideIndex);
            startSlideInterval(); // 클릭 후 타이머 재설정
        });
        console.log(`NFP 도트 ${index} 이벤트 리스너 등록됨`);
    });
    
    // NFP 마우스 호버 이벤트
    if (bannerContainer) {
        bannerContainer.addEventListener('mouseenter', function() {
            console.log('NFP 마우스 진입 - 자동 슬라이드 정지');
            stopSlideInterval();
        });
        
        bannerContainer.addEventListener('mouseleave', function() {
            console.log('NFP 마우스 나감 - 자동 슬라이드 재시작');
            setTimeout(() => {
                startSlideInterval();
            }, 1000);
        });
        console.log('NFP 마우스 호버 이벤트 등록됨');
    }
    
    // NFP 초기 설정 및 자동 슬라이드 시작
    // 첫 번째 슬라이드 강제 초기화
    currentSlide = 0;
    const movePercent = 0 * (100 / slides.length);
    bannerSlider.style.transform = `translateX(-${movePercent}%)`;
    updateDots(); // 첫 번째 도트 활성화
    
    console.log('NFP 초기화 완료 - 첫 번째 슬라이드 및 도트 활성화');
    
    // 즉시 자동 슬라이드 시작 (팝업과 동일한 타이밍)
    startSlideInterval();
    
    console.log('NFP 배너 슬라이더 초기화 완료');
});