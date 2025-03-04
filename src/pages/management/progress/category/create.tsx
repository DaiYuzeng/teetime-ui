import { useRouter } from "next/router";
import CategoryForm from "@/components/CategoryForm"

const CategoryCreate = () => {
  const router = useRouter();
  
  const onSuccess = () => {
    router.push("/management/progress/category")
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Create Category</h2>
      <CategoryForm mode="create" onSuccess={() => onSuccess()} />
    </div>
  );
};

export default CategoryCreate;
