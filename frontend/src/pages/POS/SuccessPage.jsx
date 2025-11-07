import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { SaleContext } from "@/context/SaleContext";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const { getSaleStatus } = useContext(SaleContext);

  useEffect(() => {
    const fetchSaleStatus = async () => {
      if (!sessionId) return;

      try {
        const data = await getSaleStatus(sessionId);
        console.log(data)
        setStatus(data.paymentStatus);
      } catch (error) {
        console.error("Failed to fetch sale status:", error);
      }
    };

    fetchSaleStatus();
  }, [sessionId]);

  if (status === "loading") return <p>Processing your payment...</p>;

  if (status === "error")
    return (
      <div className="text-center text-red-500 mt-10">
        <h2>Payment verification failed</h2>
        <button onClick={() => navigate("/pos")}>Go back</button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CheckCircle size={64} color="green" />
      <h1 className="text-2xl font-bold mt-4">Payment Successful 🎉</h1>
      <p className="text-gray-600 mt-2">Session ID: {sessionId}</p>
      <button
        onClick={() => navigate("/pos")}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Back to POS
      </button>
    </div>
  );
};

export default SuccessPage;
