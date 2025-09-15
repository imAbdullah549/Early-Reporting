import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import type {
  ReportPayload,
  ReportRequest,
  ReportRequestBody,
} from "./report/types";

export type TokenResponse = { token: string };

export type User = {
  id: string;
  name?: string;
  email?: string;
};

type UsersResponse = {
  users?: Omit<User, "status">[];
};

export type Activity = {
  id: string;
  name: string;
  color?: string;
  folderId?: string;
  status: "active" | "inactive" | "archived";
};

type ActivitiesResponse = {
  activities?: Omit<Activity, "status">[];
  inactiveActivities?: Omit<Activity, "status">[];
  archivedActivities?: Omit<Activity, "status">[];
};

export type ReportResponse = ReportPayload;

const baseUrl = import.meta.env.PROD ? "/api/proxy" : "/proxy";

export const earlyApi = createApi({
  reducerPath: "earlyApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getToken: builder.mutation<
      TokenResponse,
      { apiKey: string; apiSecret: string }
    >({
      query: ({ apiKey, apiSecret }) => ({
        url: "/api/v4/developer/sign-in",
        method: "POST",
        body: { apiKey, apiSecret },
      }),
    }),
    generateReport: builder.mutation<ReportResponse, ReportRequest>({
      query: ({ start, end, activityIds, userIds }) => {
        const body: ReportRequestBody = {
          date: { start, end },
          fileType: "json",
        };

        if (activityIds && activityIds.length) {
          body.activities = { ids: activityIds };
        }

        if (userIds && userIds?.length) {
          body.users = { ids: userIds };
        }

        return {
          url: "/api/v4/report",
          method: "POST",
          body,
        };
      },
    }),
    fetchActivities: builder.query<Activity[], void>({
      query: () => ({ url: "/api/v4/activities", method: "GET" }),
      transformResponse: (res: ActivitiesResponse): Activity[] => {
        const active = (res.activities ?? []).map((a) => ({
          ...a,
          status: "active" as const,
        }));
        const inactive = (res.inactiveActivities ?? []).map((a) => ({
          ...a,
          status: "inactive" as const,
        }));
        const archived = (res.archivedActivities ?? []).map((a) => ({
          ...a,
          status: "archived" as const,
        }));
        return [...active, ...inactive, ...archived];
      },
    }),
    fetchMembers: builder.query<User[], void>({
      query: () => ({
        url: `/api/v4/users`,
        method: "GET",
      }),
      transformResponse: (res: UsersResponse): User[] => {
        return (res.users ?? []).map((u) => ({
          ...u,
          status: "active" as const,
        }));
      },
    }),
  }),
});
export const {
  useGetTokenMutation,
  useGenerateReportMutation,
  useFetchActivitiesQuery,
  useFetchMembersQuery,
} = earlyApi;
