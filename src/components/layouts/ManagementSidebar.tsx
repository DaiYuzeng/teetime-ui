import { Menu } from "antd";
import { DashboardOutlined, SettingOutlined, FolderOutlined } from "@ant-design/icons";
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
      <Menu.Item key="/management/teetime" icon={<SettingOutlined />}>
        <Link href="/management/teetime">Tee Time</Link>
      </Menu.Item>
      <Menu.Item key="/management/signature" icon={<SettingOutlined />}>
        <Link href="/management/signature">Signature</Link>
      </Menu.Item>
    </Menu>
  );
};

export default ManagementSidebar;
