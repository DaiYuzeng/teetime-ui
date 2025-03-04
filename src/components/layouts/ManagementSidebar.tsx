import { Menu } from "antd";
import { DashboardOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";

const ManagementSidebar = () => {
  return (
    <Menu theme="dark" mode="inline">
      <Menu.Item key="/management/dashboard" icon={<DashboardOutlined />}>
        <Link href="/management/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="/management/user" icon={<SettingOutlined />}>
        <Link href="/management/user">User</Link>
      </Menu.Item>
      <Menu.Item key="/management/inquiry" icon={<SettingOutlined />}>
        <Link href="/management/inquiry">Inquiry</Link>
      </Menu.Item>
    </Menu>
  );
};

export default ManagementSidebar;
