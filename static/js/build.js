const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

// 설정
const POSTS_DIR = 'admin/posts';
const OUTPUT_JSON = 'admin/posts.json';
const POSTS_OUTPUT_DIR = 'posts';
const POST_TEMPLATE_PATH = 'templates/post_template.html';

// 게시글 템플릿 파일 내용 읽기
const postTemplate = fs.readFileSync(POST_TEMPLATE_PATH, 'utf8');

// 디렉토리가 없으면 생성
if (!fs.existsSync(POSTS_OUTPUT_DIR)) {
  fs.mkdirSync(POSTS_OUTPUT_DIR, { recursive: true });
}

// Markdown 파일을 JSON으로 변환하는 함수
function processMarkdownFiles() {
  const posts = [];
  
  // POSTS_DIR에서 모든 Markdown 파일 가져오기
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  
  files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Front Matter 파싱
    const { data, content } = matter(fileContent);
    
    // Markdown을 HTML로 변환
    const htmlContent = marked(content);
    
    // slug 생성
    const slug = file.replace('.md', '').split('-').slice(3).join('-') || 
                data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    // 게시글 객체 생성
    const post = {
      ...data,
      body: htmlContent,
      slug: slug
    };
    
    posts.push(post);
    
    // HTML 파일 생성
    generatePostHtml(post, slug);
  });
  
  // 모든 게시글 정보를 JSON 파일로 저장
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(posts, null, 2));
  
  console.log(`${posts.length}개의 게시글이 처리되었습니다.`);
}

// 게시글 HTML 생성 함수
function generatePostHtml(post, slug) {
  const postDate = new Date(post.date);
  const formattedDate = `${postDate.getFullYear()}.${String(postDate.getMonth() + 1).padStart(2, '0')}.${String(postDate.getDate()).padStart(2, '0')}`;
  
  // 템플릿에 데이터 적용
  let postHtml = postTemplate
    .replace(/{{title}}/g, post.title)
    .replace(/{{date}}/g, formattedDate)
    .replace(/{{image_url}}/g, post.body_image || post.thumbnail)
    .replace(/{{content}}/g, post.body);
  
  // HTML 파일 저장
  const outputPath = path.join(POSTS_OUTPUT_DIR, `${slug}.html`);
  fs.writeFileSync(outputPath, postHtml);
  
  console.log(`게시글 HTML이 생성되었습니다: ${outputPath}`);
}

// 스크립트 실행
processMarkdownFiles();