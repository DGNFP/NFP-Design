function createHeader(targetElementId = 'header-container', activeMenu = '') {
    // 외부 CSS 로드
    const cssHref = './css/styles.css';
    const existingLink = document.querySelector(`link[href="${cssHref}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }

    // 헤더 HTML 생성
    const headerHtml = `
<header>
    <div class="container">
        <nav>
            <a href="/" class="logo"><span>NFP</span> DESIGN</a>
            <ul class="menu">
                <li><a href="/#home">홈</a></li>
                <li><a href="/#design">프로젝트</a></li>
                <li><a href="/#about" class="${activeMenu === 'about' ? 'active' : ''}">소개</a></li>
                <li><a href="/#contact" class="${activeMenu === 'contact' ? 'active' : ''}">연락하기</a></li>
                <li><a href="/posts/" class="${activeMenu === 'posts' ? 'active' : ''}">작업 보기</a></li>
                <li><a href="/freeboard/" class="${activeMenu === 'news' ? 'active' : ''}">자유게시판</a></li>
                
            </ul>
            <div class="menu-btn"><i class="fas fa-bars"></i></div>
        </nav>
    </div>
</header>
`;
    
    // 페이지에 헤더 삽입
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
        targetElement.innerHTML = headerHtml;
    } else {
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }
    
    // 모바일 메뉴 토글 기능
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');
    
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function() {
            menu.classList.toggle('active'); // 메뉴의 상태를 토글
        });
    }

    // 각 메뉴 항목에 클릭 이벤트 추가하여 페이지 이동
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 메뉴 클릭 시 'active' 클래스를 메뉴 항목에만 적용
            menuLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
