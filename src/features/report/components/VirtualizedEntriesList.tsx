import { useSelector } from "react-redux";
import VirtualList from "rc-virtual-list";
import { Avatar, List, Space } from "antd";
import { selectEntries } from "../selectors";
import type { ReportTimeEntry } from "../types";
import { initials } from "../../../utils/string";
import { durMin, fmt } from "../../../utils/time";
import React, { useEffect, useMemo, useState } from "react";

const CONTAINER_HEIGHT = 550; // viewport height
const ITEM_HEIGHT = 56; // row height
const PAGE_SIZE = 15; // load 10 at a time

const VirtualizedEntriesList: React.FC<{ loading?: boolean }> = ({
  loading,
}) => {
  const allRows = useSelector(selectEntries);
  const [data, setData] = useState<ReportTimeEntry[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setPage(1);
    setData(allRows.slice(0, PAGE_SIZE));
  }, [allRows]);

  const canLoadMore = useMemo(
    () => data.length < allRows.length,
    [data.length, allRows.length]
  );

  const appendNextPage = async () => {
    if (!canLoadMore || loading) return;
    setIsLoading(true);

    // simulate async (if fetching from server, replace with await fetch())
    await new Promise((r) => setTimeout(r, 500));

    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const nextChunk = allRows.slice(start, end);

    setData((prev) => [...prev, ...nextChunk]);
    setPage((p) => p + 1);

    setIsLoading(false);
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const el = e.currentTarget;
    // near-bottom check
    if (Math.abs(el.scrollHeight - el.scrollTop - CONTAINER_HEIGHT) <= 1) {
      appendNextPage();
    }
  };

  return (
    <List
      loading={isLoading}
      header={
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr 200px 200px 120px",
            padding: "10px 12px",
            background: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
            fontWeight: 600,
          }}
        >
          <div>User</div>
          <div>Activity</div>
          <div>Start</div>
          <div>End</div>
          <div style={{ textAlign: "right" }}>Duration</div>
        </div>
      }
    >
      <VirtualList
        data={data}
        height={CONTAINER_HEIGHT}
        itemHeight={ITEM_HEIGHT}
        itemKey="id"
        onScroll={onScroll}
      >
        {(item: ReportTimeEntry, index: number) => {
          const userLabel = item.user?.email || item.user?.name || "Unknown";
          const activityName = item.activity?.name || "—";
          const activityColor = item.activity?.color || "#d9d9d9";

          return (
            <List.Item
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "320px 1fr 200px 200px 120px",
                alignItems: "center",
                paddingBlock: 0,
                height: ITEM_HEIGHT,
                background: index % 2 ? "#fff" : "#fcfcfc",
              }}
            >
              {/* User */}
              <List.Item.Meta
                style={{ display: "flex", alignItems: "center" }}
                avatar={
                  <Avatar size="small">
                    {initials(item.user?.name || item.user?.email)}
                  </Avatar>
                }
                title={userLabel}
                description={null}
              />
              {/* Activity */}

              <Space>
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: activityColor,
                    border: "1px solid #e5e5e5",
                  }}
                />

                {activityName}
              </Space>

              {/* Start */}
              <div>{fmt(item.duration.startedAt)}</div>
              {/* End */}
              <div>{fmt(item.duration.stoppedAt)}</div>
              {/* Duration */}
              <div
                style={{
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {durMin(item.duration.startedAt, item.duration.stoppedAt)}
              </div>
            </List.Item>
          );
        }}
      </VirtualList>

      {/* Optional footer hint */}
      {!canLoadMore && (
        <div style={{ textAlign: "center", padding: 8, color: "#999" }}>
          All {allRows.length} items loaded
        </div>
      )}
    </List>
  );
};

export default VirtualizedEntriesList;
