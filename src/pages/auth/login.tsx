import api from "@/utils/axios";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/router";
import { Button, Form, Input, message } from "antd";

const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const hashedPassword = await hashPassword(values.password);
      const response = await api.post("/token", {
        username: values.username,
        hashed_password: hashedPassword,
      });

      setToken(response.data.access_token);
      message.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div>
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
