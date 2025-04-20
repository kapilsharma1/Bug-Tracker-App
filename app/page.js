"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useStore();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(credentials.username, credentials.password);
    
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0070f3' }}>
          FealtyX Bug Tracker
        </h1>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Login
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          <p>Demo Credentials:</p>
          <p>Developer: username: <strong>developer1</strong>, password: <strong>password123</strong></p>
          <p>Manager: username: <strong>manager1</strong>, password: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
} 