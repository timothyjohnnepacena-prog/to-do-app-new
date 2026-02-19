'use client';

import React, { useState, useEffect } from 'react';

interface ActivityLogEntry {
  _id: string;
  taskId: string;
  action: string;
  details?: string;
  createdAt: string;
}

interface ActivityLogProps {
  logs: ActivityLogEntry[];
  onLogsCleared?: () => void; // Walkie-talkie to tell the main screen we deleted the history
}

export default function ActivityLog({ logs, onLogsCleared }: ActivityLogProps) {
  const [displayLogs, setDisplayLogs] = useState<ActivityLogEntry[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  // Keep our visual logs up to date when the database gets new ones
  useEffect(() => {
    setDisplayLogs(logs);
  }, [logs]);

  // Cute little emojis for our actions
  const actionLabels: Record<string, string> = {
    created: '✨ Created',
    status_changed: '🔄 Status Changed',
    updated: '✏️ Updated',
    deleted: '🗑️ Deleted',
  };

  // What happens when we click the red Clear All button
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all activity history?')) {
      return;
    }

    setIsClearing(true);
    try {
      // Send a message to our activity-logs mailbox to delete everything
      const response = await fetch('/api/activity-logs', {
        method: 'DELETE',
      });

      if (response.ok) {
        setDisplayLogs([]);
        if (onLogsCleared) onLogsCleared();
      } else {
        alert('Failed to clear activity logs');
      }
    } catch (error) {
      console.error('Error clearing activity logs:', error);
      alert('Failed to clear activity logs');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h2 className="text-lg font-bold text-white">Activity Log</h2>
        <button
          onClick={handleClearAll}
          disabled={isClearing || displayLogs.length === 0}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
          title="Clear all activity history"
        >
          {isClearing ? 'Clearing...' : 'Clear All'}
        </button>
      </div>

      {displayLogs.length === 0 ? (
        <p className="text-indigo-200 text-sm">No activities yet</p>
      ) : (
        <div className="space-y-1 overflow-y-auto flex-1 min-h-0 pr-2">
          {displayLogs.map((log) => (
            <div key={log._id} className="border-l-2 border-orange-300 pl-2 py-1">
              <p className="text-xs font-semibold text-white">
                {actionLabels[log.action] || log.action}
              </p>
              {log.details && (
                <p className="text-xs text-indigo-100">{log.details}</p>
              )}
              <p className="text-xs text-indigo-300">
                {new Date(log.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}