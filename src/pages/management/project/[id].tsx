import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import ProjectForm from "@/components/ProjectForm"
import { Progress } from "@/pages/management/progress/progress/[id]"
import api from "@/utils/axios";

export interface Project {
  id: number,
  name: string;
  description: string;
  progresses: ProjectProgress[]
}

interface ProjectProgress extends Progress {
  progress_id: number,
  project_id: number,
  cost: number
}

const ProjectEdit = () => {
  const router = useRouter();
  const id: number | undefined = Array.isArray(router.query.id) ? Number(router.query.id[0]) : Number(router.query.id);

  const [data, setData] = useState<Project | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/project/${id}`);
        setData(response.data);
      } catch (error) {
        message.error("Failed to fetch project.");
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const onSuccess = () => {
    router.push("/management/project")
  };

  if (loading) return <p>Loading category...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Update Project</h2>
      <ProjectForm mode="update" initialValues={data} onSuccess={() => onSuccess()} />
    </div>
  );
};

export default ProjectEdit;
