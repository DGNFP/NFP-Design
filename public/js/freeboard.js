document.addEventListener('DOMContentLoaded', function() {
    // 필터 기능
    const filterLinks = document.querySelectorAll('.category-filter a');
    const boardItems = document.querySelectorAll('.board-all-item[data-main="freeboard"]');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 활성 상태 변경
            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            boardItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all') {
                    // 전체 보기
                    item.style.display = 'block';
                } else if (itemCategory === filterValue) {
                    // 해당 카테고리 보기
                    item.style.display = 'block';
                } else {
                    // 숨기기
                    item.style.display = 'none';
                }
            });
            
            // 필터 결과 업데이트
            updateFilterResults();
        });
    });
    
    // 검색 기능
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeFilter = document.querySelector('.category-filter a.active').getAttribute('data-filter');
        
        boardItems.forEach(item => {
            const title = item.querySelector('.board-all-item-title').textContent.toLowerCase();
            const itemCategory = item.getAttribute('data-category');
            
            // 검색어 매칭
            const matchesSearch = searchTerm === '' || title.includes(searchTerm);
            
            // 카테고리 필터 매칭
            const matchesFilter = activeFilter === 'all' || itemCategory === activeFilter;
            
            // 둘 다 만족해야 표시
            if (matchesSearch && matchesFilter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        updateFilterResults();
    }
    
    // 검색 이벤트
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
    
    // Enter 키 검색
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 필터 결과 업데이트 함수
    function updateFilterResults() {
        const visibleItems = Array.from(boardItems).filter(item => 
            item.style.display !== 'none'
        );
        
        console.log(`자유게시판 필터 결과: ${visibleItems.length}개 게시물 표시`);
        
        // 결과가 없을 때 메시지 표시 (선택사항)
        const container = document.querySelector('.board-all-grid');
        let noResultsMsg = container.querySelector('.no-results-message');
        
        if (visibleItems.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                    font-size: 16px;
                `;
                noResultsMsg.innerHTML = '<i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>검색 결과가 없습니다.';
                container.appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
    
    // 초기 결과 표시
    updateFilterResults();
});
