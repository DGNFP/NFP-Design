// js/board_all.js
async function loadPosts() {
    const posts = [
        { path: '/admin/posts/2025-05-13-예시게시글.md', title: '예시게시글', date: '2025-05-13' },
        { path: '/admin/posts/2025-05-14-두번째게시글.md', title: '두번째게시글', date: '2025-05-14' }
    ];

    let postContainer = document.getElementById('post-container'); // 게시글을 담을 컨테이너

    // 각 게시글에 대해 카드 생성
    for (let post of posts) {
        let postHTML = await fetchPost(post.path); // Markdown → HTML 변환된 내용
        let postCard = `
            <div class="post-card">
                <h2>${post.title}</h2>
                <p>${post.date}</p>
                <div class="post-content">${postHTML}</div>
            </div>
        `;
        postContainer.innerHTML += postCard; // 생성한 카드를 HTML에 추가
    }
}
loadPosts();
