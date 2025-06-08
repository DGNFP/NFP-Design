---
title: "Node.js Express API 서버 구축"
subtitle: 소제목 확인용 디버깅깅
date: 2025-06-01T14:30:00+09:00
categories: ["programming"]
subCategory: "백엔드"
images: []
---

## 프로젝트 개요

Node.js와 Express를 활용한 REST API 서버를 구축했습니다. 사용자 인증, 데이터베이스 연동, JWT 토큰 기반 인증 시스템을 포함한 완전한 백엔드 솔루션입니다.

## 주요 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: bcrypt, helmet, cors

## 구현 기능

### 1. 사용자 인증 시스템
- 회원가입/로그인 API
- JWT 토큰 기반 인증
- 비밀번호 암호화 (bcrypt)
- 토큰 갱신 기능

### 2. RESTful API 설계
- CRUD 작업을 위한 표준 HTTP 메서드
- 적절한 상태 코드 반환
- 일관된 JSON 응답 구조
- API 버저닝 적용

### 3. 데이터베이스 모델링
- MongoDB를 활용한 NoSQL 설계
- Mongoose ODM으로 스키마 정의
- 관계형 데이터 처리 (populate)
- 인덱싱 최적화

### 4. 보안 강화
- CORS 정책 설정
- Helmet으로 보안 헤더 적용
- Rate limiting 구현
- 입력 데이터 검증 및 sanitization

## 파일 구조

```
backend-api/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── config/
├── tests/
└── package.json
```

## 성과 및 개선점

**성과:**
- 안정적인 API 서버 구축 완료
- 보안 모범 사례 적용
- 확장 가능한 아키텍처 설계

**개선점:**
- Redis를 활용한 세션 관리
- 로그 시스템 고도화
- 마이크로서비스 아키텍처 적용 검토

이 프로젝트를 통해 백엔드 개발의 핵심 요소들을 체계적으로 학습하고 적용할 수 있었습니다.