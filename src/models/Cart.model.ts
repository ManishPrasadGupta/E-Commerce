import mongoose, { Document, Model, Types } from "mongoose";
import { ColorVariant } from "./Product.model";

// Cart Item Interface
export interface ICartItem {
  ProductId: string;
  name: string;
  quantity: number;
  variant: ColorVariant;
  // imageSrc?: string;
  // imageAlt?: string;
  // href?: string;
}

// Full Cart Interface
export interface ICart extends Document {
  userId: Types.ObjectId;  
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
  getTotal(): number;
  findItemById(itemId: string): ICartItem | undefined;
}

// Schema for Variant inside Cart Item (no _id added)
const variantSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

// Cart Item Schema
const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: variantSchema, required: true },
    // imageSrc: { type: String },
    // imageAlt: { type: String },
    // href: { type: String },
  },
  { _id: false }
);

// Main Cart Schema
const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "User"
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Method to calculate total price
cartSchema.methods.getTotal = function () {
  return this.items.reduce((total: number, item: ICartItem) => {
    return total + item.variant.price * item.quantity;
  }, 0);
};

// Method to find an item by ID
cartSchema.methods.findItemById = function (itemId: string) {
  return this.items.find((item: ICartItem) => item.ProductId === itemId);
};

// Create the Cart model
const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
