import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'COMPANY_ADMIN';
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

// 사용자 문서 생성/업데이트
export const createUserDocument = async (
  firebaseUser: FirebaseUser,
  additionalData: Partial<AuthUser> = {}
): Promise<AuthUser> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email } = firebaseUser;
    const userData: AuthUser = {
      id: firebaseUser.uid,
      email: email!,
      name: displayName || additionalData.name || '',
      role: additionalData.role || 'USER',
      companyId: additionalData.companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...additionalData,
    };

    try {
      await setDoc(userRef, userData);
      return userData;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  } else {
    return userSnap.data() as AuthUser;
  }
};

// 이메일/비밀번호로 회원가입
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  name?: string
): Promise<{ user: AuthUser; firebaseUser: FirebaseUser }> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  if (name) {
    await updateProfile(firebaseUser, { displayName: name });
  }

  const user = await createUserDocument(firebaseUser, { name });
  return { user, firebaseUser };
};

// 이메일/비밀번호로 로그인
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: AuthUser; firebaseUser: FirebaseUser }> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  const user = await createUserDocument(firebaseUser);
  return { user, firebaseUser };
};

// Google 로그인
export const signInWithGoogle = async (): Promise<{ user: AuthUser; firebaseUser: FirebaseUser }> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const firebaseUser = userCredential.user;
  const user = await createUserDocument(firebaseUser);
  return { user, firebaseUser };
};

// 로그아웃
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// 인증 상태 변화 감지
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// 사용자 문서 가져오기
export const getUserDocument = async (uid: string): Promise<AuthUser | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as AuthUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
};