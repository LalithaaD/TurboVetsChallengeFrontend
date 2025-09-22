import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task, UserRole } from '../types';
import { 
  Calendar, 
  User, 
  Flag, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Clock
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  userRole: UserRole;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const categoryColors = {
  work: 'bg-blue-100 text-blue-800',
  personal: 'bg-purple-100 text-purple-800',
  shopping: 'bg-orange-100 text-orange-800',
  health: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  userRole,
  onEdit,
  onDelete,
  isDragging = false,
}) => {
  const canEdit = userRole === 'owner' || userRole === 'admin';
  const canDelete = userRole === 'owner';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3
            transition-all duration-200 hover:shadow-md
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''}
            ${isDragging ? 'opacity-50' : ''}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                  ${priorityColors[task.priority]}
                `}>
                  <Flag className="w-3 h-3 mr-1" />
                  {task.priority}
                </span>

                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${categoryColors[task.category]}
                `}>
                  {task.category}
                </span>

                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${statusColors[task.status]}
                `}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                {task.assigneeName && (
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {task.assigneeName}
                  </div>
                )}

                {task.dueDate && (
                  <div className={`
                    flex items-center
                    ${isOverdue ? 'text-red-600' : ''}
                  `}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(task.dueDate)}
                    {isOverdue && <Clock className="w-3 h-3 ml-1" />}
                  </div>
                )}

                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {task.createdByName}
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                
                {canDelete && (
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
