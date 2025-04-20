"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useStore from '../lib/store';

export default function NavBar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useStore();
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  if (!isAuthenticated) return null;
  
  return (
    <nav className="bg-primary" style={{ backgroundColor: '#0070f3', padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
          Task Tracker
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: 'white' }}>
            Dashboard
          </Link>
          
          {user?.role === 'Manager' && (
            <Link href="/tasks/approval" style={{ color: 'white' }}>
              Pending Approvals
            </Link>
          )}
          
          <Link href="/tasks" style={{ color: 'white' }}>
           {user?.role === 'Developer' ? 'My Tasks' : 'All Tasks'}
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
            <span style={{ color: 'gold', marginRight: '0.5rem' }}>
              {user?.name} ({user?.role})
            </span>
            <button 
              onClick={handleLogout} 
              className="btn-secondary" 
              style={{ 
                padding: '0.25rem 0.5rem', 
                backgroundColor: 'white', 
                color: '#0070f3',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 