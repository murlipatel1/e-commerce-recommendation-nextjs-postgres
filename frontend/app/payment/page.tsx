"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { processPayment } from "@/lib/payment";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const order_id = searchParams.get("order_id") ?? "";
  const total_price = searchParams.get("total_price") ?? "0";

  console.log("Order ID:", order_id);
  console.log("Total Price:", total_price);

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(false);

  useEffect(() => {
    if (!order_id || total_price === "0") {
      setError("Invalid order details. Redirecting to cart...");
      setTimeout(() => {
        router.push("/products");
      }, 3000);
    }
  }, [order_id, total_price, router]);

  // Copy shipping address to billing address if checkbox is checked
  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress({ ...shippingAddress });
    }
  }, [sameAsShipping, shippingAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, type: "shipping" | "billing") => {
    const { name, value } = e.target;
    if (type === "shipping") {
      setShippingAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setBillingAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async () => {
    if (!user) {
      alert("Please log in to proceed with payment.");
      return;
    }
  
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.zip ||
      !billingAddress.fullName ||
      !billingAddress.address ||
      !billingAddress.city ||
      !billingAddress.zip
    ) {
      setError("Please fill in all required address fields.");
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const shipping = {
        shipping_name: shippingAddress.fullName,
        shipping_address: shippingAddress.address,
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_zip: shippingAddress.zip,
        shipping_country: shippingAddress.country,
      };
  
      const billing = {
        billing_name: billingAddress.fullName,
        billing_address: billingAddress.address,
        billing_city: billingAddress.city,
        billing_state: billingAddress.state,
        billing_zip: billingAddress.zip,
        billing_country: billingAddress.country,
      };
  
      const response = await processPayment(order_id, paymentMethod, shipping, billing);
      console.log("Payment Response:", response);
      alert("Payment Done Successfully");
      router.push("/products");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <p className="mb-4 text-lg">Total Amount: <strong>${Number(total_price).toFixed(2)}</strong></p>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="fullName" placeholder="Full Name" className="border p-2 w-full" value={shippingAddress.fullName} onChange={(e) => handleInputChange(e, "shipping")} required />
          <input type="text" name="address" placeholder="Street Address" className="border p-2 w-full" value={shippingAddress.address} onChange={(e) => handleInputChange(e, "shipping")} required />
          <input type="text" name="city" placeholder="City" className="border p-2 w-full" value={shippingAddress.city} onChange={(e) => handleInputChange(e, "shipping")} required />
          <input type="text" name="state" placeholder="State" className="border p-2 w-full" value={shippingAddress.state} onChange={(e) => handleInputChange(e, "shipping")} />
          <input type="text" name="zip" placeholder="ZIP Code" className="border p-2 w-full" value={shippingAddress.zip} onChange={(e) => handleInputChange(e, "shipping")} required />
          <input type="text" name="country" placeholder="Country" className="border p-2 w-full" value={shippingAddress.country} onChange={(e) => handleInputChange(e, "shipping")} required />
        </div>
      </div>

      {/* Checkbox to Copy Shipping Address to Billing */}
      <div className="mb-4 flex items-center">
        <input type="checkbox" id="sameAsShipping" checked={sameAsShipping} onChange={() => setSameAsShipping(!sameAsShipping)} className="mr-2" />
        <label htmlFor="sameAsShipping" className="text-sm">Same as shipping address</label>
      </div>

      {/* Billing Address */}
      {!sameAsShipping && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="fullName" placeholder="Full Name" className="border p-2 w-full" value={billingAddress.fullName} onChange={(e) => handleInputChange(e, "billing")} required />
            <input type="text" name="address" placeholder="Street Address" className="border p-2 w-full" value={billingAddress.address} onChange={(e) => handleInputChange(e, "billing")} required />
            <input type="text" name="city" placeholder="City" className="border p-2 w-full" value={billingAddress.city} onChange={(e) => handleInputChange(e, "billing")} required />
            <input type="text" name="state" placeholder="State" className="border p-2 w-full" value={billingAddress.state} onChange={(e) => handleInputChange(e, "billing")} />
            <input type="text" name="zip" placeholder="ZIP Code" className="border p-2 w-full" value={billingAddress.zip} onChange={(e) => handleInputChange(e, "billing")} required />
            <input type="text" name="country" placeholder="Country" className="border p-2 w-full" value={billingAddress.country} onChange={(e) => handleInputChange(e, "billing")} required />
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Choose Payment Method:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="upi">UPI</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {/* Payment Button */}
      <button onClick={handlePayment} disabled={isProcessing} className={`px-4 py-2 rounded text-white ${isProcessing ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}>
        {isProcessing ? "Processing..." : "Proceed to Pay"}
      </button>
    </div>
  );
}
