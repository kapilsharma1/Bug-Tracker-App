import { create } from 'zustand';
import { users } from '../data/users';
import { tasks as initialTasks } from '../data/tasks';
import { timeTracking as initialTimeTracking } from '../data/timeTracking';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      
      user: null,
      isAuthenticated: false,
      
      
      tasks: initialTasks,
      
    
      timeTracking: initialTimeTracking,
      activeTimer: null,
      
      
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
      
      
      logout: () => {
        set({ user: null, isAuthenticated: false, activeTimer: null });
      },
      
      
      addTask: (task) => {
        const user = get().user;
       
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
        
       
        if (!taskToUpdate) return;
        
       
        if (taskToUpdate.status === 'Pending Approval') {
          if (user.role === 'Manager' && Object.keys(updatedTask).length === 1 && 'status' in updatedTask) {
            
          } else {
            
            return;
          }
        }
        
       
        if (user.role === 'Manager') {
       
          if (Object.keys(updatedTask).length === 1 && 'status' in updatedTask) {
            
          } else {
          
            return;
          }
        }
        
       
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
        
       
        if (!taskToDelete) return;
        
      
        if (taskToDelete.status === 'Pending Approval') {
          return;
        }
        
      
        if (user.role === 'Manager') {
          return;
        }
        
     
        if (user.role === 'Developer' && taskToDelete.assignee !== user.id) {
          return;
        }
        
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          timeTracking: state.timeTracking.filter((entry) => entry.taskId !== taskId),
        }));
      },
      
     
      startTimer: (taskId) => {
        const user = get().user;
       
        if (user.role === 'Manager') return;
        
        const userId = user.id;
        const startTime = new Date().toISOString();
        set({ activeTimer: { taskId, userId, startTime } });
      },
      
      stopTimer: () => {
        const { activeTimer, timeTracking, user } = get();
        if (!activeTimer) return;
        
      
        if (user.role === 'Manager') return;
        
        const endTime = new Date().toISOString();
        const startDate = new Date(activeTimer.startTime);
        const endDate = new Date(endTime);
        const duration = Math.floor((endDate - startDate) / (1000 * 60)); 
        
        const newEntry = {
          id: Date.now().toString(),
          taskId: activeTimer.taskId,
          userId: activeTimer.userId,
          startTime: activeTimer.startTime,
          endTime,
          duration,
        };
        
       
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
      
    
      closeTask: (taskId) => {
        const user = get().user;
        
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