import { useRouter } from "next/router";
import { message } from "antd";
import api from "@/utils/axios";
import TeeTimeForm from "@/components/TeeTimeForm";
import dayjs, { Dayjs } from "dayjs";

interface CreateTeeTime {
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

const TeeTimeCreate = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmit = async (values: CreateTeeTime) => {
    try {
      const payload = {
        ...values,
        status: "Pending",
        start_date: values.start_date?.toISOString(),
        end_date: values.end_date ? values.end_date.toISOString() : null,
        requested_time: values.requested_time ? values.requested_time.format("HH:mm:ss") : null,
        member_list: values.member_list
          ? values.member_list.split(",").map((m) => m.trim())
          : [],
      };

      await api.post("/teetime", payload);
      messageApi.success("Tee Time updated successfully!");
      router.push("/management/teetime");
    } catch (error: any) {
      messageApi.error(error.response?.data?.detail || "Failed to update tee time.");
    }
  };

  return (
    <>
      {contextHolder}
      <TeeTimeForm<CreateTeeTime>
        mode="update"
        onSubmit={onSubmit}
      />
    </>
    
  );
};

export default TeeTimeCreate;
