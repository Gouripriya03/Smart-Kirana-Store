/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import AuthPage from './components/AuthPage';
import CustomerDashboard from './components/CustomerDashboard';
import ShopkeeperDashboard from './components/ShopkeeperDashboard';
import { User, Item, UserRole, Order } from './types';

// Initial mock data
const INITIAL_ITEMS: Item[] = [
  { id: '1', name: 'Basmati Rice', price: 450, quantity: '5kg', shopkeeperId: 'system', inStock: true },
  { id: '2', name: 'Toor Dal', price: 120, quantity: '1kg', shopkeeperId: 'system', inStock: true },
  { id: '3', name: 'Sunflower Oil', price: 165, quantity: '1L', shopkeeperId: 'system', inStock: false },
  { id: '4', name: 'Aashirvaad Atta', price: 290, quantity: '5kg', shopkeeperId: 'system', inStock: true },
  { id: '5', name: 'Sugar', price: 45, quantity: '1kg', shopkeeperId: 'system', inStock: true },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleAuth = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddItem = (newItem: Omit<Item, 'id' | 'shopkeeperId' | 'inStock'>) => {
    if (!user) return;
    const item: Item = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      shopkeeperId: user.id,
      inStock: true
    };
    setItems(prev => [item, ...prev]);
  };

  const handleToggleAvailability = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePlaceOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return (
    <main className="min-h-screen bg-[#F8FAF8]">
      {!user ? (
        <AuthPage onAuth={handleAuth} />
      ) : user.role === UserRole.CUSTOMER ? (
        <CustomerDashboard 
          user={user} 
          items={items} 
          onLogout={handleLogout}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : (
        <ShopkeeperDashboard 
          user={user} 
          items={items} 
          orders={orders}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onToggleAvailability={handleToggleAvailability}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}

