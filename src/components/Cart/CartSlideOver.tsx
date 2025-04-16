import { useCart } from "@/context/CartContext";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CartSlideOver({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce((total, item) => total + item.variant.price * item.quantity, 0);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                    <button onClick={() => setOpen(false)} className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                      <XMarkIcon className="size-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex py-6">
                          {/* <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image || "https://via.placeholder.com/100"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div> */}
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                              <p className="mt-1 text-sm text-gray-500">Color: {item.variant.price}</p>
                                {/* <p className="ml-4">₹{item.price}</p> */}
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Color: {item.variant.type}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <p className="text-gray-500">Qty {item.quantity}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="mt-6">
                    <a href="#" className="flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">
                      Checkout
                    </a>
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <button onClick={() => setOpen(false)} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Continue Shopping &rarr;
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
