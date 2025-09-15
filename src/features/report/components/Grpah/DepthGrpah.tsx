import dayjs from "dayjs";
import { useMemo } from "react";
import { Column } from "@ant-design/plots";
import { Card, Col, Result, Row, Typography } from "antd";
import { useSelector, shallowEqual } from "react-redux";
import { selectEntries } from "../../selectors";
import { formatHours } from "../../../../utils/time";

type Datum = { time: string; value: number; activity: string };

export default function DepthGraph({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string;
}) {
  const rows = useSelector(selectEntries, shallowEqual);

  const transformed = useMemo<Datum[]>(() => {
    return rows
      .map((row) => {
        const start = dayjs(row.duration.startedAt);
        const end = dayjs(row.duration.stoppedAt);
        if (!start.isValid() || !end.isValid()) return null;

        const minutes = end.diff(start, "minute");
        if (minutes <= 0) return null;

        return {
          time: start.format("ddd - DD-MMM-YY"),
          value: minutes / 60,
          activity: row?.activity?.name?.trim() || "Uncategorized",
        };
      })
      .filter((x): x is Datum => Boolean(x));
  }, [rows]);

  const aggregated = useMemo<Datum[]>(() => {
    const acc: Record<string, Datum> = {};
    for (const cur of transformed) {
      const key = `${cur.time}__${cur.activity}`;
      if (!acc[key]) acc[key] = { ...cur };
      else acc[key].value += cur.value;
    }
    return Object.values(acc);
  }, [transformed]);

  // slider ratio
  const { total, visible, ratio } = useMemo(() => {
    const totalDays = new Set(aggregated.map((d) => d.time)).size;
    const visible = 25;
    const ratio = totalDays > visible ? visible / totalDays : 1;
    return { total: totalDays, visible, ratio };
  }, [aggregated]);

  const columnCfg = useMemo(() => {
    return {
      data: aggregated,
      xField: "time",
      yField: "value",
      colorField: "activity",
      stack: true,
      axis: {
        y: { labelFormatter: (d: number) => `${d}h` },
        x: { columnWidth: 5 },
      },
      scrollbar: total > visible ? { x: { ratio } } : false,
      style: {
        maxWidth: 20,
        radiusTopLeft: 10,
        radiusTopRight: 10,
      },
      interaction: {
        tooltip: {
          render: (
            _e: unknown,
            {
              title,
              items,
            }: {
              title: string;
              items: Array<{ color: string; value: number; name: string }>;
            }
          ) => (
            <>
              <h4>{title}</h4>
              {items.map(({ color, value, name }, idx) => (
                <div key={`${title}-${name}-${idx}`}>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: color,
                          marginRight: 6,
                        }}
                      />
                      <span>{name}</span>
                    </div>
                    <b>{formatHours(value)}</b>
                  </div>
                </div>
              ))}
            </>
          ),
        },
      },
    } as const;
  }, [aggregated, total, visible, ratio]);

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
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Daily Analysis
        </Typography.Title>
      }
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Column {...columnCfg} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
