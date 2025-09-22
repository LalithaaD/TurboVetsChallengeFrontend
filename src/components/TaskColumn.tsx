import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Task, UserRole } from '../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  userRole: UserRole;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  status,
  tasks,
  userRole,
  onEditTask,
  onDeleteTask,
}) => {
  const getColumnColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'border-gray-200';
      case 'in-progress':
        return 'border-blue-200';
      case 'completed':
        return 'border-green-200';
      default:
        return 'border-gray-200';
    }
  };

  const getHeaderColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-50 text-gray-700';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700';
      case 'completed':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className={`bg-gray-50 rounded-lg border-2 ${getColumnColor(status)} min-h-[400px]`}>
      <div className={`p-4 rounded-t-lg ${getHeaderColor(status)}`}>
        <h3 className="font-semibold text-sm uppercase tracking-wide">
          {title}
        </h3>
        <span className="text-xs text-gray-500 ml-2">
          ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              p-3 min-h-[350px] transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-primary-50' : ''}
            `}
          >
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">No tasks yet</p>
                  <p className="text-xs">Drop tasks here</p>
                </div>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  userRole={userRole}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  isDragging={snapshot.isDraggingOver}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
