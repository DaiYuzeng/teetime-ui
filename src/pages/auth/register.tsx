import { useRouter } from "next/router";
import { message } from "antd";
import api from "@/utils/axios";
import { hashPassword } from "@/utils/crypto";

import UserForm from "@/components/UserForm";
import { User } from "@/utils/interface";

interface RegisterUser extends User {
  password: string;
  confirm_password: string;
  shareholder1_username: string;
  shareholder2_username: string;
}

const Register = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const beforeSubmit = (values: RegisterUser) => {
    if (values.password !== values.hashed_password) {
      messageApi.error("Passwords do not match!");
      return false;
    }
  };

  const onSubmit = async (values: RegisterUser) => {
    try {
      console.log('4')
      const hashedPassword = await hashPassword(values.password);

      await api.post("/register", {
        ...values,
        hashed_password: hashedPassword,
        password: undefined,
        confirm_password: undefined,
      });

      messageApi.success("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      messageApi.error(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <>
      {contextHolder}
      <UserForm<RegisterUser>
        onSubmit={onSubmit}
        beforeSubmit={beforeSubmit}
        mode="create"
      />
    </>
  );
};

export default Register;
