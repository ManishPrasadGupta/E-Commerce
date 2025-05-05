"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useNotification } from "@/components/Notification";
import { Loader2, RefreshCcw } from "lucide-react";
import type { IProduct, ColorVariant } from "@/models/Product.model";
import AddressForm from "@/components/Address/addressForm";
import { IAddress } from "@/models/User.model";


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
  const params = useSearchParams();
  const router = useRouter();
  const { showNotification } = useNotification();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [variant, setVariant] = useState<ColorVariant | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);


  const fetchAddresses = async () => {
    setFetchingAddress(true);
    try {
      const res = await apiClient.getAddresses();
      if (res.success && Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
        console.log("Fetched addresses:", res.addresses); 
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setAddresses([]);
    }
    setFetchingAddress(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
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
    const fetchProduct = async () => {
      const productId = params.get("productId");
      const variantType = params.get("variantType");
      if (!productId || !variantType) {
        showNotification("Invalid checkout: product or variant missing", "error");
        router.replace("/");
        return;
      }
      try {
        const prod = await apiClient.getProduct(productId);
        setProduct(prod);
        const foundVariant = prod.variants.find((v: ColorVariant) => v.type === variantType);
        setVariant(foundVariant || null);
        setLoading(false);
      } catch {
        showNotification("Failed to load product info", "error");
        router.replace("/");
      }
    };
    if (status === "authenticated") {
      fetchProduct();
    }
  }, [params, showNotification, router, status]);

  //  Fetch user's address
  // useEffect(() => {
  //   const fetchAddresses = async () => {
  //     setFetchingAddress(true);
  //     try {
  //       const res = await apiClient.getAddresses();
  //       if (res.success && Array.isArray(res.addresses)) {
  //         setAddresses(res.addresses);
  //       } else {
  //         setAddresses([]);
  //       }
  //     } catch (err) {
  //       setAddresses([]);
  //     }
  //     setFetchingAddress(false);
  //   };
  //   if (status === "authenticated") {
  //     fetchAddresses();
  //   }
  // }, [status]);




  // Place order
  const handlePlaceOrder = async () => {

    if (!addresses.length) {
      showNotification("Please enter your address", "error");
      return;
    }

    if (!product || !variant) {
      showNotification("Invalid checkout state", "error");
      return;
    }
    setPlacingOrder(true);
    try {
      
      const { orderId, amount } = await apiClient.createOrder({
        productId: product?._id ?? "",
        variant,
        //this two method yet to be implemented
        // address,
        // paymentMethod,
      });

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
          description: `${product.name} - ${variant.type}`,
          order_id: orderId,
          handler: function () {
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
        showNotification("Order placed!", "success");
        router.push("/orders");
      }
    }  catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      showNotification("Order failed: " + errorMessage, "error");
    }
    setPlacingOrder(false);
  };




  const handleAddressSuccess = async () => {
    try {
      const res = await apiClient.getAddresses();
      setAddresses(res.success && Array.isArray(res.addresses) ? res.addresses : []);
      setOpen(false);
      setEditingAddress(null)
      showNotification("Address saved!", "success");
    } catch {
      showNotification("Failed to fetch addresses!", "error");
    }
  };


  if (status === "loading" || loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product || !variant) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-8">
        <span>Checkout information not found</span>
      </div>
    );
  }

  return (
    <div>
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            setEditingAddress(null); 
            setOpen(true);
          }}
        >
          Add Address
      </button>

      <button
          className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          onClick={fetchAddresses}
          disabled={fetchingAddress}
          title="Fetch Latest Addresses"
        >
          <RefreshCcw className={`inline mr-1 w-4 h-4 ${fetchingAddress ? 'animate-spin' : ''}`} />
          {/* {fetchingAddress ? "Fetching..." : "Fetch Address"} */}
      </button>

      {addresses.length > 0 && (
        <div>
          <div className="font-semibold mb-1">Shipping Addresses:</div>
          {addresses.map((address) => (
            <label key={address._id?.toString()} className="flex gap-2 items-start mb-2 cursor-pointer">
              <input
                type="radio"
                name="shippingAddress"
                value={address._id?.toString()}
                checked={selectedAddressId === address._id?.toString()}
                onChange={() => setSelectedAddressId(address._id?.toString())}
              />
              <div>
                <div>{address.firstName} {address.lastName}</div>
                <div>{address.house}, {address.area}</div>
                <div>{address.city}, {address.state} - {address.pincode}</div>
                <div>Mobile: {address.mobileNumber}</div>
                <button
                  className="ml-2 px-2 py-1 text-xs bg-yellow-400 rounded"
                  onClick={e => {
                    e.preventDefault();
                    setEditingAddress(address); 
                    setOpen(true);             
                  }}
                  >
                  Edit Address
                </button>

                <button
                  className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded"
                  onClick={async e => {
                    e.preventDefault();
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
                >
                  Delete
                </button>
              </div>
            </label>
          ))}
        </div>
      )}

      {open && (
        <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => {
            setOpen(false);
            setEditingAddress(null); 
          }}
        />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md mx-2 max-h-[90vh] overflow-y-auto relative">
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

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Payment Method</label>
        <select
          className="input input-bordered w-full"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          >
          <option value="razorpay">Online Payment (Razorpay)</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="mb-4 bg-base-200 rounded p-4">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
        <div className="flex justify-between">
          <span>
            {product.name} <span className="text-sm text-neutral-500">({variant.type})</span>
          </span>
          <span className="font-bold text-lg">₹{variant.price}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,s0px_-1px_0px_0px_#27272a_inset]"
        type="submit"
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
          
      </div>
    </div>
  );
}
