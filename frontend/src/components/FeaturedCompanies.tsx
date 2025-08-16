'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Users } from 'lucide-react';
import { Company } from '@/types';

export default function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/companies')
      .then(res => res.json())
      .then(data => {
        setCompanies(data.slice(0, 8));
        setLoading(false);
      })
      .catch(err => {
        console.error('Companies 로딩 실패:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">로딩 중...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            주요 파트너 기업
          </h2>
          <p className="text-lg text-gray-600">
            우수한 기업들과 함께 성장하세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {company.name}
              </h3>
              
              <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                서울
              </div>
              
              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <Users className="h-4 w-4 mr-1" />
                채용중 {(company as any)._count?.jobs || 0}건
              </div>
              
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md text-sm transition-colors">
                기업 정보 보기
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-md font-medium transition-colors">
            모든 기업 보기
          </button>
        </div>
      </div>
    </section>
  );
}