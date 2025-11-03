   // 스크롤 이벤트 - 헤더 스타일 변경
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.padding = '10px 0';
                header.style.background = 'rgba(5, 5, 5, 0.9)';
            } else {
                header.style.padding = '20px 0';
                header.style.background = 'rgba(10, 10, 10, 0.7)';
            }
        });

        // 스크롤 애니메이션
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // 애니메이션 요소 선택
        const sections = document.querySelectorAll('section');
        const featureCards = document.querySelectorAll('.feature-card');
        const gameCards = document.querySelectorAll('.game-card');

        // 초기 스타일 설정 및 Observer 등록
        sections.forEach((section, index) => {
            if (index > 0) { // 첫 번째 섹션(Hero)은 제외
                section.style.opacity = 0;
                section.style.transform = 'translateY(50px)';
                section.style.transition = 'all 0.8s ease-out';
                observer.observe(section);
            }
        });

        featureCards.forEach((card, index) => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
            observer.observe(card);
        });

        gameCards.forEach((card, index) => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
            observer.observe(card);
        });

        // 부드러운 스크롤
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            });
        });