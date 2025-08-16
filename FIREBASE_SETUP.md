# 🔥 Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `jobboard-app`)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2. Firebase 서비스 활성화

### Authentication 설정
1. 콘솔에서 "Authentication" → "시작하기" 클릭
2. "Sign-in method" 탭에서 다음 방법들 활성화:
   - **이메일/비밀번호**: 활성화
   - **Google**: 활성화 (프로젝트 지원 이메일 설정)

### Firestore Database 설정
1. "Firestore Database" → "데이터베이스 만들기" 클릭
2. **테스트 모드**로 시작 (나중에 보안 규칙 적용)
3. 지역 선택 (asia-northeast3 권장 - 서울)

### Storage 설정
1. "Storage" → "시작하기" 클릭
2. **테스트 모드**로 시작
3. 지역은 Firestore와 동일하게 설정

## 3. Web 앱 구성

1. 프로젝트 개요에서 **웹** 아이콘(`</>`) 클릭
2. 앱 닉네임 입력 (예: `jobboard-web`)
3. Firebase Hosting 설정 (선택사항)
4. 구성 정보 복사

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 4. 서비스 계정 키 생성

1. "프로젝트 설정" → "서비스 계정" 탭
2. "새 비공개 키 생성" 클릭
3. JSON 파일 다운로드 및 안전한 위치에 저장

## 5. 환경 변수 설정

### 프론트엔드 (.env.local)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 백엔드 (.env)
```bash
# 기존 설정
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key

# Firebase Admin SDK 구성
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# 서버 설정
PORT=3001
FRONTEND_URL=http://localhost:3001
```

⚠️ **중요**: 실제 값들로 교체해야 합니다!

## 6. 보안 규칙 적용

### Firestore 규칙
```javascript
// 프로젝트 루트의 firestore.rules 파일을 Firebase에 배포
firebase deploy --only firestore:rules
```

### Storage 규칙
```javascript
// 프로젝트 루트의 storage.rules 파일을 Firebase에 배포
firebase deploy --only storage
```

## 7. 실행 방법

### Firebase 버전 실행

1. **백엔드 서버 (Firebase)**:
```bash
cd backend
npm run dev:firebase
```

2. **프론트엔드**:
```bash
cd frontend
npm run dev
```

3. **Firebase 페이지 접속**:
   - http://localhost:3001/firebase

### 기존 SQLite 버전 실행

1. **백엔드 서버 (SQLite)**:
```bash
cd backend
npm run dev
```

2. **프론트엔드**:
```bash
cd frontend
npm run dev
```

3. **기본 페이지 접속**:
   - http://localhost:3001

## 8. 테스트 데이터 추가

Firebase Console에서 직접 데이터를 추가하거나, 웹 인터페이스에서 회원가입 후 테스트하세요.

### 샘플 회사 데이터 (Firestore)
```javascript
// companies 컬렉션
{
  name: "카카오",
  website: "https://www.kakaocorp.com",
  description: "혁신적인 기술로 더 나은 세상을 만들어가는 카카오",
  location: "서울",
  industry: "IT",
  size: "대기업",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## 9. 배포 준비

### Firebase Hosting
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 초기화
firebase init

# 배포
firebase deploy
```

### 환경 변수 (프로덕션)
- Vercel, Netlify 등에서 환경 변수 설정
- 보안을 위해 민감한 정보는 절대 커밋하지 말것

## 🚀 완료!

이제 Firebase와 완전히 통합된 구인구직 플랫폼이 준비되었습니다!

### 주요 기능:
- ✅ Firebase Authentication (이메일/Google 로그인)
- ✅ Firestore Database (실시간 데이터)
- ✅ Firebase Storage (파일 업로드)
- ✅ 보안 규칙 적용
- ✅ 백엔드 API (Firebase Admin SDK)
- ✅ 완전한 프론트엔드 통합