import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import api from "@/utils/axios";

interface InquiryFormProps {
  mode: "create" | "edit" | "view";
  inquiryId?: string;
  initialValues?: { guest_name: string; phone: string; email?: string; message?: string, status?: string };
  onSuccess?: () => void;
}

const StatusField: React.FC<InquiryFormProps> = ({ mode }) => {
  if (mode !== 'edit') return null;

  const statusOptions = [
    { value: 'waiting', label: <span>Waiting</span> },
    { value: 'responsed', label: <span>Responsed</span> }
  ]

  return (
    <Form.Item label="Status" name="status">
        <Select options={statusOptions} />
      </Form.Item>
  )
}

const InquiryForm: React.FC<InquiryFormProps> = ({ mode, inquiryId, initialValues, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [mode, initialValues, form]);

  const handleSubmit = async (values: { id: number, guest_name: string; phone: string; email?: string; message?: string, status: string }) => {
    setLoading(true);
    values.id = Number(inquiryId)
    
    try {
      if (mode === "create") {
        await api.post("/inquiry", values);
        message.success("Inquiry submitted successfully!");
      } else if (mode === "edit" && inquiryId) {
        await api.put(`/inquiry/${inquiryId}`, values);
        message.success("Inquiry updated successfully!");
      }

      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to submit inquiry");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Name" name="guest_name" rules={[{ required: true, message: "Please enter your name" }]}>
        <Input disabled={true} />
      </Form.Item>
      <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone" }]}>
        <Input disabled={true} />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input type="email" disabled={true} />
      </Form.Item>
      
      <StatusField mode={mode} />

      <Form.Item label="Message" name="message">
        <Input.TextArea rows={4} disabled={true} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {mode === "create" ? "Submit Inquiry" : "Update Inquiry"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InquiryForm;
