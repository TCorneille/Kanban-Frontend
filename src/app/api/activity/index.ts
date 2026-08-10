import { apiSlice } from "../../apiEntry";

export interface ActivityLog {
  id: string;
  _id: string;
  user: string | { _id: string; name?: string; email?: string; avatar?: string };
  actionType: string;
  details: string;
  workspace?: { _id: string; name: string; slug: string };
  board?: { _id: string; name?: string; title?: string };
  task?: { _id: string; title: string };
  createdAt: string;
}

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyActivities: builder.query<ActivityLog[], number | void>({
      query: (limit = 10) => `api/v1/activities/me?limit=${limit}`,
      transformResponse: (res: any) => {
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.activities)) return res.data.activities;
        if (Array.isArray(res)) return res;
        return [];
      },
      providesTags: ["Activity"],
    }),
  }),
});

export const { useGetMyActivitiesQuery } = activityApi;