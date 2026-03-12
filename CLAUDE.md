# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

NFP 디자인 회사의 포트폴리오 및 블로그 사이트. Hugo 정적 사이트 생성기 기반, Netlify CMS로 콘텐츠 관리, Netlify로 배포.

- **사이트 URL:** https://nfpdesign.co.kr
- **Hugo 버전:** 0.147.5
- **언어:** 한국어 (ko), Asia/Seoul 타임존

## 주요 명령어

```bash
# 개발 서버 실행
hugo server

# 프로덕션 빌드
hugo --gc --minify --baseURL https://nfpdesign.co.kr

# 미래/만료 글 포함하여 개발 서버 실행 (config.yaml에서 이미 활성화됨)
hugo server --buildFuture --buildExpired
```

## 아키텍처 구조

### 테마 없음
`themes/` 디렉토리는 비어있다. 모든 템플릿은 `layouts/`에서 직접 관리.

### 레이아웃 구조
- `layouts/_default/baseof.html` - 모든 페이지의 기본 구조 (메타태그, SEO, GA4, 보안 헤더)
- `layouts/_default/single.html` - 개별 포스트 페이지
- `layouts/_default/list.html` - 목록/카테고리 페이지
- `layouts/partials/` - 재사용 부분 템플릿 (header, footer, floating, analytics)
- 각 콘텐츠 섹션별로 `layouts/{섹션}/list.html` 존재

### 콘텐츠 섹션
- `content/categories/` - 디자인 포트폴리오 (ad, content, creative, game-ad, programming, project, streaming, video, web, youtube)
- `content/studio/` - 웹 도구 및 미니게임 30+개
- `content/games/` - 게임 블로그 (FC Online 등)
- `content/blog/` - 일상, 가이드, 팁, 리소스, 프로젝트 글
- `content/news/`, `content/notice/` - 뉴스 및 공지

### 정적 파일
- `static/css/` - 스타일시트 (styles.css: 메인, studiopage.css: 가장 큰 파일 307KB)
- `static/js/` - 기능별 JS (filter.js, lightbox.js, studiopage.js 등)
- `static/components/` - 재사용 JS 컴포넌트 (header.js, footer.js, floating.js 등)
- `static/img/uploads/` - 업로드 이미지 (WebP 자동 변환됨)
- `static/admin/` - Netlify CMS UI

### 이미지 자동 처리
`.github/workflows/compress-images.yml`에서 `static/img/uploads/` 또는 `content/`에 이미지가 push되면 자동으로 WebP 변환 및 URL 인코딩된 파일명 복사본 생성 후 커밋.

## 콘텐츠 작성 규칙

### Front Matter 구조
포트폴리오 글은 Netlify CMS(`static/admin/config.yml`)의 컬렉션 스키마를 따름. 주요 필드:
- `title`, `date`, `draft`
- `categories`, `tags`
- `thumbnail` (이미지 경로)
- 섹션별 추가 필드 (subcategory 등)

### Markdown 설정
- `markup.goldmark.renderer.unsafe: true` → HTML 직접 삽입 가능
- `linkify: false` → URL 자동 링크 변환 비활성화
- `wrapStandAloneImageWithinParagraph: false` → 이미지 `<p>` 태그 래퍼 방지

## 배포

Netlify 자동 배포. `netlify.toml`의 캐싱 전략:
- CSS/JS/이미지: 1년 캐시 (`max-age=31536000`)
- robots.txt, sitemap.xml: 1시간 캐시

`public/` 디렉토리는 빌드 결과물로 git에 포함되어 있음 (389MB).
