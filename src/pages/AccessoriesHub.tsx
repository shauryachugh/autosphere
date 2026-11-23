import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR } from '../utils/formatters';
import { accessoriesCatalog } from '../data/mockData';
import { Accessory } from '../types';

export const AccessoriesHub: React.FC = () => {
  const { 
    activeVehicle, 
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    cartTotalINR, 
    showToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const filteredAccessories = accessoriesCatalog.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCheckout = () => {
    showToast(`Order placed for ₹${cartTotalINR.toLocaleString('en-IN')}! Dispatching via Blue Dart Express.`, 'success');
    clearCart();
    setIsCartOpen(false);
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated Accessories Hub
            </h1>
            <Badge variant="electric" size="sm">
              Tailored for {activeVehicle.make}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Engineered hardware & accessories tested for Indian road conditions, monsoon weather, and hot summers
          </p>
        </div>

        {/* Cart Launcher Button */}
        <Button
          onClick={() => setIsCartOpen(true)}
          variant="primary"
          size="sm"
          icon={<ShoppingBag className="w-4 h-4" />}
        >
          <span>Cart ({totalCartCount})</span>
          {totalCartCount > 0 && (
            <span className="ml-1 font-mono font-bold">• {formatINR(cartTotalINR)}</span>
          )}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-slate-800">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'All Essentials', value: 'all' },
            { label: 'Smart Tech & Dashcams', value: 'smart_tech' },
            { label: 'EV Charging', value: 'ev_charging' },
            { label: 'Tyre & Maintenance', value: 'maintenance' },
            { label: 'Floor & Boot Mats', value: 'protection' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                  : 'bg-dark-850 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search dashcams, mats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Accessories Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccessories.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden shadow-card flex flex-col justify-between"
          >
            <div>
              {/* Image & Compatibility Badge */}
              <div className="relative aspect-video max-h-48 overflow-hidden bg-dark-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <Badge variant="electric" size="xs">
                    ✓ Fits {activeVehicle.make} {activeVehicle.model}
                  </Badge>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{item.brand}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{item.rating}</span>
                    <span className="text-slate-400 text-[10px]">({item.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1 pt-1 text-xs text-slate-300">
                  {item.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing row */}
                <div className="flex items-baseline justify-between pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-lg font-extrabold text-white font-mono">
                      {formatINR(item.priceINR)}
                    </span>
                    <span className="text-xs text-slate-500 line-through font-mono ml-2">
                      {formatINR(item.originalPriceINR)}
                    </span>
                  </div>

                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    In Stock (Free 48h Delivery)
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart button */}
            <div className="p-5 pt-0">
              <Button
                onClick={() => addToCart(item)}
                variant="primary"
                size="sm"
                className="w-full"
                icon={<ShoppingBag className="w-4 h-4" />}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-dark-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Your Shopping Cart</h3>
                <Badge variant="electric" size="xs">
                  {totalCartCount} items
                </Badge>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="font-semibold text-white">Your cart is empty</p>
                  <p className="text-slate-500 mt-1">Explore our curated automotive essentials above.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {cart.map(({ item, quantity }) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <span className="text-xs font-mono text-cyan-300">
                          {formatINR(item.priceINR)} x {quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-dark-800"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-800 bg-dark-950/60 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Payable (incl. GST):</span>
                  <span className="text-xl font-bold text-white font-mono">{formatINR(cartTotalINR)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  variant="primary"
                  size="md"
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Proceed to Secure Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
