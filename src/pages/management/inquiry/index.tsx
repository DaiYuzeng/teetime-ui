import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { fetchData } from "@/utils/axios";
import { TablePaginationConfig } from "antd/es/table";
import Link from "next/link";

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const loadInquiries = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const { total, data } = await fetchData('/inquiry', pageSize, offset);
      setInquiries(data);
      setTotal(total);
    } catch (error) {
      message.error("Failed to fetch inquiries.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries(pagination.current!, pagination.pageSize!);
  }, [pagination]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: "Guest Name",
      dataIndex: "guest_name",
      key: "guest_name",
      render: (text: string, record: any) => (
        <Link href={`/management/inquiry/${record.id}/edit`}>
          {text}
        </Link>
      )
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inquiry List</h2>
      <Table
        columns={columns}
        dataSource={inquiries}
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

export default InquiryList;
