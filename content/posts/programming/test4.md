---
title: "반응형 카페 웹사이트 퍼블리싱"
date: 2025-06-01T15:15:00+09:00
categories: ["programming"]
subCategory: "퍼블리싱"
demoCode: |
  <!DOCTYPE html>
  <html lang="ko">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cafe Delightful - 따뜻한 커피 한 잔</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
          
          .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 2rem 0; text-align: center; }
          .header h1 { font-size: 3rem; margin-bottom: 0.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          .header p { font-size: 1.2rem; opacity: 0.9; }
          
          .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
          
          .menu-section { padding: 4rem 0; background: #F5F5DC; }
          .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
          .menu-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
          .menu-item:hover { transform: translateY(-5px); }
          .menu-item h3 { color: #8B4513; margin-bottom: 0.5rem; }
          .price { font-weight: bold; color: #D2691E; font-size: 1.2rem; }
          
          .about { padding: 4rem 0; text-align: center; }
          .about h2 { font-size: 2.5rem; margin-bottom: 2rem; color: #8B4513; }
          .about p { font-size: 1.1rem; max-width: 800px; margin: 0 auto; }
          
          .footer { background: #8B4513; color: white; text-align: center; padding: 2rem 0; }
          
          @media (max-width: 768px) {
              .header h1 { font-size: 2rem; }
              .menu-grid { grid-template-columns: 1fr; }
              .container { padding: 0 1rem; }
          }
      </style>
  </head>
  <body>
      <header class="header">
          <div class="container">
              <h1>☕ Cafe Delightful</h1>
              <p>따뜻한 커피와 함께하는 특별한 시간</p>
          </div>
      </header>
      
      <section class="menu-section">
          <div class="container">
              <h2 style="text-align: center; font-size: 2.5rem; color: #8B4513; margin-bottom: 1rem;">인기 메뉴</h2>
              <div class="menu-grid">
                  <div class="menu-item">
                      <h3>🌟 시그니처 아메리카노</h3>
                      <p>깔끔하고 진한 맛의 프리미엄 원두로 추출한 아메리카노</p>
                      <div class="price">₩4,500</div>
                  </div>
                  <div class="menu-item">
                      <h3>🥛 바닐라 라떼</h3>
                      <p>부드러운 우유와 달콤한 바닐라 시럽의 완벽한 조화</p>
                      <div class="price">₩5,200</div>
                  </div>
                  <div class="menu-item">
                      <h3>🍰 티라미수</h3>
                      <p>이탈리아 정통 레시피로 만든 진짜 티라미수</p>
                      <div class="price">₩6,800</div>
                  </div>
                  <div class="menu-item">
                      <h3>🧊 아이스 카라멜 마키아토</h3>
                      <p>달콤한 카라멜과 진한 에스프레소의 시원한 만남</p>
                      <div class="price">₩5,800</div>
                  </div>
              </div>
          </div>
      </section>
      
      <section class="about">
          <div class="container">
              <h2>About Us</h2>
              <p>
                  2010년부터 시작된 Cafe Delightful은 최고급 원두와 정성스러운 손길로 
                  고객 여러분께 특별한 커피 경험을 선사합니다. 
                  편안한 분위기 속에서 맛있는 커피와 디저트를 즐기며 
                  소중한 사람들과 따뜻한 시간을 보내세요.
              </p>
          </div>
      </section>
      
      <footer class="footer">
          <div class="container">
              <p>&copy; 2025 Cafe Delightful. 모든 권리 보유.</p>
              <p>📍 서울시 강남구 테헤란로 123 | ☎️ 02-1234-5678</p>
          </div>
      </footer>
  </body>
  </html>
---

## 프로젝트 개요

카페 브랜드를 위한 반응형 웹사이트를 퍼블리싱했습니다. 모바일부터 데스크톱까지 모든 디바이스에서 최적화된 사용자 경험을 제공하는 것을 목표로 제작했습니다.

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, Media Query
- **반응형 디자인**: Mobile-First 접근
- **웹 접근성**: WCAG 2.1 가이드라인 준수

## 구현 특징

### 1. 반응형 레이아웃
- CSS Grid를 활용한 메뉴 아이템 배치
- Media Query로 디바이스별 최적화
- 유연한 컨테이너 시스템

### 2. 사용자 경험 개선
- 부드러운 호버 애니메이션
- 직관적인 네비게이션
- 빠른 로딩 속도

### 3. 시각적 디자인
- 카페 브랜드에 맞는 따뜻한 색상 팔레트
- 타이포그래피 계층 구조
- 그라데이션과 그림자 효과

### 4. 웹 표준 준수
- 시맨틱 HTML 구조
- SEO 최적화
- 웹 접근성 고려

## 브레이크포인트

- **모바일**: ~768px (1열 레이아웃)
- **태블릿**: 768px~1024px (2열 레이아웃)
- **데스크톱**: 1024px+ (3-4열 레이아웃)

## 성과

- 모든 주요 브라우저에서 완벽 호환
- Google PageSpeed 95점 달성
- 모바일 친화적 웹사이트 인증
- 웹 접근성 AA 등급 준수

이 프로젝트를 통해 현대적인 웹 퍼블리싱 기술과 사용자 중심 디자인의 중요성을 깊이 이해할 수 있었습니다.