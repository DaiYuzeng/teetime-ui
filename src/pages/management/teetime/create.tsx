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

  const beforeSubmit = (values: CreateTeeTime) => {
    if (values.type === "Regular") return true;

    if (!values.member_list) {
      message.error("Member list is required.");
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
        status: "Pending",
        start_date: values.start_date?.toISOString(),
        end_date: values.end_date ? values.end_date.toISOString() : null,
        requested_time: values.requested_time ? values.requested_time.format("HH:mm:ss") : null,
        member_list: values.member_list
          ? values.member_list.split(",").map((m) => m.trim())
          : [],
      };

      await api.post("/teetime", payload);
      messageApi.success("Tee Time created successfully!");
      router.push("/management/teetime");
    } catch (error: any) {
      messageApi.error(error.response?.data?.detail || "Failed to create tee time.");
    }
  };

  return (
    <>
      {contextHolder}
      <TeeTimeForm<CreateTeeTime>
        mode="create"
        beforeSubmit={beforeSubmit}
        onSubmit={onSubmit}
      />
    </>
    
  );
};

export default TeeTimeCreate;
