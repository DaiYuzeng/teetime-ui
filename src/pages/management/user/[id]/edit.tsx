import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, message, Select } from "antd";
import api from "@/utils/axios";

enum Role {
  admin = "admin",
  staff = "staff",
  worker = "worker",
  client = "client",
  guest = "guest"
}

interface User {
  id: number,
  username: string;
  phone: string;
  email: string;
  role: Role;
}

const UserEdit = () => {
  const router = useRouter();
  const id: string | undefined = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/user/${id}`);
        setUser(response.data);
      } catch (error) {
        message.error("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (id && user) {
      form.setFieldsValue(user);
    }
  }, [id, user, form]);

  const handleSubmit = async (values: User) => {
    setLoading(true);
    try {
      values.id = Number(id);
      await api.put(`/user/${id}`, values);
      message.success("User updated successfully!");
      form.resetFields();
      router.push('/management/user');
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Update User</h2>
      {user && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Username" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select a role" }]}>
            <Select
              options={Object.values(Role).map(role => ({ label: role, value: role }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update User
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UserEdit;
