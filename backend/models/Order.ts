import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    name: { type: String },
    price: { type: Number },
    orderQuantity: { type: Number }
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  deliveryMethod: { type: String, enum: ['pickup', 'delivery'], required: true },
  createdAt: { type: Number, default: Date.now }
});

export const Order = mongoose.model('Order', OrderSchema);
