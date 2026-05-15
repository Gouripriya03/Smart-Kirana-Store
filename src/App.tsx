/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import CustomerDashboard from './components/CustomerDashboard';
import ShopkeeperDashboard from './components/ShopkeeperDashboard';
import { User, Item, UserRole, Order } from './types';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const fetchedItems = await api.get('/items');
      setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      
      const fetchedOrders = await api.get('/orders');
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const handleAuth = (loggedInUser: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', token);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleAddItem = async (newItem: Omit<Item, 'id' | 'shopkeeperId' | 'inStock'>) => {
    try {
      const addedItem = await api.post('/items', newItem);
      setItems(prev => [addedItem, ...prev]);
    } catch (err) {
      console.error('Failed to add item');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const updatedItem = await api.patch(`/items/${id}/stock`);
      setItems(prev => prev.map(item => item._id === id ? updatedItem : item));
    } catch (err) {
      console.error('Failed to toggle availability');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(prev => prev.filter(item => (item._id || item.id) !== id));
    } catch (err) {
      console.error('Failed to delete item');
    }
  };

  const handlePlaceOrder = async (orderData: any) => {
    try {
      const placedOrder = await api.post('/orders', orderData);
      setOrders(prev => [placedOrder, ...prev]);
    } catch (err) {
      console.error('Failed to place order');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await api.patch(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(order => 
        (order._id || order.id) === orderId ? updatedOrder : order
      ));
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  if (loading) return null;

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

