export enum UserRole {
  CUSTOMER = 'customer',
  SHOPKEEPER = 'shopkeeper',
}

export type AuthMode = 'signin' | 'signup';

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: string;
  image?: string;
  shopkeeperId: string;
  inStock?: boolean;
}

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
}

export enum DeliveryMethod {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export interface OrderItem extends Item {
  orderQuantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
