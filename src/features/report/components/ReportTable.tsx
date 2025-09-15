import { Table } from "antd";
import { useSelector } from "react-redux";
import { selectEntries } from "../selectors";
import type { ReportTimeEntry } from "../types";
import type { ColumnsType } from "antd/es/table";
import { durMin, fmt } from "../../../utils/time";

export default function ReportTable({ loading }: { loading?: boolean }) {
  const rows = useSelector(selectEntries);

  const columns: ColumnsType<ReportTimeEntry> = [
    {
      title: "User",
      dataIndex: ["user", "email"],
      key: "user",
      render: (email: string) => email || "—",
    },
    {
      title: "Activity",
      dataIndex: ["activity", "name"],
      key: "activity",
      render: (name: string) => name || "—",
    },
    {
      title: "Start",
      key: "start",
      dataIndex: ["duration", "startedAt"],
      render: (startedAt: string) => fmt(startedAt),
    },
    {
      title: "End",
      key: "end",
      dataIndex: ["duration", "stoppedAt"],
      render: (stoppedAt: string) => fmt(stoppedAt),
    },
    {
      title: "Duration",
      key: "dur",
      render: (_, r) => durMin(r.duration.startedAt, r.duration.stoppedAt),
    },
  ];

  return (
    <Table
      loading={loading}
      rowKey={(r) => r.id}
      dataSource={rows}
      columns={columns}
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
}
