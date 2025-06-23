---
title: Studio NFP - NFP Design 브랜딩
subtitle: 두개의 브랜드를 묶는 홀딩스
date: 2025-06-24T07:26:00.000Z
categories:
  - programming
subCategory: 웹 퍼블리싱
tags:
  - 브랜딩
  - HTML5
  - CSS3
  - NFP 디자인
  - NFP Design
demoTheme: default
demoCode:
  lang: html
  code: >-
    <!DOCTYPE html>

    <html lang="ko">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NFP 브랜드 그라데이션 시뮬레이션</title>
        <style>
            body {
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
                font-family: 'Arial', sans-serif;
                color: white;
                min-height: 100vh;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            h1 {
                text-align: center;
                font-size: 2.5em;
                margin-bottom: 50px;
                color: #01ff75;
                text-shadow: 0 0 20px rgba(1, 255, 117, 0.5);
            }
            
            .gradient-section {
                margin-bottom: 60px;
                padding: 30px;
                background: rgba(0,0,0,0.3);
                border-radius: 20px;
                border: 1px solid rgba(255,255,255,0.1);
            }
            
            .gradient-title {
                font-size: 1.5em;
                margin-bottom: 30px;
                text-align: center;
                color: #ffffff;
            }
            
            .gradient-bar {
                height: 100px;
                border-radius: 15px;
                margin-bottom: 30px;
                box-shadow: 0 0 30px rgba(255,255,255,0.2);
            }
            
            .gradient1 {
                background: linear-gradient(90deg, #01ff75, #00f0ff, #fff200);
            }
            
            .gradient2 {
                background: linear-gradient(90deg, #fff200, #01ff75, #00f0ff);
            }
            
            .color-labels {
                display: flex;
                justify-content: space-between;
                font-size: 0.9em;
                color: #cccccc;
                margin-top: 10px;
            }
            
            .logo-simulation {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                gap: 30px;
                margin-top: 40px;
            }
            
            .logo-card {
                background: rgba(0,0,0,0.5);
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.1);
                min-width: 250px;
            }
            
            .logo-text {
                font-size: 2em;
                font-weight: bold;
                margin-bottom: 10px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
            }
            
            .logo1 {
                color: white;
            }
            
            .logo1 .nfp-gradient {
                background: linear-gradient(90deg, #01ff75, #00f0ff, #fff200);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .logo2 {
                color: white;
            }
            
            .logo2 .nfp-gradient {
                background: linear-gradient(90deg, #fff200, #01ff75, #00f0ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .brand-description {
                color: #aaaaaa;
                font-size: 0.9em;
                margin-top: 15px;
            }
            
            .color-meaning {
                display: flex;
                justify-content: space-around;
                margin-top: 30px;
                text-align: center;
            }
            
            .color-item {
                padding: 15px;
                border-radius: 10px;
                min-width: 120px;
            }
            
            .neon-green {
                background: rgba(1, 255, 117, 0.2);
                border: 1px solid #01ff75;
            }
            
            .neon-blue {
                background: rgba(0, 240, 255, 0.2);
                border: 1px solid #00f0ff;
            }
            
            .neon-yellow {
                background: rgba(255, 242, 0, 0.2);
                border: 1px solid #fff200;
            }
            
            .workflow {
                margin-top: 40px;
                padding: 30px;
                background: rgba(0,0,0,0.3);
                border-radius: 15px;
                text-align: center;
            }
            
            .workflow-title {
                font-size: 1.3em;
                margin-bottom: 20px;
                color: #ffffff;
            }
            
            .workflow-arrow {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                font-size: 1.1em;
            }
            
            .arrow {
                color: #666;
                font-size: 1.5em;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Studio NFP 그라데이션 시뮬레이션</h1>
            
            <div class="gradient-section">
                <div class="gradient-title">옵션 1: 네온그린 → 네온블루 → 네온옐로</div>
                <div class="gradient-bar gradient1"></div>
                <div class="color-labels">
                    <span>디자인 (#01ff75)</span>
                    <span>프로그래밍 (#00f0ff)</span>
                    <span>게임 (#fff200)</span>
                </div>
            </div>
            
            <div class="gradient-section">
                <div class="gradient-title">옵션 2: 네온옐로 → 네온그린 → 네온블루</div>
                <div class="gradient-bar gradient2"></div>
                <div class="color-labels">
                    <span>게임 (#fff200)</span>
                    <span>디자인 (#01ff75)</span>
                    <span>프로그래밍 (#00f0ff)</span>
                </div>
            </div>
            
            <div class="logo-simulation">
                <div class="logo-card">
                    <div class="logo-text logo1">Studio <span class="nfp-gradient">NFP</span></div>
                    <div class="brand-description">그라데이션 옵션 1<br/>워크플로우 순서</div>
                </div>
                
                <div class="logo-card">
                    <div class="logo-text logo2">Studio <span class="nfp-gradient">NFP</span></div>
                    <div class="brand-description">그라데이션 옵션 2<br/>자연스러운 색상 전환</div>
                </div>
            </div>
            
            <div class="color-meaning">
                <div class="color-item neon-green">
                    <strong>네온그린</strong><br/>
                    디자인<br/>
                    <small>창의성 & 혁신</small>
                </div>
                <div class="color-item neon-blue">
                    <strong>네온블루</strong><br/>
                    프로그래밍<br/>
                    <small>기술 & 논리</small>
                </div>
                <div class="color-item neon-yellow">
                    <strong>네온옐로</strong><br/>
                    게임<br/>
                    <small>재미 & 에너지</small>
                </div>
            </div>
            
            <div class="workflow">
                <div class="workflow-title">옵션 1 워크플로우</div>
                <div class="workflow-arrow">
                    <span style="color: #01ff75;">디자인</span>
                    <span class="arrow">→</span>
                    <span style="color: #00f0ff;">프로그래밍</span>
                    <span class="arrow">→</span>
                    <span style="color: #fff200;">게임</span>
                </div>
            </div>
        </div>
    </body>

    </html>
---
세개의 컬러가 상징하는 의미

디자인 (네온그린 ) :  01ff75

프로그래밍 ( 네온블루) :  00f0ff

게임 ( 네온옐로) : fff200

NFP 디자인의 네온그린과 NFP 게임즈의 네온블루~옐로 그라데이션

세 컬러의 그라데이션이 어우러진 스튜디오 NFP의 브랜딩 기획입니다.
