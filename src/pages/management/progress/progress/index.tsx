import { useState, useEffect } from "react";
import { Table, message, Space, Button } from "antd";
import { fetchData } from "@/utils/axios";
import { TablePaginationConfig } from "antd/es/table";
import Link from "next/link";
import { ScheduleStatusMap, PaymentStatusMap } from "@/components/ProgressForm";

interface Category {
  id: number;
  key: string;
  name: string;
}

const ProgressList = () => {
  const [categories, setCategories] = useState<Record<number, Category>>({});
  const [progresses, setProgresses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await fetchData("/category");
        const categoryMap = data.reduce(
          (acc: Record<number, Category>, category: Category) => {
            acc[category.id] = category;
            return acc;
          },
          {} as Record<number, string>
        );
        setCategories(categoryMap);
      } catch (error) {
        message.error("Failed to fetch Categories.");
      }
    };

    fetchCategories();
  }, []);

  const loadProgresses = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const { total, data } = await fetchData("/progress", pageSize, offset);
      setProgresses(data);
      setTotal(total);
    } catch (error) {
      message.error("Failed to fetch Progresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgresses(pagination.current!, pagination.pageSize!);
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Link href={`/management/progress/progress/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      render: (key: string, record: any) => `${categories[record.category_id]?.key}${key}`,
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (categoryId: number) => categories[categoryId]?.name || "Unknown",
    },
    {
      title: "Schedule Status",
      dataIndex: "schedule_status",
      key: "schedule_status",
      render: (status: string) => ScheduleStatusMap[status] || "Unknown",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) => PaymentStatusMap[status] || "Unknown",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Progress List</h2>
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button>
          <Link href="/management/progress/progress/create">Create</Link>
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={progresses}
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

export default ProgressList;
