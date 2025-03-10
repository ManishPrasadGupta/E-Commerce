import mongoose, {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password: string;
    role: 'user' | 'admin';
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;

}

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},

}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = models?.User || model<IUser>('User', userSchema); 

export default User;