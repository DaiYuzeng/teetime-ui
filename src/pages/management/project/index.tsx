import { useState, useEffect } from "react";
import { Table, message, Space, Button } from "antd";
import { fetchData } from "@/utils/axios";
import { TablePaginationConfig } from "antd/es/table";
import Link from "next/link";

const ProjectList = () => {
  const [dataList, setdataList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const loadDataList = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const { total, data } = await fetchData('/project', pageSize, offset);
      setdataList(data);
      setTotal(total);
    } catch (error) {
      message.error("Failed to fetch Projects.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDataList(pagination.current!, pagination.pageSize!);
  }, [pagination]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Link href={`/management/project/${record.id}`}>
          {text}
        </Link>
      )
    },
    { title: "Description", dataIndex: "description", key: "description" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Project List</h2>
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end", }}>
        <Button>
          <Link href="/management/project/create">Create</Link>
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={dataList}
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

export default ProjectList;
