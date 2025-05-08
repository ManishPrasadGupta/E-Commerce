"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient, CreateOrderData } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useNotification } from "@/components/Notification";
import { Loader2, RefreshCcw, Plus, Edit, Trash2 } from "lucide-react";
import AddressForm from "@/components/Address/addressForm";
import { IAddress } from "@/models/User.model";
import { useCart } from "@/context/CartContext";
import { ColorVariant } from "@/models/Product.model";

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: () => void;
  prefill: { email: string };
  theme: { color: string };
};

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { data: session, status } = useSession();
  const { cartItems, clearCart } = useCart();

  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [buyNowProduct, setBuyNowProduct] = useState<{
    productId: string;
    variant: ColorVariant;
    quantity: number;
  } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  // Fetch addresses
  const fetchAddresses = async () => {
    setFetchingAddress(true);
    try {
      const res = await apiClient.getAddresses();
      if (res.success && Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
      setAddresses([]);
    }
    setFetchingAddress(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (addresses.length && !selectedAddressId) {
      setSelectedAddressId(addresses[0]._id?.toString());
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const data = localStorage.getItem("buyNowProduct");
    if (data) {
      setBuyNowProduct(JSON.parse(data));
      localStorage.removeItem("buyNowProduct"); // optional: clear after use
    }
  }, []);

  const handleAddressSuccess = async () => {
    try {
      const res = await apiClient.getAddresses();
      setAddresses(res.success && Array.isArray(res.addresses) ? res.addresses : []);
      setOpen(false);
      setEditingAddress(null);
      showNotification("Address saved!", "success");
    } catch {
      showNotification("Failed to fetch addresses!", "error");
    }
  };

  // Place order for all items in cart
  const handlePlaceOrder = async () => {
    if (!addresses.length) {
      showNotification("Please enter your address", "error");
      return;
    }


    if (!cartItems.length && !buyNowProduct) {
      showNotification("Cart is empty", "error");
      return;
    }
    setPlacingOrder(true);
    try {
      const selectedAddress = addresses.find(addr => addr._id?.toString() === selectedAddressId);
      if (!selectedAddress) {
        showNotification("Please select a valid address", "error");
        setPlacingOrder(false);
        return;
      }


      

      let payload: CreateOrderData;
      if (buyNowProduct) {
        payload = {
          productId: buyNowProduct.productId,
          variant: buyNowProduct.variant,
          address: selectedAddress,
          paymentMethod,
        };
      } else {
        payload = {
          items: cartItems,
          address: selectedAddress,
          paymentMethod,
        };
      }
  
      const { orderId, amount } = await apiClient.createOrder(payload);

      // Razorpay payment
      if (paymentMethod === "razorpay") {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
          showNotification("Razorpay key is missing", "error");
          setPlacingOrder(false);
          return;
        }
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency: "INR",
          name: "Electronics",
          description: `Order for ${cartItems.length} items`,
          order_id: orderId,
          handler: function () {
            clearCart();
            showNotification("Payment successful!", "success");
            router.push("/orders");
          },
          prefill: { email: session?.user?.email || "" },
          theme: { color: "#3399cc" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Cash on Delivery
        clearCart();
        showNotification("Order placed!", "success");
        router.push("/orders");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      showNotification("Order failed: " + errorMessage, "error");
    }
    setPlacingOrder(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-8">
        <span>Your cart is empty</span>
      </div>
    );
  }


  

// ##########################################(Return)#########################################################



  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      {/* Checkout Title */}
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      {/* Address Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => {
                setEditingAddress(null);
                setOpen(true);
              }}
              aria-label="Add new address"
              title="Add Address"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              onClick={fetchAddresses}
              disabled={fetchingAddress}
              title="Fetch Latest Addresses"
              aria-label="Refresh address list"
            >
              <RefreshCcw className={`w-4 h-4 ${fetchingAddress ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh addresses</span>
            </button>
          </div>
        </div>
        {addresses.length > 0 ? (
          <fieldset className="space-y-3">
          <legend className="sr-only">Select Shipping Address</legend>
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address._id?.toString();
            return (
              <label
                key={address._id?.toString()}
                htmlFor={`address-${address._id}`}
                tabIndex={0}
                className={`p-3 rounded border flex flex-col sm:flex-row items-start sm:items-center gap-2 cursor-pointer transition
                  ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                `}
                onClick={() => setSelectedAddressId(address._id?.toString())}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") setSelectedAddressId(address._id?.toString());
                }}
                aria-pressed={isSelected}
              >
                <input
                  id={`address-${address._id}`}
                  type="radio"
                  name="shippingAddress"
                  value={address._id?.toString()}
                  checked={isSelected}
                  onChange={() => setSelectedAddressId(address._id?.toString())}
                  className="accent-blue-600 mt-1"
                  aria-label={`Select address for ${address.firstName} ${address.lastName}`}
                  tabIndex={-1} // So tab goes to label, not input
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium">{address.firstName} {address.lastName}</div>
                  <div>{address.house}, {address.area}</div>
                  <div>{address.city}, {address.state} - {address.pincode}</div>
                  <div className="text-xs text-gray-500">Mobile: {address.mobileNumber}</div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation(); 
                      setEditingAddress(address);
                      setOpen(true);
                    }}
                    aria-label="Edit address"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
                    onClick={async e => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevents selecting address when deleting
                      if (window.confirm("Are you sure you want to delete this address?")) {
                        try {
                          await apiClient.deleteAddress(address);
                          fetchAddresses();
                          showNotification("Address deleted!", "success");
                        } catch {
                          showNotification("Failed to delete address!", "error");
                        }
                      }
                    }}
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </label>
            );
          })}
        </fieldset>
        ) : (
          <div className="text-gray-500 italic mt-2">No addresses saved yet. Please add one.</div>
        )}
      </section>

      {/* Address Modal */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
            onClick={() => {
              setOpen(false);
              setEditingAddress(null);
            }}
            aria-label="Close address modal"
          />
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 max-h-[90vh] overflow-y-auto relative animate-fadeIn">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setOpen(false);
                  setEditingAddress(null);
                }}
                aria-label="Close"
              >
                &#10005;
              </button>
              <AddressForm
                onSuccess={handleAddressSuccess}
                initialData={editingAddress || undefined}
              />
            </div>
          </div>
        </>
      )}

      {/* Payment Section */}
      <section className="mb-8">
        <label className="block font-semibold mb-2" htmlFor="payment-method">Payment Method</label>
        <select
          id="payment-method"
          className="input input-bordered w-full"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="razorpay">Online Payment (Razorpay)</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </section>

      {/* Order Summary */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
        <div className="bg-base-200 rounded p-4 space-y-2">
          {buyNowProduct ? (
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Product</span>
                <span className="text-sm text-neutral-500 ml-1">({buyNowProduct.variant.type})</span>
                <span className="text-xs text-gray-400 ml-2">x {buyNowProduct.quantity}</span>
              </div>
              <span className="font-bold text-md">
                ₹{buyNowProduct.variant.price * buyNowProduct.quantity}
              </span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="flex justify-between items-center" key={item.productId + item.variant.type}>
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-neutral-500 ml-1">({item.variant.type})</span>
                  <span className="text-xs text-gray-400 ml-2">x {item.quantity}</span>
                </div>
                <span className="font-bold text-md">₹{item.variant.price * item.quantity}</span>
              </div>
            ))
          )}
          <div className="flex justify-between items-center pt-2 border-t font-bold text-xl text-blue-700 mt-2">
            <span>Total</span>
            <span>
              ₹
              {buyNowProduct
                ? buyNowProduct.variant.price * buyNowProduct.quantity
                : subtotal}
            </span>
          </div>
        </div>
      </section>

      {/* Place Order Button */}
      <button
        className={`block w-full py-3 rounded-md text-white font-bold text-lg transition shadow-lg
          ${placingOrder ? "bg-gray-400" : "bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600"}
        `}
        type="button"
        onClick={handlePlaceOrder}
        disabled={placingOrder || !cartItems.length}
        aria-busy={placingOrder}
      >
        {placingOrder ? (
          <span className="flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Placing Order...
          </span>
        ) : (
          "Place Order"
        )}
      </button>
    </div>
  );
}