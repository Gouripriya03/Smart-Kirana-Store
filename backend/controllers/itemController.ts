import { Request, Response } from 'express';
import { Item } from '../models/Item';

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addItem = async (req: any, res: Response) => {
  try {
    const { name, price, quantity, image } = req.body;
    const item = new Item({ name, price, quantity, image, shopkeeperId: req.user.id });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleStock = async (req: any, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.inStock = !item.inStock;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteItem = async (req: any, res: Response) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
