// 배너 슬라이더 기능
document.addEventListener('DOMContentLoaded', function() {
    const banners = document.querySelectorAll('.banner');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let interval;

    // 배너 표시 함수
    function showBanner(index) {
        // 모든 배너 숨기기
        banners.forEach(banner => {
            banner.classList.remove('active');
        });
        
        // 모든 도트 비활성화
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // 현재 인덱스의 배너와 도트 활성화
        banners[index].classList.add('active');
        dots[index].classList.add('active');
        
        // 현재 인덱스 업데이트
        currentIndex = index;
    }
    
    // 다음 배너 표시 함수
    function nextBanner() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= banners.length) {
            nextIndex = 0;
        }
        showBanner(nextIndex);
    }
    
    // 이전 배너 표시 함수
    function prevBanner() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = banners.length - 1;
        }
        showBanner(prevIndex);
    }
    
    // 자동 슬라이드 시작
    function startAutoSlide() {
        // 기존 인터벌 제거하여 중복 방지
        stopAutoSlide();
        interval = setInterval(nextBanner, 10000); // 10초마다 다음 배너로
    }
    
    // 자동 슬라이드 중지
    function stopAutoSlide() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }
    
    // 이벤트 리스너 설정
    prevBtn.addEventListener('click', function() {
        prevBanner();
        // 클릭 후 타이머 재설정
        stopAutoSlide();
        startAutoSlide();
    });
    
    nextBtn.addEventListener('click', function() {
        nextBanner();
        // 클릭 후 타이머 재설정
        stopAutoSlide();
        startAutoSlide();
    });
    
    // 도트 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showBanner(index);
            // 클릭 후 타이머 재설정
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // 초기 자동 슬라이드 시작
    startAutoSlide();
    
    // 마우스 오버시 자동 슬라이드 일시 중지
    const bannerContainer = document.querySelector('.banner-container');
    bannerContainer.addEventListener('mouseenter', stopAutoSlide);
    bannerContainer.addEventListener('mouseleave', startAutoSlide);
});