import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product, Category } from '../../types';
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  PlusCircle, 
  X, 
  Check,
  TrendingUp
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, restockProduct, formatMoney, settings } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState('10');

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Notebooks & Paper' as Exclude<Category, 'All'>,
    sku: '',
    barcode: '',
    price: '',
    cost: '',
    stock: '',
    unit: 'pc',
    minStockAlert: '10',
    description: ''
  });

  const categories = [
    'All',
    'Notebooks & Paper',
    'Writing & Correction',
    'School & Math Sets',
    'Office & Filing',
    'Art & Craft',
    'Printing & Services'
  ];

  // Low stock products
  const lowStockCount = products.filter(p => p.minStockAlert > 0 && p.stock <= p.minStockAlert).length;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (showLowStockOnly && !(p.minStockAlert > 0 && p.stock <= p.minStockAlert)) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q)
      );
    });
  }, [products, showLowStockOnly, selectedCategory, searchQuery]);

  // Open add modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Notebooks & Paper',
      sku: `NB-${Date.now().toString().slice(-4)}`,
      barcode: `600${Math.floor(1000000 + Math.random() * 9000000)}`,
      price: '',
      cost: '',
      stock: '20',
      unit: 'pc',
      minStockAlert: '5',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sku: product.sku,
      barcode: product.barcode,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      minStockAlert: product.minStockAlert.toString(),
      description: product.description || ''
    });
  };

  // Submit product create/update
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price) || 0;
    const costNum = parseFloat(formData.cost) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;
    const minAlertNum = parseInt(formData.minStockAlert, 10) || 0;

    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        category: formData.category,
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim(),
        price: priceNum,
        cost: costNum,
        stock: stockNum,
        unit: formData.unit,
        minStockAlert: minAlertNum,
        description: formData.description.trim() || undefined
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name.trim(),
        category: formData.category,
        sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
        barcode: formData.barcode.trim() || `BAR-${Date.now().toString().slice(-6)}`,
        price: priceNum,
        cost: costNum,
        stock: stockNum,
        unit: formData.unit,
        minStockAlert: minAlertNum,
        description: formData.description.trim() || undefined
      });
      setIsAddModalOpen(false);
    }
  };

  // Submit Restock
  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockingProduct) return;
    const qty = parseInt(restockAmount, 10);
    if (!isNaN(qty) && qty > 0) {
      restockProduct(restockingProduct.id, qty);
    }
    setRestockingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Stationery Inventory & Catalog</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage stock levels, buying & selling prices, SKUs, and low-inventory reorders
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Stationery Product</span>
        </button>
      </div>

      {/* Low stock warning banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{lowStockCount} items</strong> have reached or fallen below minimum stock thresholds.
            </span>
          </div>
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className="font-semibold underline underline-offset-2 hover:text-amber-950 shrink-0"
          >
            {showLowStockOnly ? 'Show All Products' : 'Filter Low Stock Only'}
          </button>
        </div>
      )}

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, or barcode..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-900"
            />
          </div>

          <div className="sm:w-60">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Product & SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Cost Price</th>
                <th className="px-4 py-3 text-right">Selling Price</th>
                <th className="px-4 py-3 text-right">Profit Margin</th>
                <th className="px-4 py-3 text-right">In Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-stone-400">
                    No products matched your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0 && p.stock < 9000;
                  const isLowStock = p.minStockAlert > 0 && p.stock <= p.minStockAlert;
                  const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(0) : 0;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Name & SKU */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-stone-900 block">{p.name}</span>
                        <div className="text-[11px] text-stone-400 font-mono flex items-center gap-2 mt-0.5">
                          <span>SKU: {p.sku}</span>
                          <span>·</span>
                          <span>Barcode: {p.barcode}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-stone-600">
                        {p.category}
                      </td>

                      {/* Cost */}
                      <td className="px-4 py-3.5 text-right font-mono text-stone-500 tabular-nums">
                        {formatMoney(p.cost)}
                      </td>

                      {/* Selling Price */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                        {formatMoney(p.price)}
                        <span className="text-[10px] text-stone-400 font-normal ml-0.5">/{p.unit}</span>
                      </td>

                      {/* Margin */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                        <span className="text-emerald-700 font-semibold">
                          +{margin}%
                        </span>
                      </td>

                      {/* Stock Level */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                        {p.stock >= 9000 ? (
                          <span className="text-stone-400 text-[11px]">Unlimited (Service)</span>
                        ) : isOutOfStock ? (
                          <span className="text-red-600 font-bold">0 {p.unit} (Out)</span>
                        ) : isLowStock ? (
                          <span className="text-amber-700 font-bold">
                            {p.stock} {p.unit} (Low)
                          </span>
                        ) : (
                          <span className="text-stone-900 font-semibold">
                            {p.stock} {p.unit}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.stock < 9000 && (
                            <button
                              onClick={() => {
                                setRestockingProduct(p);
                                setRestockAmount('20');
                              }}
                              className="px-2 py-1 text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                              title="Restock units"
                            >
                              + Stock
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Restock Product</h3>
                <p className="text-xs text-stone-500 mt-0.5">{restockingProduct.name}</p>
              </div>
              <button onClick={() => setRestockingProduct(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="p-5 space-y-4">
              <div className="bg-stone-50 p-3 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Current Stock:</span>
                  <span className="font-mono font-bold text-stone-900">{restockingProduct.stock} {restockingProduct.unit}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>After Restock:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {restockingProduct.stock + (parseInt(restockAmount, 10) || 0)} {restockingProduct.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Add Quantity ({restockingProduct.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full text-sm font-mono font-bold px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setRestockingProduct(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Stationery Item'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Oxford Mathematical Geometry Set"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="pc, ream, box, set, pack"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Buying / Cost Price ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0.00"
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Selling Price ({settings.currency}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full text-xs font-mono font-bold px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description / Specification (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 500 sheets per pack, 80 gsm high opacity..."
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-3.5 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
