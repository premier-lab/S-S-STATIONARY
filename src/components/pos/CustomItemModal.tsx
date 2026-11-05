import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Plus, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomItemModal: React.FC<CustomItemModalProps> = ({ isOpen, onClose }) => {
  const { addToCart, settings } = useShop();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pc');
  const [category, setCategory] = useState<'Notebooks & Paper' | 'Writing & Correction' | 'School & Math Sets' | 'Office & Filing' | 'Art & Craft' | 'Printing & Services'>('Printing & Services');

  if (!isOpen) return null;

  const quickPresets = [
    { name: 'Color Photocopy A4', price: 30, unit: 'page', category: 'Printing & Services' as const },
    { name: 'B&W Photocopy A4', price: 5, unit: 'page', category: 'Printing & Services' as const },
    { name: 'Spiral Binding A4', price: 120, unit: 'doc', category: 'Printing & Services' as const },
    { name: 'Lamination A4', price: 80, unit: 'page', category: 'Printing & Services' as const },
    { name: 'Book Covering (Plastic)', price: 40, unit: 'book', category: 'School & Math Sets' as const },
    { name: 'Manilla Card Paper', price: 25, unit: 'sheet', category: 'Notebooks & Paper' as const }
  ];

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setName(preset.name);
    setPrice(preset.price.toString());
    setUnit(preset.unit);
    setCategory(preset.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    const parsedQty = parseInt(quantity, 10);

    if (!name.trim() || isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedQty) || parsedQty <= 0) {
      return;
    }

    const tempProduct: Product = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      sku: `CUST-${Date.now().toString().slice(-4)}`,
      barcode: `CUST${Date.now().toString().slice(-6)}`,
      price: parsedPrice,
      cost: parsedPrice * 0.5,
      stock: 9999,
      unit,
      minStockAlert: 0
    };

    addToCart(tempProduct, parsedQty);
    setName('');
    setPrice('');
    setQuantity('1');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Add Custom / Service Item</h2>
            <p className="text-xs text-stone-500 mt-0.5">For one-off services, photocopy, or unlisted stationery</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-5 pt-3 pb-2 bg-stone-50 border-b border-stone-100">
          <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs bg-white border border-stone-200 px-2 py-1 rounded-md text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors whitespace-nowrap"
              >
                {preset.name} ({settings.currency} {preset.price})
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Item or Service Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 5x Color Photocopy or Custom Stamp"
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Unit Price ({settings.currency}) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Unit Type
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="pc">pc (piece)</option>
                <option value="page">page</option>
                <option value="doc">doc</option>
                <option value="pack">pack</option>
                <option value="sheet">sheet</option>
                <option value="set">set</option>
                <option value="book">book</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="Printing & Services">Printing & Services</option>
                <option value="Notebooks & Paper">Notebooks & Paper</option>
                <option value="Writing & Correction">Writing & Correction</option>
                <option value="School & Math Sets">School & Math Sets</option>
                <option value="Office & Filing">Office & Filing</option>
                <option value="Art & Craft">Art & Craft</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
