import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token]);

  if (!token) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
