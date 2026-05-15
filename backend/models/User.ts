import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'shopkeeper'], required: true },
  createdAt: { type: Number, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
