import { Layout, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import MenuRight from "@/components/layouts/MenuRight";

const { Header } = Layout;

const WebsiteHeader = () => {
  const router = useRouter();
  const menuItems = [
    { key: "/", label: <Link href="/">Home</Link> },
    { key: "/inquiry", label: <Link href="/inquiry">Inquiry</Link> },
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

export default WebsiteHeader;
