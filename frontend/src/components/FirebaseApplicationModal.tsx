'use client';

import { useState } from 'react';
import { X, FileText, Upload } from 'lucide-react';
import { useFirebaseAuth } from './FirebaseAuthContext';
import { Job, createApplication } from '@/lib/firestoreServices';
import { uploadResume, validateResumeFile } from '@/lib/storageServices';

interface FirebaseApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onApplicationSubmit: () => void;
}

export default function FirebaseApplicationModal({ 
  isOpen, 
  onClose, 
  job, 
  onApplicationSubmit 
}: FirebaseApplicationModalProps) {
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeUrl: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useFirebaseAuth();

  if (!isOpen || !job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateResumeFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setResumeFile(file);
      setError('');
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile || !user) return;

    setUploading(true);
    setError('');

    try {
      const downloadURL = await uploadResume(user.id, resumeFile);
      setFormData(prev => ({ ...prev, resumeUrl: downloadURL }));
      setResumeFile(null);
      alert('이력서가 성공적으로 업로드되었습니다!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('로그인이 필요합니다');
      return;
    }

    if (!formData.coverLetter.trim()) {
      setError('자기소개서를 작성해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createApplication({
        userId: user.id,
        jobId: job.id,
        coverLetter: formData.coverLetter,
        resume: formData.resumeUrl,
      });

      onApplicationSubmit();
      onClose();
      setFormData({ coverLetter: '', resumeUrl: '' });
      setResumeFile(null);
    } catch (err: any) {
      setError(err.message || '지원서 제출에 실패했습니다');
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
          {job.salary && (
            <p className="text-green-600 text-sm font-medium mt-2">{job.salary}</p>
          )}
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
              이력서
            </label>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                PDF, DOC, DOCX 파일 업로드 (최대 5MB)
              </div>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              
              <label
                htmlFor="resume-upload"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
              >
                파일 선택
              </label>
              
              {resumeFile && (
                <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-700">{resumeFile.name}</span>
                  <button
                    type="button"
                    onClick={handleUploadResume}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    {uploading ? '업로드 중...' : '업로드'}
                  </button>
                </div>
              )}
            </div>

            {/* URL Input */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="또는 이력서 링크를 입력하세요"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Google Drive, Dropbox 등의 공유 링크를 입력해주세요
              </p>
            </div>
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