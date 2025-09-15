export type ReportTimeEntry = {
  id: string;
  activity?: {
    id: string;
    name: string;
    color?: string;
    folderId?: string;
  } | null;
  user?: {
    id: string;
    name?: string;
    email?: string;
  } | null;
  folder?: {
    id: string;
    name: string;
  } | null;
  duration: {
    startedAt: string; // ISO (UTC Z)
    stoppedAt: string; // ISO
  };
  note?: {
    tags?: string[];
    mentions?: string[];
    text?: string;
  } | null;
  timezone?: string; // "Z"
};

export type ReportPayload = {
  timeEntries: ReportTimeEntry[];
  // add more fields if present (projects, totals, etc.)
};

export type ReportFiltersState = {
  date: { start: string; end: string };
  userIds: string[]; // <- array
  activityIds: string[]; // <- array
};

export type ReportRequestBody = {
  date: {
    start: string;
    end: string;
  };
  fileType: "json" | "csv" | "pdf"; // adjust if API supports more
  activities?: {
    ids: string[];
  };
  users?: {
    ids: string[];
  };
};

export type ReportRequest = {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  activityIds?: string[];
  userIds?: string[];
};
