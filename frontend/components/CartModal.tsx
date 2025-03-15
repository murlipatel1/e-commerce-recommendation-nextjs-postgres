import { CartItem } from "@/lib/cart";

interface CartModalProps {
  cart: CartItem[];
  onClose: () => void;
  onDelete: (productId: string) => void;
  onPlaceOrder: () => void;
}

export default function CartModal({ cart, onClose, onDelete, onPlaceOrder }: CartModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Cart Items</h2>
        {cart.length > 0 ? (
          <ul>
            {cart.map(({ id, name, price, quantity }) => (
              <li key={id} className="mb-2 text-black">
                <div className="flex justify-between items-center">
                  <span>{name} (x{quantity})</span>
                  <span>${(price * quantity).toFixed(2)}</span>
                  <button onClick={() => onDelete(id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-black">No items in the cart.</div>
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Close</button>
          {cart.length > 0 && <button onClick={onPlaceOrder} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Place Order</button>}
        </div>
      </div>
    </div>
  );
}
