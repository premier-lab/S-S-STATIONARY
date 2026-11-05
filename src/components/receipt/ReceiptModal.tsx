import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Printer, Copy, Check, Download, Share2 } from 'lucide-react';
import { Sale } from '../../types';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  const { settings, formatMoney } = useShop();
  const [copied, setCopied] = useState(false);

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const getPlainTextReceipt = () => {
    const divider = '------------------------------------------';
    let text = `${settings.shopName}\n`;
    text += `${settings.shopSubtitle}\n`;
    text += `Tel: ${settings.phone}\n`;
    text += `${settings.address}\n`;
    text += `${divider}\n`;
    text += `RECEIPT: ${sale.receiptNumber}\n`;
    text += `Date: ${sale.dateFormatted}\n`;
    text += `Cashier: ${sale.cashier}\n`;
    text += `Customer: ${sale.customerName}\n`;
    text += `${divider}\n`;
    text += `ITEM                    QTY   PRICE   TOTAL\n`;
    text += `${divider}\n`;
    
    sale.items.forEach(item => {
      const itemLine = `${item.name.slice(0, 20).padEnd(22)} ${String(item.quantity).padStart(3)}  ${item.unitPrice.toFixed(0).padStart(6)}  ${item.subtotal.toFixed(0).padStart(6)}\n`;
      text += itemLine;
    });

    text += `${divider}\n`;
    text += `SUBTOTAL: ${formatMoney(sale.subtotal)}\n`;
    if (sale.discount > 0) {
      text += `DISCOUNT: -${formatMoney(sale.discount)}\n`;
    }
    if (sale.taxAmount > 0) {
      text += `${settings.taxName} (${sale.taxRate}%): ${formatMoney(sale.taxAmount)}\n`;
    }
    text += `TOTAL: ${formatMoney(sale.total)}\n`;
    text += `PAYMENT: ${sale.paymentMethod.toUpperCase()} (${formatMoney(sale.amountPaid)})\n`;
    if (sale.changeGiven > 0) {
      text += `CHANGE: ${formatMoney(sale.changeGiven)}\n`;
    }
    if (sale.paymentReference) {
      text += `REF: ${sale.paymentReference}\n`;
    }
    text += `${divider}\n`;
    text += `${settings.receiptFooter}\n`;
    text += `Thank You! Please Visit Again.\n`;

    return text;
  };

  const handleCopyText = () => {
    const text = getPlainTextReceipt();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = getPlainTextReceipt();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sale.receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Top Control Bar (Hidden when printed) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900">Receipt #{sale.receiptNumber}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              sale.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {sale.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyText}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors text-xs flex items-center gap-1"
              title="Copy for WhatsApp / SMS"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-md transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Paper Thermal Receipt */}
        <div className="p-6 bg-stone-50/30 flex justify-center">
          <div 
            id="printable-receipt"
            className="w-full max-w-[340px] bg-white p-6 shadow-sm border border-stone-200 text-stone-900 font-mono text-xs leading-relaxed"
          >
            {/* Shop Brand Header */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <h1 className="text-base font-extrabold tracking-wider uppercase text-stone-950 font-sans">
                {settings.shopName}
              </h1>
              <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                {settings.shopSubtitle}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                {settings.address}
              </p>
              <p className="text-[11px] text-stone-500">
                Tel: {settings.phone}
              </p>
            </div>

            {/* Receipt Meta */}
            <div className="py-2.5 border-b border-dashed border-stone-300 text-[11px] space-y-0.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Receipt No:</span>
                <span className="font-bold text-stone-900">{sale.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Time:</span>
                <span>{sale.dateFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cashier:</span>
                <span>{sale.cashier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-semibold text-stone-900">{sale.customerName}</span>
              </div>
              {sale.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span>{sale.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="py-2.5 border-b border-dashed border-stone-300">
              <div className="flex justify-between text-[10px] text-stone-500 uppercase tracking-wider mb-1.5 pb-1 border-b border-stone-200">
                <span>Item</span>
                <span className="text-right">Total</span>
              </div>

              <div className="space-y-1.5">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="flex justify-between font-medium text-stone-900">
                      <span className="line-clamp-1 pr-2">{item.name}</span>
                      <span className="shrink-0 tabular-nums">{formatMoney(item.subtotal)}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 flex justify-between">
                      <span>{item.quantity} {item.unit || 'pc'} × {formatMoney(item.unitPrice)}</span>
                      <span className="text-[9px] text-stone-400 font-mono">[{item.sku}]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & Totals */}
            <div className="py-2.5 border-b border-dashed border-stone-300 text-[11px] space-y-1">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="tabular-nums">{formatMoney(sale.subtotal)}</span>
              </div>

              {sale.discount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Discount:</span>
                  <span className="tabular-nums">-{formatMoney(sale.discount)}</span>
                </div>
              )}

              {sale.taxAmount > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>{settings.taxName} ({sale.taxRate}%):</span>
                  <span className="tabular-nums">{formatMoney(sale.taxAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-stone-950 pt-1 border-t border-stone-200">
                <span>TOTAL:</span>
                <span className="tabular-nums">{formatMoney(sale.total)}</span>
              </div>

              <div className="flex justify-between pt-1 text-stone-600">
                <span className="capitalize">Paid via {sale.paymentMethod.replace('_', ' ')}:</span>
                <span className="tabular-nums">{formatMoney(sale.amountPaid)}</span>
              </div>

              {sale.changeGiven > 0 && (
                <div className="flex justify-between text-stone-900 font-semibold">
                  <span>Change Given:</span>
                  <span className="tabular-nums">{formatMoney(sale.changeGiven)}</span>
                </div>
              )}

              {sale.paymentReference && (
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>Payment Ref:</span>
                  <span className="font-mono">{sale.paymentReference}</span>
                </div>
              )}

              {sale.notes && (
                <div className="pt-1 text-[10px] text-stone-500 italic">
                  Note: {sale.notes}
                </div>
              )}
            </div>

            {/* Barcode Graphic Simulation */}
            <div className="py-3 text-center">
              <div className="inline-flex flex-col items-center">
                <div className="flex items-center justify-center gap-[1px] h-9 mb-1">
                  {sale.receiptNumber.split('').map((char, i) => {
                    const width = (char.charCodeAt(0) % 3) + 1;
                    return (
                      <span
                        key={i}
                        className="bg-stone-950 h-full inline-block"
                        style={{ width: `${width * 1.5}px` }}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] tracking-widest text-stone-600 font-mono">
                  *{sale.receiptNumber}*
                </span>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-center pt-2 text-[10px] text-stone-500 border-t border-dashed border-stone-300 space-y-0.5">
              <p>{settings.receiptFooter}</p>
              <p className="font-semibold text-stone-700">*** Thank You, Welcome Again! ***</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions (No print) */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
