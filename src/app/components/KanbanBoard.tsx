'use client';

import React from 'react';
import Column from './Column';
import TaskForm from './TaskForm';

interface Task {
  _id: string;
  title: string;
  status: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskAdded: () => void;
  onTaskUpdated: () => void;
}

export default function KanbanBoard({ tasks, onTaskAdded, onTaskUpdated }: KanbanBoardProps) {
  // These are the exact names of our three columns!
  const statuses = ['todo', 'in-progress', 'done'];

  // A little helper to sort the sticky notes into their correct columns
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Put our typing box at the top */}
      <TaskForm onTaskAdded={onTaskAdded} />

      {/* Put our three columns side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onTaskUpdated={onTaskUpdated}
            allTasks={tasks}
          />
        ))}
      </div>
    </div>
  );
}