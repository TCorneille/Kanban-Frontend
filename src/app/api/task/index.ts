import { apiSlice } from "../../apiEntry";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  board: string;
  columnId: string;
  position: number;
  priority?: TaskPriority;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
}

export interface CreateTaskPayload {
  boardId: string;
  title: string;
  columnId: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: string;
  position?: number;
}

export interface UpdateTaskPayload {
  taskId: string;
  boardId: string;
  body: Partial<Omit<ITask, "_id" | "board">>;
}

export interface MoveTaskPayload {
  taskId: string;
  boardId: string;
  columnId: string;
  position: number;
  sourceColumnName?: string;
  targetColumnName?: string;
}

export const taskApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Activity"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTasksByBoard: builder.query<ApiResponse<{ tasks: ITask[] }>, string>({
        query: (boardId) => `api/v1/boards/${boardId}/tasks`,
        providesTags: (result, _error, boardId) =>
          result
            ? [
                ...result.data.tasks.map(({ _id }) => ({
                  type: "Task" as const,
                  id: _id,
                })),
                { type: "Task", id: `BOARD_${boardId}` },
              ]
            : [{ type: "Task", id: `BOARD_${boardId}` }],
      }),

      getTaskById: builder.query<ApiResponse<{ task: ITask }>, string>({
        query: (taskId) => `api/v1/tasks/${taskId}`,
        providesTags: (_result, _error, taskId) => [
          { type: "Task", id: taskId },
        ],
      }),

      createTask: builder.mutation<
        ApiResponse<{ task: ITask }>,
        CreateTaskPayload
      >({
        query: ({ boardId, ...body }) => ({
          url: `api/v1/boards/${boardId}/tasks`,
          method: "POST",
          body,
        }),
        // 🚀 Invalidates Activity cache so ActivityCard updates live!
        invalidatesTags: (_result, _error, { boardId }) => [
          { type: "Task", id: `BOARD_${boardId}` },
          { type: "Activity" },
        ],
      }),

      updateTask: builder.mutation<
        ApiResponse<{ task: ITask }>,
        UpdateTaskPayload
      >({
        query: ({ taskId, body }) => ({
          url: `api/v1/tasks/${taskId}`,
          method: "PATCH",
          body,
        }),
        // 🚀 Invalidates Activity cache
        invalidatesTags: (_result, _error, { taskId, boardId }) => [
          { type: "Task", id: taskId },
          { type: "Task", id: `BOARD_${boardId}` },
          { type: "Activity" },
        ],
      }),

      moveTask: builder.mutation<ApiResponse<{ task: ITask }>, MoveTaskPayload>(
        {
          query: ({
            taskId,
            columnId,
            position,
            sourceColumnName,
            targetColumnName,
          }) => ({
            url: `api/v1/tasks/${taskId}/move`,
            method: "PATCH",
            body: { columnId, position, sourceColumnName, targetColumnName },
          }),
          invalidatesTags: [{ type: "Task" }, { type: "Activity" }],
        },
      ),

      deleteTask: builder.mutation<
        ApiResponse<null>,
        { taskId: string; boardId: string }
      >({
        query: ({ taskId }) => ({
          url: `api/v1/tasks/${taskId}`,
          method: "DELETE",
        }),
        // 🚀 Invalidates Activity cache when task is deleted
        invalidatesTags: (_result, _error, { boardId }) => [
          { type: "Task", id: `BOARD_${boardId}` },
          { type: "Activity" },
        ],
      }),
    }),

    overrideExisting: false,
  });

export const {
  useGetTasksByBoardQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
