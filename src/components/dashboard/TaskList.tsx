
import React from 'react';
import TaskCard from './TaskCard';
import type { Task } from '@/hooks/useDashboardTasks';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: string, userTaskId: string, points: number) => void;
}

const TaskList = ({ tasks, onCompleteTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-confidence-50 rounded-lg p-6 text-center">
        <p className="text-confidence-700">No tasks available right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={() => onCompleteTask(task.id, task.user_task_id || '', task.points)}
        />
      ))}
    </div>
  );
};

export default TaskList;
