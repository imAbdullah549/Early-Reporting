import dayjs from "dayjs";
import { selectFilters } from "../selectors";
import type { RootState } from "../../../app/store";
import VirtualizedSelect from "./VirtualizedSelect";
import { Button, DatePicker, Flex, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useFetchActivitiesQuery, useFetchMembersQuery } from "../../earlyApi";
import {
  setActivityIds,
  setDate,
  setUserIds,
  resetFilters,
} from "../report.slice";

const { RangePicker } = DatePicker;

export default function Filters() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const token = useSelector((s: RootState) => s.auth.token);

  const {
    data: allActivities = [],
    isLoading: actLoading,
    isFetching: actFetching,
  } = useFetchActivitiesQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const activityOptions = allActivities.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const {
    data: users = [],
    isLoading: memLoading,
    isFetching: memFetching,
  } = useFetchMembersQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const userOption = users.map((m) => ({
    value: m.id,
    label: m.email || m.name || `User ${m.id}`,
  }));

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={8}>
      <Flex gap={8} wrap>
        <RangePicker
          value={[dayjs(filters.date.start), dayjs(filters.date.end)]}
          onChange={(v) => {
            if (v && v[0] && v[1]) {
              dispatch(
                setDate({
                  start: v[0].format("YYYY-MM-DD"),
                  end: v[1].format("YYYY-MM-DD"),
                })
              );
            }
          }}
          allowClear={false}
        />

        <VirtualizedSelect
          options={userOption}
          value={filters.userIds}
          placeholder="Filter by user"
          onChange={(v) => dispatch(setUserIds(v))}
          loading={memLoading || memFetching}
          disabled={!token}
        />

        <VirtualizedSelect
          options={activityOptions}
          value={filters.activityIds}
          placeholder="Filter by activity"
          onChange={(v) => dispatch(setActivityIds(v))}
          loading={actLoading || actFetching}
          disabled={!token}
        />

        <Button onClick={() => dispatch(resetFilters())}>Reset</Button>
      </Flex>
    </Space>
  );
}
