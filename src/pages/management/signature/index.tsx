import { useState, useEffect } from "react";
import { Table, message, Tag, Select, Dropdown } from "antd";
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { fetchData } from "@/utils/axios";
import { TablePaginationConfig } from "antd/es/table";
import Link from "next/link";

import api from "@/utils/axios";

const tagMap = {
  Pending: 'warning',
  Approved: 'success',
  Denied: 'error'
}

const items: MenuProps['items'] = [
  {
    label: 'Deny',
    key: 'deny',
  },
];

const SignatureList = () => {
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
      const { total, data } = await fetchData('/signature', pageSize, offset);
      setRows(data);
      setTotal(total);
    } catch (error) {
      messageApi.error("Failed to fetch applications.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRows(pagination.current!, pagination.pageSize!);
  }, [pagination]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleActionChange = async (value: string, record: any) => {
    try {
      await api.put(`/signature/${record.id}`, {
        id: record.id,
        candidate_user_id: record.candidate_user_id,
        shareholder_user_id: record.shareholder_user_id,
        status: value,
      });
      messageApi.success(`Application ${value.toLowerCase()} successfully.`);
      loadRows(pagination.current!, pagination.pageSize!);
    } catch (error) {
      messageApi.error("Failed to update application status.");
    }
  };

  const handleMenuClick = (info: any, record: any) => {
    if (info.key === 'deny') {
      handleActionChange('Denied', record);
    }
  };

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "candidate_username",
      key: "candidate_username",
      render: (text: string, record: any) => (
        <Link href={`/management/user/${record.id}/edit?view`}>
          {text}
        </Link>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: keyof typeof tagMap, record: any) => (
        <Tag color={tagMap[text]}>
          {text}
        </Tag>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        record.status === 'Pending' ? (
          <Dropdown.Button
            icon={<DownOutlined />}
            loading={loading}
            menu={{
              items,
              onClick: (info) => handleMenuClick(info, record)
            }}
            onClick={() => handleActionChange('Approved', record)}
          >
            Approve
          </Dropdown.Button>
        ) : (
          <span style={{ color: "#aaa" }}>N/A</span>
        )
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Signature List</h2>
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

export default SignatureList;
