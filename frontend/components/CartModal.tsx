import { Product } from '@/types';

interface CartModalProps {
  cart: { product: Product; quantity: number }[];
  onClose: () => void;
  onDelete: (productId: string) => void;
  onPlaceOrder: () => void;
}

export default function CartModal({ cart, onClose, onDelete, onPlaceOrder }: CartModalProps) {
  const calculateTotal = () => {
    const subtotal = cart.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0);
    const tax = subtotal * 0.12;
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  const handleDelete = (productId: string) => {
    onDelete(productId);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Cart Items</h2>
        {cart.length > 0 ? (
          <ul>
            {cart.map(({ product, quantity }) => (
              <li key={product.id} className="mb-2 text-black">
                <div className="flex justify-between items-center">
                  <span>{product.name} (x{quantity})</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-black">No items in the cart.</div>
        )}
        {cart.length > 0 && (
          <div className="mt-4 text-black">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tax (12%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
          {cart.length > 0 && (
            <button
              onClick={onPlaceOrder}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
