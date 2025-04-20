"use client";

import { useState } from 'react';
import useStore from '../../lib/store';
import TaskCard from '../../components/TaskCard';
import TaskFilter from '../../components/TaskFilter';
import NewTaskForm from '../../components/NewTaskForm';

export default function TasksPage() {
  const { user, tasks } = useStore();
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    searchTerm: '',
  });
  
  // Filter tasks based on filters and user role
  const filteredTasks = tasks.filter(task => {
    // For developers, only show their tasks
    if (user.role === 'Developer' && task.assignee !== user.id) {
      return false;
    }
    
    // Apply status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    
    // Apply priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchTermLower);
      const descriptionMatch = task.description.toLowerCase().includes(searchTermLower);
      
      if (!titleMatch && !descriptionMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
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
      
      <TaskFilter onFilter={setFilters} />
      
      <div style={{ marginTop: '2rem' }}>
        {filteredTasks.length === 0 ? (
          <div className="card">
            <p>No tasks found matching the criteria.</p>
          </div>
        ) : (
          <>
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </>
        )}
      </div>
    </div>
  );
} 