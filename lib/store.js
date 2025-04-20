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
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ),
        }));
      },
      
      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          timeTracking: state.timeTracking.filter((entry) => entry.taskId !== taskId),
        }));
      },
      
      // Time tracking functions
      startTimer: (taskId) => {
        const userId = get().user.id;
        const startTime = new Date().toISOString();
        set({ activeTimer: { taskId, userId, startTime } });
      },
      
      stopTimer: () => {
        const { activeTimer, timeTracking } = get();
        if (!activeTimer) return;
        
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