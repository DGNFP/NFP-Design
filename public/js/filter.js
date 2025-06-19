document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filters = document.querySelectorAll('.category-filter a');
    
    // 페이지네이션 변수
    let currentPage = 1;
    const itemsPerPage = 9; // 개별 게시판은 9개씩
    let filteredItems = [];
    let currentFilter = 'all';
    let currentSearchTerm = '';
    
    // 현재 페이지가 어떤 게시판인지 확인
    const isMainBoard = window.location.pathname.includes('/posts/');
    const isFreeBoard = window.location.pathname.includes('/freeboard/');
    const isGamesBoard = window.location.pathname.includes('/games/'); // ✨ 게임게시판 추가
    
    console.log('현재 게시판 타입:', 
        isMainBoard ? '전체 게시판' : 
        isFreeBoard ? '자유게시판' : 
        isGamesBoard ? '게임게시판' : '개별 게시판');
    
    // 필터 기능
    filters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1; // 필터 변경 시 첫 페이지로
            
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
            currentPage = 1; // 검색 시 첫 페이지로
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
    
    // 메인 업데이트 함수
    function updateDisplay() {
        // 1. 필터링된 아이템들 가져오기
        filteredItems = getFilteredItems();
        
        // 2. 현재 페이지에 맞는 아이템들만 표시
        showCurrentPage();
        
        // 3. 페이지네이션 업데이트
        updatePagination();
        
        // 4. 결과 없음 메시지 업데이트 (모든 게시판에 적용)
        updateNoResultsMessage();
        
        console.log(`필터: ${currentFilter}, 검색: "${currentSearchTerm}", 페이지: ${currentPage}, 결과: ${filteredItems.length}개`);
    }
    
    // 필터링된 아이템들 가져오기
    function getFilteredItems() {
        let selector;
        
        if (isMainBoard) {
            // 전체 게시판
            selector = '.board-all-item';
        } else if (isFreeBoard) {
            // 자유게시판
            selector = '.board-all-item[data-main="freeboard"]';
        } else if (isGamesBoard) {
            // ✨ 게임게시판 추가
            selector = '.board-all-item[data-main="games"]';
        } else {
            // 개별 게시판들
            selector = '.board-item, .board-item-square, .board-item-wide, .board-item-creative, .board-item-ad, .board-item-project-minimal';
        }
        
        const allItems = Array.from(document.querySelectorAll(selector));
        
        return allItems.filter(item => {
            // 1. 필터 조건 확인
            let matchesFilter = false;
            if (currentFilter === 'all') {
                matchesFilter = true;
            } else {
                if (isMainBoard) {
                    // 전체 게시판: 1차 카테고리 확인
                    const mainCategory = item.getAttribute('data-main') || '';
                    const categoryFromDesc = getCategoryFromDescription(item);
                    const actualCategory = mainCategory || categoryFromDesc;
                    matchesFilter = actualCategory === currentFilter;
                } else if (isFreeBoard || isGamesBoard) {
                    // ✨ 자유게시판, 게임게시판: 서브카테고리 확인
                    const subCategory = item.getAttribute('data-category') || '';
                    matchesFilter = subCategory === currentFilter;
                } else {
                    // 개별 게시판: 2차 카테고리 확인
                    const subCategory = item.getAttribute('data-category') || '';
                    matchesFilter = subCategory === currentFilter;
                }
            }
            
            // 2. 검색 조건 확인
            let matchesSearch = true;
            if (currentSearchTerm) {
                let titleSelector, descSelector;
                
                if (isMainBoard || isFreeBoard || isGamesBoard) {
                    // ✨ 전체 게시판, 자유게시판, 게임게시판
                    titleSelector = '.board-all-item-title';
                    descSelector = '.board-all-item-desc, .board-all-item-excerpt'; // 게임게시판 본문 검색 추가
                } else {
                    // 개별 게시판들
                    titleSelector = '.board-item-title, .project-minimal-title';
                    descSelector = '.board-item-desc, .project-minimal-desc';
                }
                
                const titleElement = item.querySelector(titleSelector);
                const descElement = item.querySelector(descSelector);
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const desc = descElement ? descElement.textContent.toLowerCase() : '';
                matchesSearch = title.includes(currentSearchTerm) || desc.includes(currentSearchTerm);
            }
            
            return matchesFilter && matchesSearch;
        });
    }
    
    // 현재 페이지 아이템들만 표시
    function showCurrentPage() {
        let selector;
        
        if (isMainBoard) {
            selector = '.board-all-item';
        } else if (isFreeBoard) {
            selector = '.board-all-item[data-main="freeboard"]';
        } else if (isGamesBoard) {
            // ✨ 게임게시판 추가
            selector = '.board-all-item[data-main="games"]';
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
        filteredItems.slice(start, end).forEach(item => {
            item.style.display = '';
        });
    }
    
    // 모든 게시판용 결과 없음 메시지 함수
    function updateNoResultsMessage() {
        let container;
        
        // 게시판 타입별로 컨테이너 찾기
        if (isMainBoard || isFreeBoard) {
            container = document.querySelector('.board-all-grid');
        } else if (isGamesBoard) {
            // ✨ 게임게시판 컨테이너 추가
            container = document.querySelector('.board-game-grid');
        } else {
            // 개별 게시판들의 컨테이너 찾기
            container = document.querySelector('.board-grid') || 
                       document.querySelector('.board-square-grid') || 
                       document.querySelector('.board-wide-grid') ||
                       document.querySelector('.board-creative-grid') ||
                       document.querySelector('.board-ad-grid') ||
                       document.querySelector('.project-minimal-grid') ||
                       document.querySelector('.board-container');
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
                
                // 검색어가 있으면 검색 관련 메시지, 필터가 있으면 필터 관련 메시지
                let message = '';
                if (currentSearchTerm) {
                    message = `<i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>"${currentSearchTerm}"에 대한 검색 결과가 없습니다.`;
                } else if (currentFilter !== 'all') {
                    message = `<i class="fas fa-filter" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>해당 카테고리에 게시물이 없습니다.`;
                } else {
                    message = `<i class="fas fa-inbox" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>게시물이 없습니다.`;
                }
                
                noResultsMsg.innerHTML = message;
                container.appendChild(noResultsMsg);
            } else {
                // 기존 메시지 업데이트
                let message = '';
                if (currentSearchTerm) {
                    message = `<i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>"${currentSearchTerm}"에 대한 검색 결과가 없습니다.`;
                } else if (currentFilter !== 'all') {
                    message = `<i class="fas fa-filter" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>해당 카테고리에 게시물이 없습니다.`;
                } else {
                    message = `<i class="fas fa-inbox" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>게시물이 없습니다.`;
                }
                noResultsMsg.innerHTML = message;
            }
            
            if (noResultsMsg) noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
    
    // 페이지네이션 업데이트 (기존 코드와 동일)
    function updatePagination() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const paginationContainer = document.querySelector('.js-pagination');
        
        if (!paginationContainer) return;
        
        // 페이지가 1개 이하면 숨기기
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = '';
        
        // 이전 버튼 (항상 표시, 비활성화 처리)
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
        
        // 페이지 번호들 (고정 레이아웃)
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
        
        // 첫 페이지와 ... 표시
        if (startPage > 1) {
            addPageButton(1);
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'pagination-dots';
                paginationContainer.appendChild(dots);
            }
        }
        
        // 중간 페이지들
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i);
        }
        
        // 마지막 페이지와 ... 표시
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'pagination-dots';
                paginationContainer.appendChild(dots);
            }
            addPageButton(totalPages);
        }
        
        // 다음 버튼 (항상 표시, 비활성화 처리)
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
        if (desc.includes('자유게시판')) return 'freeboard';
        if (desc.includes('게임게시판')) return 'games'; // ✨ 게임게시판 추가
        
        return '';
    }
    
    // 초기 실행
    updateDisplay();
});