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
        this.translateY = 0;
        this.lastTranslateY = 0;
        
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
        
        // 터치/마우스 이벤트 (확대 상태 드래그 및 휠 줌)
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        const image = document.getElementById('lightbox-image');
        
        // 마우스 이벤트 (확대 상태에서만 드래그)
        image.addEventListener('mousedown', (e) => {
            this.handleStart(e);
        });
        
        // 전역 이벤트로 마우스 업/무브 처리 (마우스가 이미지 밖으로 나가도 동작)
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleMove(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.handleEnd();
        });
        
        // 터치 이벤트 (확대 상태에서만 드래그)
        image.addEventListener('touchstart', (e) => this.handleStart(e.touches[0]));
        image.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDragging) {
                this.handleMove(e.touches[0]);
            }
        });
        image.addEventListener('touchend', () => this.handleEnd());
        
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
        // 확대 상태이거나 이미지가 화면을 벗어났을 때 드래그 허용
        if (!this.canDrag()) return;
        
        e.preventDefault(); // 기본 동작 방지
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        // 현재 드래그 시작점을 마지막 위치로 저장
        this.lastTranslateY = this.translateY;
    }
    
    handleMove(e) {
        // 드래그 가능한 상태이고 드래그 중일 때만 이동
        if (!this.isDragging || !this.canDrag()) return;
        
        e.preventDefault(); // 기본 동작 방지
        const deltaY = e.clientY - this.startY;
        
        // 상하(Y축)로만 이동, 좌우(X축) 이동 차단
        this.translateY = this.lastTranslateY + deltaY;
        this.applyTransform();
    }
    
    handleEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // 드래그 종료 시 현재 위치를 저장
        this.lastTranslateY = this.translateY;
    }
    
    canDrag() {
        // 확대 상태이거나 이미지가 화면을 벗어났을 때 드래그 가능
        return this.isZoomed || this.isImageOverflowing();
    }
    
    isImageOverflowing() {
        const image = document.getElementById('lightbox-image');
        const container = document.querySelector('.nfp-lightbox-container');
        
        if (!image || !container) return false;
        
        const imageRect = image.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // 이미지 높이가 컨테이너 높이보다 클 때 오버플로우로 판단
        return imageRect.height > containerRect.height;
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
        this.scale = Math.max(this.scale / 1.5, 0.25);  // 25%까지 축소 가능
        this.applyZoom();
    }
    
    toggleZoom(e) {
        // 더블클릭 기능 제거됨 - 사용하지 않음
        if (this.isZoomed) {
            this.resetZoom();
        } else {
            this.scale = 2;
            this.applyZoom();
        }
    }
    
    applyZoom() {
        const image = document.getElementById('lightbox-image');
        this.applyTransform();
        
        this.isZoomed = this.scale > 1;
        image.classList.toggle('zoomed', this.isZoomed);
        
        // 줌 상태가 아니면 위치 초기화
        if (!this.isZoomed) {
            this.resetPosition();
        }
    }
    
    applyTransform() {
        const image = document.getElementById('lightbox-image');
        image.style.transform = `scale(${this.scale}) translateY(${this.translateY}px)`;
    }
    
    resetPosition() {
        this.translateY = 0;
        this.lastTranslateY = 0;
    }
    
    resetZoom() {
        this.scale = 1;
        this.isZoomed = false;
        this.resetPosition();
        const image = document.getElementById('lightbox-image');
        image.style.transform = 'scale(1) translateY(0px)';
        image.classList.remove('zoomed');
    }
}

// DOM 로드 완료 후 라이트박스 초기화
document.addEventListener('DOMContentLoaded', () => {
    new NFPLightbox();
});