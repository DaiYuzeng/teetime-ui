import { Button, Dropdown } from "antd";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/authStore";

const MenuRight = () => {
  const { token, username, logout } = useAuthStore();

  if (token) {
    const userMenu = {
      items: [
        {
          key: "management",
          label: <Link href="/management">Management</Link>,
        },
        {
          key: "logout",
          label: "Logout",
          onClick: logout,
        },
      ],
    };

    return [
      {
        key: "user",
        label: (
          <Dropdown menu={userMenu} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />} style={{ color: "white" }}>
              Welcome, {username}
            </Button>
          </Dropdown>
        ),
        style: { marginLeft: "auto" },
      },
    ];
  }

  return [
    { key: "/auth/login", label: <Link href="/auth/login">Login</Link>, style: { marginLeft: "auto" } },
    { key: "/auth/register", label: <Link href="/auth/register">Register</Link> },
  ];
};

export default MenuRight;
