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
    
    // 현재 페이지가 전체 게시판인지 개별 게시판인지 확인
    const isMainBoard = window.location.pathname.includes('/posts/');
    
    console.log('현재 게시판 타입:', isMainBoard ? '전체 게시판' : '개별 게시판');
    
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
        
        console.log(`필터: ${currentFilter}, 검색: "${currentSearchTerm}", 페이지: ${currentPage}, 결과: ${filteredItems.length}개`);
    }
    
    // 필터링된 아이템들 가져오기
    function getFilteredItems() {
        // 전체 게시판과 개별 게시판에 따라 선택자 변경 (프로젝트 게시판 추가)
        const selector = isMainBoard ? '.board-all-item' : '.board-item, .board-item-square, .board-item-wide, .board-item-creative, .board-item-ad, .board-item-project-minimal';
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
                } else {
                    // 개별 게시판: 2차 카테고리 확인
                    const subCategory = item.getAttribute('data-category') || '';
                    matchesFilter = subCategory === currentFilter;
                }
            }
            
            // 2. 검색 조건 확인
            let matchesSearch = true;
            if (currentSearchTerm) {
                // 프로젝트 게시판용 셀렉터 추가
                const titleSelector = isMainBoard ? '.board-all-item-title' : '.board-item-title, .project-minimal-title';
                const descSelector = isMainBoard ? '.board-all-item-desc' : '.board-item-desc, .project-minimal-desc';
                
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
        // 프로젝트 게시판 추가
        const selector = isMainBoard ? '.board-all-item' : '.board-item, .board-item-square, .board-item-wide, .board-item-creative, .board-item-ad, .board-item-project-minimal';
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
    
    // 페이지네이션 업데이트
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
        if (desc.includes('프로젝트')) return 'project'; // 프로젝트 추가
        
        return '';
    }
    
    // 초기 실행
    updateDisplay();
});