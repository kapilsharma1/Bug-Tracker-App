"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useStore from '../lib/store';
import { useMemo } from 'react';

export default function DashboardChart() {
  const { tasks, timeTracking } = useStore();
  
  const chartData = useMemo(() => {
    // Prepare data for the last 7 days
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        tasksCount: 0,
      });
    }
    
    // Count tasks worked on each day based on time tracking entries
    const dateMap = new Map(dates.map(d => [d.date, d]));
    
    timeTracking.forEach(entry => {
      const entryDate = new Date(entry.startTime).toISOString().split('T')[0];
      if (dateMap.has(entryDate)) {
        const dayData = dateMap.get(entryDate);
        // Check if this task was already counted
        const isNewTask = dayData.taskIds ? !dayData.taskIds.includes(entry.taskId) : true;
        
        if (isNewTask) {
          dayData.tasksCount++;
          
          // Initialize taskIds array if it doesn't exist
          if (!dayData.taskIds) {
            dayData.taskIds = [];
          }
          
          dayData.taskIds.push(entry.taskId);
        }
      }
    });
    
    return dates;
  }, [tasks, timeTracking]);
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="display" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="tasksCount" 
            stroke="#0070f3" 
            name="Tasks Worked On"
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 