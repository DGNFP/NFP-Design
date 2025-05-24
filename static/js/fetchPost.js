// js/fetchPost.js
async function fetchPost(postPath) {
    const response = await fetch(postPath); // 예: /admin/posts/2025-05-13-예시게시글.md
    const markdown = await response.text(); // Markdown 텍스트 읽기
    const htmlContent = marked(markdown); // Markdown을 HTML로 변환
    return htmlContent;
}
