import { useState, useEffect } from "react";
import { Table, message, Tag, Button, Space, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { TablePaginationConfig } from "antd/es/table";
import { fetchData } from "@/utils/axios";
import api from "@/utils/axios";
import dayjs from "dayjs";
import Link from "next/link";

import type { MenuProps } from 'antd';

const tagMap = {
  Pending: 'warning',
  Approved: 'success',
  Denied: 'error',
};

const TeeTimeList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const loadRows = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const { total, data } = await fetchData('/teetime', pageSize, offset);
      setRows(data);
      setTotal(total);
    } catch (error) {
      messageApi.error("Failed to fetch tee times.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRows(pagination.current!, pagination.pageSize!);
  }, [pagination]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/teetime/${id}`);
      messageApi.success('Tee Time deleted successfully');
      loadRows(pagination.current!, pagination.pageSize!); // refresh list
    } catch (err) {
      messageApi.error('Failed to delete tee time');
    }
  };

  const columns = [
    {
      title: "Tee Time",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: any) => (
        <Link href={`/management/teetime/${record.id}/edit`}>
          {text}
        </Link>
      )
    },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (value: string) => value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof tagMap) => (
        <Tag color={tagMap[status]}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const dropdownItems: MenuProps['items'] = [
          {
            key: 'delete',
            label: (
              <span onClick={() => handleDelete(record.id)}>
                Delete
              </span>
            ),
          },
        ];
    
        return (
          <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <h2>Tee Time List</h2>
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end", }}>
        <Button>
          <Link href="/management/teetime/create">Create</Link>
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={rows}
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

export default TeeTimeList;
