'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import KanbanBoard from './components/KanbanBoard';
import ActivityLog from './components/ActivityLog';

interface Task {
  _id: string;
  title: string;
  status: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ActivityLogEntry {
  _id: string;
  taskId: string;
  action: string;
  details?: string;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchActivityLogs();
  }, []);

  const fetchTasks = async () => {
    try {
      // Added { cache: 'no-store' } to stop the browser from hiding your new tasks
      const response = await fetch('/api/tasks', { cache: 'no-store' });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]); 
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      // Added { cache: 'no-store' } here as well
      const response = await fetch('/api/activity-logs', { cache: 'no-store' });
      const data = await response.json();
      if (Array.isArray(data)) {
        setActivityLogs(data);
      } else {
        setActivityLogs([]);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      setActivityLogs([]);
    }
  };

  const handleTaskAdded = () => {
    fetchTasks();
    fetchActivityLogs();
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    fetchActivityLogs();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden text-black">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-4 shadow-md flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Kanban Board</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">Let's get things done!</p>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold border border-white/50 transition"
          >
            LOG OUT
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <KanbanBoard 
          tasks={tasks} 
          onTaskAdded={handleTaskAdded}
          onTaskUpdated={handleTaskUpdated}
        />
      </div>
      
      <div className="bg-indigo-600 text-white border-t border-indigo-700 px-6 py-3 h-40 flex flex-col flex-shrink-0 overflow-hidden">
        <ActivityLog logs={activityLogs} onLogsCleared={handleTaskUpdated} />
      </div>
    </div>
  );
}