import { Layout } from "antd";

const { Footer } = Layout;

const RobinFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Robin Homes ©{new Date().getFullYear()} Created by Robin Homes
    </Footer>
  );
};

export default RobinFooter;
