'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  AuthUser,
  signUpWithEmailAndPassword,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  onAuthStateChange,
  getUserDocument,
} from '@/lib/firebaseAuth';

interface FirebaseAuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase 사용자가 있으면 Firestore에서 사용자 문서 가져오기
        const userData = await getUserDocument(firebaseUser.uid);
        setUser(userData);
        setFirebaseUser(firebaseUser);
      } else {
        // 로그아웃 상태
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: userData, firebaseUser: fbUser } = await signInWithEmail(email, password);
      setUser(userData);
      setFirebaseUser(fbUser);
    } catch (error: any) {
      throw new Error(error.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const { user: userData, firebaseUser: fbUser } = await signUpWithEmailAndPassword(
        email,
        password,
        name
      );
      setUser(userData);
      setFirebaseUser(fbUser);
    } catch (error: any) {
      throw new Error(error.message || '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { user: userData, firebaseUser: fbUser } = await signInWithGoogle();
      setUser(userData);
      setFirebaseUser(fbUser);
    } catch (error: any) {
      throw new Error(error.message || 'Google 로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      throw new Error(error.message || '로그아웃에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        register,
        loginWithGoogle,
        logout,
        loading,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}