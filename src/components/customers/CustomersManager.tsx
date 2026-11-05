import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Customer } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  X, 
  BookOpen, 
  CreditCard,
  Phone,
  Mail,
  Building2,
  GraduationCap
} from 'lucide-react';

interface CustomersManagerProps {
  onOpenSaleWithCustomer?: (customerId: string) => void;
}

export const CustomersManager: React.FC<CustomersManagerProps> = () => {
  const { customers, addCustomer, recordCreditPayment, creditPayments, sales, formatMoney, settings } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [onlyDebtors, setOnlyDebtors] = useState(false);

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [payingCustomer, setPayingCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'mobile_money' | 'card'>('cash');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // Selected customer for history view
  const [viewHistoryCustomer, setViewHistoryCustomer] = useState<Customer | null>(null);

  // New customer form
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustType, setNewCustType] = useState<Customer['type']>('Individual');
  const [newCustCredit, setNewCustCredit] = useState('0');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Totals
  const totalOutstandingCredit = customers.reduce((sum, c) => sum + c.creditBalance, 0);

  const filteredCustomers = customers.filter(c => {
    if (onlyDebtors && c.creditBalance <= 0) return false;
    if (selectedType !== 'All' && c.type !== selectedType) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      email: newCustEmail.trim() || undefined,
      type: newCustType,
      creditBalance: parseFloat(newCustCredit) || 0,
      notes: newCustNotes.trim() || undefined
    });

    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustCredit('0');
    setNewCustNotes('');
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingCustomer) return;
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    recordCreditPayment({
      customerId: payingCustomer.id,
      amount: amountNum,
      paymentMethod: payMethod,
      reference: payRef.trim() || undefined,
      notes: payNotes.trim() || undefined
    });

    setPayingCustomer(null);
    setPaymentAmount('');
    setPayRef('');
    setPayNotes('');
  };

  // Get sales of customer in view
  const customerSales = viewHistoryCustomer 
    ? sales.filter(s => s.customerId === viewHistoryCustomer.id || s.customerName === viewHistoryCustomer.name)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Customer Accounts & Credit Ledger</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage school accounts, offices, student debtors, and record credit collections
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Customer / School Account</span>
        </button>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Total Credit Outstanding</span>
          <span className="text-xl font-mono font-extrabold text-amber-800 mt-1 block">
            {formatMoney(totalOutstandingCredit)}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Money owed to shop by accounts
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Active Accounts</span>
          <span className="text-xl font-mono font-bold text-stone-900 mt-1 block">
            {customers.length} Accounts
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {customers.filter(c => c.creditBalance > 0).length} with unpaid balances
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Recent Credit Collections</span>
          <span className="text-xl font-mono font-bold text-emerald-700 mt-1 block">
            {formatMoney(creditPayments.reduce((s, p) => s + p.amount, 0))}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {creditPayments.length} payment receipts recorded
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer by name or phone..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-900"
            />
          </div>

          <div className="sm:w-56">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800"
            >
              <option value="All">All Categories</option>
              <option value="School / Teacher">School / Teacher</option>
              <option value="Office / Corporate">Office / Corporate</option>
              <option value="Student">Student</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          <button
            onClick={() => setOnlyDebtors(!onlyDebtors)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
              onlyDebtors 
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {onlyDebtors ? '✓ Showing Debtors Only' : 'Filter Unpaid Balances'}
          </button>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Customer / Organization</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Phone / Contact</th>
                <th className="px-4 py-3 text-right">Lifetime Purchases</th>
                <th className="px-4 py-3 text-right">Credit Balance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-stone-400">
                    No customers found matching the search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-stone-900 block">{c.name}</span>
                      {c.notes && (
                        <span className="text-[11px] text-stone-400 italic block mt-0.5">
                          {c.notes}
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5 text-stone-600">
                      {c.type}
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5 text-stone-600">
                      <span className="font-mono block">{c.phone || '—'}</span>
                      {c.email && <span className="text-[11px] text-stone-400">{c.email}</span>}
                    </td>

                    {/* Total spent */}
                    <td className="px-4 py-3.5 text-right font-mono text-stone-800 tabular-nums">
                      {formatMoney(c.totalSpent)}
                      <span className="text-[10px] text-stone-400 block font-normal">
                        {c.salesCount} visits
                      </span>
                    </td>

                    {/* Credit Balance */}
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                      {c.creditBalance > 0 ? (
                        <span className="font-bold text-amber-800">
                          {formatMoney(c.creditBalance)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Cleared (0.00)</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.creditBalance > 0 && (
                          <button
                            onClick={() => {
                              setPayingCustomer(c);
                              setPaymentAmount(c.creditBalance.toString());
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                          >
                            Receive Payment
                          </button>
                        )}

                        <button
                          onClick={() => setViewHistoryCustomer(c)}
                          className="px-2 py-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Credit Payment Modal */}
      {payingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 bg-emerald-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Record Credit Payment</h3>
                <p className="text-xs text-stone-500 mt-0.5">{payingCustomer.name}</p>
              </div>
              <button onClick={() => setPayingCustomer(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-5 space-y-4">
              <div className="bg-stone-50 p-3 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Current Outstanding Debt:</span>
                  <span className="font-mono font-bold text-amber-800">{formatMoney(payingCustomer.creditBalance)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Balance After Payment:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatMoney(Math.max(0, payingCustomer.creditBalance - (parseFloat(paymentAmount) || 0)))}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Amount ({settings.currency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full text-base font-mono font-bold px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cash', 'mobile_money', 'card'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                        payMethod === m 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {m.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reference / M-Pesa Code (Optional)
                </label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. QKJ4928"
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setPayingCustomer(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  Record Payment & Clear Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Purchase History Modal */}
      {viewHistoryCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <div>
                <h3 className="text-sm font-bold text-stone-900">{viewHistoryCustomer.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {viewHistoryCustomer.type} · Credit Balance: <strong className="text-amber-800 font-mono">{formatMoney(viewHistoryCustomer.creditBalance)}</strong>
                </p>
              </div>
              <button onClick={() => setViewHistoryCustomer(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Purchase History</h4>
              {customerSales.length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center">No purchases recorded for this customer yet.</p>
              ) : (
                customerSales.map(s => (
                  <div key={s.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                    <div className="flex justify-between font-mono font-bold text-stone-900">
                      <span>{s.receiptNumber}</span>
                      <span>{formatMoney(s.total)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>{s.dateFormatted} · Paid via {s.paymentMethod.replace('_', ' ')}</span>
                      <span className={s.status === 'completed' ? 'text-emerald-700' : 'text-red-700'}>
                        {s.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] pt-1">
                      {s.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setViewHistoryCustomer(null)}
                className="px-4 py-1.5 text-xs text-stone-700 hover:bg-stone-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900">Add Customer / Account</h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Customer / School / Office Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. St. Peters Primary School or Mr. David"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Customer Type
                  </label>
                  <select
                    value={newCustType}
                    onChange={(e) => setNewCustType(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="Individual">Individual</option>
                    <option value="School / Teacher">School / Teacher</option>
                    <option value="Office / Corporate">Office / Corporate</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="e.g. +254 700 000 000"
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="accounts@school.com"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Starting Credit Balance ({settings.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  value={newCustCredit}
                  onChange={(e) => setNewCustCredit(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="e.g. Buys paper reams for term exams"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
