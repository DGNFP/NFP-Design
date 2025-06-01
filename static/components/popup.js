document.addEventListener('DOMContentLoaded', function() {
    // 오늘 하루 보지않음 체크
    const hideToday = localStorage.getItem('popup-hide-today');
    const today = new Date().toDateString();
    
    if (hideToday === today) {
        return; // 오늘 하루 보지않음이 설정되어 있으면 팝업 표시 안함
    }
    
    const popup = document.getElementById('popup-banner');
    if (!popup) return; // 팝업 요소가 없으면 종료
    
    const slides = document.querySelectorAll('.popup-banner-slide');
    const dots = document.querySelectorAll('.popup-dot');
    const hideButton = document.querySelector('.popup-hide-today');
    const closeButton = document.querySelector('.popup-close');
    
    let currentSlide = 0;
    let slideInterval;
    
    // 팝업 표시
    popup.classList.add('show');
    
    // 슬라이드 변경 함수
    function goToSlide(slideIndex) {
        // 현재 슬라이드 비활성화
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('prev');
        dots[currentSlide].classList.remove('active');
        
        // 새 슬라이드 활성화
        currentSlide = slideIndex;
        slides[currentSlide].classList.remove('prev');
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // 이전 슬라이드 정리 (애니메이션 후)
        setTimeout(() => {
            slides.forEach((slide, index) => {
                if (index !== currentSlide) {
                    slide.classList.remove('prev');
                }
            });
        }, 500);
    }
    
    // 다음 슬라이드로 이동
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    // 자동 슬라이드 시작 (5초마다)
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // 자동 슬라이드 정지
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }
    
    // 도트 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopSlideInterval();
            startSlideInterval(); // 다시 시작
        });
    });
    
    // 마우스 호버시 자동 슬라이드 정지
    popup.addEventListener('mouseenter', stopSlideInterval);
    popup.addEventListener('mouseleave', startSlideInterval);
    
    // 오늘 하루 보지않음 버튼
    if (hideButton) {
        hideButton.addEventListener('click', () => {
            localStorage.setItem('popup-hide-today', today);
            popup.classList.add('hide');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        });
    }
    
    // 닫기 버튼
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            popup.classList.add('hide');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        });
    }
    
    // 자동 슬라이드 시작
    startSlideInterval();
});