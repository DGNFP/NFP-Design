document.addEventListener('DOMContentLoaded', function() {
    // 모달 관련 요소
    const writeModal = document.getElementById('write-modal');
    const writeBtn = document.getElementById('write-btn');
    const closeBtn = document.querySelector('.close-button');
    const postForm = document.getElementById('post-form');
    const postList = document.getElementById('postList');
    const pagination = document.getElementById('pagination');
    
    // 카테고리 관련 요소
    const primaryCategory = document.getElementById('primary-category');
    const secondaryCategory = document.getElementById('secondary-category');
    
    // 검색 관련 요소
    const searchInput = document.querySelector('.admin-search .form-control');
    const searchBtn = document.querySelector('.search-btn');
    
    // 파일 업로드 관련 요소
    const fileUpload = document.getElementById('image-upload');
    const fileNameDisplay = document.getElementById('file-name');
    
    // 게시글 데이터 관리
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let currentPage = 1;
    const postsPerPage = 9;
    let filteredPosts = [...posts];
    
    // 2차 카테고리 옵션 매핑
    const categoryMapping = {
      '웹 디자인': ['홈페이지', '디지털배너', '상세페이지', 'ux/ui', '기타 (웹디자인)'],
      '컨텐츠 디자인': ['카드뉴스', '포스터', 'SNS이미지', '피드광고', '기타 (컨텐츠)'],
      '영상 디자인': ['영상 제작', '영상 편집', '모션그래픽', '유튜브 썸네일'],
      '광고/인쇄 디자인': ['현수막/엑스배너', '명함', '브로슈어/카탈로그', '옥외광고']
    };
    
    // 이미지 파일을 Base64로 변환하는 함수
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    
    // 글쓰기 버튼 클릭 시 모달 표시
    writeBtn.addEventListener('click', function() {
      writeModal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // 스크롤 방지
    });
    
    // 닫기 버튼 클릭 시 모달 닫기
    closeBtn.addEventListener('click', function() {
      writeModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // 스크롤 복원
      // 폼 초기화
      postForm.reset();
      fileNameDisplay.textContent = '선택된 파일 없음';
      secondaryCategory.innerHTML = '<option value="">1차 카테고리를 먼저 선택하세요</option>';
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
      if (event.target === writeModal) {
        writeModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 스크롤 복원
        // 폼 초기화
        postForm.reset();
        fileNameDisplay.textContent = '선택된 파일 없음';
        secondaryCategory.innerHTML = '<option value="">1차 카테고리를 먼저 선택하세요</option>';
      }
    });
    
    // 파일 선택 시 파일명 표시
    fileUpload.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        fileNameDisplay.textContent = this.files[0].name;
      } else {
        fileNameDisplay.textContent = '선택된 파일 없음';
      }
    });
    
    // 1차 카테고리 변경 시 2차 카테고리 업데이트
    primaryCategory.addEventListener('change', function() {
      const selectedCategory = this.value;
      secondaryCategory.innerHTML = '';
      
      if (selectedCategory) {
        // 기본 옵션 추가
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '선택하세요';
        secondaryCategory.appendChild(defaultOption);
        
        // 선택된 1차 카테고리에 따른 2차 카테고리 옵션 추가
        categoryMapping[selectedCategory].forEach(subCategory => {
          const option = document.createElement('option');
          option.value = subCategory;
          option.textContent = subCategory;
          secondaryCategory.appendChild(option);
        });
      } else {
        // 1차 카테고리가 선택되지 않은 경우
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '1차 카테고리를 먼저 선택하세요';
        secondaryCategory.appendChild(option);
      }
    });
    
    // 폼 제출 처리
    postForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
      const primary = primaryCategory.value;
      const secondary = secondaryCategory.value;
      
      // 이미지 파일 처리
      let imageData = '';
      if (fileUpload.files && fileUpload.files[0]) {
        try {
          imageData = await getBase64(fileUpload.files[0]);
        } catch (error) {
          console.error('이미지 처리 오류:', error);
        }
      }
      
      // 현재 날짜 및 시간 생성
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
      
      // 새 게시글 객체 생성
      const newPost = {
        id: Date.now(), // 유니크 ID 생성
        title,
        body: content,
        category1: primary,
        category2: secondary,
        thumbnail: imageData,
        body_image: imageData, // 본문 이미지도 같은 이미지로 설정(필요에 따라 변경 가능)
        date: dateStr,
        time: timeStr,
        createdAt: now.toISOString()
      };
      
      // 게시글 배열에 추가 및 로컬 스토리지 업데이트
      posts.unshift(newPost); // 최신 글이 맨 앞에 오도록
      localStorage.setItem('posts', JSON.stringify(posts));
      
      // 필터링된 게시글 목록 갱신
      filteredPosts = [...posts];
      
      // 게시글 목록 갱신 및 모달 닫기
      renderPosts();
      writeModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // 스크롤 복원
      
      // 폼 초기화
      postForm.reset();
      fileNameDisplay.textContent = '선택된 파일 없음';
      secondaryCategory.innerHTML = '<option value="">1차 카테고리를 먼저 선택하세요</option>';
      
      // 알림 표시
      alert('게시글이 성공적으로 등록되었습니다.');
    });
    
    // 검색 기능
    searchBtn.addEventListener('click', function() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      
      if (searchTerm) {
        filteredPosts = posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.body.toLowerCase().includes(searchTerm) ||
          post.category1.toLowerCase().includes(searchTerm) ||
          post.category2.toLowerCase().includes(searchTerm)
        );
      } else {
        filteredPosts = [...posts];
      }
      
      currentPage = 1; // 검색 시 첫 페이지로 이동
      renderPosts();
    });
    
    // 엔터키로 검색 실행
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
    
    // 게시글 렌더링 함수
    function renderPosts() {
      // 페이지네이션 계산
      const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
      const startIndex = (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const currentPosts = filteredPosts.slice(startIndex, endIndex);
      
      // 게시글 목록 HTML 생성
      let postsHTML = '';
      
      if (currentPosts.length === 0) {
        postsHTML = '<div class="no-posts">게시글이 없습니다.</div>';
      } else {
        postsHTML = '<div class="post-grid">';
        
        currentPosts.forEach(post => {
          postsHTML += `
            <div class="post-card" data-id="${post.id}">
              <div class="post-image">
                ${post.thumbnail 
                  ? `<img src="${post.thumbnail}" alt="${post.title}">`
                  : `<div class="no-image">No Image</div>`
                }
              </div>
              <div class="post-info">
              

              
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                  <span>${post.date}</span>
                  <span>${post.category1} > ${post.category2}</span>
                </div>
                <div class="post-excerpt">${post.body.length > 100 
                  ? post.body.substring(0, 100) + '...' 
                  : post.body}</div>
              </div>
            </div>
          `;
        });
        
        postsHTML += '</div>';
      }
      
      postList.innerHTML = postsHTML;
      
      // 페이지네이션 버튼 생성
      renderPagination(totalPages);
      
      // 게시글 클릭 이벤트 추가
      document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
          const postId = parseInt(this.getAttribute('data-id'));
          const post = posts.find(p => p.id === postId);
          
          if (post) {
            viewPost(post);
          }
        });
      });
    }
    
    // 페이지네이션 렌더링 함수
    function renderPagination(totalPages) {
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }
      
      let paginationHTML = '';
      
      // 이전 버튼
      paginationHTML += `
        <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''}>
          <i class="fas fa-chevron-left"></i>
        </button>
      `;
      
      // 페이지 번호 버튼
      const maxButtons = 5; // 최대 표시할 버튼 수
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      
      // 버튼 수 조정
      if (endPage - startPage + 1 < maxButtons && startPage > 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
          <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
            ${i}
          </button>
        `;
      }
      
      // 다음 버튼
      paginationHTML += `
        <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''}>
          <i class="fas fa-chevron-right"></i>
        </button>
      `;
      
      pagination.innerHTML = paginationHTML;
      
      // 페이지네이션 버튼 이벤트 추가
      document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          if (this.classList.contains('prev') && currentPage > 1) {
            currentPage--;
          } else if (this.classList.contains('next') && currentPage < totalPages) {
            currentPage++;
          } else if (!this.classList.contains('prev') && !this.classList.contains('next')) {
            currentPage = parseInt(this.getAttribute('data-page'));
          }
          
          renderPosts();
          window.scrollTo(0, document.querySelector('.admin-section').offsetTop);
        });
      });
    }
    
    // 게시글 상세 보기 함수
    function viewPost(post) {
      // URL 파라미터로 게시글 ID 전달하여 상세 페이지로 이동
      // 실제로는 새 페이지로 이동하거나 모달로 표시할 수 있음
      // 여기서는 간단한 알림으로 대체
      alert(`
        제목: ${post.title}
        카테고리: ${post.category1} > ${post.category2}
        작성일: ${post.date} ${post.time}
        
        내용:
        ${post.body}
      `);
      
      // 실제 구현에서는 아래와 같이 상세 페이지로 이동하거나 모달 표시
      // window.location.href = `post-detail.html?id=${post.id}`;
      // 또는 모달로 상세 내용 표시
    }
    
    // NetlifyCMS 연동 (필요한 경우)
    function initNetlifyCMS() {
      // NetlifyCMS가 로드된 경우
      if (window.CMS) {
        // NetlifyCMS 설정
        window.CMS.init({
          config: {
           backend: {
            name: 'github',
            repo: 'DGNFP/NFP_Design',
            branch: 'main',
          },
            media_folder: 'images/uploads',
            collections: [
              {
                name: 'posts',
                label: '게시글',
                folder: '_posts',
                create: true,
                fields: [
                  { label: '제목', name: 'title', widget: 'string' },
                  { label: '게시일', name: 'date', widget: 'datetime' },
                  { label: '썸네일 이미지', name: 'thumbnail', widget: 'image' },
                  { label: '본문 이미지', name: 'body_image', widget: 'image', required: false },
                  { label: '본문 내용', name: 'body', widget: 'markdown' },
                  { label: '1차 카테고리', name: 'category1', widget: 'select', options: Object.keys(categoryMapping) },
                  { label: '2차 카테고리', name: 'category2', widget: 'select', options: [].concat(...Object.values(categoryMapping)) }
                ]
              }
            ]
          }
        });
      }
    }
    
    // 기본 작동 시작
    renderPosts();
    
    // NetlifyCMS 초기화 시도 (선택적)
    try {
      initNetlifyCMS();
    } catch (error) {
      console.warn('NetlifyCMS 초기화 실패:', error);
    }
  });