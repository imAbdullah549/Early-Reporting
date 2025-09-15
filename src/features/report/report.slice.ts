import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import type { ReportFiltersState, ReportPayload } from "./types";
import { earlyApi } from "../earlyApi";

const initialStart = dayjs().subtract(1, "month").format("YYYY-MM-DD");
const initialEnd = dayjs().format("YYYY-MM-DD");

export const initialDateRange = { start: initialStart, end: initialEnd };

const reportSlice = createSlice({
  name: "report",
  initialState: { data: null as ReportPayload | null },
  reducers: {
    setReport(state, action: PayloadAction<ReportPayload | null>) {
      state.data = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      earlyApi.endpoints.generateReport.matchFulfilled,
      (state, { payload }) => {
        state.data = payload; // auto-fill report slice
      }
    );
  },
});
export const { setReport } = reportSlice.actions;
export default reportSlice.reducer;

export const initialFilters: ReportFiltersState = {
  date: initialDateRange,
  userIds: [],
  activityIds: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFilters,
  reducers: {
    setDate(state, action: PayloadAction<{ start: string; end: string }>) {
      state.date = action.payload;
    },
    setUserIds(state, action: PayloadAction<string[]>) {
      state.userIds = action.payload;
    },
    setActivityIds(state, action: PayloadAction<string[]>) {
      state.activityIds = action.payload;
    },
    resetFilters() {
      return initialFilters;
    },
  },
});

export const { setDate, setUserIds, setActivityIds, resetFilters } =
  filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;
