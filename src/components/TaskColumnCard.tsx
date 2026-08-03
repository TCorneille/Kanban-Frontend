import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IoCalendarClearOutline, IoChevronDown } from 'react-icons/io5';
import { IoIosCheckmark } from 'react-icons/io';
import { TaskItem } from './TaskItem';
import { useCreateTaskMutation, type ITask, type TaskPriority } from '../app/api/task';

export interface TaskColumnProps {
  title: string;
  columnId: string;
  boardId: string;
  count?: number;
  tasks?: ITask[];
}

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

export const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  columnId,
  boardId,
  count,
  tasks = [],
}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  // Make the entire container a droppable target for dnd-kit
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPriorityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !boardId || !columnId) return;

    try {
      await createTask({
        boardId,
        columnId,
        title: taskTitle.trim(),
        priority,
        dueDate: dueDate || undefined,
        position: tasks.length,
      }).unwrap();

      setTaskTitle('');
      setDueDate('');
      setPriority('medium');
      setIsPriorityOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-[#13161c] border border-[#1e232d] p-5 shadow-sm text-white flex flex-col justify-between min-h-[460px]">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
        <span className="flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-semibold text-slate-300 bg-[#1a1f29] border border-[#232834] rounded-full">
          {count ?? tasks.length}
        </span>
      </div>

      {/* Task List / Droppable Target */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col my-3 p-3 border-2 border-dashed rounded-xl transition-colors duration-150 overflow-y-auto max-h-[340px] ${
          isOver
            ? 'border-amber-500/50 bg-[#0e1015]/70'
            : 'border-[#232834] bg-[#0e1015]/40'
        }`}
      >
        {tasks.length > 0 ? (
          <SortableContext
            items={tasks.map((t) => t._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full space-y-2.5">
              {tasks.map((task) => (
                <TaskItem key={task._id} task={task} boardId={boardId} />
              ))}
            </div>
          </SortableContext>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-medium text-center">
            Drop tasks here
          </div>
        )}
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mt-auto pt-2">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="New task title"
          className="w-full px-3.5 py-2.5 rounded-xl bg-transparent border border-[#232834] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150"
        />

        <div className="grid grid-cols-2 gap-2.5">
          {/* Priority Selection */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsPriorityOpen(!isPriorityOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-transparent border border-[#232834] text-sm text-slate-300 hover:border-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <span className="capitalize">{priority}</span>
              <IoChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {isPriorityOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-full min-w-[140px] bg-[#13161c] border border-[#1e232d] rounded-2xl shadow-2xl py-2 z-50">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPriority(p);
                      setIsPriorityOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left text-slate-200 hover:bg-[#1e232d] transition-colors capitalize"
                  >
                    <span>{p}</span>
                    {priority === p && <IoIosCheckmark className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="relative flex items-center">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-transparent border border-[#232834] text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150 cursor-pointer [color-scheme:dark]"
            />
            {!dueDate && (
              <IoCalendarClearOutline className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating || !taskTitle.trim()}
          className="w-full py-2.5 px-4 rounded-xl bg-[#a16207]/80 hover:bg-[#a16207] active:scale-[0.99] text-amber-100 font-semibold text-sm transition-all duration-150 cursor-pointer border border-amber-600/30 disabled:opacity-50"
        >
          {isCreating ? 'Adding...' : 'Add task'}
        </button>
      </form>
    </div>
  );
};

export default TaskColumn;