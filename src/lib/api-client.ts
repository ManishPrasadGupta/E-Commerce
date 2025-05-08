import { ICartItem } from "@/models/Cart.model";
import { IOrder } from "@/models/Order.model";
import { IProduct, ColorVariant } from "@/models/Product.model";
import { Types } from "mongoose";
import { IAddress } from "@/models/User.model";


export type ProductFormData = Omit<IProduct, "_id">;


export interface UpdateAddressData {
  userId: string;
  address: Omit<IAddress, "_id">;
}


export type CreateOrderData =
  | {
      productId: Types.ObjectId | string;
      variant: ColorVariant;
      address: IAddress;
      paymentMethod: string;
    }
  | {
      items: ICartItem[];
      address: IAddress;
      paymentMethod: string;
  };

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown,
  headers?: Record<string, string>;
};

// in the below T means Template which means anything can come up here also do some research on this.
class ApiClient {

  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api/${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }        

//Products
  async getProducts() {
    const response = await this.fetch<{ products: IProduct[] }>("/products"); // Expect an object with `products` key
    return response.products; // Extract and return only the array
  }
  
  async getTopProducts() {
    const response = await this.fetch<IProduct[]>("/products/top-products"); // Corrected route
    return response; // Directly return the array
  }
  

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData
    });
  }



//orders
  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/user");
  }

  async createOrder(orderData: CreateOrderData) {
    
    let sanitizedOrderData: CreateOrderData;
    if ("productId" in orderData && orderData.productId) {
      sanitizedOrderData = {
        ...orderData,
        productId: orderData.productId.toString(),
      };
    } else {
      // It's the cart-based type, no sanitization needed
      sanitizedOrderData = orderData;
    }
  
    return this.fetch<{ orderId: string; amount: number }>("/orders", {
      method: "POST",
      body: sanitizedOrderData,
    });
  }


//Cart
  async getCartItems() {
    return this.fetch<ICartItem[]>("/cart");
  }

  async addToCart(item: {
    productId: string;
    name: string;
    quantity: number;
    variant: ColorVariant; // includes type and price!
    href?: string;
  }) {
    return this.fetch<ICartItem>("/cart", {
      method: "POST",
      body: { items: [item] }, // always send { items: [item] }
    });
  }
  

  async fetchCart() {
    const res = await fetch("/api/cart", { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();
    return data || [];
  } 


  async updateCartItemQuantity(productId: string, variantType: string, quantity: number) {
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantType, quantity }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }

  async deleteCartItem(productId: string, variantType: string) {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      body: JSON.stringify({ productId, variantType }),
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  }


  async clearCart() {
    return this.fetch<void>("/cart/clear", {
      method: "DELETE",
    });
  }



  //address
  async saveAddress(address: IAddress) {
    const res = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }

  async getAddresses() {
    const res = await fetch(`/api/address`, { method: "GET" });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data;
  }

  async updateAddress(address: IAddress) {
    const res = await fetch(`/api/address/${address._id}`, {
      method: "PUT",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({address})
    });
    if(!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async deleteAddress(address: IAddress) {
    const res = await fetch(`/api/address/${address._id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export const apiClient = new ApiClient();