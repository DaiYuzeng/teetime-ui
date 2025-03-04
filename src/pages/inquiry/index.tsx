import InquiryForm from "@/components/InquiryForm";

const Inquiry = () => {

  const onSuccess = () => {
    
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Submit an Inquiry</h2>
      <InquiryForm mode="create" onSuccess={() => onSuccess()} />
    </div>
  );
};

export default Inquiry;
