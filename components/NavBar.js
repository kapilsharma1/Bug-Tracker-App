"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useStore from '../lib/store';

export default function NavBar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link style={{fontSize: '1.5rem',color: 'white'}} href="/dashboard" className="logo">
          Task Tracker
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          ☰
        </button>

        <div className={`menu ${menuOpen ? 'open' : ''}`}>
          <Link style={{fontSize: '1rem',color: 'white'}} href="/dashboard" className="nav-link">Dashboard</Link>
          {user?.role === 'Manager' && (
            <Link style={{fontSize: '1rem',color: 'white'}} href="/tasks/approval" className="nav-link">Pending Approvals</Link>
          )}
          <Link style={{fontSize: '1rem',color: 'white'}} href="/tasks" className="nav-link">
            {user?.role === 'Developer' ? 'My Tasks' : 'All Tasks'}
          </Link>

          <div className="user">
            <span className="user-name">{user?.name} ({user?.role})</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background-color: #0070f3;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .navbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
        }

        .hamburger {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
        }

        .menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #e0e0e0;
        }

        .user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-name {
          color: gold;
          font-size: 0.95rem;
        }

        .logout-btn {
          background-color: white;
          color: #0070f3;
          border: none;
          border-radius: 4px;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-weight: 500;
        }

        .logout-btn:hover {
          background-color: #f0f0f0;
        }

       
        @media (max-width: 768px) {
          .hamburger {
            display: block;
          }

          .menu {
            display: none;
            flex-direction: column;
            width: 100%;
            margin-top: 1rem;
            animation: fadeIn 0.3s ease-in-out;
          }

          .menu.open {
            display: flex;
          }

          .nav-link {
            padding: 0.5rem 0;
          }

          .user {
            flex-direction: column;
            align-items: center;
            margin-top: 1rem;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
