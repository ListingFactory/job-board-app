'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Building2, Users, TrendingUp } from 'lucide-react';

interface Stats {
  jobs: number;
  companies: number;
  users: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats>({ jobs: 0, companies: 0, users: 0 });

  useEffect(() => {
    fetch('http://localhost:3000/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Stats 로딩 실패:', err));
  }, []);

  const statItems = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary-600" />,
      label: '채용공고',
      value: stats.jobs.toLocaleString(),
      suffix: '+'
    },
    {
      icon: <Building2 className="h-8 w-8 text-primary-600" />,
      label: '등록 기업',
      value: stats.companies.toLocaleString(),
      suffix: '+'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      label: '회원수',
      value: stats.users.toLocaleString(),
      suffix: '+'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      label: '성공 매칭',
      value: '1,200',
      suffix: '+'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            JobBoard의 성과
          </h2>
          <p className="text-lg text-gray-600">
            매일 새로운 기회가 만들어지고 있습니다
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {item.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {item.value}{item.suffix}
              </div>
              <div className="text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}