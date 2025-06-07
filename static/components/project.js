// 간단한 프로젝트 슬라이더 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // jQuery와 Slick CDN 로드
    loadSlickCarousel().then(() => {
        initializeSliders();
    });
});

// Slick Carousel CDN 로드
function loadSlickCarousel() {
    return new Promise((resolve) => {
        // jQuery 로드
        if (typeof jQuery === 'undefined') {
            const jqueryScript = document.createElement('script');
            jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            jqueryScript.onload = () => loadSlickAfterJQuery(resolve);
            document.head.appendChild(jqueryScript);
        } else {
            loadSlickAfterJQuery(resolve);
        }
    });
}

function loadSlickAfterJQuery(resolve) {
    // Slick CSS 로드
    if (!document.querySelector('link[href*="slick.css"]')) {
        const slickCSS = document.createElement('link');
        slickCSS.rel = 'stylesheet';
        slickCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css';
        document.head.appendChild(slickCSS);
        
        const slickThemeCSS = document.createElement('link');
        slickThemeCSS.rel = 'stylesheet';
        slickThemeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';
        document.head.appendChild(slickThemeCSS);
    }
    
    // Slick JS 로드
    if (typeof jQuery.fn.slick === 'undefined') {
        const slickScript = document.createElement('script');
        slickScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js';
        slickScript.onload = resolve;
        document.head.appendChild(slickScript);
    } else {
        resolve();
    }
}

// 센터 강조 수동 적용 함수
function applyCenterHighlight() {
    // 모든 기존 강조 제거
    $('.highlight-card a').removeClass('force-center-highlight');
    $('.highlight-project-name').css({
        'color': '#ffffff',
        'font-weight': '600'
    });
    
    // 현재 센터 아이템 찾기
    let $centerSlide = $('.center .slick-slide.slick-center');
    
    if ($centerSlide.length === 0) {
        // 방법 2: slick-current 찾기
        $centerSlide = $('.center .slick-slide.slick-current');
    }
    
    if ($centerSlide.length === 0) {
        // 방법 3: 가운데 위치한 슬라이드 계산으로 찾기
        const $allSlides = $('.center .slick-slide:not(.slick-cloned)');
        const slideCount = $allSlides.length;
        const centerIndex = Math.floor(slideCount / 2);
        $centerSlide = $allSlides.eq(centerIndex);
    }
    
    if ($centerSlide.length > 0) {
        // 여러 방법으로 카드 찾기 시도
        let $centerCard = $centerSlide.find('.highlight-card a');
        
        if ($centerCard.length === 0) {
            // 직접 a 태그 찾기
            $centerCard = $centerSlide.find('a');
        }
        
        if ($centerCard.length === 0) {
            // 첫 번째 div 안의 a 태그 찾기
            $centerCard = $centerSlide.find('div a');
        }
        
        if ($centerCard.length > 0) {
            $centerCard.addClass('force-center-highlight');
            
            // 텍스트 강조도 직접 적용
            $centerCard.find('.highlight-project-name').css({
                'color': '#01FF75',
                'font-weight': '700'
            });
        }
    }
}

// 슬라이더 초기화
function initializeSliders() {
    // 포트폴리오 하이라이트 - Center Mode
    $('.center').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 300,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1,
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20px',
                    slidesToShow: 1,
                    dots: true
                }
            }
        ]
    });

    // 포트폴리오 하이라이트 이벤트 처리
    $('.center').on('init', function(event, slick) {
        setTimeout(applyCenterHighlight, 100); /* 300ms → 100ms */
    });

    $('.center').on('afterChange', function(event, slick, currentSlide) {
        setTimeout(applyCenterHighlight, 30); /* 100ms → 30ms */
    });

    $('.center').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        // 슬라이드 변경 전 모든 강조 제거
        $('.highlight-card a').removeClass('force-center-highlight');
        $('.highlight-project-name').css({
            'color': '#ffffff',
            'font-weight': '600'
        });
    });

    $('.center').on('setPosition', function(event, slick) {
        setTimeout(applyCenterHighlight, 20); /* 50ms → 20ms */
    });

    // 메인 프로젝트 - Autoplay
    $('.autoplay').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        pauseOnHover: true,
        centerMode: true,
        centerPadding: '100px',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '80px'
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '40px',
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '20px',
                    arrows: false
                }
            }
        ]
    });

    // 커스텀 화살표 버튼 추가
    addCustomArrows();
    
    // 초기 센터 강조 적용
    setTimeout(applyCenterHighlight, 50); /* 500ms → 200ms */
    setTimeout(applyCenterHighlight, 100); /* 1000ms → 400ms */
    
    // 화면 리사이즈 시에도 센터 강조 재적용
    $(window).on('resize', function() {
        setTimeout(applyCenterHighlight, 50); /* 100ms → 50ms */
    });
}

// 커스텀 화살표 버튼 추가 함수
function addCustomArrows() {
   // 포트폴리오 하이라이트 화살표 추가
    $('.portfolio-highlights').css('position', 'relative');
    $('.portfolio-highlights').append('<button class="custom-prev center-prev"><i class="fas fa-chevron-left"></i></button>');
    $('.portfolio-highlights').append('<button class="custom-next center-next"><i class="fas fa-chevron-right"></i></button>');

    // 메인 프로젝트 화살표 추가
    $('.main-projects-section').css('position', 'relative');
    $('.main-projects-section').append('<button class="custom-prev autoplay-prev"><i class="fas fa-chevron-left"></i></button>');
    $('.main-projects-section').append('<button class="custom-next autoplay-next"><i class="fas fa-chevron-right"></i></button>');
    
    // 이벤트 연결
    $('.center-prev').on('click', function() {
        $('.center').slick('slickPrev');
    });
    
    $('.center-next').on('click', function() {
        $('.center').slick('slickNext');
    });
    
    $('.autoplay-prev').on('click', function() {
        $('.autoplay').slick('slickPrev');
    });
    
    $('.autoplay-next').on('click', function() {
        $('.autoplay').slick('slickNext');
    });
}