// document.addEventListener('DOMContentLoaded', function() {
//   // 모든 게시글 데이터를 가져오는 함수
//   async function fetchPosts() {
//     try {
//       const response = await fetch('/admin/posts.json');
//       const posts = await response.json();
//       return posts;
//     } catch (error) {
//       console.error('게시글을 불러오는 중 오류가 발생했습니다:', error);
//       return [];
//     }
//   }

//   // 게시글 목록을 렌더링하는 함수
//   async function renderPosts() {
//     const posts = await fetchPosts();
//     const boardGrid = document.querySelector('.board-all-grid');
    
//     // 게시판이 존재하지 않으면 종료
//     if (!boardGrid) return;
    
//     // 기존 내용을 유지하면서 새 게시글 추가
//     posts.forEach(post => {
//       // main 카테고리 매핑
//       const mainCategoryMap = {
//         '웹 디자인': 'web',
//         '컨텐츠 디자인': 'content',
//         '영상 디자인': 'video',
//         '광고/인쇄 디자인': 'ad'
//       };
      
//       // 2차 카테고리를 slug 형태로 변환
//       const subCategorySlug = post.category2.toLowerCase().replace(/\s+/g, '_').replace(/[\/\\]/g, '_');
      
//       // 게시글 날짜 포맷팅 (YYYY.MM.DD)
//       const postDate = new Date(post.date);
//       const formattedDate = `${postDate.getFullYear()}.${String(postDate.getMonth() + 1).padStart(2, '0')}.${String(postDate.getDate()).padStart(2, '0')}`;
      
//       // 게시글 URL 생성
//       const postSlug = post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
//       const postUrl = `/posts/${postSlug}.html`;
      
//       // 게시글 아이템 HTML 생성
//       const postElement = document.createElement('div');
//       postElement.className = 'board-all-item';
//       postElement.setAttribute('data-main', mainCategoryMap[post.category1] || 'content');
//       postElement.setAttribute('data-category', subCategorySlug);
      
//       postElement.innerHTML = `
//         <a href="${postUrl}">
//           <img src="${post.thumbnail}" alt="${post.title}">
//           <div class="board-all-item-content">
//             <h3 class="board-all-item-title">${post.title}</h3>
//             <p class="board-all-item-desc">${post.description || post.body.substring(0, 100).replace(/<[^>]*>/g, '')}...</p>
//             <p class="board-all-item-date">${formattedDate}</p>
//             <a href="${postUrl}" class="board-all-item-link">자세히 보기</a>
//           </div>
//         </a>
//       `;
      
//       boardGrid.appendChild(postElement);
//     });
//   }

//   // 게시글 상세 페이지 렌더링 함수
//   async function renderPostDetail() {
//     // URL에서 게시글 slug 가져오기
//     const urlParts = window.location.pathname.split('/');
//     const postSlug = urlParts[urlParts.length - 1].replace('.html', '');
    
//     if (!postSlug) return;
    
//     // 모든 게시글 가져오기
//     const posts = await fetchPosts();
    
//     // 현재 게시글 찾기
//     const currentPost = posts.find(post => {
//       const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
//       return slug === postSlug;
//     });
    
//     if (!currentPost) return;
    
//     // 게시글 내용 채우기
//     document.getElementById('post-title').textContent = currentPost.title;
    
//     // 날짜 포맷팅
//     const postDate = new Date(currentPost.date);
//     const formattedDate = `${postDate.getFullYear()}.${String(postDate.getMonth() + 1).padStart(2, '0')}.${String(postDate.getDate()).padStart(2, '0')}`;
//     document.getElementById('post-date').textContent = formattedDate;
    
//     // 메인 이미지 설정
//     const postImage = document.getElementById('post-image');
//     if (postImage) {
//       postImage.src = currentPost.body_image || currentPost.thumbnail;
//       postImage.alt = currentPost.title;
//     }
    
//     // 게시글 본문 내용 설정
//     document.getElementById('post-body').innerHTML = currentPost.body;
    
//     // 이전/다음 게시글 링크 설정
//     setupPostNavigation(posts, currentPost);
//   }
  
//   // 이전/다음 게시글 네비게이션 설정
//   function setupPostNavigation(posts, currentPost) {
//     // 게시글 날짜로 정렬
//     const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
//     // 현재 게시글 인덱스 찾기
//     const currentIndex = sortedPosts.findIndex(post => post.title === currentPost.title);
    
//     const prevLink = document.querySelector('.nav-previous');
//     const nextLink = document.querySelector('.nav-next');
    
//     // 이전 게시글 링크
//     if (currentIndex < sortedPosts.length - 1) {
//       const prevPost = sortedPosts[currentIndex + 1];
//       const prevSlug = prevPost.slug || prevPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
//       prevLink.href = `/posts/${prevSlug}.html`;
//     } else {
//       prevLink.style.visibility = 'hidden';
//     }
    
//     // 다음 게시글 링크
//     if (currentIndex > 0) {
//       const nextPost = sortedPosts[currentIndex - 1];
//       const nextSlug = nextPost.slug || nextPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
//       nextLink.href = `/posts/${nextSlug}.html`;
//     } else {
//       nextLink.style.visibility = 'hidden';
//     }
//   }

//   // 현재 페이지 경로에 따라 적절한 함수 실행
//   const path = window.location.pathname;
  
//   if (path.includes('board_all.html') || path === '/' || path.endsWith('board/')) {
//     renderPosts();
//   } else if (path.includes('/posts/')) {
//     renderPostDetail();
//   }
// });



document.addEventListener('DOMContentLoaded', function() {
    // 게시글 목록 페이지용 함수
    function renderPostList() {
        fetch('/content/posts')
            .then(response => response.json())
            .then(posts => {
                const gridContainer = document.querySelector('.board-all-grid');
                
                posts.forEach(post => {
                    const postElement = `
                    <div class="board-all-item" data-main="${getCategoryClass(post.category)}" data-category="cardnews">
                        <a href="post/${post.slug}.html">
                            <img src="${post.thumbnail}" alt="${post.title}">
                            <div class="board-all-item-content">
                                <h3 class="board-all-item-title">${post.title}</h3>
                                <p class="board-all-item-desc">${post.description}</p>
                                <p class="board-all-item-date">${formatDate(post.date)}</p>
                                <a href="post/${post.slug}.html" class="board-all-item-link">자세히 보기</a>
                            </div>
                        </a>
                    </div>
                    `;
                    gridContainer.innerHTML += postElement;
                });
            });
    }

    // 게시글 상세 페이지용 함수
    function renderPostDetail() {
        const slug = window.location.pathname.split('/').pop().replace('.html', '');
        fetch(`/content/posts/${slug}.json`)
            .then(response => response.json())
            .then(post => {
                document.getElementById('post-title').textContent = post.title;
                document.getElementById('post-date').textContent = formatDate(post.date);
                document.getElementById('post-image').src = post.thumbnail;
                document.getElementById('post-body').innerHTML = marked(post.body);
            });
    }

   function getCategoryClass(category) {
    const categoryMap = {
        '웹 디자인': 'web',
        '컨텐츠 디자인': 'content',
        '영상 디자인': 'video',
        '광고/인쇄 디자인': 'ad'
    };
    return categoryMap[category] || 'all';
}

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0].replace(/-/g, '.');
    }

    // 현재 페이지에 따라 적절한 함수 호출
    if (document.querySelector('.board-all-grid')) {
        renderPostList();
    } else if (document.querySelector('.post-section')) {
        renderPostDetail();
    }
});