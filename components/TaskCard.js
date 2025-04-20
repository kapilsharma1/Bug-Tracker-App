"use client";

import { useState } from 'react';
import useStore from '../lib/store';

export default function TaskCard({ task, showControls = true }) {
  const { user, updateTask, deleteTask, closeTask, approveTask, reopenTask, startTimer, stopTimer, activeTimer } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTimeSpent = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedTask({ ...task });
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };
  
  const handleSave = () => {
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };
  
  const handleStatusAction = () => {
    if (task.status === 'Open' || task.status === 'In Progress') {
      closeTask(task.id);
    } else if (task.status === 'Pending Approval' && user.role === 'Manager') {
      approveTask(task.id);
    } else if (task.status === 'Pending Approval' && user.role === 'Manager') {
      reopenTask(task.id);
    }
  };
  
  const handleTimer = () => {
    if (activeTimer && activeTimer.taskId === task.id) {
      stopTimer();
    } else {
      startTimer(task.id);
    }
  };
  
  const getStatusBadgeClass = () => {
    switch (task.status) {
      case 'Open':
        return 'status-open';
      case 'In Progress':
        return 'status-in-progress';
      case 'Closed':
        return 'status-closed';
      case 'Pending Approval':
        return 'status-pending';
      default:
        return '';
    }
  };
  
  const getPriorityBadgeClass = () => {
    switch (task.priority) {
      case 'High':
        return 'badge-high';
      case 'Medium':
        return 'badge-medium';
      case 'Low':
        return 'badge-low';
      default:
        return '';
    }
  };
  
  const canEdit = user.id === task.assignee || user.role === 'Manager';
  const canChangeStatus = user.id === task.assignee || user.role === 'Manager';
  const showApproveReject = user.role === 'Manager' && task.status === 'Pending Approval';
  const isTimerActive = activeTimer && activeTimer.taskId === task.id;
  
  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      {isEditing ? (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                className="form-control"
                id="priority"
                name="priority"
                value={editedTask.priority}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                className="form-control"
                id="status"
                name="status"
                value={editedTask.status}
                onChange={handleInputChange}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                {user.role === 'Manager' && <option value="Closed">Closed</option>}
                {user.role === 'Manager' && <option value="Pending Approval">Pending Approval</option>}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleEditToggle}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ marginBottom: '0.5rem', marginRight: '1rem' }}>{task.title}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={`badge ${getPriorityBadgeClass()}`}>
                {task.priority}
              </span>
              <span className={`badge ${getStatusBadgeClass()}`}>
                {task.status}
              </span>
            </div>
          </div>
          
          <p style={{ marginBottom: '1rem', color: '#666' }}>{task.description}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
            <div>
              <p><strong>Created:</strong> {formatDate(task.createdDate)}</p>
              <p><strong>Due:</strong> {formatDate(task.dueDate)}</p>
            </div>
            <div>
              <p><strong>Assignee:</strong> {task.assigneeName || 'Unassigned'}</p>
              <p><strong>Time Spent:</strong> {formatTimeSpent(task.timeSpent)}</p>
            </div>
          </div>
          
          {showControls && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {canEdit && (
                <>
                  <button className="btn-secondary" onClick={handleEditToggle}>Edit</button>
                  <button className="btn-danger" onClick={handleDelete}>Delete</button>
                </>
              )}
              
              {canChangeStatus && !showApproveReject && task.status !== 'Closed' && (
                <button 
                  className={task.status === 'Open' || task.status === 'In Progress' ? 'btn-success' : 'btn'} 
                  onClick={handleStatusAction}
                >
                  {task.status === 'Open' || task.status === 'In Progress' ? 'Mark Complete' : 'Reopen'}
                </button>
              )}
              
              {showApproveReject && (
                <>
                  <button className="btn-success" onClick={() => approveTask(task.id)}>
                    Approve
                  </button>
                  <button className="btn-danger" onClick={() => reopenTask(task.id)}>
                    Reject
                  </button>
                </>
              )}
              
              {task.status !== 'Closed' && task.status !== 'Pending Approval' && (
                <button 
                  className={isTimerActive ? 'btn-danger' : 'btn'} 
                  onClick={handleTimer}
                >
                  {isTimerActive ? 'Stop Timer' : 'Start Timer'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 