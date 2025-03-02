import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>
    </ProtectedRoute>
  );
};

export default Dashboard;