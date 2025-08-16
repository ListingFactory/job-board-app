'use client';

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색:', { searchTerm, location });
  };

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            꿈의 직장을 찾아보세요
          </h1>
          <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
            수천 개의 채용공고에서 당신에게 맞는 완벽한 기회를 발견하세요
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 rounded-md">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="직무, 회사명을 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              
              <div className="flex-1 flex items-center px-4 py-3 rounded-md border-l border-gray-200">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="지역을 입력하세요"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                검색
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['프론트엔드', '백엔드', '데이터사이언스', '디자인', 'PM'].map((tag) => (
              <button
                key={tag}
                className="bg-primary-500 hover:bg-primary-400 text-white px-4 py-2 rounded-full text-sm transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}