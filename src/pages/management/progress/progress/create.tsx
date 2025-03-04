import { useRouter } from "next/router";
import ProgressForm from "@/components/ProgressForm"

const CategoryCreate = () => {
  const router = useRouter();
  
  const onSuccess = () => {
    router.push("/management/progress/progress")
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Create Progress</h2>
      <ProgressForm mode="create" onSuccess={() => onSuccess()} />
    </div>
  );
};

export default CategoryCreate;
