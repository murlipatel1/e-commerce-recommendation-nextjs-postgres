import { Order } from '@/types';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Order #{order.id}</span>
            <span className={`px-2 py-1 rounded text-sm ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-gray-600">Total: ${order.total_price}</p>
            <p className="text-sm text-gray-500">
              Ordered on: {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}