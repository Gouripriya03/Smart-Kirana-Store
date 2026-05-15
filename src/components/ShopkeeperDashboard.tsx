import React, { useState } from 'react';
import { Store, LogOut, Plus, Package, IndianRupee, Scale, Trash2, ClipboardList, CheckCircle2, ShoppingBag, Clock } from 'lucide-react';
import { Item, User, Order, OrderStatus } from '../types';
import { cn } from '../lib/utils';

interface ShopkeeperDashboardProps {
  user: User;
  items: Item[];
  orders: Order[];
  onAddItem: (item: Omit<Item, 'id' | 'shopkeeperId' | 'inStock'>) => void;
  onDeleteItem: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onLogout: () => void;
}

export default function ShopkeeperDashboard({ user, items, orders, onAddItem, onDeleteItem, onToggleAvailability, onUpdateOrderStatus, onLogout }: ShopkeeperDashboardProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity) return;
    
    onAddItem({
      name,
      price: parseFloat(price),
      quantity,
    });
    
    setName('');
    setPrice('');
    setQuantity('');
  };

  const myItems = items.filter(i => i.shopkeeperId === user.id || i.shopkeeperId === 'system');
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-bold text-gray-900">SmartKirana <span className="text-emerald-500 font-medium text-sm ml-1">Merchant</span></h1>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl mx-4">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'inventory' ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Package className="w-4 h-4" />
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative",
              activeTab === 'orders' ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <ClipboardList className="w-4 h-4" />
            Orders
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {pendingOrders.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            <p className="text-xs text-emerald-600 font-medium">Shopkeeper</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Item Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-xl shadow-emerald-900/5 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-emerald-600" />
                  Add New Item
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Item Name</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Basmati Rice"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Quantity / Unit</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 1kg, 500ml, 1 Pack"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all mt-4"
                  >
                    List Item In Store
                  </button>
                </form>
              </div>
            </div>

            {/* Inventory List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Store Inventory</h2>
                <p className="text-gray-500 italic">You have {myItems.length} items listed in your store.</p>
              </div>

              <div className="space-y-4">
                {myItems.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-[20px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center relative">
                        <Package className="w-8 h-8 text-emerald-600" />
                        {/* The "Small red color thing" */}
                        <div className={cn(
                          "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                          item.inStock !== false ? "bg-emerald-500" : "bg-red-500"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                            item.inStock !== false ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                            {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium italic">{item.quantity}</span>
                          <span className="text-emerald-600 font-bold">₹{item.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onToggleAvailability(item.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                          item.inStock !== false 
                            ? "bg-white text-red-600 border-red-100 hover:bg-red-50" 
                            : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                        )}
                      >
                        {item.inStock !== false ? 'Mark Out of Stock' : 'Mark Available'}
                      </button>
                      <button 
                        onClick={() => onDeleteItem(item.id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {myItems.length === 0 && (
                  <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-gray-500 font-bold">No items listed yet</h3>
                    <p className="text-gray-400 text-sm italic">Add your first item to start selling!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Incoming Orders</h2>
              <p className="text-gray-500 italic">Manage your customer requests and deliveries here.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {orders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                  <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">No orders received yet</h3>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col md:flex-row">
                    <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-emerald-50/30 flex flex-col justify-between w-full md:w-80">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-white px-2 py-1 rounded-full border border-emerald-100">
                            #{order.id}
                          </span>
                          <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full",
                            order.status === OrderStatus.PENDING ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          )}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-black text-gray-900 text-xl">{order.customerEmail.split('@')[0]}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-4">{order.customerEmail}</p>
                        
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                          <ShoppingBag className="w-4 h-4" />
                          {order.items.length} Items
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <Clock className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-emerald-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Method:</span>
                          <span className="text-sm font-bold text-gray-900 uppercase">{order.deliveryMethod}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-black text-emerald-700">
                          <span>Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-8">
                       <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Order Summary</h4>
                       <div className="space-y-3 mb-8">
                         {order.items.map(item => (
                           <div key={item.id} className="flex justify-between items-center text-sm">
                             <div className="flex items-center gap-2">
                               <span className="font-bold text-emerald-600">{item.orderQuantity}x</span>
                               <span className="font-medium text-gray-700">{item.name}</span>
                               <span className="text-[10px] text-gray-400 italic">({item.quantity})</span>
                             </div>
                             <span className="font-bold text-gray-900">₹{item.price * item.orderQuantity}</span>
                           </div>
                         ))}
                         {order.deliveryMethod === 'delivery' && (
                           <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                              <span className="font-medium text-emerald-600">Delivery Fee</span>
                              <span className="font-bold text-gray-900">₹40</span>
                           </div>
                         )}
                       </div>

                       <div className="flex gap-4">
                        {order.status === OrderStatus.PENDING && (
                           <button 
                            onClick={() => onUpdateOrderStatus(order.id, OrderStatus.COMPLETED)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            Mark as Handed Over
                          </button>
                        )}
                        <button className="px-6 py-3 border border-gray-100 text-gray-400 font-bold rounded-xl hover:bg-gray-50 transition-all">
                          Print Bill
                        </button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
