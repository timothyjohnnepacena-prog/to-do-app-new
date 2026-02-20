'use client';

import React, { useState, useRef } from 'react';
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
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const cardHeightRef = useRef<number>(0);
  
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);

    // Retrieve the dragged task ID from the dragging element
    const draggingElement = document.querySelector('[data-task-id].is-dragging');
    if (draggingElement) {
      const taskId = draggingElement.getAttribute('data-task-id');
      if (taskId) {
        setDraggingTaskId(taskId);
      }
    }

    const container = e.currentTarget;
    const y = e.clientY;
    
    // Exclude the dragged element from drop position calculations
    const draggableElements = [...container.querySelectorAll('[data-task-id]:not(.is-dragging)')];
    
    let closestOffset = Number.NEGATIVE_INFINITY;
    let newDropIndex = tasks.length; 

    draggableElements.forEach((child) => {
      const taskId = child.getAttribute('data-task-id');
      const taskIndex = tasks.findIndex(t => t._id === taskId);
      
      if (taskIndex !== -1) {
        const box = child.getBoundingClientRect();
        const offset = y - (box.top + box.height / 2);
        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          newDropIndex = taskIndex;
        }
      }
    });

    setDropIndicatorIndex(newDropIndex);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDropIndicatorIndex(null);
      setDraggingTaskId(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setDropIndicatorIndex(null);
    setDraggingTaskId(null);

    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const taskToMove = allTasks.find((t) => t._id === taskId);
    if (!taskToMove) return;

    const container = e.currentTarget;
    const y = e.clientY;
    const draggableElements = [...container.querySelectorAll('[data-task-id]:not(.is-dragging)')];
    
    let insertBeforeTaskId: string | null = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    draggableElements.forEach(child => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        insertBeforeTaskId = child.getAttribute('data-task-id');
      }
    });

    // Remove from original list and insert at new position
    let newColumnTasks = tasks.filter(t => t._id !== taskId);

    if (insertBeforeTaskId) {
      const insertIndex = newColumnTasks.findIndex(t => t._id === insertBeforeTaskId);
      if (insertIndex !== -1) {
        newColumnTasks.splice(insertIndex, 0, taskToMove);
      } else {
        newColumnTasks.push(taskToMove);
      }
    } else {
      newColumnTasks.push(taskToMove); 
    }

    const updatedTasks = newColumnTasks.map((t, index) => ({
      _id: t._id,
      status: status, 
      priority: index,
    }));

    try {
      await fetch(`/api/tasks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks, movedTaskId: taskId }),
      });
      onTaskUpdated();
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-3 flex flex-col h-full overflow-hidden ${columnColors[status]} ${
        isDragOver ? 'border-blue-400 bg-blue-50/40 shadow-inner' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-bold mb-3 text-gray-800">
        {columnNames[status]}
        <span className="ml-2 text-sm font-normal text-gray-500">({tasks.length})</span>
      </h2>
      
      <div className="space-y-2 overflow-y-auto flex-1 min-h-0 relative">
        {tasks.map((task, index) => (
          <React.Fragment key={task._id}>
            {dropIndicatorIndex === index && draggingTaskId && (
              <div className="rounded p-3 text-xs border border-gray-200 border-l-4 border-l-blue-500 bg-blue-100/40 opacity-50 animate-pulse shadow-sm">
                <h3 className="font-semibold text-gray-800 text-sm break-words mb-2">
                  {allTasks.find(t => t._id === draggingTaskId)?.title || ''}
                </h3>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-1 rounded text-xs font-medium">Edit</div>
                  <div className="flex-1 bg-red-50 text-red-600 border border-red-200 px-1.5 py-1 rounded text-xs font-medium">Delete</div>
                </div>
              </div>
            )}
            <div
              ref={(el) => {
                if (el && cardHeightRef.current === 0) {
                  cardHeightRef.current = el.offsetHeight;
                }
              }}
            >
              <TaskCard task={task} status={status} onTaskUpdated={onTaskUpdated} />
            </div>
          </React.Fragment>
        ))}
        {dropIndicatorIndex === tasks.length && draggingTaskId && (
          <div className="rounded p-3 text-xs border border-gray-200 border-l-4 border-l-blue-500 bg-blue-100/40 opacity-50 animate-pulse shadow-sm">
            <h3 className="font-semibold text-gray-800 text-sm break-words mb-2">
              {allTasks.find(t => t._id === draggingTaskId)?.title || ''}
            </h3>
            <div className="flex gap-2 mt-2">
              <div className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-1 rounded text-xs font-medium">Edit</div>
              <div className="flex-1 bg-red-50 text-red-600 border border-red-200 px-1.5 py-1 rounded text-xs font-medium">Delete</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}