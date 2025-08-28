document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filters = document.querySelectorAll('.category-filter a');
    
    // 게시판별 페이지네이션 설정
    function getItemsPerPage() {
        const currentPath = window.location.pathname;
        
        // 크리에이티브 디자인, 컨텐츠 디자인 = 15개
        if (currentPath.includes('/creative/') || 
            currentPath.includes('/content/')) {
            return 15;
        }
        
        // 전체게시판은 9개 유지 (기존 설정)
        if (currentPath.includes('/categories/')) {
            return 10;
        }
        
        // 나머지 게시판들 = 12개
        return 12;
    }
    
    // 페이지네이션 변수
    let currentPage = 1;
    let itemsPerPage = getItemsPerPage();
    let filteredItems = [];
    let currentFilter = 'all';
    let currentSearchTerm = '';
    
    // 현재 페이지가 어떤 게시판인지 확인
    const isMainBoard = window.location.pathname === '/categories/' || window.location.pathname === '/categories';
    const isblog = window.location.pathname.includes('/blog/');
    const isGamesBoard = window.location.pathname.includes('/games/');
    const isCreativeBoard = window.location.pathname.includes('/creative/');
    const isContentBoard = window.location.pathname.includes('/content/');
    const isWebBoard = window.location.pathname.includes('/web/');
    const isVideoBoard = window.location.pathname.includes('/video/');
    const isProgrammingBoard = window.location.pathname.includes('/programming/');
    const isAdBoard = window.location.pathname.includes('/ad/');
    const isProjectBoard = window.location.pathname.includes('/project/');

    
    
    // 게임게시판 전용 필터링 함수 (강화된 CSS 적용)
    function applyGamesBoardFilter(filterValue) {
        const gameItems = document.querySelectorAll('.board-all-item[data-main="games"]');
        let visibleCount = 0;
        
        gameItems.forEach(item => {
            const category = item.getAttribute('data-category') || '';
            const shouldShow = (filterValue === 'all') || (category.trim() === filterValue.trim());
            
            if (shouldShow) {
                // 강력한 표시 CSS
                item.style.cssText = `
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: relative !important;
                    left: auto !important;
                    width: auto !important;
                    height: auto !important;
                    overflow: visible !important;
                `;
                visibleCount++;
            } else {
                // 강력한 숨김 CSS
                item.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    position: absolute !important;
                    left: -9999px !important;
                    top: -9999px !important;
                    width: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    z-index: -1 !important;
                `;
            }
        });
        
        // 결과 메시지 업데이트
        updateGamesBoardMessage(visibleCount, filterValue);
        return visibleCount;
    }
    
    // 게임게시판 결과 메시지 업데이트
    function updateGamesBoardMessage(count, filterValue) {
        const container = document.querySelector('.board-game-grid');
        if (!container) return;
        
        // 기존 메시지 제거
        const existingMsgs = container.querySelectorAll('.no-results-message');
        existingMsgs.forEach(msg => msg.remove());
        
        if (count === 0) {
            const noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.style.cssText = `
                grid-column: 1 / -1 !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                text-align: center !important;
                padding: 40px 20px !important;
                color: #666 !important;
                font-size: 16px !important;
                background: rgba(108, 117, 125, 0.05) !important;
                border-radius: 12px !important;
                border: 2px dashed rgba(108, 117, 125, 0.2) !important;
                margin: 20px 0 !important;
                position: relative !important;
                z-index: 999 !important;
            `;
            
            noResultsMsg.innerHTML = `
                <i class="fas fa-filter" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                "${filterValue}" 카테고리에 게시물이 없습니다.
            `;
            
            container.appendChild(noResultsMsg);
        }
    }
    
    // 게임게시판 전용 필터링된 아이템들 가져오기
    function getGamesBoardFilteredItems() {
        const allItems = Array.from(document.querySelectorAll('.board-all-item[data-main="games"]'));
        
        return allItems.filter(item => {
            // 1. 필터 조건 확인
            let matchesFilter = false;
            if (currentFilter === 'all') {
                matchesFilter = true;
            } else {
                const subCategory = (item.getAttribute('data-category') || '').trim();
                matchesFilter = subCategory === currentFilter.trim();
            }
            
            // 2. 검색 조건 확인
            let matchesSearch = true;
            if (currentSearchTerm) {
                const titleElement = item.querySelector('.board-all-item-title');
                const subtitleElement = item.querySelector('.board-all-item-subtitle');
                const descElement = item.querySelector('.board-all-item-desc');
                
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const subtitle = subtitleElement ? subtitleElement.textContent.toLowerCase() : '';
                const desc = descElement ? descElement.textContent.toLowerCase() : '';
                
                const tagElements = item.querySelectorAll('.board-all-item-tags .tag, .board-all-item-tag, .tags .tag, .tag');
                let tags = '';
                tagElements.forEach(tagEl => {
                    tags += tagEl.textContent.toLowerCase() + ' ';
                });
                
                const dataCategory = (item.getAttribute('data-category') || '').toLowerCase();
                const searchTerm = currentSearchTerm.toLowerCase();
                
                matchesSearch = title.includes(searchTerm) || 
                               subtitle.includes(searchTerm) ||
                               desc.includes(searchTerm) ||
                               tags.includes(searchTerm) ||
                               dataCategory.includes(searchTerm);
            }
            
            return matchesFilter && matchesSearch;
        });
    }
    
    // 기존 다른 게시판용 필터링된 아이템들 가져오기
    function getOtherBoardFilteredItems() {
        let selector;
        
        if (isMainBoard) {
            selector = '.board-all-item';
        } else if (isblog) {
            selector = '.board-all-item[data-main="blog"]';
        } else {
            selector = '.board-item, .board-item-square, .board-item-wide, .board-item-creative, .board-item-ad, .board-item-project-minimal';
        }
        
        const allItems = Array.from(document.querySelectorAll(selector));
        
        return allItems.filter(item => {
            // 기존 로직 그대로 사용
            let matchesFilter = false;
            if (currentFilter === 'all') {
                matchesFilter = true;
            } else {
                if (isMainBoard) {
                    const mainCategory = item.getAttribute('data-main') || '';
                    const categoryFromDesc = getCategoryFromDescription(item);
                    const actualCategory = mainCategory || categoryFromDesc;
                    matchesFilter = actualCategory === currentFilter;
                } else if (isblog) {
                    const subCategory = item.getAttribute('data-category') || '';
                    matchesFilter = subCategory === currentFilter;
                } else {
                    const subCategory = item.getAttribute('data-category') || '';
                    matchesFilter = subCategory === currentFilter;
                }
            }
            
            let matchesSearch = true;
            if (currentSearchTerm) {
                let titleSelector, subtitleSelector, descSelector, tagSelector, categorySelector;
                
                if (isMainBoard || isblog) {
                    titleSelector = '.board-all-item-title';
                    subtitleSelector = '.board-all-item-subtitle';
                    descSelector = '.board-all-item-desc, .board-all-item-excerpt';
                    tagSelector = '.board-all-item-tags .tag, .board-all-item-tag, .tags .tag, .tag';
                    categorySelector = '.board-all-item-category, .category, .board-all-item-desc';
                } else {
                    titleSelector = '.board-item-title, .project-minimal-title';
                    subtitleSelector = '.board-item-subtitle, .project-minimal-subtitle';
                    descSelector = '.board-item-desc, .project-minimal-desc';
                    tagSelector = '.board-item-tags .tag, .project-minimal-tags .tag, .tags .tag, .tag, .board-item-tag';
                    categorySelector = '.board-item-category, .project-minimal-category, .category';
                }
                
                const titleElement = item.querySelector(titleSelector);
                const subtitleElement = item.querySelector(subtitleSelector);
                const descElement = item.querySelector(descSelector);
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const subtitle = subtitleElement ? subtitleElement.textContent.toLowerCase() : '';
                const desc = descElement ? descElement.textContent.toLowerCase() : '';
                
                const tagElements = item.querySelectorAll(tagSelector);
                let tags = '';
                tagElements.forEach(tagEl => {
                    tags += tagEl.textContent.toLowerCase() + ' ';
                });
                
                const categoryElement = item.querySelector(categorySelector);
                const dataCategory = item.getAttribute('data-category') || '';
                const dataMain = item.getAttribute('data-main') || '';
                const categoryText = categoryElement ? categoryElement.textContent.toLowerCase() : '';
                const categories = (dataCategory + ' ' + dataMain + ' ' + categoryText).toLowerCase();
                
                matchesSearch = title.includes(currentSearchTerm) || 
                               subtitle.includes(currentSearchTerm) ||
                               desc.includes(currentSearchTerm) || 
                               tags.includes(currentSearchTerm) || 
                               categories.includes(currentSearchTerm);
            }
            
            return matchesFilter && matchesSearch;
        });
    }
    
    // 통합 필터링된 아이템들 가져오기
    function getFilteredItems() {
        if (isGamesBoard) {
            return getGamesBoardFilteredItems();
        } else {
            return getOtherBoardFilteredItems();
        }
    }
    
    // 현재 페이지 아이템들만 표시
    function showCurrentPage() {
        if (isGamesBoard) {
            // 게임게시판은 별도 처리하지 않음 (이미 applyGamesBoardFilter에서 처리)
            return;
        }
        
        let selector;
        
        if (isMainBoard) {
            selector = '.board-all-item';
        } else if (isblog) {
            selector = '.board-all-item[data-main="blog"]';
        } else {
            selector = '.board-item, .board-item-square, .board-item-wide, .board-item-creative, .board-item-ad, .board-item-project-minimal';
        }
        
        const allItems = document.querySelectorAll(selector);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        // 모든 아이템 숨기기
        allItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // 현재 페이지 아이템들만 표시
        const currentPageItems = filteredItems.slice(start, end);
        currentPageItems.forEach(item => {
            item.style.display = '';
        });
    }
    
    // 다른 게시판용 결과 없음 메시지 함수
    function updateOtherBoardNoResultsMessage() {
        let container;
        
        if (isMainBoard || isblog) {
            container = document.querySelector('.board-all-grid');
        } else {
            container = document.querySelector('.board-grid') || 
                       document.querySelector('.board-square-grid') || 
                       document.querySelector('.board-wide-grid') ||
                       document.querySelector('.board-creative-grid') ||
                       document.querySelector('.board-ad-grid') ||
                       document.querySelector('.project-minimal-grid') ||
                       document.querySelector('.board-container') ||
                       document.querySelector('[class*="board"][class*="grid"]') ||
                       document.querySelector('[class*="grid"]:has(.board-item)') ||
                       document.querySelector('main .container') ||
                       document.querySelector('.content-area') ||
                       document.querySelector('.main-content');
        }
        
        if (!container) return;
        
        let noResultsMsg = container.querySelector('.no-results-message');
        
        if (filteredItems.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                    font-size: 16px;
                    background: rgba(108, 117, 125, 0.05);
                    border-radius: 12px;
                    border: 2px dashed rgba(108, 117, 125, 0.2);
                    margin: 20px 0;
                `;
                container.appendChild(noResultsMsg);
            }
            
            let message = '';
            if (currentSearchTerm) {
                message = `<i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>"${currentSearchTerm}"에 대한 검색 결과가 없습니다.`;
            } else if (currentFilter !== 'all') {
                message = `<i class="fas fa-filter" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>해당 카테고리에 게시물이 없습니다.`;
            } else {
                message = `<i class="fas fa-inbox" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>게시물이 없습니다.`;
            }
            
            noResultsMsg.innerHTML = message;
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
    
    // 페이지네이션 업데이트 (게임게시판은 제외)
    function updatePagination() {
        if (isGamesBoard) {
            // 게임게시판은 페이지네이션 없이 모든 아이템 표시
            return;
        }
        
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const paginationContainer = document.querySelector('.js-pagination');
        
        if (!paginationContainer) return;
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = '';
        
        // 이전 버튼
        const prevBtn = document.createElement('a');
        prevBtn.className = 'page-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        if (currentPage > 1) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage--;
                updateDisplay();
            });
        } else {
            prevBtn.style.opacity = '0.3';
            prevBtn.style.cursor = 'not-allowed';
        }
        paginationContainer.appendChild(prevBtn);
        
        // 페이지 번호들
        const maxVisiblePages = 5;
        let startPage, endPage;
        
        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }
        
        if (startPage > 1) {
            addPageButton(1);
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'pagination-dots';
                paginationContainer.appendChild(dots);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i);
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'pagination-dots';
                paginationContainer.appendChild(dots);
            }
            addPageButton(totalPages);
        }
        
        const nextBtn = document.createElement('a');
        nextBtn.className = 'page-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        if (currentPage < totalPages) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage++;
                updateDisplay();
            });
        } else {
            nextBtn.style.opacity = '0.3';
            nextBtn.style.cursor = 'not-allowed';
        }
        paginationContainer.appendChild(nextBtn);
        
        function addPageButton(pageNum) {
            const pageBtn = document.createElement('a');
            pageBtn.textContent = pageNum;
            pageBtn.className = pageNum === currentPage ? 'active' : '';
            pageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = pageNum;
                updateDisplay();
            });
            paginationContainer.appendChild(pageBtn);
        }
    }
    
    // 설명에서 카테고리 추출하는 함수 (전체 게시판용)
    function getCategoryFromDescription(item) {
        const descElement = item.querySelector('.board-all-item-desc');
        if (!descElement) return '';
        
        const desc = descElement.textContent;
        
        if (desc.includes('웹 디자인')) return 'web';
        if (desc.includes('컨텐츠 디자인')) return 'content';
        if (desc.includes('영상 디자인')) return 'video';
        if (desc.includes('광고/인쇄 디자인')) return 'ad';
        if (desc.includes('크리에이티브 디자인')) return 'creative';
        if (desc.includes('프로그래밍')) return 'programming';
        if (desc.includes('프로젝트')) return 'project';
        if (desc.includes('자유게시판')) return 'blog';
        if (desc.includes('게임게시판')) return 'games';
        
        return '';
    }
    
    // 메인 업데이트 함수
    function updateDisplay() {
        if (isGamesBoard) {
            // 게임게시판: 강화된 필터링 적용
            applyGamesBoardFilter(currentFilter);
        } else {
            // 다른 게시판: 기존 로직 사용
            filteredItems = getFilteredItems();
            showCurrentPage();
            updatePagination();
            updateOtherBoardNoResultsMessage();
        }
    }
    
    // 필터 기능
    filters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1;
            
            if (searchInput) {
                searchInput.value = '';
                currentSearchTerm = '';
            }
            
            updateDisplay();
        });
    });
    
    // 검색 기능
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            currentSearchTerm = searchInput.value.toLowerCase().trim();
            currentPage = 1;
            updateDisplay();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentSearchTerm = this.value.toLowerCase().trim();
                currentPage = 1;
                updateDisplay();
            }
        });
    }
    
    // 초기 실행
    updateDisplay();
});