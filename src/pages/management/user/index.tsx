import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { fetchData } from "@/utils/axios";
import { TablePaginationConfig } from "antd/es/table";
import Link from "next/link";

const UserList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const loadUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const { total, data } = await fetchData('/user', pageSize, offset);
      setUsers(data);
      setTotal(total);
    } catch (error) {
      messageApi.error("Failed to fetch users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers(pagination.current!, pagination.pageSize!);
  }, [pagination]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
      render: (text: string, record: any) => (
        <Link href={`/management/user/${record.id}/edit`}>
          {text}
        </Link>
      )
    },
    { title: "First Name", dataIndex: "firstname", key: "firstname" },
    { title: "Last Name", dataIndex: "lastname", key: "lastname" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Membership Level", dataIndex: "role", key: "role" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <h2>User List</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          total: total,
          current: pagination.current!,
          pageSize: pagination.pageSize!,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserList;
