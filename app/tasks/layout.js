"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../../lib/store';
import NavBar from '../../components/NavBar';

export default function TasksLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useStore();
  
  useEffect(() => {

    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return null; 
  }
  
  return (
    <div>
      <NavBar />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {children}
      </main>
    </div>
  );
} 