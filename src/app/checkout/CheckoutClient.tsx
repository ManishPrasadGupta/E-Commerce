"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment, useCallback } from "react";
import { apiClient, CreateOrderData } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import {
  Loader2,
  RefreshCcw,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import AddressForm from "@/components/Address/addressForm";
import { IAddress } from "@/models/User.model";
import { useCart } from "@/context/CartContext";
import { ColorVariant } from "@/models/Product.model";
import { useToast } from "@/hooks/use-toast";

// Define a specific type for the Cashfree object
interface CashfreeOptions {
  paymentSessionId: string;
  redirectTarget: string;
  onSuccess: (data: unknown) => void;
  onFailure: (data: unknown) => void;
}

interface Cashfree {
  initialiseDropin: (options: CashfreeOptions) => void;
}

declare global {
  interface Window {
    Cashfree?: Cashfree;
  }
}

// Skeleton component for address loading state
const AddressSkeleton = () => (
  <div className="space-y-4">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="animate-pulse rounded-xl border bg-white p-4">
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="mt-3 h-3 w-3/4 rounded bg-gray-200"></div>
        <div className="mt-2 h-3 w-2/3 rounded bg-gray-200"></div>
      </div>
    ))}
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { status } = useSession();
  const { cartItems, clearCart } = useCart();

  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cashfree");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >();
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [buyNowProduct, setBuyNowProduct] = useState<{
    productId: string;
    variant: ColorVariant;
    quantity: number;
    name: string;
  } | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const total = buyNowProduct
    ? buyNowProduct.variant.price * buyNowProduct.quantity
    : subtotal;

  // Load Cashfree SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    setFetchingAddress(true);
    try {
      const res = await apiClient.getAddresses();
      const userAddresses =
        res.success && Array.isArray(res.addresses) ? res.addresses : [];
      setAddresses(userAddresses);
      if (userAddresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(userAddresses[0]._id?.toString());
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setFetchingAddress(false);
    }
  }, [selectedAddressId]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
      setLoading(false);
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router, fetchAddresses]);

  // Handle "Buy Now" product from localStorage
  useEffect(() => {
    const data = localStorage.getItem("buyNowProduct");
    if (data) {
      try {
        setBuyNowProduct(JSON.parse(data));
      } catch {
        localStorage.removeItem("buyNowProduct");
      }
    }
  }, []);

  const handleAddressSuccess = () => {
    fetchAddresses();
    setAddressModalOpen(false);
    setEditingAddress(null);
    toast({ title: "Success", description: "Address saved successfully!" });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Error",
        description: "Please select a shipping address.",
      });
      return;
    }
    setPlacingOrder(true);

    try {
      const selectedAddress = addresses.find(
        (addr) => addr._id?.toString() === selectedAddressId
      );
      if (!selectedAddress) throw new Error("Selected address not found.");

      const payload: CreateOrderData = buyNowProduct
        ? {
            productId: buyNowProduct.productId,
            variant: buyNowProduct.variant,
            address: selectedAddress,
            paymentMethod,
          }
        : { items: cartItems, address: selectedAddress, paymentMethod };

      const { paymentSessionId } = await apiClient.createOrder(payload);

      if (paymentMethod === "cashfree" && window.Cashfree) {
        window.Cashfree.initialiseDropin({
          paymentSessionId,
          redirectTarget: "_self",
          onSuccess: () => {
            clearCart();
            localStorage.removeItem("buyNowProduct");
            toast({
              title: "Success",
              description: "Payment successful! Your order has been placed.",
            });
            router.push("/orders");
          },
          onFailure: () => {
            toast({
              title: "Error",
              description: "Payment failed. Please try again.",
            });
          },
        });
      } else {
        // COD
        clearCart();
        localStorage.removeItem("buyNowProduct");
        toast({
          title: "Success",
          description: "Order placed successfully! You will pay on delivery.",
        });
        router.push("/orders");
      }
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: `Order failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-4xl font-extrabold tracking-tight text-blue-900">
          Secure Checkout
        </h1>
        <p className="mb-10 text-center text-gray-500">
          Complete your purchase in just a few steps.
        </p>

        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-3">
          {/* Left Column: Address and Payment */}
          <div className="space-y-10 lg:col-span-2">
            {/* Address Section */}
            <div className="rounded-2xl border bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Shipping Address
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                  <button
                    onClick={fetchAddresses}
                    disabled={fetchingAddress}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:animate-spin"
                  >
                    <RefreshCcw className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {fetchingAddress ? (
                  <AddressSkeleton />
                ) : addresses.length > 0 ? (
                  addresses.map((address) => (
                    <label
                      key={address._id?.toString()}
                      className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500 ${
                        selectedAddressId === address._id?.toString()
                          ? "border-blue-600 ring-2 ring-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id?.toString()}
                        checked={selectedAddressId === address._id?.toString()}
                        onChange={() =>
                          setSelectedAddressId(address._id?.toString())
                        }
                        className="sr-only"
                      />
                      {selectedAddressId === address._id?.toString() && (
                        <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-blue-600" />
                      )}
                      <div className="flex-1 text-sm">
                        <span className="font-bold text-gray-900">
                          {address.firstName} {address.lastName}
                        </span>
                        <p className="text-gray-600">
                          {address.house}, {address.area}
                        </p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="mt-1 text-gray-500">
                          Mobile: {address.mobileNumber}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingAddress(address);
                            setAddressModalOpen(true);
                          }}
                          className="flex items-center gap-1 rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 transition hover:bg-yellow-200"
                        >
                          <Edit className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            if (window.confirm("Delete this address?")) {
                              await apiClient.deleteAddress(address);
                              fetchAddresses();
                              toast({
                                title: "Success",
                                description: "Address deleted.",
                              });
                            }
                          }}
                          className="flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="py-4 text-center text-gray-500">
                    No addresses found. Please add one to continue.
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="rounded-2xl border bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800">
                Payment Method
              </h2>
              <div className="mt-4">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="cashfree">
                    Online Payment (Cards, UPI, etc.)
                  </option>
                  <option value="cod">Cash on Delivery</option>
                </select>
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  <ShieldCheck className="h-5 w-5" />
                  <span>All transactions are secure and encrypted.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border bg-white/70 p-6 shadow-2xl backdrop-blur-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-3">
                {buyNowProduct ? (
                  <div className="flex justify-between text-gray-700">
                    <span className="max-w-[70%] truncate">
                      {buyNowProduct.name} x{buyNowProduct.quantity}
                    </span>{" "}
                    <span>
                      ₹
                      {(
                        buyNowProduct.variant.price * buyNowProduct.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-gray-700"
                    >
                      <span className="max-w-[70%] truncate">
                        {item.name} x{item.quantity}
                      </span>{" "}
                      <span>
                        ₹{(item.variant.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="my-4 border-t border-dashed"></div>
              <div className="flex justify-between font-medium text-gray-600">
                <span>Shipping</span>{" "}
                <span className="text-green-600">FREE</span>
              </div>
              <div className="my-4 border-t"></div>
              <div className="flex justify-between text-xl font-extrabold text-blue-900">
                <span>Total</span> <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-3.5 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" /> Placing
                    Order...
                  </>
                ) : (
                  `Place Order (₹${total.toFixed(2)})`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Address Form Modal */}
        <Transition appear show={isAddressModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setAddressModalOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-gray-900"
                    >
                      {editingAddress ? "Edit Address" : "Add a New Address"}
                    </Dialog.Title>
                    <div className="mt-4">
                      <AddressForm
                        onSuccess={handleAddressSuccess}
                        initialData={editingAddress || undefined}
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
