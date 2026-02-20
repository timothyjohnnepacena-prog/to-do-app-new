'use client';

import React, { useState } from 'react';

interface Task {
  _id: string;
  title: string;
  status: string;
  priority?: number;
}

interface TaskCardProps {
  task: Task;
  status: string;
  onTaskUpdated: () => void;
}

export default function TaskCard({ task, status, onTaskUpdated }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status }),
      });
      if (response.ok) {
        setIsEditing(false);
        onTaskUpdated();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onTaskUpdated();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Force the browser to grab exactly the card, ignoring column padding
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    e.dataTransfer.setData('taskId', task._id);
    
    // Delay hiding the card so the browser can take a clear snapshot first
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg p-3 shadow border-l-4 border-blue-500">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 px-2 py-1 border rounded text-sm text-black focus:outline-none"
          autoFocus
        />
        <div className="flex gap-2">
          <button onClick={handleUpdate} className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">Save</button>
          <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-400 text-white px-2 py-1 rounded text-sm font-medium">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-task-id={task._id} 
      className={`rounded p-3 text-xs border border-gray-200 border-l-4 border-l-blue-500 transition-all ${
        isDragging 
          ? 'fixed -left-full -top-full w-0 h-0 overflow-hidden opacity-0 is-dragging bg-transparent shadow-none pointer-events-none' 
          : 'bg-white shadow hover:shadow-md cursor-grab active:cursor-grabbing'
      }`}
    >
      <h3 className="font-semibold text-gray-800 text-sm break-words mb-2">{task.title}</h3>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setIsEditing(true)} className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-1 rounded text-xs font-medium">Edit</button>
        <button onClick={handleDelete} className="flex-1 bg-red-50 text-red-600 border border-red-200 px-1.5 py-1 rounded text-xs font-medium">Delete</button>
      </div>
    </div>
  );
}