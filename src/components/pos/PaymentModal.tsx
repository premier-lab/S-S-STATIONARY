import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  X, 
  Banknote, 
  Smartphone, 
  CreditCard, 
  BookOpen, 
  CheckCircle2, 
  Printer, 
  AlertCircle 
} from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saleId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { 
    cartTotal, 
    cartSubtotal,
    cartDiscount,
    cartTaxAmount,
    customers, 
    selectedCustomerId, 
    setSelectedCustomerId,
    registerSale, 
    formatMoney,
    settings,
    printReceipt
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaidStr, setAmountPaidStr] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentCustomer = customers.find(c => c.id === selectedCustomerId);

  // Set default amount paid to cart total when opened
  useEffect(() => {
    if (isOpen) {
      setAmountPaidStr(cartTotal.toString());
      setPaymentMethod('cash');
      setReference('');
      setNotes('');
      setErrorMsg('');
    }
  }, [isOpen, cartTotal]);

  if (!isOpen) return null;

  const parsedPaid = parseFloat(amountPaidStr) || 0;
  const changeDue = Math.max(0, parsedPaid - cartTotal);
  const remainingDue = Math.max(0, cartTotal - parsedPaid);

  // Quick cash bill shortcuts based on typical denominations
  const quickBills = [
    { label: 'Exact', amount: cartTotal },
    { label: '+50', amount: Math.ceil(cartTotal / 50) * 50 },
    { label: '+100', amount: Math.ceil(cartTotal / 100) * 100 },
    { label: '+500', amount: Math.ceil(cartTotal / 500) * 500 },
    { label: '+1,000', amount: Math.ceil(cartTotal / 1000) * 1000 },
  ].filter((b, idx, arr) => {
    // Deduplicate buttons if they resolve to the same value
    return idx === 0 || b.amount > cartTotal && arr.findIndex(x => x.amount === b.amount) === idx;
  });

  const handleProcessSale = (autoPrint: boolean) => {
    setErrorMsg('');

    if (paymentMethod === 'cash' && parsedPaid < cartTotal) {
      setErrorMsg(`Cash received (${formatMoney(parsedPaid)}) is less than total amount (${formatMoney(cartTotal)})`);
      return;
    }

    if (paymentMethod === 'credit' && (!currentCustomer || currentCustomer.name === 'Walk-in Customer')) {
      setErrorMsg('Store credit requires selecting a registered customer account');
      return;
    }

    try {
      const recordedSale = registerSale({
        paymentMethod,
        amountPaid: paymentMethod === 'cash' ? parsedPaid : cartTotal,
        paymentReference: reference.trim() || undefined,
        notes: notes.trim() || undefined
      });

      if (autoPrint) {
        printReceipt(recordedSale);
      }

      onSuccess(recordedSale.id);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete sale');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-700 block">
              Checkout & Payment
            </span>
            <h2 className="text-base font-bold text-stone-900">
              Total Payable: <span className="font-mono text-stone-900">{formatMoney(cartTotal)}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs font-semibold'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1" />
                <span className="text-xs">Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_money')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  paymentMethod === 'mobile_money'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs font-semibold'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-xs">M-Pesa / Mobile</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs font-semibold'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs">Bank Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  paymentMethod === 'credit'
                    ? 'border-amber-700 bg-amber-700 text-white shadow-xs font-semibold'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <BookOpen className="w-5 h-5 mb-1" />
                <span className="text-xs">Store Credit</span>
              </button>
            </div>
          </div>

          {/* Dynamic Payment Body */}
          {paymentMethod === 'cash' && (
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">
                  Cash Tendered ({settings.currency})
                </label>
                <span className="text-xs text-stone-500 font-mono">
                  Due: {formatMoney(cartTotal)}
                </span>
              </div>

              <input
                type="number"
                step="any"
                min="0"
                value={amountPaidStr}
                onChange={(e) => setAmountPaidStr(e.target.value)}
                className="w-full text-lg font-mono font-bold px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 text-stone-900"
                placeholder="0.00"
                autoFocus
              />

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickBills.map((qb, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAmountPaidStr(qb.amount.toString())}
                    className="text-xs font-mono bg-white border border-stone-200 hover:bg-stone-100 hover:border-stone-300 px-2.5 py-1.5 rounded-md text-stone-800 transition-colors"
                  >
                    {qb.label}: {formatMoney(qb.amount)}
                  </button>
                ))}
              </div>

              {/* Change / Balance breakdown */}
              <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600">
                  {parsedPaid >= cartTotal ? 'Change to Return:' : 'Shortfall:'}
                </span>
                <span className={`text-base font-mono font-bold ${
                  parsedPaid >= cartTotal ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {parsedPaid >= cartTotal ? formatMoney(changeDue) : formatMoney(remainingDue)}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'mobile_money' && (
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Direct Mobile Money (M-Pesa / Airtel Money / MTN)</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Transaction Code / Reference (e.g. QKH712398)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="Enter confirmation code"
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 uppercase"
                  autoFocus
                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="font-medium">POS Terminal / Bank Card</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  POS Auth Code / Card Last 4 Digits
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. AUTH-4821 or VISA-9021"
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
              </div>
            </div>
          )}

          {paymentMethod === 'credit' && (
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-start gap-2 text-xs text-amber-900">
                <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Store Credit / On Account</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    This amount will be added to the customer's outstanding balance ledger.
                  </p>
                </div>
              </div>

              {currentCustomer?.name === 'Walk-in Customer' ? (
                <div className="p-2.5 bg-white border border-amber-300 rounded-lg text-xs text-amber-800">
                  Please select an existing customer account (like a school, teacher, or company) from the customer list above before charging to credit.
                </div>
              ) : (
                <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Customer:</span>
                    <span className="font-semibold text-stone-900">{currentCustomer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Current Balance:</span>
                    <span className="font-mono text-stone-700">{formatMoney(currentCustomer?.creditBalance || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-100 font-medium">
                    <span className="text-amber-900">New Balance after sale:</span>
                    <span className="font-mono font-bold text-amber-900">
                      {formatMoney((currentCustomer?.creditBalance || 0) + cartTotal)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Receipt Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Delivered to Form 3 Class, or special request"
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            Back to Cart
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleProcessSale(false)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Record Sale</span>
            </button>

            <button
              type="button"
              onClick={() => handleProcessSale(true)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Record & Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
