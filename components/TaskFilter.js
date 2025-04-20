"use client";

import { useState } from 'react';

export default function TaskFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    searchTerm: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };
  
  const handleReset = () => {
    const resetFilters = {
      status: '',
      priority: '',
      searchTerm: '',
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };
  
  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h3>Filter Tasks</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            className="form-control"
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            className="form-control"
            id="priority"
            name="priority"
            value={filters.priority}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="searchTerm">Search</label>
          <input
            type="text"
            className="form-control"
            id="searchTerm"
            name="searchTerm"
            placeholder="Search in title or description"
            value={filters.searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button className="btn-secondary" onClick={handleReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
} 