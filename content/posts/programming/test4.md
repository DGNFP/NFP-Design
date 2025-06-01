---
title: "모던 카페 웹사이트 퍼블리싱"
date: 2025-06-01T15:30:00+09:00
categories: ["programming"]
subCategory: "퍼블리싱"
demoCode: |
  <!DOCTYPE html>
  <html lang="ko">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cafe Mocha - 특별한 커피 경험</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #2c3e50;
              background: #f8f9fa;
          }
          
          .header {
              background: linear-gradient(135deg, #6f4e37, #8b4513, #a0522d);
              color: white;
              padding: 3rem 0;
              text-align: center;
              position: relative;
              overflow: hidden;
          }
          
          .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.08)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="70" cy="80" r="2.5" fill="rgba(255,255,255,0.05)"/></svg>');
              animation: float 20s ease-in-out infinite;
          }
          
          @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
          }
          
          .header h1 {
              font-size: 3.5rem;
              margin-bottom: 1rem;
              text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
              position: relative;
              z-index: 1;
          }
          
          .header p {
              font-size: 1.3rem;
              opacity: 0.9;
              position: relative;
              z-index: 1;
          }
          
          .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 2rem;
          }
          
          .menu-section {
              padding: 5rem 0;
              background: white;
          }
          
          .section-title {
              text-align: center;
              font-size: 2.8rem;
              color: #6f4e37;
              margin-bottom: 3rem;
              position: relative;
          }
          
          .section-title::after {
              content: '';
              width: 80px;
              height: 4px;
              background: linear-gradient(90deg, #6f4e37, #a0522d);
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              border-radius: 2px;
          }
          
          .menu-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 2rem;
              margin-top: 3rem;
          }
          
          .menu-item {
              background: white;
              border-radius: 15px;
              padding: 2rem;
              box-shadow: 0 8px 30px rgba(0,0,0,0.08);
              transition: all 0.3s ease;
              border: 1px solid #f0f0f0;
              position: relative;
              overflow: hidden;
          }
          
          .menu-item::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 4px;
              background: linear-gradient(90deg, #6f4e37, #a0522d);
              transform: scaleX(0);
              transition: transform 0.3s ease;
          }
          
          .menu-item:hover {
              transform: translateY(-8px);
              box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          }
          
          .menu-item:hover::before {
              transform: scaleX(1);
          }
          
          .menu-item h3 {
              color: #6f4e37;
              margin-bottom: 1rem;
              font-size: 1.4rem;
              font-weight: 600;
          }
          
          .menu-item p {
              color: #666;
              margin-bottom: 1.5rem;
              line-height: 1.6;
          }
          
          .price {
              font-weight: bold;
              color: #a0522d;
              font-size: 1.3rem;
              text-align: right;
          }
          
          .about {
              padding: 5rem 0;
              background: linear-gradient(135deg, #f8f9fa, #e9ecef);
              text-align: center;
          }
          
          .about p {
              font-size: 1.2rem;
              max-width: 700px;
              margin: 0 auto;
              color: #555;
              line-height: 1.8;
          }
          
          .footer {
              background: #2c3e50;
              color: white;
              text-align: center;
              padding: 3rem 0;
          }
          
          .footer p {
              margin-bottom: 0.5rem;
              opacity: 0.9;
          }
          
          @media (max-width: 768px) {
              .header h1 {
                  font-size: 2.5rem;
              }
              
              .menu-grid {
                  grid-template-columns: 1fr;
              }
              
              .container {
                  padding: 0 1rem;
              }
              
              .section-title {
                  font-size: 2.2rem;
              }
          }
      </style>
  </head>
  <body>
      <header class="header">
          <div class="container">
              <h1>☕ Cafe Mocha</h1>
              <p>특별한 커피와 함께하는 소중한 순간</p>
          </div>
      </header>
      
      <section class="menu-section">
          <div class="container">
              <h2 class="section-title">시그니처 메뉴</h2>
              <div class="menu-grid">
                  <div class="menu-item">
                      <h3>🌟 프리미엄 모카라떼</h3>
                      <p>벨기에 초콜릿과 에스프레소의 완벽한 조화로 만든 시그니처 음료입니다.</p>
                      <div class="price">₩6,500</div>
                  </div>
                  <div class="menu-item">
                      <h3>🥛 크림 카페라떼</h3>
                      <p>부드러운 우유 거품과 진한 에스프레소가 어우러진 클래식한 맛입니다.</p>
                      <div class="price">₩5,800</div>
                  </div>
                  <div class="menu-item">
                      <h3>🍰 수제 치즈케이크</h3>
                      <p>매일 직접 만드는 신선한 치즈케이크로 커피와 완벽한 페어링을 자랑합니다.</p>
                      <div class="price">₩7,200</div>
                  </div>
                  <div class="menu-item">
                      <h3>🧊 콜드브루 원액</h3>
                      <p>18시간 저온 추출한 프리미엄 콜드브루로 깔끔하고 풍부한 맛입니다.</p>
                      <div class="price">₩4,800</div>
                  </div>
              </div>
          </div>
      </section>
      
      <section class="about">
          <div class="container">
              <h2 class="section-title">About Cafe Mocha</h2>
              <p>
                  2015년부터 시작된 Cafe Mocha는 최상급 원두와 정성스러운 손길로 
                  고객님께 특별한 커피 경험을 선사하고 있습니다. 
                  편안하고 아늑한 공간에서 맛있는 커피와 디저트를 즐기며 
                  소중한 사람들과 함께하는 행복한 시간을 만들어보세요.
              </p>
          </div>
      </section>
      
      <footer class="footer">
          <div class="container">
              <p>&copy; 2025 Cafe Mocha. All rights reserved.</p>
              <p>📍 서울시 강남구 논현로 456 | ☎️ 02-9876-5432</p>
              <p>⏰ 평일 07:00-22:00 | 주말 08:00-23:00</p>
          </div>
      </footer>
  </body>
  </html>
---

## 프로젝트 개요

모던한 디자인의 카페 브랜드 웹사이트를 반응형으로 퍼블리싱했습니다. 사용자 경험을 최우선으로 고려하여 직관적이고 세련된 인터페이스를 구현했습니다.

## 주요 기능

### 🎨 디자인 특징
- **모던 그라데이션**: 따뜻한 브라운 톤의 그라데이션 배경
- **마이크로 애니메이션**: 호버 효과와 부드러운 전환 애니메이션
- **카드 기반 레이아웃**: 정보를 체계적으로 구성한 카드 디자인
- **시각적 계층구조**: 명확한 타이포그래피와 여백 시스템

### 📱 반응형 설계
- **Mobile First**: 모바일 우선 설계 접근법
- **Flexible Grid**: CSS Grid를 활용한 유연한 레이아웃
- **Adaptive Typography**: 디바이스별 최적화된 폰트 크기
- **Touch-Friendly**: 터치 인터페이스 최적화

### ⚡ 성능 최적화
- **Pure CSS**: 외부 라이브러리 없이 순수 CSS만 사용
- **Optimized Animation**: GPU 가속을 활용한 부드러운 애니메이션
- **Semantic HTML**: 웹 접근성과 SEO를 고려한 마크업
- **Lightweight**: 빠른 로딩 속도를 위한 최적화

## 기술 스택

- **HTML5**: 시맨틱 웹 표준 준수
- **CSS3**: 최신 CSS 기능 활용 (Grid, Flexbox, Custom Properties)
- **Responsive Design**: 모든 디바이스 호환
- **Web Accessibility**: WCAG 2.1 가이드라인 준수

## 브라우저 호환성

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 모바일 브라우저 완벽 지원

이 프로젝트를 통해 사용자 중심의 웹 디자인과 최신 웹 기술의 효과적인 활용법을 실습할 수 있었습니다.