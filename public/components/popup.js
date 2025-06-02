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
    let isUserInteracting = false; // 사용자 상호작용 플래그
    
    // 팝업 표시
    popup.classList.add('show');
    
    // 슬라이드 변경 함수
    function goToSlide(slideIndex, fromUser = false) {
        // 사용자 클릭으로 인한 슬라이드 변경인지 체크
        if (fromUser) {
            isUserInteracting = true;
            // 기존 타이머 완전히 정리
            stopSlideInterval();
        }
        
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
        
        // 사용자 상호작용 후 새로운 타이머 시작
        if (fromUser) {
            setTimeout(() => {
                isUserInteracting = false;
                startSlideInterval();
            }, 100); // 짧은 딜레이 후 타이머 재시작
        }
    }
    
    // 다음 슬라이드로 이동
    function nextSlide() {
        // 사용자가 상호작용 중이면 자동 슬라이드 건너뛰기
        if (isUserInteracting) return;
        
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next, false);
    }
    
    // 자동 슬라이드 시작 (5초마다)
    function startSlideInterval() {
        // 기존 타이머가 있다면 정리
        stopSlideInterval();
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // 자동 슬라이드 정지
    function stopSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // 팝업 닫기 애니메이션 함수
    function closePopupWithAnimation() {
        // show 클래스 제거하고 hide 클래스 추가
        popup.classList.remove('show');
        popup.classList.add('hide');
        
        // 애니메이션 완료 후 팝업 숨기기
        setTimeout(() => {
            popup.style.display = 'none';
            popup.classList.remove('hide');
        }, 300); // slideOut 애니메이션 시간과 맞춤
    }
    
    // 도트 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // 현재 슬라이드와 같은 도트를 클릭한 경우 무시
            if (index === currentSlide) return;
            
            goToSlide(index, true); // 사용자 클릭임을 명시
        });
    });
    
    // 마우스 호버시 자동 슬라이드 정지
    popup.addEventListener('mouseenter', () => {
        isUserInteracting = true;
        stopSlideInterval();
    });
    
    popup.addEventListener('mouseleave', () => {
        isUserInteracting = false;
        startSlideInterval();
    });
    
    // 오늘 하루 보지않음 버튼
    if (hideButton) {
        hideButton.addEventListener('click', () => {
            localStorage.setItem('popup-hide-today', today);
            stopSlideInterval(); // 타이머 정리
            closePopupWithAnimation();
        });
    }
    
    // 닫기 버튼
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            stopSlideInterval(); // 타이머 정리
            closePopupWithAnimation();
        });
    }
    
    // 자동 슬라이드 시작
    startSlideInterval();
});