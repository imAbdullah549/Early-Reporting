import { useEffect, useState } from "react";
import type { RootState } from "../app/store";
import { PageContainer } from "@ant-design/pro-layout";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../features/auth/auth.slice";
import { selectKpis } from "../features/report/selectors";
import Filters from "../features/report/components/Filters";
import ReportTable from "../features/report/components/ReportTable";
import { Alert, Card, Col, Row, Segmented, Space, Typography } from "antd";
import VirtualizedEntriesList from "../features/report/components/VirtualizedEntriesList";
import {
  useGenerateReportMutation,
  useGetTokenMutation,
} from "../features/earlyApi";
import {
  FieldTimeOutlined,
  FileUnknownFilled,
  UserOutlined,
} from "@ant-design/icons";
import GroupAnalysis from "../features/report/components/GroupAnalysis";
import DepthGraph from "../features/report/components/Grpah/DepthGrpah";

type Mode = "table" | "virtual";

export default function ReportingPage() {
  const dispatch = useDispatch();
  const filters = useSelector((s: RootState) => s.filters);
  const kpis = useSelector(selectKpis);

  const [getToken, tokenState] = useGetTokenMutation();
  const [generateReport, reportState] = useGenerateReportMutation();
  const [mode, setMode] = useState<Mode>("table");

  useEffect(() => {
    (async () => {
      if (!tokenState.isUninitialized) return;
      const res = await getToken({
        apiKey: "MzkwMTM1X2M5Y2IxNjBmMWJlZDRhN2FhYTQ3ZWZkMzdkMjg5Nzk0",
        apiSecret: "MzIxYzVlOWM1YTU3NDExY2I0ZThiOWMxYzk2ZmEzMmE",
      }).unwrap();
      dispatch(setToken(res.token));
    })();
  }, [dispatch, getToken, tokenState.isUninitialized]);

  useEffect(() => {
    (async () => {
      if (tokenState.isUninitialized || tokenState.isLoading) return;
      await generateReport({
        start: filters.date.start,
        end: filters.date.end,
        activityIds: filters.activityIds.length
          ? filters.activityIds
          : undefined,
        userIds: filters.userIds.length ? filters.userIds : undefined,
      }).unwrap();
    })();
  }, [
    dispatch,
    generateReport,
    filters.date.start,
    filters.date.end,
    filters.activityIds,
    filters.userIds,
    tokenState.isLoading,
    tokenState.isUninitialized,
  ]);

  const summary = [
    {
      title: "Total Hours",
      value: kpis.totalHours,
      icon: <FieldTimeOutlined style={{ color: "#FF3B3B" }} />,
      color: "#f5222d",
    },
    {
      title: "Entries",
      value: kpis.entryCount,
      icon: <FileUnknownFilled style={{ color: "#FA8C16" }} />,
      color: "#faad14",
    },
    {
      title: "Users",
      value: kpis.distinctUsers,
      icon: <UserOutlined style={{ color: "#52c41a" }} />,
      color: "#52c41a",
    },
  ];

  const isLoading = reportState.isLoading || reportState.isUninitialized;

  const errorMsg =
    (tokenState.isError && "Authentication failed") ||
    (reportState.isError && "Failed to load report") ||
    "";

  return (
    <PageContainer title={"Reporting"} extra={<Filters />}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {!!errorMsg && <Alert type="error" showIcon message={errorMsg} />}
        <Row gutter={[16, 16]} style={{ flex: 1 }}>
          {summary.map(({ title, value, icon }) => (
            <Col xs={24} sm={8} key={title} style={{ display: "flex" }}>
              <Card style={{ flex: 1 }}>
                <Row align="middle" justify="space-between">
                  <Col>
                    <Typography.Text style={{ fontSize: 14, fontWeight: 300 }}>
                      {title}
                    </Typography.Text>
                  </Col>
                  <Col style={{ fontSize: 18 }}>{icon}</Col>
                </Row>
                <Row>
                  <Col>
                    <Typography.Text
                      strong
                      style={{ fontSize: 40, lineHeight: "40px" }}
                    >
                      {value}
                    </Typography.Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        <GroupAnalysis loading={isLoading} error={errorMsg} />
        <DepthGraph loading={isLoading} error={errorMsg} />

        <Card
          extra={
            <Segmented
              options={[
                { label: "Table", value: "table" },
                { label: "Virtualized List", value: "virtual" },
              ]}
              value={mode}
              onChange={(v) => setMode(v as Mode)}
            />
          }
        >
          {mode === "table" ? (
            <ReportTable loading={isLoading} />
          ) : (
            <VirtualizedEntriesList loading={isLoading} />
          )}
        </Card>
      </Space>
    </PageContainer>
  );
}
