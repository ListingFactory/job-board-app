'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Job } from '@/lib/firestoreServices';
import { getJobs } from '@/lib/firestoreServices';
import { useFirebaseAuth } from './FirebaseAuthContext';
import FirebaseApplicationModal from './FirebaseApplicationModal';

export default function FirebaseFeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { user } = useFirebaseAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { jobs } = await getJobs({ limitCount: 6 });
      setJobs(jobs);
    } catch (error) {
      console.error('Jobs 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }
    
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = () => {
    alert('지원서가 성공적으로 제출되었습니다!');
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">로딩 중...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              추천 채용공고
            </h2>
            <p className="text-lg text-gray-600">
              오늘의 인기 채용공고를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.company?.name || '회사명'}</h3>
                      <p className="text-sm text-gray-500">{job.company?.industry || '기술 · IT'}</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {job.title}
                </h4>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location || '서울'}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.type === 'FULL_TIME' ? '정규직' : 
                       job.type === 'PART_TIME' ? '파트타임' : 
                       job.type === 'CONTRACT' ? '계약직' : '인턴'}
                    </div>
                  </div>
                  <span className="text-primary-600 font-medium">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {job.salary && (
                  <div className="mt-2 text-sm font-medium text-green-600">
                    {job.salary}
                  </div>
                )}
                
                <button 
                  onClick={() => handleApply(job)}
                  className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition-colors"
                >
                  지원하기
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/jobs" className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-md font-medium transition-colors">
              모든 채용공고 보기
            </Link>
          </div>
        </div>
      </section>
      
      <FirebaseApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={selectedJob}
        onApplicationSubmit={handleApplicationSubmit}
      />
    </>
  );
}