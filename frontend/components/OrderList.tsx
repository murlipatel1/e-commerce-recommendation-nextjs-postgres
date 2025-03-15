import { Order } from "@/types";

interface OrderListProps {
  orders: Order[];
  payments: { order_id: string; payment_method: string; transaction_id: string,
    shipping_name: string, shipping_address: string, shipping_city: string, shipping_state: string, shipping_zip: string, shipping_country: string
   }[];
}

export default function OrderList({ orders, payments }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const payment = payments.find((p) => p.order_id === order.id);
        return (
          <div key={order.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order #{order.id}</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-gray-600">Total: ${order.total_price}</p>
              <p className="text-sm text-gray-500">
                Ordered on: {new Date(order.created_at).toLocaleDateString()}
              </p>
              {payment && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>Payment Method: {payment.payment_method}</p>
                  <p>Transaction ID: {payment.transaction_id}</p>
                  <h1>Shipping Address</h1>
                  <p>Name: {payment.shipping_name}</p>
                  <p>Address: {payment.shipping_address}</p>
                  <p>City: {payment.shipping_city}</p>
                  <p>State: {payment.shipping_state}</p>
                  <p>Zip: {payment.shipping_zip}</p>
                  <p>Country: {payment.shipping_country}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
