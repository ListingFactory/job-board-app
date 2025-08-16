'use client';

import { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Job } from '@/types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onApplicationSubmit: () => void;
}

export default function ApplicationModal({ isOpen, onClose, job, onApplicationSubmit }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('로그인이 필요합니다');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: job.id,
          coverLetter: formData.coverLetter,
          resume: formData.resume
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '지원서 제출에 실패했습니다');
      }

      onApplicationSubmit();
      onClose();
      setFormData({ coverLetter: '', resume: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            지원서 작성
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Job Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{job.company?.name}</p>
          <p className="text-gray-700 text-sm">{job.description}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자기소개서 *
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              required
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="자신을 어필할 수 있는 내용을 작성해주세요..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이력서 링크 또는 첨부파일 정보
            </label>
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="resume"
                value={formData.resume}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="이력서 링크나 파일 정보를 입력하세요"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Google Drive, Dropbox 링크 또는 이력서 파일에 대한 설명을 입력해주세요
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-900 mb-2">지원 전 확인사항</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 제출한 지원서는 수정할 수 없습니다</li>
              <li>• 허위 정보 기재 시 불이익을 받을 수 있습니다</li>
              <li>• 지원 결과는 이메일로 안내드립니다</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !formData.coverLetter.trim()}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '제출 중...' : '지원서 제출'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}