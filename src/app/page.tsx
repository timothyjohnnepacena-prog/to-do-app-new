'use client';

import React, { useState, useEffect } from 'react';
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

  // When the app opens, go get our tasks and history from the database!
  useEffect(() => {
    fetchTasks();
    fetchActivityLogs();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      
      // We check: Is this actually a list? 
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        // If it's an error message, just give it an empty list so it doesn't crash
        setTasks([]); 
        console.error("Database gave us an error instead of tasks:", data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('/api/activity-logs');
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

  // The walkie-talkie receivers! When a piece says "I updated!", we refresh the data.
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
      {/* Our Beautiful Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-4 shadow-md flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Kanban Board</h1>
        <p className="text-sm font-medium">Let's get things done!</p>
      </div>

      {/* The Main Board with the Columns */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <KanbanBoard 
          tasks={tasks} 
          onTaskAdded={handleTaskAdded}
          onTaskUpdated={handleTaskUpdated}
        />
      </div>
      
      {/* The History Log at the bottom */}
      <div className="bg-indigo-600 text-white border-t border-indigo-700 px-6 py-3 h-40 flex flex-col flex-shrink-0 overflow-hidden">
        <ActivityLog logs={activityLogs} onLogsCleared={handleTaskUpdated} />
      </div>
    </div>
  );
}