import { Menu } from "antd";
import { DashboardOutlined, SettingOutlined, FolderOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Role } from "@/utils/interface";

const ManagementSidebar = () => {
  const role = useAuthStore((state) => state.role);

  console.log(role)

  return (
    <Menu theme="dark" mode="inline">
      <Menu.Item key="/management/dashboard" icon={<DashboardOutlined />}>
        <Link href="/management/dashboard">Dashboard</Link>
      </Menu.Item>
      {role === Role.admin ? (
        <Menu.Item key="/management/user" icon={<SettingOutlined />}>
          <Link href="/management/user">User</Link>
        </Menu.Item>
      ) : null}
      <Menu.Item key="/management/teetime" icon={<SettingOutlined />}>
        <Link href="/management/teetime">Tee Time</Link>
      </Menu.Item>
      {[Role.admin, Role.staff, Role.shareholder].includes(role as Role) ? (
        <Menu.Item key="/management/signature" icon={<SettingOutlined />}>
          <Link href="/management/signature">Signature</Link>
        </Menu.Item>
      ) : null}
      
    </Menu>
  );
};

export default ManagementSidebar;
