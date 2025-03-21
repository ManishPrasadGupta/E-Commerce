import mongoose, {Schema, model, models} from "mongoose";
import { ColorVariant } from "./Product.model";

interface PopulatedUser {
    _id: mongoose.Types.ObjectId;
    email: string;
  }
  
  interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;  
    imageUrl: string[];
    variants: ColorVariant[]; 
  }
  
  
  export interface IOrder {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | PopulatedUser;
    productId: mongoose.Types.ObjectId | PopulatedProduct;
    variant: ColorVariant;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    downloadUrl?: string;
    previewUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variant: {
        type: String,
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed','failed'],
        default: 'pending'
    },
    downloadUrl: {
        type: String
    },
    previewUrl: {
        type: String
    },

}, {timestamps: true});

const Order = models?.Order || model('Order', orderSchema);
export default Order;