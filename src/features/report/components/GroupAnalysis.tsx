import { Card, Col, Row, Segmented, Typography } from "antd"; // removed unused Space
import { useState } from "react";
import GroupColumnGrpah from "./Grpah/GroupColumnGrpah";
import GroupPieGraph from "./Grpah/GroupPieGraph";
type Mode = "activity" | "user";

export default function GroupAnalysis({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string;
}) {
  const [mode, setMode] = useState<Mode>("activity");

  return (
    <Card
      title={
        <Typography.Title
          level={4}
          style={{ margin: 0 }}
          ellipsis={{ tooltip: "Time by dimension" }}
        >
          Group by {mode === "activity" ? "Activity" : "User"}
        </Typography.Title>
      }
      extra={
        <Segmented
          options={[
            { label: "By Activity", value: "activity" },
            { label: "By User", value: "user" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
        />
      }
    >
      <Row gutter={[16, 16]} style={{ alignItems: "stretch" }}>
        <Col xs={24} lg={12} style={{ display: "flex" }}>
          <GroupColumnGrpah loading={loading} error={error} mode={mode} />
        </Col>
        <Col xs={24} lg={12} style={{ display: "flex" }}>
          <GroupPieGraph loading={loading} error={error} mode={mode} />
        </Col>
      </Row>
    </Card>
  );
}
