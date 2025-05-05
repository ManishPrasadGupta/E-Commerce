import mongoose, {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IAddress {
  _id?: mongoose.Types.ObjectId; 
  firstName: string;
  lastName: string;
  mobileNumber: string;
  pincode: string;
  house: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  }

export interface IUser {
    email: string;
    password: string;
    role: 'user' | 'admin';
    addresses?: IAddress[];
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}


const addressSchema = new Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      pincode: { type: String, required: true, match: /^\d{6}$/ },
      house: { type: String, required: true },  
      area: { type: String, required: true },  
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true }
    }
  );



const userSchema = new Schema(
    {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    addresses: { type: [addressSchema], default: [] }
    },
    {timestamps: true}
);

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = models?.User || model<IUser>('User', userSchema); 

export default User;