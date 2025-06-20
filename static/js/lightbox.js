/**
 * NFP 디자인 이미지 라이트박스
 * 게시글 내 이미지 확대 및 네비게이션 기능
 */

class NFPLightbox {
    constructor() {
        this.lightbox = null;
        this.images = [];
        this.currentIndex = 0;
        this.isZoomed = false;
        this.scale = 1;
        this.startX = 0;
        this.startY = 0;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        this.createLightbox();
        this.bindEvents();
        this.setupImages();
    }
    
    createLightbox() {
        const lightboxHTML = `
            <div class="nfp-lightbox" id="nfp-lightbox">
                <div class="nfp-lightbox-container">
                    <div class="nfp-lightbox-loading"></div>
                    <img class="nfp-lightbox-image" id="lightbox-image" alt="">
                    <div class="nfp-lightbox-counter" id="lightbox-counter">1 / 1</div>
                    <div class="nfp-lightbox-zoom">
                        <button id="lightbox-zoom-out">−</button>
                        <button id="lightbox-zoom-in">+</button>
                    </div>
                </div>
                <button class="nfp-lightbox-close" id="lightbox-close">×</button>
                <button class="nfp-lightbox-nav nfp-lightbox-prev" id="lightbox-prev">‹</button>
                <button class="nfp-lightbox-nav nfp-lightbox-next" id="lightbox-next">›</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('nfp-lightbox');
    }
    
    setupImages() {
        // 게시글 본문 내 모든 이미지 수집
        const postBody = document.querySelector('.post-body');
        if (!postBody) return;
        
        const images = postBody.querySelectorAll('img[src*="/img/uploads/"]');
        this.images = Array.from(images).map((img, index) => {
            // 라이트박스 속성 추가
            img.setAttribute('data-lightbox', 'nfp-gallery');
            img.setAttribute('data-index', index);
            
            // 클릭 이벤트 추가
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(index);
            });
            
            return {
                src: img.src,
                alt: img.alt || '',
                element: img
            };
        });
    }
    
    bindEvents() {
        // 닫기 버튼
        document.getElementById('lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });
        
        // 네비게이션 버튼
        document.getElementById('lightbox-prev').addEventListener('click', () => {
            this.prevImage();
        });
        
        document.getElementById('lightbox-next').addEventListener('click', () => {
            this.nextImage();
        });
        
        // 줌 버튼
        document.getElementById('lightbox-zoom-in').addEventListener('click', () => {
            this.zoomIn();
        });
        
        document.getElementById('lightbox-zoom-out').addEventListener('click', () => {
            this.zoomOut();
        });
        
        // 배경 클릭으로 닫기
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
        
        // 터치/마우스 이벤트 (드래그 및 줌)
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        const image = document.getElementById('lightbox-image');
        
        // 마우스 이벤트
        image.addEventListener('mousedown', (e) => this.handleStart(e));
        image.addEventListener('mousemove', (e) => this.handleMove(e));
        image.addEventListener('mouseup', () => this.handleEnd());
        image.addEventListener('mouseleave', () => this.handleEnd());
        
        // 터치 이벤트
        image.addEventListener('touchstart', (e) => this.handleStart(e.touches[0]));
        image.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleMove(e.touches[0]);
        });
        image.addEventListener('touchend', () => this.handleEnd());
        
        // 더블클릭/더블탭으로 줌
        let lastTap = 0;
        image.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                this.toggleZoom(e);
            }
            lastTap = currentTime;
        });
        
        // 마우스 휠 줌
        image.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });
    }
    
    handleStart(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        // 줌 상태에서는 이미지 드래그, 일반 상태에서는 스와이프
        if (this.isZoomed) {
            // 줌된 이미지 드래그 (구현 생략 - 복잡한 로직)
        } else {
            // 좌우 스와이프 감지
            if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
                if (deltaX > 0) {
                    this.prevImage();
                } else {
                    this.nextImage();
                }
                this.isDragging = false;
            }
        }
    }
    
    handleEnd() {
        this.isDragging = false;
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.showImage();
        this.updateNavigation();
        this.updateCounter();
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        this.resetZoom();
    }
    
showImage() {
    const image = document.getElementById('lightbox-image');
    const loading = document.querySelector('.nfp-lightbox-loading');
    
    // 이미지에 로딩 클래스 추가 (투명도 낮춤)
    image.classList.add('loading');
    loading.style.display = 'block';
    
    // 새 이미지 프리로드
    const newImage = new Image();
    newImage.onload = () => {
        // 로딩 완료 후 이미지 교체
        image.src = newImage.src;
        image.alt = this.images[this.currentIndex].alt;
        
        // 로딩 효과 제거
        loading.style.display = 'none';
        image.classList.remove('loading');
    };
    
    // 새 이미지 로딩 시작
    newImage.src = this.images[this.currentIndex].src;
}
    
    prevImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = this.currentIndex > 0 ? 
            this.currentIndex - 1 : this.images.length - 1;
        
        this.showImage();
        this.updateNavigation();
        this.updateCounter();
        this.resetZoom();
    }
    
    nextImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = this.currentIndex < this.images.length - 1 ? 
            this.currentIndex + 1 : 0;
        
        this.showImage();
        this.updateNavigation();
        this.updateCounter();
        this.resetZoom();
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        if (this.images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }
    
    updateCounter() {
        const counter = document.getElementById('lightbox-counter');
        counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        
        if (this.images.length <= 1) {
            counter.style.display = 'none';
        } else {
            counter.style.display = 'block';
        }
    }
    
    zoomIn() {
        this.scale = Math.min(this.scale * 1.5, 3);
        this.applyZoom();
    }
    
    zoomOut() {
        this.scale = Math.max(this.scale / 1.5, 1);
        this.applyZoom();
    }
    
    toggleZoom(e) {
        if (this.isZoomed) {
            this.resetZoom();
        } else {
            this.scale = 2;
            this.applyZoom();
        }
    }
    
    applyZoom() {
        const image = document.getElementById('lightbox-image');
        image.style.transform = `scale(${this.scale})`;
        
        this.isZoomed = this.scale > 1;
        image.classList.toggle('zoomed', this.isZoomed);
    }
    
    resetZoom() {
        this.scale = 1;
        this.isZoomed = false;
        const image = document.getElementById('lightbox-image');
        image.style.transform = 'scale(1)';
        image.classList.remove('zoomed');
    }
}

// DOM 로드 완료 후 라이트박스 초기화
document.addEventListener('DOMContentLoaded', () => {
    new NFPLightbox();
});