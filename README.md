# FealtyX Bug/Task Tracker

A comprehensive bug/task tracker web application built with Next.js and React.

## Features

- **User Authentication**: Simple login system with Developer and Manager roles
- **Dashboard**: Overview of tasks and activity with trend line visualization
- **Task Management**: Create, edit, delete, and filter tasks
- **Task Workflow**: Developers can close bugs, managers can approve or reject closure
- **Time Tracking**: Track time spent on tasks with detailed history

## Tech Stack

- **Frontend Framework**: Next.js
- **State Management**: Zustand
- **Charts**: Recharts
- **Styling**: CSS with custom variables

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fealty
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

- **Developer:**
  - Username: developer1
  - Password: password123

- **Manager:**
  - Username: manager1
  - Password: password123

## Implementation Details

- **Mock Authentication**: Uses hardcoded credentials for demo purposes
- **Data Persistence**: Uses Zustand's persist middleware to store data in localStorage
- **Responsive Design**: Works well on both desktop and mobile devices
- **Role-Based Access**: Different UI and capabilities based on user role

## Project Structure

- `/app`: Next.js app router pages and layout
- `/components`: Reusable UI components
- `/data`: Mock data for users, tasks, and time tracking
- `/lib`: Store and utility functions
- `/public`: Static assets

## Future Enhancements

- Backend integration with a real API
- User management and registration
- More advanced reporting and analytics
- Team and project management features
- Email notifications
- Dark mode theme support 