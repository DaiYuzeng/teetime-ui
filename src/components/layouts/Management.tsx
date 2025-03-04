import { Layout } from "antd";
import ManagementHeader from "@/components/layouts/ManagementHeader";
import ManagementSidebar from "@/components/layouts/ManagementSidebar";
import RobinFooter from "@/components/layouts/Footer";

const { Content, Sider } = Layout;

const ManagementLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <ManagementHeader />
      <Layout>
        <Sider width={250}>
          <ManagementSidebar />
        </Sider>
        <Content style={{ flex: 1, padding: "20px" }}>{children}</Content>
      </Layout>
      <RobinFooter />
    </Layout>
  );
};

export default ManagementLayout;
