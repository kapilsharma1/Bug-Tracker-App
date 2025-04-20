"use client";

import { useState, useEffect } from 'react';
import useStore from '../lib/store';
import { useRouter } from 'next/navigation';
import { users } from '../data/users';

export default function NewTaskForm({ onClose }) {
  const { user, addTask } = useStore();
  const router = useRouter();
  
  // Get all developers for the assignee dropdown
  const developers = users.filter(u => u.role === 'Developer');
  
  // Redirect managers trying to access this component
  useEffect(() => {
    if (user.role === 'Manager') {
      onClose();
    }
  }, [user, onClose]);
  
  // Don't render for managers
  if (user.role === 'Manager') {
    return null;
  }
  
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: user.id, // Default to current user
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One week from now
    createdBy: user.id,
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Additional safety check - managers cannot create tasks
    if (user.role === 'Manager') {
      onClose();
      return;
    }
    
    addTask(task);
    onClose();
  };
  
  return (
    <div className="card">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={task.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={task.description}
            onChange={handleInputChange}
            rows="3"
            required
          ></textarea>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              className="form-control"
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="assignee">Assignee</label>
            <select
              className="form-control"
              id="assignee"
              name="assignee"
              value={task.assignee}
              onChange={handleInputChange}
            >
              {developers.map(dev => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={task.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
} 