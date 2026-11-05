import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Sale, PaymentMethod, SaleStatus } from '../../types';
import { 
  Search, 
  Printer, 
  RotateCcw, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface SalesLedgerProps {
  onViewReceipt: (sale: Sale) => void;
}

export const SalesLedger: React.FC<SalesLedgerProps> = ({ onViewReceipt }) => {
  const { sales, refundSale, formatMoney, settings } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Void/Refund prompt state
  const [refundingSaleId, setRefundingSaleId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Date boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400 * 1000;
  const weekStart = todayStart - 7 * 86400 * 1000;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // Date filter
      if (dateFilter === 'today' && sale.timestamp < todayStart) return false;
      if (dateFilter === 'yesterday' && (sale.timestamp < yesterdayStart || sale.timestamp >= todayStart)) return false;
      if (dateFilter === 'week' && sale.timestamp < weekStart) return false;
      if (dateFilter === 'month' && sale.timestamp < monthStart) return false;

      // Status filter
      if (statusFilter !== 'all' && sale.status !== statusFilter) return false;

      // Method filter
      if (methodFilter !== 'all' && sale.paymentMethod !== methodFilter) return false;

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const matchesReceipt = sale.receiptNumber.toLowerCase().includes(q);
      const matchesCustomer = sale.customerName.toLowerCase().includes(q);
      const matchesCashier = sale.cashier.toLowerCase().includes(q);
      const matchesItems = sale.items.some(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));

      return matchesReceipt || matchesCustomer || matchesCashier || matchesItems;
    });
  }, [sales, dateFilter, statusFilter, methodFilter, searchQuery, todayStart, yesterdayStart, weekStart, monthStart]);

  // Aggregate stats
  const totalVolume = filteredSales.reduce((sum, s) => s.status === 'completed' ? sum + s.total : sum, 0);
  const completedCount = filteredSales.filter(s => s.status === 'completed').length;
  const refundedCount = filteredSales.filter(s => s.status === 'refunded').length;

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundingSaleId || !refundReason.trim()) return;

    refundSale(refundingSaleId, refundReason.trim());
    setRefundingSaleId(null);
    setRefundReason('');
  };

  const handleExportCsv = () => {
    if (filteredSales.length === 0) return;

    const headers = ['Receipt Number', 'Date', 'Cashier', 'Customer', 'Items Count', 'Subtotal', 'Discount', 'Tax', 'Total', 'Payment Method', 'Reference', 'Status', 'Notes'];
    const rows = filteredSales.map(s => [
      `"${s.receiptNumber}"`,
      `"${s.dateFormatted}"`,
      `"${s.cashier}"`,
      `"${s.customerName}"`,
      s.items.reduce((sum, i) => sum + i.quantity, 0),
      s.subtotal,
      s.discount,
      s.taxAmount,
      s.total,
      `"${s.paymentMethod}"`,
      `"${s.paymentReference || ''}"`,
      `"${s.status}"`,
      `"${s.notes || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ss-stationery-sales-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Sales Register Ledger</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Historical sales register, receipt reprints, refunds, and accounting audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={filteredSales.length === 0}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Total Net Revenue (Filtered)</span>
          <span className="text-xl font-mono font-extrabold text-stone-950 mt-1 block">
            {formatMoney(totalVolume)}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {completedCount} completed transactions
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Average Transaction Size</span>
          <span className="text-xl font-mono font-bold text-stone-900 mt-1 block">
            {formatMoney(completedCount > 0 ? totalVolume / completedCount : 0)}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Per paying customer
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Refunds / Voided</span>
          <span className={`text-xl font-mono font-bold mt-1 block ${refundedCount > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
            {refundedCount} transactions
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Inventory returned to stock
          </span>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt #, customer name, cashier, or product..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
            />
          </div>

          {/* Date range filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800"
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Past 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Payment Method filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile Money (M-Pesa)</option>
              <option value="card">Bank Card</option>
              <option value="credit">Store Credit</option>
            </select>
          </div>
        </div>

        {/* Quick status tabs */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100">
          <span className="text-[11px] font-semibold text-stone-400 mr-1">Status:</span>
          {['all', 'completed', 'refunded'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              {status}
            </button>
          ))}
          <span className="text-xs text-stone-400 ml-auto font-mono">
            {filteredSales.length} records found
          </span>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Receipt #</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items Sold</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-stone-400">
                    <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs font-medium text-stone-600">No sales transactions matched your criteria</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Try clearing your filters or record a new sale in the POS</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const totalItemsCount = sale.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr key={sale.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Receipt number */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-stone-900 block">
                          {sale.receiptNumber}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Clerk: {sale.cashier}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3.5 text-stone-600">
                        <span className="block font-mono">{sale.dateFormatted}</span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-stone-900 block">{sale.customerName}</span>
                        {sale.customerPhone && (
                          <span className="text-[10px] text-stone-400 font-mono">{sale.customerPhone}</span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-stone-800">
                          {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                        </span>
                        <p className="text-[11px] text-stone-500 line-clamp-1 max-w-[220px]">
                          {sale.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </td>

                      {/* Payment Method */}
                      <td className="px-4 py-3.5">
                        <span className="capitalize font-medium text-stone-800 block">
                          {sale.paymentMethod.replace('_', ' ')}
                        </span>
                        {sale.paymentReference && (
                          <span className="text-[10px] text-stone-400 font-mono">
                            Ref: {sale.paymentReference}
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                        {formatMoney(sale.total)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        {sale.status === 'completed' ? (
                          <span className="text-[11px] text-emerald-800 font-medium">
                            Completed
                          </span>
                        ) : (
                          <div>
                            <span className="text-[11px] text-red-700 font-medium block">
                              Refunded
                            </span>
                            {sale.refundReason && (
                              <span className="text-[9px] text-stone-400 italic block">
                                {sale.refundReason}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewReceipt(sale)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                            title="Reprint or View Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {sale.status === 'completed' && (
                            <button
                              onClick={() => {
                                setRefundingSaleId(sale.id);
                                setRefundReason('');
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Refund / Void Sale"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Refund Confirmation Modal */}
      {refundingSaleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-200 bg-red-50/50">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold">Void / Refund Sale</h3>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Refunding this transaction will automatically restore the sold items to inventory and deduct the revenue from daily totals.
              </p>
            </div>

            <form onSubmit={handleConfirmRefund} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reason for Refund / Return *
                </label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Defective pen, Customer bought wrong book size, Cashier error"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setRefundingSaleId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Confirm Refund & Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
