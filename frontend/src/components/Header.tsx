'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const openLoginModal = () => {
    setAuthModalTab('login');
    setShowAuthModal(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900">JobBoard</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/jobs" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                채용공고
              </Link>
              <Link href="/companies" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                기업정보
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                소개
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.name || user.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4 mr-2" />
                        프로필 설정
                      </Link>
                      {(user.role === 'ADMIN' || user.role === 'COMPANY_ADMIN') && (
                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Settings className="h-4 w-4 mr-2" />
                          관리 대시보드
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={openLoginModal}
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    로그인
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab={authModalTab}
      />
    </>
  );
}