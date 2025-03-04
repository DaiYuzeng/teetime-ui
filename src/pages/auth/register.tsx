import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, message } from "antd";
import api from "@/utils/axios";
import { hashPassword } from "@/utils/crypto";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (values: { username: string; email: string; phone: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = await hashPassword(values.password);
      await api.post("/register", {
        username: values.username,
        phone: values.phone,
        email: values.email,
        hashed_password: hashedPassword,
      });

      message.success("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: "auto", maxWidth: 600 }}>
      <h2>Register</h2>
      <Form onFinish={handleRegister} layout="vertical">
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number" },
            { pattern: /^[0-9]+$/, message: "Phone number must be digits only" },
            { min: 10, message: "Phone number must be at least 10 digits" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
