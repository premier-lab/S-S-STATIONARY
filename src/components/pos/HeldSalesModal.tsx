import React from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Play, Trash2, Clock, ShoppingCart } from 'lucide-react';

interface HeldSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeldSalesModal: React.FC<HeldSalesModalProps> = ({ isOpen, onClose }) => {
  const { heldSales, restoreHeldSale, deleteHeldSale, formatMoney } = useShop();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Parked / Held Sales</h2>
            <p className="text-xs text-stone-500 mt-0.5">Resume an in-progress transaction when customer is ready</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto divide-y divide-stone-100">
          {heldSales.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-600 font-medium">No sales are currently parked</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Use the "Hold" button in the cart to temporarily pause a sale</p>
            </div>
          ) : (
            heldSales.map((sale) => {
              const totalAmount = sale.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
              const itemCount = sale.items.reduce((sum, item) => sum + item.quantity, 0);
              const timeString = new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={sale.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{sale.customerName}</span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {timeString}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-1">
                      {sale.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                    </p>

                    <div className="text-[11px] text-stone-500 flex items-center gap-2 font-mono">
                      <span>{itemCount} items</span>
                      <span>·</span>
                      <span className="font-semibold text-stone-900">{formatMoney(totalAmount)}</span>
                      {sale.notes && (
                        <>
                          <span>·</span>
                          <span className="italic text-amber-700">"{sale.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        restoreHeldSale(sale.id);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Resume</span>
                    </button>
                    <button
                      onClick={() => deleteHeldSale(sale.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Discard parked sale"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
