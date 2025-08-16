import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from 'firebase/storage';
import { storage } from './firebase';

// 이력서 업로드
export const uploadResume = async (
  userId: string,
  file: File,
  fileName?: string
): Promise<string> => {
  try {
    const finalFileName = fileName || `resume_${Date.now()}_${file.name}`;
    const resumeRef = ref(storage, `resumes/${userId}/${finalFileName}`);
    
    const snapshot = await uploadBytes(resumeRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('이력서 업로드에 실패했습니다');
  }
};

// 회사 로고 업로드
export const uploadCompanyLogo = async (
  companyId: string,
  file: File,
  fileName?: string
): Promise<string> => {
  try {
    const finalFileName = fileName || `logo_${Date.now()}_${file.name}`;
    const logoRef = ref(storage, `company-logos/${companyId}/${finalFileName}`);
    
    const snapshot = await uploadBytes(logoRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading company logo:', error);
    throw new Error('회사 로고 업로드에 실패했습니다');
  }
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (
  userId: string,
  file: File,
  fileName?: string
): Promise<string> => {
  try {
    const finalFileName = fileName || `profile_${Date.now()}_${file.name}`;
    const profileRef = ref(storage, `profile-images/${userId}/${finalFileName}`);
    
    const snapshot = await uploadBytes(profileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('프로필 이미지 업로드에 실패했습니다');
  }
};

// 파일 삭제
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('파일 삭제에 실패했습니다');
  }
};

// 파일 유효성 검사
export const validateResumeFile = (file: File): string | null => {
  // 파일 크기 검사 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return '파일 크기는 5MB 이하여야 합니다';
  }
  
  // 파일 형식 검사
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return 'PDF, DOC, DOCX 파일만 업로드 가능합니다';
  }
  
  return null;
};

export const validateImageFile = (file: File, maxSizeMB: number = 2): string | null => {
  // 파일 크기 검사
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `파일 크기는 ${maxSizeMB}MB 이하여야 합니다`;
  }
  
  // 파일 형식 검사
  if (!file.type.startsWith('image/')) {
    return '이미지 파일만 업로드 가능합니다';
  }
  
  return null;
};