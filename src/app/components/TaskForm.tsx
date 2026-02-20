'use client';

import React, { useState } from 'react';

interface TaskFormProps {
  onTaskAdded: () => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          status: 'todo',
        }),
      });

      if (response.ok) {
        setTitle('');
        onTaskAdded();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-3 shadow-md flex gap-3 items-end">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 whitespace-nowrap disabled:bg-gray-400"
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}