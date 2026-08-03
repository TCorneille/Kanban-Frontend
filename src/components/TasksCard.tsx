import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface TasksHeaderCardProps {
  title?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearchChange?: (query: string) => void;
  onAddTask?: (taskData: { title: string; description: string; priority: string }) => void;
}

export const TasksCard: React.FC<TasksHeaderCardProps> = ({
  title = 'All tasks',
  currentPage: initialPage = 1,
  totalPages = 1,
  onPageChange,
  onSearchChange,
  onAddTask,
}) => {
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask?.({
      title: taskTitle,
      description: taskDescription,
      priority: taskPriority,
    });

    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full rounded-2xl bg-[#13161c]/70 backdrop-blur-md border border-white/10 px-6 py-5 shadow-sm text-white mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search tasks..."
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-150"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-colors duration-150 flex items-center gap-2 cursor-pointer shrink-0 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            onClick={handlePrevious}
            disabled={page <= 1}
            className={`transition-colors duration-150 ${
              page <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white cursor-pointer'
            }`}
          >
            Previous
          </button>

          <span className="text-slate-400">
            Page <span className="text-white font-semibold">{page}</span> of{' '}
            <span className="text-white font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className={`transition-colors duration-150 ${
              page >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white cursor-pointer'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Render Modal into Document Body to prevent z-index clipping */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl bg-[#13161c] border border-white/15 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Create New Task</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Task details..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#13161c] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TasksCard;