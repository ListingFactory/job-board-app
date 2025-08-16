'use client';

import { useEffect, useState } from 'react';
import { Search, Building2, MapPin, Users, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Company } from '@/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/companies');
      const data = await response.json();
      setCompanies(data || []);
    } catch (error) {
      console.error('Companies 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">기업정보</h1>
          
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center px-4 py-2 border rounded-md">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="기업명을 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">로딩 중...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {company.name}
                    </h3>
                    <p className="text-gray-600 text-sm">기술 · IT 서비스</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      서울특별시
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      채용중 {(company as any)._count?.jobs || 0}건
                    </div>
                    {company.website && (
                      <div className="flex items-center justify-center text-sm text-primary-600">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          홈페이지
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition-colors text-sm">
                      채용공고 보기
                    </button>
                    <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-md transition-colors text-sm">
                      기업 정보 자세히
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredCompanies.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}