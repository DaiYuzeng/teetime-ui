import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import api from "@/utils/axios";
import UserForm from "@/components/UserForm";
import { User } from "@/utils/interface";

const UserEdit = () => {
  const router = useRouter();
  const id: string | undefined = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const mode = router.query.view !== undefined ? 'view' : 'update';

  const [initialValues, setInitialValues] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/user/${id}`);
        setInitialValues(response.data);
      } catch (error) {
        message.error("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const onSubmit = async (values: User) => {
    try {
      values.id = Number(id);
      await api.put(`/user/${id}`, values);
      message.success("User updated successfully!");
      router.push("/management/user");
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to update user");
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <UserForm<User>
      mode={mode}
      onSubmit={onSubmit}
      initialValues={initialValues}
    />
  );
};

export default UserEdit;
