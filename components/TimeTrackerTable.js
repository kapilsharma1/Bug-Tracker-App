"use client";

import useStore from '../lib/store';
import { useMemo } from 'react';
import { users } from '../data/users';

export default function TimeTrackerTable({ userId = null }) {
  const { timeTracking, tasks, user } = useStore();
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const filteredEntries = useMemo(() => {
    // If userId is provided, filter by that user, else use current user (for developer view)
    // For managers, if userId is null, show all entries
    if (userId) {
      return timeTracking.filter(entry => entry.userId === userId);
    } else if (user.role === 'Developer') {
      return timeTracking.filter(entry => entry.userId === user.id);
    } else {
      return timeTracking;
    }
  }, [timeTracking, user, userId]);
  
  const getTaskTitle = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : 'Unknown Task';
  };
  
  const getAssigneeName = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 'Unknown';
    
    const assignee = users.find(u => u.id === task.assignee);
    return assignee ? assignee.name : 'Unassigned';
  };
  
  return (
    <div className="card">
      <h3>Time Tracking History</h3>
      
      {filteredEntries.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No time tracking entries found.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Task</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Assignee</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Start Time</th>
                <th style={{ textAlign: 'left', padding: '0.6rem' }}>End Time</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '0.5rem' }}>{getTaskTitle(entry.taskId)}</td>
                  <td style={{ padding: '0.5rem' }}>{getAssigneeName(entry.taskId)}</td>
                  <td style={{ padding: '0.5rem' }}>{formatDate(entry.startTime)}</td>
                  <td style={{ padding: '0.6rem' }}>{formatDate(entry.endTime)}</td>
                  <td style={{ padding: '0.5rem' }}>{formatDuration(entry.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 