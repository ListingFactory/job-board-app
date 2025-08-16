import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create sample companies
  const kakao = await prisma.company.create({
    data: {
      name: '카카오',
      website: 'https://www.kakaocorp.com'
    }
  });

  const naver = await prisma.company.create({
    data: {
      name: '네이버',
      website: 'https://www.navercorp.com'
    }
  });

  const coupang = await prisma.company.create({
    data: {
      name: '쿠팡',
      website: 'https://www.coupang.com'
    }
  });

  const samsung = await prisma.company.create({
    data: {
      name: '삼성전자',
      website: 'https://www.samsung.com'
    }
  });

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@jobboard.com',
      password: hashedPassword,
      name: '관리자',
      role: 'ADMIN'
    }
  });

  const companyAdmin = await prisma.user.create({
    data: {
      email: 'hr@kakao.com',
      password: hashedPassword,
      name: '카카오 HR',
      role: 'COMPANY_ADMIN',
      companyId: kakao.id
    }
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: '김개발자',
      role: 'USER'
    }
  });

  // Create sample jobs
  const jobs = [
    {
      title: '프론트엔드 개발자 (React/Next.js)',
      description: '카카오에서 차세대 웹 서비스를 개발할 프론트엔드 개발자를 모집합니다. React, Next.js, TypeScript 경험이 있으신 분을 찾습니다.',
      companyId: kakao.id
    },
    {
      title: '백엔드 개발자 (Node.js/Python)',
      description: '확장 가능한 백엔드 시스템을 구축할 개발자를 찾습니다. Node.js, Python, 클라우드 환경 경험 우대',
      companyId: kakao.id
    },
    {
      title: '데이터 엔지니어',
      description: '네이버 검색 서비스의 데이터 파이프라인을 구축하고 운영할 데이터 엔지니어를 모집합니다.',
      companyId: naver.id
    },
    {
      title: 'DevOps 엔지니어',
      description: '네이버 클라우드 플랫폼의 인프라를 관리하고 자동화할 DevOps 엔지니어를 찾습니다.',
      companyId: naver.id
    },
    {
      title: '풀스택 개발자',
      description: '쿠팡 이커머스 플랫폼을 개발할 풀스택 개발자를 모집합니다. Java, React, AWS 경험 필수',
      companyId: coupang.id
    },
    {
      title: '모바일 앱 개발자 (iOS/Android)',
      description: '쿠팡 모바일 앱을 개발할 iOS/Android 개발자를 찾습니다. Swift, Kotlin 경험 우대',
      companyId: coupang.id
    },
    {
      title: 'AI/ML 엔지니어',
      description: '삼성전자 AI 연구소에서 차세대 AI 기술을 개발할 엔지니어를 모집합니다.',
      companyId: samsung.id
    },
    {
      title: '임베디드 소프트웨어 개발자',
      description: '삼성 스마트폰의 시스템 소프트웨어를 개발할 임베디드 개발자를 찾습니다.',
      companyId: samsung.id
    },
    {
      title: 'UI/UX 디자이너',
      description: '사용자 중심의 디자인을 통해 최고의 사용자 경험을 만들어갈 디자이너를 모집합니다.',
      companyId: kakao.id
    },
    {
      title: '프로덕트 매니저',
      description: '글로벌 서비스의 제품 기획과 전략을 수립할 프로덕트 매니저를 찾습니다.',
      companyId: naver.id
    }
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  console.log('Database seed completed!');
  console.log(`Created ${jobs.length} jobs for 4 companies`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });