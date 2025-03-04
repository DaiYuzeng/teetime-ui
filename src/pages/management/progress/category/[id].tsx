import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import CategoryForm from "@/components/CategoryForm"
import api from "@/utils/axios";

export interface Category {
  id: number,
  key: string;
  name: string;
  description: string;
}

const CategoryEdit = () => {
  const router = useRouter();
  const id: string | undefined = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/category/${id}`);
        setCategory(response.data);
      } catch (error) {
        message.error("Failed to fetch category.");
      }

      setLoading(false);
    };

    fetchCategory();
  }, [id]);

  const onSuccess = () => {
    router.push("/management/progress/category")
  };

  if (loading) return <p>Loading category...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Update Category</h2>
      <CategoryForm mode="update" initialValues={category} onSuccess={() => onSuccess()} />
    </div>
  );
};

export default CategoryEdit;
