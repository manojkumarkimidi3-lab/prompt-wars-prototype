import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Store as StoreIcon, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Star, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  ArrowRight,
  Trash2,
  Gift
} from 'lucide-react';
import type { Store, Product, CartItem, City } from '../types';

interface CustomerNeighborhoodBasketProps {
  stores: Store[];
  selectedCity: string;
  cart: CartItem[];
  onAddToCart: (product: Product, store: Store) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdateSubPreference: (productId: string, preference: 'auto-refund' | 'allow-smart-sub' | 'call-me') => void;
  onPlaceOrder: (customerDetails: { name: string; address: string; couponCode: string }) => void;
  onOpenOperations: () => void;
}

export const CustomerNeighborhoodBasket: React.FC<CustomerNeighborhoodBasketProps> = ({
  stores,
  selectedCity,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onUpdateSubPreference,
  onPlaceOrder,
  onOpenOperations
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState('Aishwarya Rao');
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Sterling Terraces, Indiranagar, Bengaluru');
  const [couponCode, setCouponCode] = useState('LOCALHERO');
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Filter stores by selected city and category
  const cityStores = stores.filter(
    (s) => s.city.toLowerCase() === selectedCity.toLowerCase()
  );

  const filteredStores = selectedCategory === 'all'
    ? cityStores
    : cityStores.filter((s) => s.category === selectedCategory);

  // Cart calculations
  const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = couponCode.trim().toUpperCase() === 'LOCALHERO' ? 50 : 0;
  const deliveryFee = totalAmount > 400 ? 0 : 25;
  const finalPayable = Math.max(0, totalAmount - discount + deliveryFee);

  // Unique stores involved in cart
  const storesInCart = Array.from(new Set(cart.map((item) => item.store.id))).map((id) =>
    stores.find((s) => s.id === id)
  ).filter(Boolean) as Store[];

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onPlaceOrder({
      name: customerName,
      address: customerAddress,
      couponCode: couponCode.trim().toUpperCase()
    });
    setOrderSuccessId(`NC-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Curated Neighborhood Commerce</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Active City: {selectedCity}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Discover Authentic Local Stores & Build Multi-Store Baskets
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              NOVA CART's genuine competitive moat: 620 artisan bakeries, wellness pharmacies, and heritage kitchens that dark stores cannot replicate.
              Combine items across multiple neighborhood shops in a single checkout with synchronized batch delivery.
            </p>
          </div>

          {/* Habit Formation Milestone Badge (addresses 3-order cliff) */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 shrink-0 max-w-sm">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Milestone Habit Engine</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Your Progress:</span>
              <span className="font-mono font-bold text-amber-400">Order #3 of 3</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-snug">
              Complete Order #3 today to lock in <strong>72% VIP Repeat Status</strong> + ₹50 multi-store neighborhood credit.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Local Shops' },
          { id: 'Artisan Bakery', label: '🥖 Artisan Bakeries' },
          { id: 'Ayurvedic & Pharmacy', label: '🌿 Ayurvedic & Pharmacy' },
          { id: 'Organic Produce', label: '🥗 Hydroponic & Organic' },
          { id: 'Heritage Sweets & Snacks', label: '🍬 Heritage Sweets & Snacks' },
          { id: 'Gourmet Dairy & Cheese', label: '🧀 Artisanal Dairy' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Layout: Stores/Products (Left 8 cols) vs Cart (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stores and Product Catalog */}
        <div className="lg:col-span-8 space-y-6">
          {filteredStores.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              No stores found in this category for {selectedCity}. Try selecting "All Local Shops" or switch city.
            </div>
          ) : (
            filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-4"
              >
                {/* Store Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={store.bannerImage}
                      alt={store.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-white">{store.name}</h2>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {store.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {store.specialtyTagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{store.rating}</span>
                      <span className="text-slate-500">({store.reviewCount})</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{store.avgPreparationTime}m prep</span>
                    </div>
                    {store.isRushMode && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Rush Shield Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Store Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {store.products.map((product) => {
                    const cartItem = cart.find((i) => i.product.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-28 object-cover rounded-md border border-slate-800"
                            />
                            {product.isSpecialty && (
                              <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                                Local Moat
                              </span>
                            )}
                            <span className="absolute bottom-1.5 right-1.5 bg-slate-950/80 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Stock: {product.stock}</span>
                            </span>
                          </div>

                          <div className="mt-2.5">
                            <h3 className="text-xs font-bold text-white line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-mono font-bold text-white">
                              ₹{product.price}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {product.unit}
                            </span>
                          </div>

                          {cartItem ? (
                            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(product.id, cartItem.quantity - 1)}
                                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-white text-xs">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(product.id, cartItem.quantity + 1)}
                                className="w-5 h-5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => onAddToCart(product, store)}
                              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Sticky Column: Multi-Store Neighborhood Basket */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Neighborhood Basket</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                {cart.length} item{cart.length === 1 ? '' : 's'}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs space-y-2">
                <ShoppingBag className="w-8 h-8 text-slate-700 mx-auto" />
                <p>Your basket is empty.</p>
                <p className="text-[11px] text-slate-600">
                  Select items from multiple stores to test synchronized batch bundling!
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {/* Stores Involved in this Single Order */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Bundled Neighborhood Pickups:</span>
                    <span className="text-emerald-400 font-mono text-[10px]">1 Rider • 24 min ETA</span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-amber-300 font-medium">
                    {storesInCart.map((s) => (
                      <span key={s.id} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        • {s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cart Items List with Proactive Substitution Preference */}
                <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.store.name} • ₹{item.product.price} × {item.quantity}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">
                            ₹{item.product.price * item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 0)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Substitution Preference Pill Selector (Fixes 8% substitute disputes) */}
                      <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">If item out of stock:</span>
                        <select
                          value={item.substitutionPreference}
                          onChange={(e) =>
                            onUpdateSubPreference(
                              item.product.id,
                              e.target.value as 'auto-refund' | 'allow-smart-sub' | 'call-me'
                            )
                          }
                          className="bg-slate-900 border border-slate-700 text-amber-300 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                        >
                          <option value="auto-refund">Instant 30s UPI Refund</option>
                          <option value="allow-smart-sub">Allow Curated Alternative</option>
                          <option value="call-me">Call Before Substituting</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address & Customer Details */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="text-slate-400 text-[11px] block">Delivery Location:</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono mt-0.5 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block">Promo Coupon:</label>
                    <div className="flex gap-1.5 mt-0.5">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. LOCALHERO"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-amber-300 font-mono uppercase focus:outline-none focus:border-amber-500"
                      />
                      <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono rounded font-bold shrink-0 flex items-center">
                        ₹{discount} OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="pt-3 border-t border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">₹{totalAmount}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Habit Milestone Discount:</span>
                      <span className="font-mono">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Bundled Delivery Fee:</span>
                    <span className="font-mono text-white">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                    <span>Total Payable:</span>
                    <span className="font-mono text-amber-400">₹{finalPayable}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
                >
                  <span>Place Multi-Store Neighborhood Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Success Notification Alert */}
          {orderSuccessId && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Order Placed: #{orderSuccessId}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Rider assigned for synchronized multi-store collection. Both merchants have acknowledged stock!
              </p>
              <button
                onClick={onOpenOperations}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline pt-1"
              >
                <span>Track in Operations Tower</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
