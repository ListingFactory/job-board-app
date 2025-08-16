# 🚀 JobBoard - 구인구직 CMS 플랫폼

완전한 기능을 갖춘 현대적인 구인구직 플랫폼입니다. Firebase와 완전히 통합되어 있어 확장성과 보안성을 보장합니다.

## ✨ 주요 기능

### 🏠 **유기적인 홈페이지**
- 세련된 검색 및 필터링 시스템
- 실시간 통계 대시보드
- 추천 채용공고 섹션
- 주요 파트너 기업 소개

### 🔐 **사용자 인증**
- 이메일/비밀번호 로그인
- Google 소셜 로그인
- 역할별 권한 관리 (USER, ADMIN, COMPANY_ADMIN)
- JWT 토큰 기반 보안

### 💼 **채용공고 관리**
- 채용공고 CRUD 작업
- 실시간 검색 및 필터링
- 카테고리별 분류
- 지원서 접수 관리

### 🏢 **기업 관리**
- 기업 프로필 관리
- 회사별 채용공고 관리
- 지원자 현황 추적

### 📋 **지원서 시스템**
- 온라인 지원서 작성
- 이력서 파일 업로드
- 지원 현황 추적
- 상태별 관리

### 🎛️ **관리자 대시보드**
- 통계 및 분석
- 사용자 관리
- 컨텐츠 관리
- 권한 제어

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 CSS
- **Lucide React** - 아이콘 라이브러리

### Backend
- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **TypeScript** - 타입 안정성

### Database & Services
- **Firebase Firestore** - NoSQL 데이터베이스
- **Firebase Authentication** - 사용자 인증
- **Firebase Storage** - 파일 저장소
- **Firebase Admin SDK** - 서버 사이드 관리

### Additional
- **Prisma** - ORM (SQLite 버전용)
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Firebase 계정

### 1. 저장소 클론
```bash
git clone https://github.com/YOUR_USERNAME/job_board_app.git
cd job_board_app
```

### 2. 의존성 설치
```bash
# 백엔드
cd backend
npm install

# 프론트엔드
cd ../frontend
npm install
```

### 3. 환경 변수 설정

#### Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication, Firestore, Storage 활성화
3. 웹 앱 구성 및 서비스 계정 키 생성

#### 환경 변수 파일 생성
```bash
# 프론트엔드
cp frontend/.env.example frontend/.env.local

# 백엔드  
cp backend/.env.example backend/.env
```

실제 Firebase 구성 값으로 교체하세요. 자세한 설정은 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)를 참조하세요.

### 4. 실행

#### Firebase 버전 (권장)
```bash
# 백엔드 서버
cd backend
npm run dev:firebase

# 프론트엔드 (새 터미널)
cd frontend
npm run dev
```

#### SQLite 버전
```bash
# 백엔드 서버
cd backend
npm run dev

# 프론트엔드 (새 터미널)
cd frontend
npm run dev
```

### 5. 접속
- **Firebase 버전**: http://localhost:3001/firebase
- **SQLite 버전**: http://localhost:3001

## 📁 프로젝트 구조

```
job_board_app/
├── frontend/                 # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/             # App Router 페이지
│   │   ├── components/      # React 컴포넌트
│   │   ├── lib/            # 유틸리티 및 설정
│   │   └── types/          # TypeScript 타입
│   └── package.json
├── backend/                  # Express.js 백엔드
│   ├── src/
│   │   ├── firebase-*      # Firebase 관련 파일
│   │   ├── index.ts        # SQLite 서버
│   │   └── seed.ts         # 시드 데이터
│   ├── prisma/             # Prisma 스키마
│   └── package.json
├── firestore.rules          # Firestore 보안 규칙
├── storage.rules            # Storage 보안 규칙
└── FIREBASE_SETUP.md        # Firebase 설정 가이드
```

## 🔐 보안

- **Firestore Security Rules**: 데이터베이스 접근 제어
- **Storage Security Rules**: 파일 업로드 제어  
- **Authentication**: JWT 토큰 기반 인증
- **환경 변수**: 민감한 정보 보호
- **역할 기반 권한**: 사용자별 기능 제한

## 🚀 배포

### Vercel (프론트엔드)
```bash
cd frontend
npm run build
vercel --prod
```

### Railway/Render (백엔드)
```bash
cd backend
npm run build
# 플랫폼별 배포 명령어
```

### Firebase Hosting
```bash
firebase deploy
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/YOUR_USERNAME/job_board_app](https://github.com/YOUR_USERNAME/job_board_app)

## 🙏 감사의 말

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/)