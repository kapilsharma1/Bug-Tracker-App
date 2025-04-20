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
  const openTasks = tasks.filter(task => task.status === 'Open' || task.status === 'In Progress');
  const closedTasks = tasks.filter(task => task.status === 'Closed');
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
            style={{fontSize: '1.1rem'}}
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
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div>
          {user.role === 'Developer' ? (
            // Developer View - Left Column
            <div>
              <h2 style={{ marginBottom: '1rem' }}>My Open Tasks</h2>
              {myTasks.length === 0 ? (
                <p>You have no active tasks.</p>
              ) : (
                <>
                  {myTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </>
              )}
            </div>
          ) : (
            // Manager View - Left Column
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Open Tasks</h2>
                {openTasks.length === 0 ? (
                  <p>No open tasks found.</p>
                ) : (
                  <>
                    {openTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </>
                )}
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Closed Tasks</h2>
                {closedTasks.length === 0 ? (
                  <p>No closed tasks found.</p>
                ) : (
                  <>
                    {closedTasks.slice(0, 5).map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Right Column */}
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
          
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Time Tracking</h2>
            <TimeTrackerTable />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <DashboardChart />
      </div>
    </div>
  );
} 