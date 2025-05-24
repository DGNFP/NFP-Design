document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // 필터 선택 이벤트
    const filters = document.querySelectorAll('.category-filter a');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Filter clicked:', this.getAttribute('data-filter'));
            
            // 활성화 클래스 토글
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const selectedFilter = this.getAttribute('data-filter');
            
            // 포트폴리오 아이템 필터링
            filterItems(selectedFilter);
        });
    });
    
    // 검색 기능
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        searchItems(searchTerm);
    });
    
    // 검색어 입력 시 엔터키 이벤트
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            searchItems(searchTerm);
        }
    });
    
    // 아이템 필터링 함수
    function filterItems(filter) {
        console.log('Filtering items by:', filter);
        const items = document.querySelectorAll('.board-item , .board-item-square , .board-item-wide , .board-all-item');
        
        items.forEach(item => {
            const subCategory = item.getAttribute('data-category'); // 2차
            const mainCategory = item.getAttribute('data-main');   // 1차
            
            const isMainMatch = mainCategory === filter;
            const isSubMatch = subCategory === filter;
    
            if (filter === 'all' || isMainMatch || isSubMatch) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 아이템 검색 함수
    function searchItems(term) {
        console.log('Searching for:', term);
        const items = document.querySelectorAll('.board-item, .board-item-square , .board-item-wide' );
        const activeFilter = document.querySelector('.category-filter a.active').getAttribute('data-filter');
        
        if (term === '') {
            // 검색어가 없으면 현재 활성화된 필터 기준으로 보여줌
            filterItems(activeFilter);
            return;
        }
        
        items.forEach(item => {
            const title = item.querySelector('.board-item-title').textContent.toLowerCase();
            const desc = item.querySelector('.board-item-desc').textContent.toLowerCase();
            const category = item.getAttribute('data-category');
            
            // 현재 활성화된 필터와 일치하거나 '전체'인 경우에만 검색 적용
            if ((activeFilter === 'all' || activeFilter === category) && 
                (title.includes(term) || desc.includes(term))) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 초기 필터링 실행 (전체 표시)
    console.log('Running initial filtering');
    filterItems('all');
});