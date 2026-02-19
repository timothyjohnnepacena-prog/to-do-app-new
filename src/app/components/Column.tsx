'use client';

import React, { useState } from 'react';
import TaskCard from './TaskCard';

interface Task {
  _id: string;
  title: string;
  status: string;
  priority?: number;
}

interface ColumnProps {
  status: string;
  tasks: Task[];
  onTaskUpdated: () => void;
  allTasks: Task[];
}

export default function Column({ status, tasks, onTaskUpdated, allTasks }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const columnNames: Record<string, string> = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
  };

  const columnColors: Record<string, string> = {
    todo: 'bg-red-50 border-red-200',
    'in-progress': 'bg-yellow-50 border-yellow-200',
    done: 'bg-green-50 border-green-200',
  };

  // Makes the column light up when we hover a task over it
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // What happens when we let go of the mouse (Drop!)
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    // Find out which task we just dropped
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const task = allTasks.find((t) => t._id === taskId);
    if (!task) return;

    // If we dropped it in the same column it was already in, do nothing
    if (task.status === status) return;

    try {
      // Tell our backend mailbox to move the task!
      // (Our backend will automatically create the Activity Log for us)
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title,
          status: status, // The new status column it was dropped into
          priority: task.priority,
        }),
      });

      if (response.ok) {
        onTaskUpdated(); // Refresh the board!
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-3 transition-all flex flex-col h-full overflow-hidden ${columnColors[status]} ${
        isDragOver ? 'scale-105 opacity-75 border-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-bold mb-3 text-gray-800">
        {columnNames[status]}
      </h2>
      <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            status={status}
            onTaskUpdated={onTaskUpdated}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-400 text-center py-4 text-sm font-medium">No tasks yet</p>
        )}
      </div>
    </div>
  );
}