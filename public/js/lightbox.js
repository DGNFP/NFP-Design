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
        this.dragDirection = null; // 'horizontal', 'vertical', null
        this.dragThreshold = 10; // 방향 감지를 위한 최소 이동 거리
        this.dragSensitivityMobile = 0.4; // 모바일 드래그 감도
        this.dragSensitivityDesktop = 0.8; // PC 드래그 감도
        this.currentDragType = null; // 'touch' 또는 'mouse'
        this.translateX = 0;
        this.translateY = 0;
        this.lastTranslateX = 0;
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
                </div>
                <div class="nfp-lightbox-zoom">
                    <button id="lightbox-zoom-out">−</button>
                    <button id="lightbox-zoom-in">+</button>
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
            this.handleStart(e, 'mouse');
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
        
        // 터치 이벤트 - 이미지에서 시작
        image.addEventListener('touchstart', (e) => {
            this.handleStart(e.touches[0], 'touch');
        }, { passive: false });
        
        // 전역 터치무브 - 라이트박스가 활성화되어 있을 때 모든 스크롤 차단
        document.addEventListener('touchmove', (e) => {
            if (this.lightbox && this.lightbox.classList.contains('active')) {
                e.preventDefault(); // 라이트박스 활성화 시 모든 스크롤 차단
                if (this.isDragging) {
                    this.handleMove(e.touches[0]);
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            this.handleEnd();
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
    
    handleStart(e, eventType) {
        // 확대 상태일 때만 드래그 허용
        if (!this.canDrag()) return;
        
        // 터치 이벤트의 경우 기본 동작 방지
        if (eventType === 'mouse') {
            e.preventDefault();
        }
        
        this.isDragging = true;
        this.currentDragType = eventType; // 현재 드래그 타입 저장
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        // 현재 드래그 시작점을 마지막 위치로 저장
        this.lastTranslateX = this.translateX;
        this.lastTranslateY = this.translateY;
    }
    
    handleMove(e) {
        // 드래그 가능한 상태이고 드래그 중일 때만 이동
        if (!this.isDragging || !this.canDrag()) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        // 방향이 아직 결정되지 않았고, 충분히 움직였을 때 방향 결정
        if (this.dragDirection === null && (Math.abs(deltaX) > this.dragThreshold || Math.abs(deltaY) > this.dragThreshold)) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.dragDirection = 'horizontal';
            } else {
                this.dragDirection = 'vertical';
            }
        }
        
        // 디바이스별 감도 적용
        const sensitivity = this.currentDragType === 'touch' ? 
            this.dragSensitivityMobile : this.dragSensitivityDesktop;
        
        // 결정된 방향에 따라 해당 축으로만 이동 (디바이스별 감도 적용)
        if (this.dragDirection === 'horizontal') {
            this.translateX = this.lastTranslateX + (deltaX * sensitivity);
            // Y축은 고정
            this.translateY = this.lastTranslateY;
        } else if (this.dragDirection === 'vertical') {
            this.translateY = this.lastTranslateY + (deltaY * sensitivity);
            // X축은 고정
            this.translateX = this.lastTranslateX;
        }
        
        this.applyTransform();
    }
    
    handleEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.dragDirection = null; // 드래그 방향 초기화
        this.currentDragType = null; // 드래그 타입 초기화
        
        // 드래그 종료 시 현재 위치를 저장
        this.lastTranslateX = this.translateX;
        this.lastTranslateY = this.translateY;
    }
    
    canDrag() {
        // 이미지가 화면을 벗어났을 때만 드래그 가능 (확대 상태 조건 제거)
        return this.isImageOverflowing();
    }
    
    isImageOverflowing() {
        const image = document.getElementById('lightbox-image');
        const container = document.querySelector('.nfp-lightbox-container');
        
        if (!image || !container) return false;
        
        // 현재 스케일을 적용한 실제 이미지 크기 계산
        const naturalWidth = image.naturalWidth * this.scale;
        const naturalHeight = image.naturalHeight * this.scale;
        
        // 컨테이너 크기
        const containerRect = container.getBoundingClientRect();
        
        // 실제 이미지 크기가 컨테이너보다 크면 오버플로우
        const isWidthOverflow = naturalWidth > containerRect.width;
        const isHeightOverflow = naturalHeight > containerRect.height;
        
        return {
            any: isWidthOverflow || isHeightOverflow,
            horizontal: isWidthOverflow,
            vertical: isHeightOverflow
        };
    }
    
    canDrag() {
        // 확대 상태(scale > 1)일 때만 드래그 가능
        return this.scale > 1;
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
        image.style.transform = `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
    }
    
    resetPosition() {
        this.translateX = 0;
        this.translateY = 0;
        this.lastTranslateX = 0;
        this.lastTranslateY = 0;
    }
    
    resetZoom() {
        this.scale = 1;
        this.isZoomed = false;
        this.resetPosition();
        const image = document.getElementById('lightbox-image');
        image.style.transform = 'scale(1) translate(0px, 0px)';
        image.classList.remove('zoomed');
    }
}

// DOM 로드 완료 후 라이트박스 초기화
document.addEventListener('DOMContentLoaded', () => {
    new NFPLightbox();
});