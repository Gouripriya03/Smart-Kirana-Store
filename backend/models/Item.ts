import mongoose, { Schema } from 'mongoose';

const ItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  image: { type: String },
  shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inStock: { type: Boolean, default: true }
});

export const Item = mongoose.model('Item', ItemSchema);
