import { apiSlice } from "../../apiEntry";

/* ==========================================
1. TYPES & INTERFACES
========================================== */

export interface IColumn {
  _id?: string;
  title: string;
  position: number;
}

export interface IBoard {
  _id: string;
  title: string;
  workspace: string;
  columns: IColumn[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  board: string;
  columnId: string;
  position: number;
}

export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
}

export interface CreateBoardPayload {
  workspaceId: string;
  title: string;
  columns?: IColumn[];
}

export interface UpdateBoardPayload {
  boardId: string;
  title?: string;
  columns?: IColumn[];
}

/* ==========================================
2. RTK QUERY ENDPOINTS
========================================== */

export const boardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ===============================
       GET BOARDS (FOR WORKSPACE)
       =============================== */
    getBoards: builder.query<ApiResponse<{ boards: IBoard[] }>, string>({
      query: (workspaceId) => `api/v1/workspaces/${workspaceId}/boards`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.boards.map(({ _id }) => ({
                type: "Board" as const,
                id: _id,
              })),
              { type: "Board", id: "LIST" },
            ]
          : [{ type: "Board", id: "LIST" }],
    }),

    /* ===============================
       GET SINGLE BOARD DETAILS & TASKS
       =============================== */
    getBoardById: builder.query<
      ApiResponse<{ board: IBoard; tasks: ITask[] }>,
      string
    >({
      query: (boardId) => `api/v1/boards/${boardId}`,
      providesTags: (_result, _error, boardId) => [
        { type: "Board", id: boardId },
      ],
    }),

    /* ===============================
       CREATE BOARD
       =============================== */
    createBoard: builder.mutation<
      ApiResponse<{ board: IBoard }>,
      CreateBoardPayload
    >({
      query: ({ workspaceId, ...body }) => ({
        url: `api/v1/workspaces/${workspaceId}/boards`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Board", id: "LIST" }],
    }),

    /* ===============================
       UPDATE BOARD DETAILS
       =============================== */
    updateBoard: builder.mutation<
      ApiResponse<{ board: IBoard }>,
      UpdateBoardPayload
    >({
      query: ({ boardId, ...body }) => ({
        url: `api/v1/boards/${boardId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        { type: "Board", id: "LIST" },
      ],
    }),

    /* ===============================
       DELETE BOARD
       =============================== */
    deleteBoard: builder.mutation<ApiResponse<null>, string>({
      query: (boardId) => ({
        url: `api/v1/boards/${boardId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, boardId) => [
        { type: "Board", id: boardId },
        { type: "Board", id: "LIST" },
      ],
    }),
  }),

  overrideExisting: false,
});

/* ==========================================
3. GENERATED HOOKS
========================================== */

export const {
  useGetBoardsQuery,
  useGetBoardByIdQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardApi;