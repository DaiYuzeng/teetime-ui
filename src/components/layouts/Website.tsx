import { Layout } from "antd";
import WebsiteHeader from "@/components/layouts/WebsiteHeader";
import RobinFooter from "@/components/layouts/Footer";
import Banner from "@/components/layouts/Banner"

const { Content } = Layout;

const WebsiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <WebsiteHeader />
      <Banner />
      <Content style={{ flex: 1, padding: "20px" }}>
        {children}
      </Content>
      <RobinFooter />
    </Layout>
  );
};

export default WebsiteLayout;
