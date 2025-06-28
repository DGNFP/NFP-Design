// 🎯 시각적 늘어짐 없는 CLS 방지 - 컨테이너 방식으로 수정
document.addEventListener('DOMContentLoaded', function() {
    const postBody = document.querySelector('.post-body');
    if (!postBody) return;

    const images = postBody.querySelectorAll('img[src^="/img/uploads/"]');

    images.forEach(function(img, index) {
        // 이미 처리된 이미지는 건너뛰기
        if (img.dataset.processed) return;
        img.dataset.processed = 'true';

        try {
            // 🎯 1단계: WebP 최적화
            const originalSrc = img.src;
            const webpSrc = originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
            
            if (supportsWebP() && originalSrc !== webpSrc) {
                img.src = webpSrc;
            }

            // 🎯 2단계: 래퍼 컨테이너 생성 + 충분한 초기 높이로 공간 확보
            const wrapper = document.createElement('div');
            wrapper.className = 'img-aspect-wrapper';
            
            // 🚀 보수적인 초기 높이 - 대부분 이미지보다 약간 크게 설정
            const conservativeHeight = Math.max(300, Math.round(window.innerWidth * 0.5));
            
            wrapper.style.cssText = `
                width: 70%;
                height: ${conservativeHeight}px;
                margin: 0 0 20px 0;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
                background: linear-gradient(110deg, rgba(40, 40, 40, 0.9) 8%, rgba(60, 60, 60, 0.95) 18%, rgba(40, 40, 40, 0.9) 33%);
                background-size: 200% 100%;
                animation: shimmer 1.5s ease-in-out infinite;
                transition: height 0.2s ease;
            `;

            // 🎯 3단계: 이미지를 래퍼로 감싸기
            const parent = img.parentNode;
            parent.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            // 🎯 4단계: 이미지 스타일 설정 (높이 건드리지 않음)
            img.style.cssText = `
                width: 100% !important;
                height: auto !important;
                display: block !important;
                margin: 0 !important;
                border-radius: 0 !important;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            // 🎯 5단계: 실제 이미지 크기로 래퍼 높이 정확히 조정
            const tempImg = new Image();
            tempImg.onload = function() {
                const wrapperWidth = wrapper.offsetWidth;
                const aspectRatio = tempImg.naturalHeight / tempImg.naturalWidth;
                const accurateHeight = wrapperWidth * aspectRatio;
                
                // 🚀 보수적 높이에서 정확한 높이로 조정 (항상 실행)
                wrapper.style.height = accurateHeight + 'px';
                wrapper.style.animation = 'none';
                wrapper.style.background = 'transparent';
            };

            // 🎯 6단계: 이미지 로드 완료 처리
            function showImage() {
                img.style.opacity = '1';
                wrapper.style.animation = 'none';
                wrapper.style.background = 'transparent';
                
                // 로드 완료 후 래퍼를 auto 높이로
                setTimeout(() => {
                    wrapper.style.height = 'auto';
                }, 150);
            }

            // 🎯 7단계: 로딩 최적화
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.decoding = 'async';

            // 이벤트 리스너
            if (img.complete && img.naturalHeight !== 0) {
                setTimeout(showImage, 0);
            } else {
                img.addEventListener('load', showImage);
                img.addEventListener('error', function() {
                    if (img.src === webpSrc && img.src !== originalSrc) {
                        img.src = originalSrc;
                    } else {
                        showImage(); // 에러여도 표시
                    }
                });
            }

            // 임시 이미지로 크기 확인
            tempImg.src = img.src;

        } catch (error) {
            console.warn('이미지 처리 중 오류:', error);
        }
    });

    // WebP 지원 확인
    function supportsWebP() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch (e) {
            return false;
        }
    }
});