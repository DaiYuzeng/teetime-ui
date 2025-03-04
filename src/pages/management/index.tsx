import { useEffect } from "react";
import { useRouter } from "next/router";

const ManagementIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/management/dashboard");
  }, []);

  return null;
};

export default ManagementIndex;