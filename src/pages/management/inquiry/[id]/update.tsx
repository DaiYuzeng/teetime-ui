import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import InquiryForm from "@/components/InquiryForm";
import api from "@/utils/axios";


interface Inquiry {
  guest_name: string;
  phone: string;
  email?: string;
  message?: string;
  status?: string;
}

const InquiryEdit = () => {
  const router = useRouter();
  const id: string | undefined = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [inquiry, setInquiry] = useState<Inquiry | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchInquiry = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/inquiry/${id}`);

        setInquiry(response.data);
      } catch (error) {
        message.error("Failed to fetch inquiries.");
      }

      setLoading(false);
    };

    fetchInquiry();
  }, [id]);

  const onSuccess = () => {
    router.push("/management/inquiry");
  };

  if (loading) return <p>Loading inquiry...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Update an Inquiry</h2>
      {inquiry && <InquiryForm mode="update" inquiryId={id} initialValues={inquiry} onSuccess={onSuccess} />}
    </div>
  );
};

export default InquiryEdit;
