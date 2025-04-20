"use client";

import { useState } from 'react';
import useStore from '../../lib/store';
import DashboardChart from '../../components/DashboardChart';
import TaskCard from '../../components/TaskCard';
import TimeTrackerTable from '../../components/TimeTrackerTable';
import NewTaskForm from '../../components/NewTaskForm';

export default function DashboardPage() {
  const { user, tasks } = useStore();
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  
  // Filter tasks for dashboard display
  const myTasks = tasks.filter(task => task.assignee === user.id && task.status !== 'Closed');
  const pendingApprovalTasks = tasks.filter(task => task.status === 'Pending Approval');
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 5);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        {/* Only developers can create new tasks */}
        {user.role === 'Developer' && (
          <button 
            className="btn"
            onClick={() => setShowNewTaskForm(true)}
          >
            Create New Task
          </button>
        )}
      </div>
      
      {showNewTaskForm && (
        <div style={{ marginBottom: '2rem' }}>
          <NewTaskForm onClose={() => setShowNewTaskForm(false)} />
        </div>
      )}
      
      <div style={{ marginBottom: '2rem' }}>
        <DashboardChart />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '1rem' }}>
            {user.role === 'Developer' ? 'My Open Tasks' : 'Recent Tasks'}
          </h2>
          
          {user.role === 'Developer' ? (
            <>
              {myTasks.length === 0 ? (
                <p>You have no active tasks.</p>
              ) : (
                <>
                  {myTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {recentTasks.length === 0 ? (
                <p>No tasks found.</p>
              ) : (
                <>
                  {recentTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
        
        <div>
          {user.role === 'Manager' && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Pending Approvals</h2>
              
              {pendingApprovalTasks.length === 0 ? (
                <p>No tasks pending approval.</p>
              ) : (
                <>
                  {pendingApprovalTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </>
              )}
            </div>
          )}
          
          <h2 style={{ marginBottom: '1rem' }}>Time Tracking</h2>
          <TimeTrackerTable />
        </div>
      </div>
    </div>
  );
} 