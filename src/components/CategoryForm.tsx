import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { Category } from "@/pages/management/progress/category/[id]";
import api from "@/utils/axios";

interface CategoryFormProps {
  mode: "create" | "update" | "view";
  initialValues?: Category;
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ mode, initialValues, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === "update" && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [mode, initialValues, form]);

  const handleSubmit = async (values: { id: number, name: string, key: string, description: string }) => {
    setLoading(true);
    
    try {
      if (mode === "create") {
        await api.post("/category", values);
        message.success("Category submitted successfully!");
      } else if (mode === "update" && initialValues?.id) {
        values.id = Number(initialValues?.id)
        await api.put(`/category/${initialValues?.id}`, values);
        message.success("Category updated successfully!");
      }

      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to submit category");
    }
    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter category name" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Key" name="key" rules={[{ required: true, message: "Please enter category key" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {mode === "create" ? "Create Category" : "Update Category"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
