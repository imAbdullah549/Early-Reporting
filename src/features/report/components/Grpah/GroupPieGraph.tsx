import { Pie } from "@ant-design/plots";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { Card, Result, Segmented, Spin, Typography } from "antd"; // removed unused Space
import {
  selectKpis,
  selectMinutesPerProject,
  selectMinutesPerUser,
} from "../../selectors";

type Metric = "minutes" | "hours" | "percent";
type Mode = "activity" | "user";

export default function GroupPieGraph({
  loading,
  error,
  mode,
}: {
  loading?: boolean;
  error?: string;
  mode: Mode;
}) {
  const perActivity = useSelector(selectMinutesPerProject);
  const perUser = useSelector(selectMinutesPerUser);
  const kpis = useSelector(selectKpis);

  const [metric, setMetric] = useState<Metric>("minutes");

  const data = mode === "activity" ? perActivity : perUser;

  const totalMinutes = kpis.totalHours * 60;
  const totalHours = kpis.totalHours;

  const pieData = useMemo(
    () =>
      (data ?? []).map((d) => {
        const minutes = d.minutes || 0;
        const hours = minutes / 60;
        const percent = totalHours > 0 ? (hours / totalHours) * 100 : 0;
        const value =
          metric === "minutes" ? minutes : metric === "hours" ? hours : percent;
        return { ...d, value };
      }),
    [data, metric, totalHours]
  );

  const formatValue = (v: number) => {
    if (metric === "minutes") return `${Math.round(v)} min`;
    if (metric === "hours") return `${v.toFixed(1)} h`;
    return `${v.toFixed(1)} %`;
  };

  const centerText =
    metric === "minutes"
      ? `${Math.round(totalMinutes)} min`
      : metric === "hours"
      ? `${totalHours.toFixed(1)} h`
      : "100 %";

  const pieCfg = useMemo(
    () => ({
      data: pieData,
      angleField: "value",
      colorField: "name",
      height: 450,
      radius: 1,
      innerRadius: 0.6,
      label: {
        text: (d: any) => `${d.name}\n ${formatValue(d.value)}`,
      },
      legend: {
        color: {
          position: "bottom",
          layout: { justifyContent: "center" },
        },
      },
      annotations: [
        {
          type: "text",
          style: {
            text: () => centerText,
            x: "50%",
            y: "50%",
            textAlign: "center",
            fontSize: 40,
            // THE FIX:
            fontWeight: 600, // was fontStyle: "bold"
          },
        },
      ],
    }),
    [pieData, formatValue, centerText]
  );

  if (error) {
    return (
      <Card>
        <Result
          status="error"
          title="Couldn’t load the chart"
          subTitle={error}
        />
      </Card>
    );
  }

  return (
    <Card
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Text strong>Distribution</Typography.Text>
          <Segmented
            size="small"
            options={[
              { label: "Minutes", value: "minutes" },
              { label: "Hours", value: "hours" },
              { label: "%", value: "percent" },
            ]}
            value={metric}
            onChange={(v) => setMetric(v as Metric)}
          />
        </div>
      }
    >
      <Spin spinning={!!loading} tip="Loading chart...">
        <Pie {...pieCfg} />
      </Spin>
    </Card>
  );
}
