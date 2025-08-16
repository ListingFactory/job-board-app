import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">JobBoard</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              최고의 구인구직 플랫폼에서 꿈의 직장을 찾고, 최적의 인재를 만나보세요.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">구직자</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-gray-400 hover:text-white">채용공고</Link></li>
              <li><Link href="/companies" className="text-gray-400 hover:text-white">기업정보</Link></li>
              <li><Link href="/resume" className="text-gray-400 hover:text-white">이력서 작성</Link></li>
              <li><Link href="/tips" className="text-gray-400 hover:text-white">취업 팁</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">기업</h3>
            <ul className="space-y-2">
              <li><Link href="/employer" className="text-gray-400 hover:text-white">채용 서비스</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white">요금제</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white">고객지원</Link></li>
              <li><Link href="/enterprise" className="text-gray-400 hover:text-white">기업 솔루션</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 JobBoard. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}