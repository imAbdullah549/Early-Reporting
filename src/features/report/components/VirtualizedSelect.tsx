import { Select } from "antd";

export type Option = { label: string; value: string };

export default function VirtualizedSelect(props: {
  options: Option[];
  value?: string[];
  placeholder?: string;
  onChange: (v: string[]) => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Select
      style={{ minWidth: 280 }}
      placeholder={props.placeholder}
      options={props.options}
      value={props.value}
      onChange={(v) => props.onChange(v)}
      showSearch
      filterOption={(input, opt) =>
        (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
      virtual
      listHeight={256}
      allowClear
      mode="multiple"
      loading={props.loading}
      disabled={props.disabled}
    />
  );
}
