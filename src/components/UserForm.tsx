import { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Select, Tag, Space } from "antd";
import { useRouter } from "next/router";

import { FormProps, Role } from "@/utils/interface"
import api from "@/utils/axios";

const tagMap = {
  Pending: 'warning',
  Approved: 'success',
  Denied: 'error'
}

const UserForm = <T extends object>({ onSubmit, beforeSubmit, mode = 'create', initialValues }: FormProps<T>) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isCreate = mode === 'create';
  const isUpdate = mode === 'update';
  const isView = mode === 'view';
  const [status1, setStatus1] = useState<string | undefined>();
  const [status2, setStatus2] = useState<string | undefined>();

  const formTitle = isCreate
    ? "Register"
    : isUpdate
    ? "Update User"
    : "View User";

  useEffect(() => {
    const fetchSignature = async () => {
      if ((initialValues as any)?.id) {
        try {
          const res = await api.get(`/signature/user/${(initialValues as any)?.id}`);
          setStatus1(res.data.find((s: any) => initialValues?.shareholder1_username === s.shareholder_username)?.status)
          setStatus2(res.data.find((s: any) => initialValues?.shareholder2_username === s.shareholder_username)?.status)
        } catch (err) {
          console.error("Failed to fetch signature status");
        }
      }
    };
    fetchSignature();
  }, [(initialValues as any)?.id]);

  const PwdSection = () => {
    if (!isCreate) return null;
    
    return (
      <>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="hashed_password"
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
      </>
    )
  }
  
  const RoleSection = () => {
    if (isCreate) return null;

    return (
      <Form.Item label="Role" name="role">
        <Select
          options={Object.values(Role).map(role => ({ label: role, value: role }))}
        />
      </Form.Item>
    )
  }  

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
      <Form<T> onFinish={handleSubmit} layout="vertical" disabled={isView} initialValues={initialValues}>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input disabled={!isCreate} />
        </Form.Item>

        <Form.Item label="First Name" name="firstname" rules={[{ required: true, message: "Please enter your firstname" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Last Name" name="lastname" rules={[{ required: true, message: "Please enter your lastname" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address" }]}>
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

        {PwdSection()}

        <Form.Item label="Shareholder 1 Username" name="shareholder1_username" rules={[{ required: true, message: "Please enter shareholder 1 username" }]}>
          <Input disabled={!isCreate} />
        </Form.Item>
        
        {status1 ? (
          <Space style={{ marginBottom: 24 }}>
            <Tag color={tagMap[status1 as keyof typeof tagMap]}>
              {status1}
            </Tag>
          </Space>
        ): null}

        

        <Form.Item label="Shareholder 2 Username" name="shareholder2_username" rules={[{ required: true, message: "Please enter shareholder 2 username" }]}>
          <Input disabled={!isCreate} />
        </Form.Item>

        {status2 ? (
          <Space style={{ marginBottom: 24 }}>
            <Tag color={tagMap[status2 as keyof typeof tagMap]}>
              {status2}
            </Tag>
          </Space>
        ): null}

        {RoleSection()}

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

export default UserForm;
