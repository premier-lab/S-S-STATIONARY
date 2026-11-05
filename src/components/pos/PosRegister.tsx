import React, { useState, useMemo, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { Category, Product } from '../../types';
import { 
  Search, 
  Barcode, 
  Plus, 
  Minus, 
  Trash2, 
  Pause, 
  RotateCcw, 
  UserPlus, 
  Percent, 
  Tag, 
  Layers, 
  Printer, 
  ArrowRight,
  AlertTriangle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { CustomItemModal } from './CustomItemModal';
import { PaymentModal } from './PaymentModal';

interface PosRegisterProps {
  onOpenCustomerModal: () => void;
  onOpenHeldModal: () => void;
}

export const PosRegister: React.FC<PosRegisterProps> = ({ 
  onOpenCustomerModal,
  onOpenHeldModal 
}) => {
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartItemQty, 
    updateCartItemPrice, 
    clearCart,
    cartSubtotal,
    cartTotal,
    cartDiscount,
    setCartDiscount,
    cartDiscountType,
    setCartDiscountType,
    cartTaxAmount,
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    holdCurrentSale,
    heldSales,
    settings,
    formatMoney
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeNotice, setBarcodeNotice] = useState<string | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const categories: Category[] = [
    'All',
    'Notebooks & Paper',
    'Writing & Correction',
    'School & Math Sets',
    'Office & Filing',
    'Art & Craft',
    'Printing & Services'
  ];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.barcode.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Barcode / SKU direct scanning simulation
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    const matchedProduct = products.find(
      p => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase()
    );

    if (matchedProduct) {
      addToCart(matchedProduct, 1);
      setBarcodeNotice(`Added: ${matchedProduct.name}`);
      setBarcodeInput('');
      setTimeout(() => setBarcodeNotice(null), 2500);
    } else {
      setBarcodeNotice(`Barcode "${code}" not found in catalog`);
      setTimeout(() => setBarcodeNotice(null), 3000);
    }
  };

  const handleHoldSalePrompt = () => {
    if (cart.length === 0) return;
    const note = window.prompt("Optional note for this parked sale (e.g. customer name or item waiting):", "");
    holdCurrentSale(note !== null ? note : undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      
      {/* Top Bar Banner / Quick Notification */}
      {barcodeNotice && (
        <div className="mb-4 py-2 px-4 bg-stone-900 text-white text-xs font-medium rounded-lg flex items-center justify-between shadow-md animate-in slide-in-from-top-2 duration-150">
          <span>{barcodeNotice}</span>
          <button onClick={() => setBarcodeNotice(null)} className="text-stone-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center: Catalog, Category Filters & Barcode Search (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search, Barcode Input & Quick Add Actions */}
          <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              
              {/* Product search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, SKU, or keyword..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Barcode / Quick SKU scanner */}
              <form onSubmit={handleBarcodeSubmit} className="flex gap-1.5 sm:w-60">
                <div className="relative flex-1">
                  <Barcode className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    ref={barcodeInputRef}
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan / Type Barcode"
                    className="w-full text-xs font-mono pl-8 pr-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-2.5 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors shrink-0"
                  title="Scan & Add"
                >
                  Enter
                </button>
              </form>

              {/* Custom Item Button */}
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="px-3 py-2 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-amber-700" />
                <span>+ Custom / Service</span>
              </button>
            </div>

            {/* Category Segmented Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2 px-1">
              <span>Showing {filteredProducts.length} stationery items</span>
              <span className="font-mono text-[11px]">Click item card to add to bill</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
                <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">No stationery items found</p>
                <p className="text-xs text-stone-400 mt-0.5">Try a different search term or add a custom service</p>
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add as Custom Item</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0 && product.stock < 9000;
                  const isLowStock = product.minStockAlert > 0 && product.stock <= product.minStockAlert;
                  const inCartCount = cart.find(i => i.product.id === product.id)?.quantity || 0;

                  return (
                    <button
                      key={product.id}
                      onClick={() => !isOutOfStock && addToCart(product, 1)}
                      disabled={isOutOfStock}
                      className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between group ${
                        isOutOfStock
                          ? 'bg-stone-100/70 border-stone-200 opacity-60 cursor-not-allowed'
                          : inCartCount > 0
                          ? 'bg-amber-50/40 border-amber-300 shadow-xs hover:border-amber-400 hover:shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                      }`}
                    >
                      {/* In-cart badge indicator */}
                      {inCartCount > 0 && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center font-mono font-bold text-[10px] shadow-xs">
                          {inCartCount}
                        </div>
                      )}

                      <div>
                        {/* Quiet category metadata */}
                        <div className="text-[10px] text-stone-600 uppercase tracking-wider mb-1 line-clamp-1">
                          {product.category}
                        </div>

                        {/* Product Title */}
                        <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-900 leading-snug line-clamp-2 mb-1.5">
                          {product.name}
                        </h4>

                        {/* SKU */}
                        <span className="text-[10px] text-stone-500 font-mono block">
                          SKU: {product.sku}
                        </span>
                      </div>

                      {/* Bottom Row: Price & Stock */}
                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-end justify-between">
                        <div>
                          <div className="text-xs font-mono font-bold text-stone-900">
                            {formatMoney(product.price)}
                            <span className="text-[10px] text-stone-500 font-normal ml-0.5">/{product.unit}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          {product.stock >= 9000 ? (
                            <span className="text-[10px] text-stone-500">Service</span>
                          ) : isOutOfStock ? (
                            <span className="text-[10px] text-red-600 font-medium">Out of Stock</span>
                          ) : isLowStock ? (
                            <span className="text-[10px] text-amber-700 font-mono font-medium">
                              {product.stock} left
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-600 font-mono">
                              {product.stock} in stock
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart Register Tape (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-6.5rem)] min-h-[580px]">
            
            {/* Cart Header */}
            <div className="p-4 border-b border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900">Current Sale Tape</h3>
                  <span className="text-xs font-mono text-stone-500">
                    ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {cart.length > 0 && (
                    <>
                      <button
                        onClick={handleHoldSalePrompt}
                        className="px-2 py-1 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200 transition-colors flex items-center gap-1"
                        title="Park this sale"
                      >
                        <Pause className="w-3 h-3 text-amber-600" />
                        <span>Hold</span>
                      </button>

                      <button
                        onClick={clearCart}
                        className="px-2 py-1 text-xs text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Clear bill"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Customer Selector */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.creditBalance > 0 ? `(Owes ${formatMoney(c.creditBalance)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={onOpenCustomerModal}
                  className="px-2.5 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  title="Add new customer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3 text-stone-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-stone-600">Register is empty</p>
                  <p className="text-[11px] text-stone-400 mt-1 max-w-[200px]">
                    Select stationery from the catalog or type a barcode to start billing
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-stone-400 font-mono flex items-center gap-2">
                          <span>{item.product.sku}</span>
                          <span>·</span>
                          <span className="text-stone-600">{formatMoney(item.unitPrice)}/{item.product.unit}</span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-stone-900 shrink-0">
                        {formatMoney(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    {/* Quantity controls & Line delete */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                        <button
                          onClick={() => updateCartItemQty(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-stone-600 hover:bg-white hover:text-stone-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) updateCartItemQty(item.product.id, val);
                          }}
                          className="w-10 text-center text-xs font-mono font-semibold bg-transparent focus:outline-none focus:bg-white rounded"
                        />

                        <button
                          onClick={() => updateCartItemQty(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-stone-600 hover:bg-white hover:text-stone-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick price override */}
                        <button
                          onClick={() => {
                            const newP = window.prompt(`Adjust unit price for "${item.product.name}":`, item.unitPrice.toString());
                            if (newP !== null) {
                              const parsed = parseFloat(newP);
                              if (!isNaN(parsed) && parsed >= 0) {
                                updateCartItemPrice(item.product.id, parsed);
                              }
                            }
                          }}
                          className="text-[11px] text-stone-500 hover:text-stone-900 underline underline-offset-2"
                        >
                          Edit Price
                        </button>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Calculations & Checkout Trigger */}
            <div className="p-4 border-t border-stone-200 bg-stone-50/70 space-y-3 shrink-0">
              
              {/* Discount & Tax breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">{formatMoney(cartSubtotal)}</span>
                </div>

                {/* Discount configuration input */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Tag className="w-3 h-3 text-stone-400" />
                    <span>Discount:</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={cartDiscount || ''}
                      onChange={(e) => setCartDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-16 text-right text-xs font-mono px-1.5 py-0.5 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    <button
                      type="button"
                      onClick={() => setCartDiscountType(cartDiscountType === 'fixed' ? 'percent' : 'fixed')}
                      className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition-colors"
                    >
                      {cartDiscountType === 'fixed' ? settings.currency : '%'}
                    </button>
                  </div>
                </div>

                {settings.taxEnabled && (
                  <div className="flex justify-between text-stone-600">
                    <span>{settings.taxName} ({settings.taxRate}%):</span>
                    <span className="font-mono tabular-nums">{formatMoney(cartTaxAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900">Total Payable:</span>
                  <span className="text-lg font-mono font-extrabold text-stone-950">
                    {formatMoney(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setIsPaymentModalOpen(true)}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm ${
                  cart.length === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 text-white hover:shadow-md'
                }`}
              >
                <span>Charge {formatMoney(cartTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <CustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          // Receipt modal opens via context
        }}
      />
    </div>
  );
};
