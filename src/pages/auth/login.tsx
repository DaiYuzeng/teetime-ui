import api from "@/utils/axios";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/router";
import { Button, Form, Input, message } from "antd";
import { hashPassword } from "@/utils/crypto";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (values: { username: string; password: string, role: string }) => {
    setLoading(true);
    
    try {
      const formData = new URLSearchParams();
      
      formData.append("username", values.username);
      formData.append("password", await hashPassword(values.password));

      const response = await api.post("/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setAuth(values.username, response.data.role, response.data.access_token, response.data.refresh_token);
      messageApi.success("Login successful!");
      router.push("/management/dashboard");
    } catch (error: any) {
      messageApi.error(error.response?.data?.detail || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: "auto", maxWidth: 600 }}>
      {contextHolder}
      <h2>Login</h2>
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
