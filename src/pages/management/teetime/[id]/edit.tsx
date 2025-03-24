import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import api from "@/utils/axios";
import TeeTimeForm from "@/components/TeeTimeForm";

interface CreateTeeTime {
  id?: number;
  type: string;
  player_count?: number;
  start_date: Dayjs;
  end_date?: Dayjs;
  requested_day?: string;
  requested_time?: Dayjs;
  member_list?: string;
  priority?: number;
  status?: string;
}

const TeeTimeEdit = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] = useState<CreateTeeTime>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTeeTime = async () => {
      try {
        const res = await api.get(`/teetime/${id}`);
        const data = res.data;

        setInitialValues({
          ...data,
          start_date: dayjs(data.start_date),
          end_date: data.end_date ? dayjs(data.end_date) : undefined,
          requested_time: data.requested_time ? dayjs(data.requested_time, "HH:mm:ss") : undefined,
          member_list: data.member_list?.join(", "),
        });
      } catch (err) {
        messageApi.error("Failed to load tee time data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeeTime();
  }, [id]);

  const beforeSubmit = (values: CreateTeeTime) => {
    if (values.type === "Regular") return true;

    if (!values.member_list) {
      messageApi.error("Member list is required.");
      return false;
    }
  
    const members = values.member_list.split(",").map((m) => m.trim());
  
    // Check for empty usernames
    if (members.some((m) => m === "")) {
      messageApi.error("Usernames cannot be empty or contain only commas.");
      return false;
    }
  
    // Validate allowed characters (only alphanumeric, underscores, hyphens)
    const invalidUsernames = members.filter((m) => !/^[a-zA-Z0-9_-]+$/.test(m));
    if (invalidUsernames.length > 0) {
      messageApi.error(`Invalid username(s): ${invalidUsernames.join(", ")}. Only letters, numbers, underscores and hyphens are allowed.`);
      return false;
    }
  
    // Optional: Max limit
    if (members.length > 4) {
      messageApi.error("You can only enter up to 4 usernames.");
      return false;
    }
  
    return true;
  };

  const onSubmit = async (values: CreateTeeTime) => {
    try {
      const payload = {
        ...values,
        id: Number(id),
        start_date: values.start_date?.toISOString(),
        end_date: values.end_date ? values.end_date.toISOString() : null,
        requested_time: values.requested_time ? values.requested_time.format("HH:mm:ss") : null,
        member_list: values.member_list
          ? values.member_list.split(",").map((m) => m.trim())
          : [],
      };

      await api.put(`/teetime/${id}`, payload);
      messageApi.success("Tee Time updated successfully!");
      router.push("/management/teetime");
    } catch (error: any) {
      messageApi.error(error.response?.data?.detail || "Failed to update tee time.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {contextHolder}
      <TeeTimeForm<CreateTeeTime>
        mode="update"
        initialValues={initialValues}
        beforeSubmit={beforeSubmit}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default TeeTimeEdit;
