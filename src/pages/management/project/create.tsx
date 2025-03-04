import { useRouter } from "next/router";
import ProjectForm from "@/components/ProjectForm"

const CategoryCreate = () => {
  const router = useRouter();
  
  const onSuccess = () => {
    router.push("/management/project")
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Create Project</h2>
      <ProjectForm mode="create" onSuccess={() => onSuccess()} />
    </div>
  );
};

export default CategoryCreate;
