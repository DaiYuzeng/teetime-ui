import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import ProgressForm from "@/components/ProgressForm"
import api from "@/utils/axios";

export interface Progress {
  id: number,
  category_id: number,
  key: string;
  name: string;
  schedule_status: string;
  payment_status: string;
}

const ProgressEdit = () => {
  const router = useRouter();
  const id: string | undefined = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [progress, setProgress] = useState<Progress | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/progress/${id}`);
        setProgress(response.data);
      } catch (error) {
        message.error("Failed to fetch progress.");
      }

      setLoading(false);
    };

    fetchCategory();
  }, [id]);

  const onSuccess = () => {
    router.push("/management/progress/progress")
  };

  if (loading) return <p>Loading category...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Update Progress</h2>
      <ProgressForm mode="update" initialValues={progress} onSuccess={() => onSuccess()} />
    </div>
  );
};

export default ProgressEdit;
