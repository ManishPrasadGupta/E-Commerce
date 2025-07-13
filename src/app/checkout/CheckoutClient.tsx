"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient, CreateOrderData } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { Loader2, RefreshCcw, Plus, Edit, Trash2 } from "lucide-react";
import AddressForm from "@/components/Address/addressForm";
import { IAddress } from "@/models/User.model";
import { useCart } from "@/context/CartContext";
import { ColorVariant } from "@/models/Product.model";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Cashfree?: {
      initialiseDropin: (options: {
        paymentSessionId: string;
        redirectTarget: string;
        onSuccess: (data: unknown) => void;
        onFailure: (data: unknown) => void;
      }) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { status } = useSession(); // removed 'session'
  const { cartItems, clearCart } = useCart();

  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cashfree");
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

  // Load Cashfree SDK
  useEffect(() => {
    if (!window.Cashfree) {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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

  // Guard Against Broken localStorage
  useEffect(() => {
    const data = localStorage.getItem("buyNowProduct");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.productId && parsed.variant) {
          setBuyNowProduct(parsed);
        } else {
          setBuyNowProduct(null);
          localStorage.removeItem("buyNowProduct");
        }
      } catch {
        setBuyNowProduct(null);
        localStorage.removeItem("buyNowProduct");
      }
    }
  }, []);

  const handleAddressSuccess = async () => {
    try {
      const res = await apiClient.getAddresses();
      setAddresses(res.success && Array.isArray(res.addresses) ? res.addresses : []);
      setOpen(false);
      setEditingAddress(null);
      toast({
        title: "Success",
        description: "Address saved successfully!",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch addresses!",
      });
    }
  };

  // Place order for all items in cart
  const handlePlaceOrder = async () => {
    if (!addresses.length) {
      toast({
        title: "Error",
        description: "Please enter your address",
      });
      return;
    }

    if (!cartItems.length && !buyNowProduct) {
      toast({
        title: "Error",
        description: "Your cart is empty",
      });
      return;
    }
    setPlacingOrder(true);
    try {
      const selectedAddress = addresses.find(addr => addr._id?.toString() === selectedAddressId);
      if (!selectedAddress) {
        toast({
          title: "Error",
          description: "Please select a valid address",
        });
        setPlacingOrder(false);
        return;
      }

      let payload: CreateOrderData;
      if (
        buyNowProduct &&
        buyNowProduct.productId &&
        buyNowProduct.variant
      ) {
        payload = {
          productId: buyNowProduct.productId,
          variant: buyNowProduct.variant,
          address: selectedAddress,
          paymentMethod,
        };
      } else if (cartItems.length) {
        payload = {
          items: cartItems,
          address: selectedAddress,
          paymentMethod,
        };
      } else {
        toast({
          title: "Error",
          description: "No items to order",
        });
        setPlacingOrder(false);
        return;
      }

      // Remove unused orderId and amount
      const { paymentSessionId } = await apiClient.createOrder(payload);

      if (paymentMethod === "cashfree") {
        if (!window.Cashfree) {
          toast({
            title: "Error",
            description: "Cashfree SDK not loaded. Please try again later.",
          });
          setPlacingOrder(false);
          return;
        }

        window.Cashfree.initialiseDropin({
          paymentSessionId,
          redirectTarget: "_self",
          onSuccess: () => {
            clearCart();
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
        // Cash on Delivery
        clearCart();
        toast({
          title: "Success",
          description: "Order placed successfully! You will pay on delivery.",
        });
        router.push("/orders");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Order failed: ${errorMessage}`,
      });
    }
    setPlacingOrder(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!cartItems.length && !buyNowProduct) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-8 shadow-lg rounded-lg bg-red-50 border border-red-200 text-center p-6">
        <span className="text-lg font-semibold text-red-700">Your cart is empty</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8 max-w-xl">
      {/* Checkout Title */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow">
            <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">Checkout</h1>
        </div>
      </div>

      {/* Address Section */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => {
                setEditingAddress(null);
                setOpen(true);
              }}
              aria-label="Add new address"
              title="Add Address"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Add Address</span>
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
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
                  className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 cursor-pointer transition
                  ${isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-300 hover:border-blue-400'}
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
                    tabIndex={-1}
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-800">{address.firstName} {address.lastName}</div>
                    <div className="text-gray-700">{address.house}, {address.area}</div>
                    <div className="text-gray-700">{address.city}, {address.state} - {address.pincode}</div>
                    <div className="text-xs text-gray-500">Mobile: {address.mobileNumber}</div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded shadow-sm"
                      onClick={() => {
                        setEditingAddress(address);
                        setOpen(true);
                      }}
                      aria-label="Edit address"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded shadow-sm"
                      onClick={async event => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (window.confirm("Are you sure you want to delete this address?")) {
                          try {
                            await apiClient.deleteAddress(address);
                            fetchAddresses();
                            toast({
                              title: "Success",
                              description: "Address deleted successfully!",
                            });
                          } catch {
                            toast({
                              title: "Error",
                              description: "Failed to delete address!",
                            });
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
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md mx-2 max-h-[90vh] overflow-y-auto relative animate-fadeIn">
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
        <label className="block font-semibold mb-2 text-gray-800" htmlFor="payment-method">Payment Method</label>
        <select
          id="payment-method"
          className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-700"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="cashfree">Online Payment (Cashfree)</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </section>

      {/* Order Summary */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-2 text-gray-800">Order Summary</h2>
        <div className="bg-blue-50 rounded-xl p-3 sm:p-4 space-y-2 shadow">
          {buyNowProduct ? (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <span className="font-medium text-gray-800">Product</span>
                <span className="text-sm text-neutral-500 ml-1">({buyNowProduct.variant.type})</span>
                <span className="text-xs text-gray-400 ml-2">x {buyNowProduct.quantity}</span>
              </div>
              <span className="font-bold text-md text-blue-700 mt-2 sm:mt-0">
                ₹{buyNowProduct.variant.price * buyNowProduct.quantity}
              </span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center" key={item.productId + item.variant.type}>
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-sm text-neutral-500 ml-1">({item.variant.type})</span>
                  <span className="text-xs text-gray-400 ml-2">x {item.quantity}</span>
                </div>
                <span className="font-bold text-md text-blue-700 mt-2 sm:mt-0">₹{item.variant.price * item.quantity}</span>
              </div>
            ))
          )}
          <div className="flex justify-between items-center pt-2 border-t font-bold text-xl text-blue-800 mt-2">
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
        className={`block w-full py-3 rounded-xl text-white font-bold text-lg transition shadow-lg
          ${placingOrder ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600"}
        `}
        type="button"
        onClick={handlePlaceOrder}
        disabled={placingOrder || (!cartItems.length && !buyNowProduct)}
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