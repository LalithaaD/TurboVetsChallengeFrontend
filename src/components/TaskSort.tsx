import React from 'react';
import { SortField, SortOrder } from '../types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TaskSortProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const TaskSort: React.FC<TaskSortProps> = ({
  sortField,
  sortOrder,
  onSortChange,
}) => {
  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'title', label: 'Title' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'status', label: 'Status' },
  ];

  const handleSort = (field: SortField) => {
    let newOrder: SortOrder = 'asc';
    
    if (sortField === field) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    onSortChange(field, newOrder);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-primary-600" />
      : <ArrowDown className="w-4 h-4 text-primary-600" />;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <div className="flex gap-1">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleSort(option.value)}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${sortField === option.value
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-transparent'
              }
            `}
          >
            {getSortIcon(option.value)}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
