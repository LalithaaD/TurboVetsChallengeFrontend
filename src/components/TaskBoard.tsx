import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task, UserRole, TaskStatus } from '../types';
import { TaskColumn } from './TaskColumn';

interface TaskBoardProps {
  tasks: Task[];
  userRole: UserRole;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onReorderTasks: (taskIds: string[]) => Promise<void>;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  userRole,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onReorderTasks,
}) => {
  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' as TaskStatus },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' as TaskStatus },
    { id: 'completed', title: 'Completed', status: 'completed' as TaskStatus },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const sourceStatus = source.droppableId as TaskStatus;

    // If status changed
    if (sourceStatus !== newStatus) {
      await onUpdateTaskStatus(draggableId, newStatus);
      return;
    }

    // If reordering within the same column
    const sourceTasks = getTasksByStatus(sourceStatus);
    const newTasks = Array.from(sourceTasks);
    const [movedTask] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, movedTask);

    const taskIds = newTasks.map(task => task.id);
    await onReorderTasks(taskIds);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {columns.map(column => (
          <TaskColumn
            key={column.id}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
            userRole={userRole}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
