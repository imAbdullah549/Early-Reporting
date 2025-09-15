import { configureStore } from "@reduxjs/toolkit";
import { earlyApi } from "../features/earlyApi";
import authReducer from "../features/auth/auth.slice";
import reportReducer, { filtersReducer } from "../features/report/report.slice";

export const store = configureStore({
  reducer: {
    [earlyApi.reducerPath]: earlyApi.reducer,
    auth: authReducer,
    report: reportReducer,
    filters: filtersReducer,
  },
  middleware: (gDM) => gDM().concat(earlyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
