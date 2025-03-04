import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { Progress } from "@/pages/management/progress/progress/[id]";
import { Category } from "@/pages/management/progress/category/[id]";
import api from "@/utils/axios";

interface ProgressFormProps {
  mode: "create" | "update" | "view";
  initialValues?: Progress;
  onSuccess?: () => void;
}

export const ScheduleStatusMap: Record<string, string> = {
  completed: "Completed",
  inprogress: "In Progress",
  notstarted: "Not Started",
  notapplicable: "Not Applicable",
  rfq: "RFQ",
};

export const PaymentStatusMap: Record<string, string> = {
  paid: "Paid",
  notpaid: "Not Paid",
};

const ProgressForm: React.FC<ProgressFormProps> = ({ mode, initialValues, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category");

        console.log(response)
        setCategories(response.data.data);
      } catch (error) {
        message.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (mode === "update" && initialValues) {
      form.setFieldsValue(initialValues);
      const category = categories.find(cat => cat.id === initialValues.category_id);
      if (category) setSelectedCategory(category);
    }

    if (mode === "create") {
      form.setFieldsValue({
        schedule_status: "notstarted",
        payment_status: "notpaid"
      });
    }
  }, [mode, initialValues, categories, form]);

  const handleCategoryChange = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId) || null;
    setSelectedCategory(category);
  };

  const handleSubmit = async (values: { id: number, name: string, key: string, category_id: number, schedule_status: string, payment_status: string }) => {
    setLoading(true);

    try {
      if (mode === "create") {
        await api.post("/progress", values);
        message.success("Progress submitted successfully!");
      } else if (mode === "update" && initialValues?.id) {
        values.id = Number(initialValues?.id)
        await api.put(`/progress/${initialValues?.id}`, values);
        message.success("Progress updated successfully!");
      }

      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to submit progress");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter progress name" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Category" name="category_id" rules={[{ required: true, message: "Please select a category" }]}>
        <Select
          placeholder="Select category"
          loading={categories.length === 0}
          onChange={handleCategoryChange}
          options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
        />
      </Form.Item>
      <Form.Item label="Key" name="key" rules={[{ required: true, message: "Please enter progress key" }]}>
        <Input addonBefore={selectedCategory ? selectedCategory.key : ""} />
      </Form.Item>
      <Form.Item label="Schedule Status" name="schedule_status" rules={[{ required: true, message: "Please select a schedule status" }]}>
        <Select
          options={Object.entries(ScheduleStatusMap).map(([key, value]) => ({ label: value, value: key }))}
        />
      </Form.Item>

      <Form.Item label="Payment Status" name="payment_status" rules={[{ required: true, message: "Please select a payment status" }]}>
        <Select
          options={Object.entries(PaymentStatusMap).map(([key, value]) => ({ label: value, value: key }))}
        />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {mode === "create" ? "Create Progress" : "Update Progress"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProgressForm;
