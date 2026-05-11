import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Package,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  Loader2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-chi-drab-54.vercel.app/api";

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const statuses = [
    {
      key: "PENDING",
      label: "Order Placed",
      icon: Clock,
      description: "We have received your order",
    },
    {
      key: "PROCESSING",
      label: "Processing",
      icon: Package,
      description: "Your order is being prepared",
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      icon: Truck,
      description: "Your order is on its way",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      icon: CheckCircle,
      description: "Order delivered successfully",
    },
  ];

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || "Order not found");
      }
    } catch {
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return statuses.findIndex((s) => s.key === status) || 0;
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20">
      {/* Hero */}
      <div className="relative py-16 bg-linear-to-b from-[#0a0a0c] to-[#0c0c0e]">
        <div className="absolute inset-0 pattern-arabesque opacity-10" />
        <div className="relative max-w-350 mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl lg:text-4xl text-[#f8f4ef] mb-4">
            Track Your Order
          </h1>
          <p className="text-[#6b6b6b]">
            Enter your order ID to check the status of your delivery
          </p>
        </div>
      </div>

      {/* Track Form */}
      <div className="max-w-150 mx-auto px-6 lg:px-8 py-12">
        <form onSubmit={handleTrack} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD-xxxxxx)"
              className="w-full pl-12 pr-4 py-4 bg-[#1a1a1e] border border-[#2a2a2e] rounded-full text-[#f8f4ef] placeholder-[#6b6b6b] focus:outline-none focus:border-[#c9b89a]/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 bg-[#c9b89a] text-[#0c0c0e] font-medium rounded-full hover:bg-[#d4c9a8] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="max-w-200 mx-auto px-6 lg:px-8 pb-20">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {order && (
          <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8 animate-fadeIn">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#2a2a2e]">
              <div>
                <p className="text-sm text-[#6b6b6b]">Order ID</p>
                <p className="font-display text-xl text-[#f8f4ef]">
                  {order.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#6b6b6b]">Order Date</p>
                <p className="text-[#f8f4ef]">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-8">
              <h3 className="font-display text-lg text-[#f8f4ef] mb-6">
                Order Status
              </h3>
              <div className="space-y-0">
                {statuses.map((status, index) => {
                  const currentIndex = getStatusIndex(order.status);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      key={status.key}
                      className="relative pl-8 pb-8 last:pb-0"
                    >
                      {/* Line */}
                      {index < statuses.length - 1 && (
                        <div
                          className={`absolute left-3 top-8 w-0.5 h-full -translate-x-1/2 ${
                            index < currentIndex
                              ? "bg-[#c9b89a]"
                              : "bg-[#2a2a2e]"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-[#c9b89a]" : "bg-[#2a2a2e]"
                        }`}
                      >
                        <status.icon
                          className={`w-4 h-4 ${isCompleted ? "text-[#0c0c0e]" : "text-[#6b6b6b]"}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="pl-4">
                        <p
                          className={`font-medium ${isCurrent ? "text-[#c9b89a]" : isCompleted ? "text-[#f8f4ef]" : "text-[#6b6b6b]"}`}
                        >
                          {status.label}
                        </p>
                        <p className="text-sm text-[#6b6b6b]">
                          {status.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-[#2a2a2e] pt-6">
              <h3 className="font-display text-lg text-[#f8f4ef] mb-4">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#2a2a2e] rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#6b6b6b]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#f8f4ef]">{item.name}</p>
                      <p className="text-sm text-[#6b6b6b]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-[#f8f4ef]">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-[#2a2a2e] mt-6 pt-6 space-y-2">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Subtotal</span>
                <span>£{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `£${order.shipping?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-medium text-lg text-[#f8f4ef] pt-2 border-t border-[#2a2a2e]">
                <span>Total</span>
                <span>£{order.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* View Full Order */}
            <Link
              to={`/my-orders/${order.id}`}
              className="mt-8 flex items-center justify-center gap-2 w-full py-4 border border-[#c9b89a] text-[#c9b89a] rounded-full hover:bg-[#c9b89a]/10 transition-colors"
            >
              View Full Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
