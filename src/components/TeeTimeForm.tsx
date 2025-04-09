import { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Select, DatePicker, TimePicker, InputNumber } from "antd";
import { useRouter } from "next/router";
import { FormProps } from "@/utils/interface";
import { useAuthStore } from "@/store/authStore";
import { Role } from "@/utils/interface";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);
const { RangePicker } = DatePicker;

export enum Type {
  regular = "Regular",
  standing = "Standing",
}

export enum WeekDay {
  monday = "Monday",
  tuesday = "Tuesday",
  wednesday = "Wednesday",
  thursday = "Thursday",
  friday = "Friday",
  saturday = "Saturday",
  sunday = "Sunday",
}

export enum Status {
  pending = "Pending",
  approved = "Approved",
  denied = "Denied",
  canceled = "Canceled",
}

const TeeTimeForm = <T extends object>({
  onSubmit,
  beforeSubmit,
  mode = "create",
  initialValues,
}: FormProps<T>) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("regular")
  const isCreate = mode === "create";
  const isView = mode === "view";
  const role = useAuthStore((state) => state.role);
  const statusMap = Object.values(Status).map((s) => ({
    label: s,
    value: s,
    disabled: role !== Role.admin && role !== Role.staff && s !== 'Canceled'
  }))

  const formTitle = isCreate ? "Create Tee Time" : mode === "update" ? "Update Tee Time" : "View Tee Time";

  useEffect(() => {
    const currentType = form.getFieldValue("type");
    if (currentType) {
      setType(currentType);
    } else {
      setType(Type.regular)
    }
  }, []);

  const handleSubmit = async (values: T) => {
    const isValid = beforeSubmit?.(values);
    if (isValid === false) return;
    setLoading(true);
    onSubmit(values);
    setLoading(false);
  };

  return (
    <div style={{ margin: "auto", maxWidth: 600 }}>
      <h2>{formTitle}</h2>
      <Form<T> form={form} onFinish={handleSubmit} layout="vertical" disabled={isView} initialValues={{
        type: Type.regular,
        ...initialValues
      }}>
      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true }]}
      >
        <Select
          disabled={!isCreate || (role !== Role.admin && role !== Role.staff && role !== Role.shareholder)}
          options={Object.values(Type).map((t) => ({ label: t, value: t }))}
          onChange={(value) => {
            setType(value);
          }}
        />
      </Form.Item>
        {
          type === Type.regular ? (
            <Form.Item label="Player Count" name="player_count" rules={[{ required: true }]}>
              <InputNumber min={1} max={4} style={{ width: "100%" }} />
            </Form.Item>
          ) : null
        }

        <Form.Item label="Start Date" name="start_date" rules={[
            { required: true, message: "Please select start date" },
            {
              validator: (_, value) =>
                value && value.isBefore(dayjs().startOf("day"))
                  ? Promise.reject("Start date cannot be in the past")
                  : Promise.resolve(),
            },
          ]}>
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        {
          type === Type.standing ? (
            <>
              <Form.Item
                label="End Date"
                name="end_date"
                dependencies={["start_date"]}
                rules={[
                  {
                    validator: (_, value) => {
                      const startDate = form.getFieldValue("start_date");

                      if (value && startDate && dayjs(value).isSameOrBefore(dayjs(startDate))) {
                        return Promise.reject("End date must be after start date");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Requested Day" name="requested_day" rules={[{ required: true }]}>
                <Select options={Object.values(WeekDay).map((d) => ({ label: d, value: d }))} allowClear />
              </Form.Item>

              <Form.Item label="Requested Time" name="requested_time" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Member List (comma-separated usernames)" name="member_list" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              { mode === 'update' ? (
                <Form.Item label="Priority" name="priority">
                  <InputNumber disabled={role !== Role.admin && role !== Role.staff} min={1} max={10} style={{ width: "100%" }} />
                </Form.Item>
              ): null }
            </>
          ) : null
        }
        
        { mode === 'update' ? (
          <Form.Item label="Status" name="status">
            <Select options={statusMap} />
          </Form.Item>
        ): null }

        <Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {formTitle}
              </Button>
            </Col>
            <Col span={12}>
              <Button htmlType="button" onClick={() => router.back()} block>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TeeTimeForm;
