import { Request, Response } from 'express';
import { Order } from '../models/Order';

export const getOrders = async (req: any, res: Response) => {
  try {
    const query = req.user.role === 'shopkeeper' ? {} : { customerId: req.user.id };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const placeOrder = async (req: any, res: Response) => {
  try {
    const { items, total, deliveryMethod } = req.body;
    const order = new Order({
      customerId: req.user.id,
      items,
      total,
      deliveryMethod
    });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
