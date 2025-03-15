import api from "./api";

export const processPayment = async (
    order_id: string, 
    payment_method: string, 
    shipping: Record<string, string>, 
    billing: Record<string, string>
) => {
  try {
      const response = await api.post("/payment", { 
      order_id, 
      payment_method, 
      ...shipping, 
      ...billing 
    });

    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};


// Confirm payment after a successful transaction
export const confirmPayment = async (order_id: string, transaction_id: string) => {
  try {
  
    const response = await api.get(`/payment/confirm?order_id=${order_id}&transaction_id=${transaction_id}`);
    return response.data; // { message: "Payment confirmed successfully" }
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

// Fetch user's past payments
export const getPayments = async () => {
  try {

    const response = await api.get("/payment/history");
  
    return response.data; // Array of payment records
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
