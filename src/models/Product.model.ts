import mongoose, {Schema, model, models} from "mongoose";

export interface ColorVariant { 
  type: string;
  price: number;
}

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  imageUrl: string[];
  variants: ColorVariant[];
  isTopProduct?: boolean;
}



const colorVariantSchema = new Schema({
  type:{
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true,
      min: 0,
  }
});

const ProductSchema = new Schema({  
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: [String],
        required: true
    },
    variants: [colorVariantSchema],
    isTopProduct: {   
      type: Boolean,
      default: false
  }

}, {timestamps: true});

const Product = models?.Product || model('Product', ProductSchema);
export default Product;