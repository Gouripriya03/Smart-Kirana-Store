import React, { useState, useMemo } from 'react';
import { ShoppingCart, LogOut, Search, Plus, Minus, Trash2, X, Truck, DoorOpen, QrCode, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Item, User, Order, OrderItem, DeliveryMethod, OrderStatus } from '../types';
import { cn } from '../lib/utils';

interface CustomerDashboardProps {
  user: User;
  items: Item[];
  onLogout: () => void;
  onPlaceOrder: (order: Order) => void;
}

export default function CustomerDashboard({ user, items, onLogout, onPlaceOrder }: CustomerDashboardProps) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery' | 'payment' | 'success'>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DeliveryMethod.PICKUP);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.orderQuantity), 0);
  }, [cart]);

  const deliveryFee = deliveryMethod === DeliveryMethod.DELIVERY ? 40 : 0;
  const total = subtotal + deliveryFee;

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, orderQuantity: i.orderQuantity + 1 } : i);
      }
      return [...prev, { ...item, orderQuantity: 1 }];
    });
  };

  const getItemQuantity = (id: string) => {
    return cart.find(i => i.id === id)?.orderQuantity || 0;
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.orderQuantity + delta);
        return { ...item, orderQuantity: newQty };
      }
      return item;
    }).filter(item => item.orderQuantity > 0));
  };

  const startCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('cart');
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: user.id,
      customerEmail: user.email,
      items: cart,
      total,
      deliveryMethod,
      deliveryFee,
      status: OrderStatus.PENDING,
      createdAt: Date.now()
    };
    onPlaceOrder(newOrder);
    setCheckoutStep('success');
    setCart([]);
    setTimeout(() => {
      setShowCheckoutModal(false);
      setCheckoutStep('cart');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-bold text-gray-900">SmartKirana</h1>
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for sugar, rice, pulses..."
              className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={startCheckout}
            className="relative p-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cart.reduce((a, b) => a + b.orderQuantity, 0)}
              </span>
            )}
          </button>
          <div className="text-right hidden sm:block border-l pl-4 border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500">Customer</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Cart Float Button */}
      <AnimatePresence>
        {cart.length > 0 && !showCheckoutModal && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4"
          >
            <button 
              onClick={startCheckout}
              className="w-full bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between font-bold hover:bg-emerald-700 transition-all border-4 border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span>{cart.length} Items Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <span>View Cart & Pay ₹{subtotal}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full pb-32">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop Daily Essentials</h2>
          <p className="text-gray-500 italic">Fresh and high-quality kirana items for your home.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className={cn(
              "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm transition-all group flex flex-col relative",
              item.inStock === false && "opacity-75 grayscale-[0.5]"
            )}>
              <div className="aspect-square bg-emerald-50/50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <ShoppingCart className="w-12 h-12 text-emerald-100" />
                
                {/* Available/Not Indicator */}
                <div className={cn(
                  "absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                  item.inStock !== false ? "bg-emerald-500" : "bg-red-500"
                )} />

                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-gray-600 border border-gray-100 uppercase tracking-tighter">
                  {item.quantity}
                </div>
                
                {item.inStock === false && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="text-xl font-bold text-emerald-600">₹{item.price}</span>
                {item.inStock !== false ? (
                  getItemQuantity(item.id) > 0 ? (
                    <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-1 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-sm hover:text-emerald-700 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-emerald-700 w-4 text-center">{getItemQuantity(item.id)}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )
                ) : (
                  <button 
                    disabled
                    className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed"
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Multi-Step Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Step: Cart Review */}
              {checkoutStep === 'cart' && (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Review Your Cart</h3>
                    <button onClick={() => setShowCheckoutModal(false)}><X /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600">
                             <ShoppingCart className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="text-[10px] text-gray-500 italic">₹{item.price} per unit</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{item.orderQuantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, -item.orderQuantity)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-gray-50 border-t">
                    <div className="flex justify-between text-xl font-black mb-6">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <button 
                      onClick={() => setCheckoutStep('delivery')}
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      Place Order <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Delivery selection */}
              {checkoutStep === 'delivery' && (
                <div className="p-8">
                  <h3 className="text-2xl font-black mb-1">How to receive?</h3>
                  <p className="text-gray-500 mb-8 italic">Choose your preferred method.</p>
                  
                  <div className="space-y-4 mb-8">
                    <button 
                      onClick={() => setDeliveryMethod(DeliveryMethod.PICKUP)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                        deliveryMethod === DeliveryMethod.PICKUP ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <DoorOpen className="w-6 h-6" />
                        <span className="font-bold">Self Pickup</span>
                      </div>
                      <span className="text-sm font-bold">Free</span>
                    </button>

                    <button 
                      onClick={() => setDeliveryMethod(DeliveryMethod.DELIVERY)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                        deliveryMethod === DeliveryMethod.DELIVERY ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6" />
                        <span className="font-bold">Home Delivery</span>
                      </div>
                      <span className="text-sm font-bold">+₹40</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold"
                  >
                    Continue to Payment (₹{total})
                  </button>
                </div>
              )}

              {/* Step: Payment */}
              {checkoutStep === 'payment' && (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Scan & Pay</h3>
                  <p className="text-gray-500 mb-8">Pay ₹{total} to the merchant</p>
                  
                  <div className="bg-gray-100 w-48 h-48 rounded-3xl mx-auto mb-8 flex items-center justify-center border-2 border-emerald-100 shadow-inner">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-100"
                  >
                    I have Paid
                  </button>
                </div>
              )}

              {/* Step: Success */}
              {checkoutStep === 'success' && (
                <div className="p-12 text-center flex flex-col items-center bg-emerald-600 text-white">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-white text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl"
                  >
                    <CheckCircle className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-2">Order Confirmed!</h3>
                  <p className="text-emerald-50 italic">The shopkeeper is notified.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
