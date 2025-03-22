import { Layout } from "antd";

const { Footer } = Layout;

const TeeTimeFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      BAIST Club ©{new Date().getFullYear()} Created by Yuzeng Dai
    </Footer>
  );
};

export default TeeTimeFooter;
