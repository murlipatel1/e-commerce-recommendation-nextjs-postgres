import api from "./api";

// Process a new payment (Redirects to payment success)
// export const processPayment = async (order_id: string, payment_method: string) => {
//   try {
//     console.log("Processing payment for order:", order_id, "using", payment_method);
//     const response = await api.post("/payment", { order_id, payment_method });
//     console.log("Payment Response:", response.data);
//     return response.data; // { message, payment, transaction_id, redirect_url }
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     throw error;
//   }
// };

export const processPayment = async (
    order_id: string, 
    payment_method: string, 
    shipping: Record<string, string>, 
    billing: Record<string, string>
) => {
  try {
    console.log("Processing payment for order:", order_id, "using", payment_method);
    
    const response = await api.post("/payment", { 
      order_id, 
      payment_method, 
      ...shipping, 
      ...billing 
    });

    console.log("Payment Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};


// Confirm payment after a successful transaction
export const confirmPayment = async (order_id: string, transaction_id: string) => {
  try {
    console.log("Confirming payment for order:", order_id, "Transaction ID:", transaction_id);
    const response = await api.get(`/payment/confirm?order_id=${order_id}&transaction_id=${transaction_id}`);
    console.log("Payment Confirmation Response:", response.data);
    return response.data; // { message: "Payment confirmed successfully" }
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

// Fetch user's past payments
export const getPayments = async () => {
  try {
    console.log("Fetching payment history...");
    const response = await api.get("/payment/history");
    console.log("Payment History Response:", response.data);
    return response.data; // Array of payment records
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
