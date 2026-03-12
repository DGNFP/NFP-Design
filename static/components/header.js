function createHeader(targetElementId = 'header-container', activeMenu = '') {
    // 외부 CSS 로드 (이미 로드된 경우 중복 삽입 방지)
    if (!document.querySelector('link[href$="/css/styles.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/styles.css';
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
                <li><a href="/#contact">연락하기</a></li>
                <li><a href="/categories/">작업 보기</a></li>
                <li><a href="/games/">게임 블로그</a></li>
                <li><a href="/studio">Studio NFP</a></li>
                
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

    // 현재 페이지에 맞는 메뉴 항목에 active 클래스 적용
    const currentPath = window.location.pathname;
    document.querySelectorAll('.menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('/#')) return;
        const linkPath = href.split('#')[0];
        if (linkPath.length > 1 && currentPath.startsWith(linkPath)) {
            link.classList.add('active');
        }
    });

    // 각 메뉴 항목에 클릭 이벤트 추가하여 페이지 이동
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
