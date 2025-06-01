document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filters = document.querySelectorAll('.category-filter a');
    
    // 현재 페이지가 전체 게시판인지 확인
    const isMainBoard = window.location.pathname.includes('/posts/');
    
    // 필터 기능
    filters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const selectedFilter = this.getAttribute('data-filter');
            filterItems(selectedFilter);
            
            if (searchInput) {
                searchInput.value = '';
            }
        });
    });
    
    // 검색 기능 - 버튼 클릭과 엔터키만
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            searchItems(searchTerm);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                searchItems(searchTerm);
            }
        });
    }
    
    // 필터링 함수 - 전체 게시판과 개별 게시판 구분
    function filterItems(filter) {
        console.log('=== 필터링 시작 ===');
        console.log('필터:', filter);
        console.log('전체 게시판:', isMainBoard);
        
        // 전체 게시판: .board-all-item, 개별 게시판: .board-item, .board-item-square, .board-item-wide 등
        const items = isMainBoard ? 
            document.querySelectorAll('.board-all-item') : 
            document.querySelectorAll('.board-item, .board-item-square, .board-item-wide');
        
        console.log('전체 아이템 수:', items.length);
        
        let showCount = 0;
        let hideCount = 0;
        
        items.forEach((item, index) => {
            let shouldShow = false;
            
            if (isMainBoard) {
                // 전체 게시판: 1차 카테고리만 확인
                const mainCategory = item.getAttribute('data-main') || '';
                const categoryFromDesc = getCategoryFromDescription(item);
                
                console.log(`아이템 ${index}:`, {
                    main: mainCategory,
                    descCategory: categoryFromDesc,
                    title: item.querySelector('.board-all-item-title')?.textContent
                });
                
                if (filter === 'all') {
                    shouldShow = true;
                } else {
                    // data-main이 비어있으면 설명에서 카테고리 추출
                    const actualCategory = mainCategory || categoryFromDesc;
                    shouldShow = actualCategory === filter;
                }
            } else {
                // 개별 게시판: 2차 카테고리 확인
                const subCategory = item.getAttribute('data-category') || '';
                
                console.log(`아이템 ${index}:`, {
                    sub: subCategory,
                    title: item.querySelector('.board-item-title')?.textContent
                });
                
                if (filter === 'all') {
                    shouldShow = true;
                } else {
                    shouldShow = subCategory === filter;
                }
            }
            
            if (shouldShow) {
                item.style.display = '';
                showCount++;
                console.log(`아이템 ${index}: 표시`);
            } else {
                item.style.display = 'none';
                hideCount++;
                console.log(`아이템 ${index}: 숨김`);
            }
        });
        
        console.log(`결과: 표시 ${showCount}개, 숨김 ${hideCount}개`);
    }
    
    // 설명에서 카테고리 추출하는 함수 (임시 방편)
    function getCategoryFromDescription(item) {
        const descElement = item.querySelector('.board-all-item-desc');
        if (!descElement) return '';
        
        const desc = descElement.textContent;
        
        // 설명 텍스트에서 카테고리 매핑
        if (desc.includes('웹 디자인')) return 'web';
        if (desc.includes('컨텐츠 디자인')) return 'content';
        if (desc.includes('영상 디자인')) return 'video';
        if (desc.includes('광고/인쇄 디자인')) return 'ad';
        if (desc.includes('크리에이티브 디자인')) return 'creative';
        if (desc.includes('프로그래밍')) return 'programming';
        
        return '';
    }
    
    // 검색 함수
    function searchItems(term) {
        console.log('=== 검색 시작 ===');
        console.log('검색어:', term);
        
        const items = isMainBoard ? 
            document.querySelectorAll('.board-all-item') : 
            document.querySelectorAll('.board-item, .board-item-square, .board-item-wide');
            
        const activeFilter = document.querySelector('.category-filter a.active');
        const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        
        console.log('현재 필터:', currentFilter);
        
        if (term === '') {
            filterItems(currentFilter);
            return;
        }
        
        let matchCount = 0;
        
        items.forEach((item, index) => {
            const titleElement = isMainBoard ? 
                item.querySelector('.board-all-item-title') : 
                item.querySelector('.board-item-title');
            const descElement = isMainBoard ? 
                item.querySelector('.board-all-item-desc') : 
                item.querySelector('.board-item-desc');
            
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                const desc = descElement ? descElement.textContent.toLowerCase() : '';
                
                let matchesFilter = false;
                
                if (isMainBoard) {
                    // 전체 게시판 필터 확인
                    const mainCategory = item.getAttribute('data-main') || '';
                    const categoryFromDesc = getCategoryFromDescription(item);
                    const actualCategory = mainCategory || categoryFromDesc;
                    
                    matchesFilter = (currentFilter === 'all' || actualCategory === currentFilter);
                } else {
                    // 개별 게시판 필터 확인
                    const subCategory = item.getAttribute('data-category') || '';
                    matchesFilter = (currentFilter === 'all' || subCategory === currentFilter);
                }
                
                const matchesSearch = title.includes(term) || desc.includes(term);
                
                if (matchesFilter && matchesSearch) {
                    item.style.display = '';
                    matchCount++;
                } else {
                    item.style.display = 'none';
                }
            }
        });
        
        console.log(`검색 결과: ${matchCount}개 항목 표시`);
    }
    
    // 초기 필터링
    filterItems('all');
});