"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../../../lib/store';
import TaskCard from '../../../components/TaskCard';

export default function TasksApprovalPage() {
  const router = useRouter();
  const { user, tasks } = useStore();
  
  // Redirect if not a manager
  useEffect(() => {
    if (user && user.role !== 'Manager') {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  // Filter tasks that are pending approval
  const pendingApprovalTasks = tasks.filter(task => task.status === 'Pending Approval');
  
  if (user?.role !== 'Manager') {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Pending Approvals</h1>
      
      {pendingApprovalTasks.length === 0 ? (
        <div className="card">
          <p>No tasks pending approval.</p>
        </div>
      ) : (
        <>
          {pendingApprovalTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </>
      )}
    </div>
  );
} 