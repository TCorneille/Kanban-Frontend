import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IoTrashOutline } from 'react-icons/io5';
import type { ITask } from '../app/api/task';
import { useDeleteTaskMutation } from '../app/api/task';

interface TaskItemProps {
  task: ITask;
  boardId: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, boardId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id });

  const [deleteTask] = useDeleteTaskMutation();

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTask({ taskId: task._id, boardId }).unwrap();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-[#1a1f29] border rounded-xl text-sm text-white flex justify-between items-center group transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'border-amber-500 shadow-lg shadow-black/50 z-50'
          : 'border-[#282e3d]'
      }`}
    >
      <div className="flex flex-col gap-1 truncate pr-2">
        <span className="font-medium truncate">{task.title}</span>
        <div className="flex items-center gap-2">
          {task.priority && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded">
              {task.priority}
            </span>
          )}
          {task.dueDate && formatDate(task.dueDate) && (
            <span className="text-[11px] text-slate-400">
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
        title="Delete task"
      >
        <IoTrashOutline className="w-4 h-4" />
      </button>
    </div>
  );
};