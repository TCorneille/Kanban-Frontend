import { apiSlice } from "../../apiEntry";

export interface IMember {
  user: string | { _id: string; name?: string; email?: string };
  role: 'owner' | 'admin' | 'member';
}

export interface IWorkspace {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
  owner: string | { _id: string; name?: string; email?: string };
  members?: IMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AddMemberPayload {
  workspaceId: string;
  email?: string;
  userId?: string;
  role?: 'owner' | 'admin' | 'member' | string;
}

// 1. Interface for the dashboard stats response
export interface IDashboardStats {
  workspaces: number;
  openTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export const workspaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 2. Query endpoint for fetching stats
    getDashboardStats: builder.query<IDashboardStats, void>({
      query: () => '/api/v1/workspaces/stats',
      transformResponse: (response: any): IDashboardStats => {
        return (
          response?.data || {
            workspaces: 0,
            openTasks: 0,
            completedTasks: 0,
            overdueTasks: 0,
          }
        );
      },
      providesTags: ['Workspace', 'Board', 'Task'], // Invalidates when workspace or tasks change
    }),

    getUserWorkspaces: builder.query<IWorkspace[], void>({
      query: () => '/api/v1/workspaces',
      transformResponse: (response: any): IWorkspace[] => {
        if (Array.isArray(response)) return response;
        if (response?.data?.workspaces) return response.data.workspaces;
        if (response?.workspaces) return response.workspaces;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Workspace' as const, id: _id })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }],
    }),

    getWorkspaceById: builder.query<IWorkspace, string>({
      query: (workspaceId) => `/api/v1/workspaces/${workspaceId}`,
      transformResponse: (response: any): IWorkspace => {
        return response?.data?.workspace || response;
      },
      providesTags: (_result, _error, workspaceId) => [
        { type: 'Workspace', id: workspaceId },
      ],
    }),

    createWorkspace: builder.mutation<IWorkspace, { name: string; description?: string }>({
      query: (body) => ({
        url: '/api/v1/workspaces',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): IWorkspace => {
        return response?.data?.workspace || response;
      },
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    deleteWorkspace: builder.mutation<{ status: string }, string>({
      query: (workspaceId) => ({
        url: `/api/v1/workspaces/${workspaceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    addMember: builder.mutation<IWorkspace, AddMemberPayload>({
      query: ({ workspaceId, email, userId, role = 'member' }) => {
        if (!workspaceId) {
          throw new Error('Workspace ID is missing or undefined.');
        }

        const body: Record<string, any> = { role };
        if (email) body.email = email;
        if (userId) body.userId = userId;

        return {
          url: `/api/v1/workspaces/${workspaceId}/members`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (response: any): IWorkspace => {
        return response?.data?.workspace || response;
      },
      invalidatesTags: (_result, _error, { workspaceId }) => [
        { type: 'Workspace', id: workspaceId },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    removeMember: builder.mutation<IWorkspace, { workspaceId: string; userId: string }>({
      query: ({ workspaceId, userId }) => {
        if (!workspaceId) {
          throw new Error('Workspace ID is missing or undefined.');
        }
        return {
          url: `/api/v1/workspaces/${workspaceId}/members/${userId}`,
          method: 'DELETE',
        };
      },
      transformResponse: (response: any): IWorkspace => {
        return response?.data?.workspace || response;
      },
      invalidatesTags: (_result, _error, { workspaceId }) => [
        { type: 'Workspace', id: workspaceId },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),
  }),
});

// 3. Export hook alongside existing hooks
export const {
  useGetDashboardStatsQuery,
  useGetUserWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = workspaceApi;