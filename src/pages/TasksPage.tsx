import React from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskColumn } from '../components/TaskColumn';
import {
  useGetTasksByBoardQuery,
  useMoveTaskMutation,
  type ITask,
} from '../app/api/task';

const initialColumns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const TasksPage: React.FC<{ boardId?: string }> = ({ boardId: propBoardId }) => {
  const params = useParams<{ boardId?: string; id?: string }>();
  
  const activeBoardId =
    propBoardId ||
    params.boardId ||
    params.id ||
    '';

  const { data, isLoading, isError, error } = useGetTasksByBoardQuery(activeBoardId, {
    skip: !activeBoardId,
  });
  const [moveTask] = useMoveTaskMutation();

  const boardData = data?.data as { boardTitle?: string; title?: string; tasks?: ITask[] } | undefined;
  const tasks: ITask[] = boardData?.tasks || [];
  const boardName: string = boardData?.boardTitle || boardData?.title || 'Board Tasks';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const findColumnOfTask = (id: string) => {
    return tasks.find((task) => task._id === id)?.columnId;
  };

  const handleDragOver = (_event: DragOverEvent) => {};

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumnOfTask(activeId);
    const overColumn = initialColumns.some((col) => col.id === overId)
      ? overId
      : findColumnOfTask(overId);

    if (!activeColumn || !overColumn) return;

    const targetColumnTasks = tasks
      .filter((t) => t.columnId === overColumn)
      .sort((a, b) => a.position - b.position);

    let newPosition = 0;

    if (activeColumn === overColumn) {
      const oldIndex = targetColumnTasks.findIndex((t) => t._id === activeId);
      const newIndex = targetColumnTasks.findIndex((t) => t._id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(targetColumnTasks, oldIndex, newIndex);
        newPosition = reordered.findIndex((t) => t._id === activeId);
      } else {
        return;
      }
    } else {
      const overIndex = targetColumnTasks.findIndex((t) => t._id === overId);
      newPosition = overIndex >= 0 ? overIndex : targetColumnTasks.length;
    }

    try {
      await moveTask({
        taskId: activeId,
        boardId: activeBoardId,
        columnId: overColumn,
        position: newPosition,
      }).unwrap();
    } catch (err) {
      console.error('Failed to persist task move:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0e1015] text-slate-400">
        Loading tasks...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#0e1015] text-red-400 gap-2">
        <p className="font-semibold text-lg">Error loading board tasks.</p>
        <p className="text-slate-500 text-sm">
          Active Board ID: <span className="text-amber-400">{activeBoardId}</span>
        </p>
        <p className="text-xs text-slate-600">
          {JSON.stringify(error)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0e1015] p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6 px-2">
        {boardName}
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 items-start overflow-x-auto">
          {initialColumns.map((col) => {
            const columnTasks = tasks
              .filter((t) => t.columnId === col.id)
              .sort((a, b) => a.position - b.position);

            return (
              <TaskColumn
                key={col.id}
                columnId={col.id}
                title={col.title}
                boardId={activeBoardId}
                tasks={columnTasks}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default TasksPage;