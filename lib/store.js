import { create } from 'zustand';
import { users } from '../data/users';
import { tasks as initialTasks } from '../data/tasks';
import { timeTracking as initialTimeTracking } from '../data/timeTracking';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      
      // Tasks state
      tasks: initialTasks,
      
      // Time tracking state
      timeTracking: initialTimeTracking,
      activeTimer: null,
      
      // Login
      login: (username, password) => {
        const user = users.find(
          (user) => user.username === username && user.password === password
        );
        
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      // Logout
      logout: () => {
        set({ user: null, isAuthenticated: false, activeTimer: null });
      },
      
      // Task management functions
      addTask: (task) => {
        const user = get().user;
        // Add safety check - managers cannot create tasks
        if (user.role === 'Manager') return null;
        
        const newTask = {
          ...task,
          id: Date.now().toString(),
          createdDate: new Date().toISOString(),
          status: 'Open',
          timeSpent: 0,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return newTask;
      },
      
      updateTask: (taskId, updatedTask) => {
        const user = get().user;
        const taskToUpdate = get().tasks.find(task => task.id === taskId);
        
        // If no task found, exit
        if (!taskToUpdate) return;
        
        // Cannot edit tasks in Pending Approval state (except for managers changing status)
        if (taskToUpdate.status === 'Pending Approval') {
          // Allow only status changes for managers (for approve/reject)
          if (user.role === 'Manager' && Object.keys(updatedTask).length === 1 && 'status' in updatedTask) {
            // Allow the status change for approval/rejection
          } else {
            // Block any other updates to tasks in Pending Approval
            return;
          }
        }
        
        // If manager trying to edit task (except for status changes), exit
        // This allows managers to approve/reject tasks, but not edit other properties
        if (user.role === 'Manager') {
          // Only allow status changes for managers (for approve/reject)
          if (Object.keys(updatedTask).length === 1 && 'status' in updatedTask) {
            // Allow the status change for approval/rejection
          } else {
            // Block other updates by managers
            return;
          }
        }
        
        // If developer trying to edit someone else's task, exit
        if (user.role === 'Developer' && taskToUpdate.assignee !== user.id) {
          return;
        }
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ),
        }));
      },
      
      deleteTask: (taskId) => {
        const user = get().user;
        const taskToDelete = get().tasks.find(task => task.id === taskId);
        
        // If no task found, exit
        if (!taskToDelete) return;
        
        // Cannot delete tasks in Pending Approval state
        if (taskToDelete.status === 'Pending Approval') {
          return;
        }
        
        // Managers cannot delete tasks
        if (user.role === 'Manager') {
          return;
        }
        
        // Developers can only delete their own tasks
        if (user.role === 'Developer' && taskToDelete.assignee !== user.id) {
          return;
        }
        
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          timeTracking: state.timeTracking.filter((entry) => entry.taskId !== taskId),
        }));
      },
      
      // Time tracking functions
      startTimer: (taskId) => {
        const user = get().user;
        // Add safety check - managers cannot start timers
        if (user.role === 'Manager') return;
        
        const userId = user.id;
        const startTime = new Date().toISOString();
        set({ activeTimer: { taskId, userId, startTime } });
      },
      
      stopTimer: () => {
        const { activeTimer, timeTracking, user } = get();
        if (!activeTimer) return;
        
        // Add safety check - managers cannot stop timers
        if (user.role === 'Manager') return;
        
        const endTime = new Date().toISOString();
        const startDate = new Date(activeTimer.startTime);
        const endDate = new Date(endTime);
        const duration = Math.floor((endDate - startDate) / (1000 * 60)); // Convert to minutes
        
        const newEntry = {
          id: Date.now().toString(),
          taskId: activeTimer.taskId,
          userId: activeTimer.userId,
          startTime: activeTimer.startTime,
          endTime,
          duration,
        };
        
        // Update task timeSpent
        const { tasks } = get();
        const task = tasks.find((t) => t.id === activeTimer.taskId);
        if (task) {
          const updatedTimeSpent = task.timeSpent + duration;
          get().updateTask(activeTimer.taskId, { timeSpent: updatedTimeSpent });
        }
        
        set({
          timeTracking: [...timeTracking, newEntry],
          activeTimer: null,
        });
        
        return newEntry;
      },
      
      // Task status functions
      closeTask: (taskId) => {
        const user = get().user;
        // Add safety check - managers cannot mark tasks as complete
        if (user.role === 'Manager') return;
        
        get().updateTask(taskId, { status: 'Pending Approval' });
      },
      
      approveTask: (taskId) => {
        get().updateTask(taskId, { status: 'Closed' });
      },
      
      reopenTask: (taskId) => {
        get().updateTask(taskId, { status: 'Open' });
      },
    }),
    {
      name: 'fealty-storage',
    }
  )
);

export default useStore; 