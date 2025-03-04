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
      <Menu.Item key="/management/project" icon={<SettingOutlined />}>
        <Link href="/management/project">Project</Link>
      </Menu.Item>
      <Menu.Item key="/management/inquiry" icon={<SettingOutlined />}>
        <Link href="/management/inquiry">Inquiry</Link>
      </Menu.Item>
      <Menu.SubMenu key="/management/progress" icon={<FolderOutlined />} title="Progress">
        <Menu.Item key="/management/progress/category">
          <Link href="/management/progress/category">Category</Link>
        </Menu.Item>
        <Menu.Item key="/management/progress/progress">
          <Link href="/management/progress/progress">Progress</Link>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default ManagementSidebar;
