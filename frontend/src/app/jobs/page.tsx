'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Building2, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Job } from '@/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    company: '',
    location: '',
    type: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.company) params.append('company', filters.company);
      
      const response = await fetch(`http://localhost:3000/api/jobs?${params}`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Jobs 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">채용공고</h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center px-4 py-2 border rounded-md">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="직무, 기업명을 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none"
                />
              </div>
              
              <select
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
                className="px-4 py-2 border rounded-md outline-none"
              >
                <option value="">모든 기업</option>
                <option value="카카오">카카오</option>
                <option value="네이버">네이버</option>
                <option value="쿠팡">쿠팡</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="px-4 py-2 border rounded-md outline-none"
              >
                <option value="">모든 형태</option>
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="인턴">인턴</option>
              </select>
              
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                검색
              </button>
            </div>
          </form>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">로딩 중...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.company?.name || '회사명'}</h3>
                          <p className="text-sm text-gray-500">기술 · IT</p>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          서울
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          정규직
                        </div>
                        <span>연봉 4000-6000만원</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors">
                        지원하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {jobs.length === 0 && (
                <div className="text-center py-12">
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