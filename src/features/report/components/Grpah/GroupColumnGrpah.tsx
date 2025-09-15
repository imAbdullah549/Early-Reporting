import { Card, Result, Spin } from "antd"; // removed unused Space
import { Column } from "@ant-design/plots";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  selectKpis,
  selectMinutesPerProject,
  selectMinutesPerUser,
} from "../../selectors";

type Mode = "activity" | "user";

export default function GroupColumnGrpah({
  loading,
  error,
  mode,
}: {
  loading?: boolean;
  error?: string;
  mode?: Mode;
}) {
  const perActivity = useSelector(selectMinutesPerProject);
  const perUser = useSelector(selectMinutesPerUser);
  const kpis = useSelector(selectKpis);

  const data = mode === "activity" ? perActivity : perUser;

  const totalHours = kpis.totalHours;

  const columnCfg = useMemo(
    () => ({
      data,
      xField: "name",
      yField: "minutes",
      colorField: "name",
      height: 450,
      label: {
        text: (d: { minutes: number }) =>
          `${((d.minutes / 60 / totalHours) * 100).toFixed(1)}%`,
        textBaseline: "bottom",
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
          ) => {
            return (
              <>
                <h4>{title}</h4>
                {items.map((item) => {
                  const { color, value } = item;
                  return (
                    <div>
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
                          ></span>
                          <span>Minutes</span>
                        </div>
                        <b>{value}</b>
                      </div>
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
                          ></span>
                          <span>Hours</span>
                        </div>
                        <b>{value / 60}</b>
                      </div>
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
                          ></span>
                          <span>Avg</span>
                        </div>
                        <b>{`${((value / 60 / totalHours) * 100).toFixed(
                          1
                        )} %`}</b>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          },
        },
      },
    }),
    [data, totalHours]
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
    <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Spin spinning={!!loading} tip="Loading chart...">
        <Column {...columnCfg} />
      </Spin>
    </Card>
  );
}
