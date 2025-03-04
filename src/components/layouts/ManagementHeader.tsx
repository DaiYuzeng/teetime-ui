import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import MenuRight from "./MenuRight";

const { Header } = Layout;

const ManagementHeader = () => {
  const router = useRouter();
  const menuItems = [
    { key: "/", label: <Link href="/">Home</Link> },
    ...MenuRight(),
  ];

  return (
    <Header className="header">
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[router.pathname]}
        items={menuItems}
      />
    </Header>
  );
};

export default ManagementHeader;
