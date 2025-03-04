import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Table, InputNumber } from "antd";
import { Project } from "@/pages/management/project/[id]";
import { ScheduleStatusMap, PaymentStatusMap} from "@/components/ProgressForm";
import api from "@/utils/axios";

interface FormProps {
  mode: "create" | "update" | "view";
  initialValues?: Project;
  onSuccess?: () => void;
}

const ScheduleStatusOptions = [
  { label: "Not Started", value: "notstarted" },
  { label: "In Progress", value: "inprogress" },
  { label: "Completed", value: "completed" },
  { label: "Not Applicable", value: "notapplicable" },
  { label: "RFQ", value: "rfq" },
];

const PaymentStatusOptions = [
  { label: "Not Paid", value: "notpaid" },
  { label: "Paid", value: "paid" },
];

const ProjectForm: React.FC<FormProps> = ({ mode, initialValues, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [progresses, setProgresses] = useState(initialValues?.progresses || []);
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === "update" && initialValues) {
      form.setFieldsValue(initialValues);
      setProgresses(initialValues.progresses || []);
    }
  }, [mode, initialValues, form]);

  const handleProgressChange = (progressId: number, field: string, value: any) => {
    setProgresses((prev) =>
      prev.map((progress) =>
        progress.progress_id === progressId ? { ...progress, [field]: value } : progress
      )
    );
  };

  const handleSubmit = async (values: { id: number; name: string; description: string }) => {
    setLoading(true);
    
    try {
      const payload = {
        ...values,
        id: initialValues?.id,
        progresses,
      };

      if (mode === "create") {
        await api.post("/project", payload);
        message.success("Project submitted successfully!");
      } else if (mode === "update" && initialValues?.id) {
        values.id = initialValues?.id;
        await api.put(`/project/${initialValues?.id}`, payload);
        message.success("Project updated successfully!");
      }

      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to submit project");
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Progress Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Schedule Status",
      dataIndex: "schedule_status",
      key: "schedule_status",
      render: (status: string, record: any) => (
        <Select
          defaultValue={status}
          onChange={(value) => handleProgressChange(record.progress_id, "schedule_status", value)}
          options={Object.entries(ScheduleStatusMap).map(([key, value]) => ({ label: value, value: key }))}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string, record: any) => (
        <Select
          defaultValue={status}
          onChange={(value) => handleProgressChange(record.progress_id, "payment_status", value)}
          options={Object.entries(PaymentStatusMap).map(([key, value]) => ({ label: value, value: key }))}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Cost ($)",
      dataIndex: "cost",
      key: "cost",
      render: (cost: number, record: any) => (
        <InputNumber
          min={0}
          defaultValue={cost}
          onChange={(value) => handleProgressChange(record.progress_id, "cost", value)}
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter project name" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      {mode !== "create" && (
        <>
          <h3>Progress List</h3>
          <Table columns={columns} dataSource={progresses} rowKey="progress_id" pagination={false} />
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {mode === "create" ? "Create Project" : "Update Project"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProjectForm;
