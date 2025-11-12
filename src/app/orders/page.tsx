"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IOrder } from "@/models/Order.model";
import { Loader2, Download } from "lucide-react";
import { IKImage } from "imagekitio-next";
import { apiClient } from "@/lib/api-client";
import { IProduct } from "@/models/Product.model";
import "@/app/styles/loader.css";
import { Card } from "@radix-ui/themes";

// Color palette for status badge
const statusClasses = {
  completed: "bg-green-100 text-green-700 border-green-300",
  failed: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-yellow-50 text-yellow-900 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    } else if (status !== "loading") {
      // If unauthenticated or any other status, stop loading.
      setLoading(false);
    }
  }, [status]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-blue-700">My Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="space-y-8">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-500 text-lg flex flex-col items-center gap-3">
                <span className="text-3xl">🛒</span>
                <span>No orders found</span>
                <span className="text-base text-slate-400">
                  {session
                    ? "Start shopping and your orders will show here."
                    : "Please log in to see your orders."}
                </span>
              </div>
            </div>
          ) : (
            orders.map((order) => {
              const product = order.productId as IProduct;
              const statusClass =
                statusClasses[order.status as keyof typeof statusClasses] ||
                statusClasses.pending;
              return (
                <Card
                  key={order._id?.toString()}
                  className="flex flex-col border border-slate-100 shadow-glass relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-lg hover:shadow-xl transition duration-200"
                >
                  <div className="w-full flex flex-col md:flex-row gap-6 items-center px-6 py-6">
                    {/* Product image */}
                    <div className="relative rounded-xl overflow-hidden w-36 h-36 shrink-0 bg-slate-200 flex items-center justify-center shadow-inner">
                      <IKImage
                        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                        path={
                          Array.isArray(product?.imageUrl)
                            ? product.imageUrl[0]
                            : product?.imageUrl
                        }
                        alt={`Order ${order._id?.toString().slice(-6)}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <h2 className="text-lg font-bold text-blue-700 mb-2 truncate">
                        {product?.name || "Product"}
                      </h2>
                      <p className="text-sm text-slate-500 mb-1">
                        Order{" "}
                        <span className="font-mono text-xs text-blue-800">
                          #{order._id?.toString().slice(-6)}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Variant:{" "}
                        <span className="font-semibold text-slate-800">
                          {order?.variant?.toString()}
                        </span>
                      </p>
                      <div className="my-2 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusClass}`}
                        >
                          {order.status}
                        </span>
                        <span className="ml-auto text-2xl font-bold text-blue-700">
                          ${order.amount.toFixed(2)}
                        </span>
                      </div>
                      {/* Download if available */}
                      {order.status === "completed" && order.downloadUrl && (
                        <a
                          href={order.downloadUrl}
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-semibold shadow hover:brightness-110 transition"
                          download={`order-${order._id
                            ?.toString()
                            .slice(-6)}.jpg`}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
