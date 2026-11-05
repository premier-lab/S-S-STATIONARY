import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Printer, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  BookOpen, 
  PieChart, 
  Calendar 
} from 'lucide-react';

export const DailyZReport: React.FC = () => {
  const { sales, formatMoney, settings } = useShop();

  const [timeframe, setTimeframe] = useState<'today' | 'yesterday' | 'week'>('today');

  // Boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400 * 1000;
  const weekStart = todayStart - 7 * 86400 * 1000;

  // Filter sales
  const relevantSales = useMemo(() => {
    return sales.filter(s => {
      if (s.status !== 'completed') return false;
      if (timeframe === 'today') return s.timestamp >= todayStart;
      if (timeframe === 'yesterday') return s.timestamp >= yesterdayStart && s.timestamp < todayStart;
      return s.timestamp >= weekStart;
    });
  }, [sales, timeframe, todayStart, yesterdayStart, weekStart]);

  // Aggregate Metrics
  const grossSales = relevantSales.reduce((sum, s) => sum + s.subtotal, 0);
  const totalDiscounts = relevantSales.reduce((sum, s) => sum + s.discount, 0);
  const totalTax = relevantSales.reduce((sum, s) => sum + s.taxAmount, 0);
  const netRevenue = relevantSales.reduce((sum, s) => sum + s.total, 0);

  // COGS and Gross Margin
  const totalCost = relevantSales.reduce((sum, s) => {
    const saleCost = s.items.reduce((iSum, item) => iSum + (item.costPrice * item.quantity), 0);
    return sum + saleCost;
  }, 0);
  const estimatedProfit = Math.max(0, netRevenue - totalCost);
  const profitMarginPercent = netRevenue > 0 ? ((estimatedProfit / netRevenue) * 100).toFixed(1) : '0';

  // Payment Breakdown
  const cashTotal = relevantSales
    .filter(s => s.paymentMethod === 'cash')
    .reduce((sum, s) => sum + s.total, 0);

  const mobileTotal = relevantSales
    .filter(s => s.paymentMethod === 'mobile_money')
    .reduce((sum, s) => sum + s.total, 0);

  const cardTotal = relevantSales
    .filter(s => s.paymentMethod === 'card')
    .reduce((sum, s) => sum + s.total, 0);

  const creditTotal = relevantSales
    .filter(s => s.paymentMethod === 'credit')
    .reduce((sum, s) => sum + s.total, 0);

  // Total items sold
  const totalUnitsSold = relevantSales.reduce((sum, s) => {
    return sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0);
  }, 0);

  // Top Selling Items
  const productPerformance = useMemo(() => {
    const map: { [name: string]: { name: string; quantity: number; revenue: number; category: string } } = {};
    relevantSales.forEach(s => {
      s.items.forEach(item => {
        if (!map[item.name]) {
          map[item.name] = { name: item.name, quantity: 0, revenue: 0, category: item.category };
        }
        map[item.name].quantity += item.quantity;
        map[item.name].revenue += item.subtotal;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [relevantSales]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map: { [cat: string]: number } = {};
    relevantSales.forEach(s => {
      s.items.forEach(item => {
        map[item.category] = (map[item.category] || 0) + item.subtotal;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [relevantSales]);

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header and timeframe toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Daily Closing & Sales Reports</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Z-Report cash register balance, revenue breakdown, and inventory profit metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe pill tabs */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-lg text-xs font-semibold">
            {(['today', 'yesterday', 'week'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md transition-colors capitalize ${
                  timeframe === tf
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tf === 'week' ? 'Past 7 Days' : tf}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintZReport}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Z-Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Total Net Revenue</span>
          <span className="text-xl font-mono font-extrabold text-stone-950 mt-1 block">
            {formatMoney(netRevenue)}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            From {relevantSales.length} transactions
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Estimated Gross Profit</span>
          <span className="text-xl font-mono font-extrabold text-emerald-700 mt-1 block">
            {formatMoney(estimatedProfit)}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Margin: ~{profitMarginPercent}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Physical Cash in Till</span>
          <span className="text-xl font-mono font-bold text-stone-900 mt-1 block">
            {formatMoney(cashTotal)}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Drawer cash balance
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">Stationery Units Sold</span>
          <span className="text-xl font-mono font-bold text-stone-900 mt-1 block">
            {totalUnitsSold} items
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Across all categories
          </span>
        </div>
      </div>

      {/* Two Column Layout: Daily Cash Register Tape (Z-Report) + Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: The Formal Z-Report Printable Slip (5 cols) */}
        <div className="lg:col-span-5">
          <div 
            id="printable-receipt"
            className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 font-mono text-xs text-stone-900 leading-relaxed"
          >
            {/* Report Header */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <span className="text-[10px] tracking-widest uppercase font-bold text-stone-500 block">
                Official Register Closing
              </span>
              <h2 className="text-base font-extrabold text-stone-950 uppercase font-sans mt-0.5">
                {settings.shopName}
              </h2>
              <p className="text-[11px] text-stone-600 font-sans">{settings.shopSubtitle}</p>
              <div className="pt-2 text-[10px] text-stone-500 space-y-0.5">
                <p>REPORT: DAILY Z-REPORT (SHIFT CLOSE)</p>
                <p>Generated: {new Date().toLocaleString()}</p>
                <p>Register Cashier: {settings.activeCashier}</p>
                <p>Period: {timeframe.toUpperCase()}</p>
              </div>
            </div>

            {/* Sales Volume Summary */}
            <div className="py-3 border-b border-dashed border-stone-300 space-y-1.5">
              <div className="flex justify-between font-bold text-stone-950 text-xs">
                <span>GROSS SALES:</span>
                <span className="tabular-nums">{formatMoney(grossSales)}</span>
              </div>
              {totalDiscounts > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>DISCOUNTS GIVEN:</span>
                  <span className="tabular-nums">-{formatMoney(totalDiscounts)}</span>
                </div>
              )}
              {totalTax > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>TAX / VAT ({settings.taxRate}%):</span>
                  <span className="tabular-nums">+{formatMoney(totalTax)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-stone-950 text-sm pt-1 border-t border-stone-200">
                <span>NET REVENUE:</span>
                <span className="tabular-nums">{formatMoney(netRevenue)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Cost of Goods (COGS):</span>
                <span className="tabular-nums">{formatMoney(totalCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-800 text-[11px]">
                <span>ESTIMATED GROSS PROFIT:</span>
                <span className="tabular-nums">{formatMoney(estimatedProfit)} ({profitMarginPercent}%)</span>
              </div>
            </div>

            {/* Cash Drawer / Tender Reconciliation */}
            <div className="py-3 border-b border-dashed border-stone-300 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                Tender Reconciliation (Drawer Count)
              </span>

              <div className="flex justify-between text-stone-900 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-stone-500" />
                  <span>CASH IN TILL:</span>
                </span>
                <span className="tabular-nums font-bold">{formatMoney(cashTotal)}</span>
              </div>

              <div className="flex justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-stone-500" />
                  <span>MOBILE MONEY:</span>
                </span>
                <span className="tabular-nums">{formatMoney(mobileTotal)}</span>
              </div>

              <div className="flex justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                  <span>BANK CARD / POS:</span>
                </span>
                <span className="tabular-nums">{formatMoney(cardTotal)}</span>
              </div>

              <div className="flex justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                  <span>ON ACCOUNT (CREDIT):</span>
                </span>
                <span className="tabular-nums">{formatMoney(creditTotal)}</span>
              </div>
            </div>

            {/* Counts */}
            <div className="py-3 border-b border-dashed border-stone-300 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Completed Sales:</span>
                <span>{relevantSales.length} txns</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items Sold:</span>
                <span>{totalUnitsSold} units</span>
              </div>
              <div className="flex justify-between">
                <span>Average Sale Value:</span>
                <span>{formatMoney(relevantSales.length > 0 ? netRevenue / relevantSales.length : 0)}</span>
              </div>
            </div>

            {/* Sign off */}
            <div className="pt-4 text-[10px] text-stone-500 space-y-3">
              <div className="flex justify-between pt-4 border-t border-stone-300">
                <span>Cashier Signature: __________________</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Manager Verification: ________________</span>
              </div>
              <p className="text-center text-[9px] pt-1">
                S&S STATIONARY INTERNAL AUDIT RECORD
              </p>
            </div>
          </div>
        </div>

        {/* Right: Top Selling Stationery & Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6 no-print">
          
          {/* Top Selling Products */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-stone-900 mb-3">
              Top Selling Stationery ({timeframe === 'week' ? 'Past 7 Days' : timeframe})
            </h3>

            {productPerformance.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No sales recorded for this period</p>
            ) : (
              <div className="space-y-3">
                {productPerformance.map((prod, idx) => {
                  const maxRevenue = productPerformance[0].revenue || 1;
                  const percentWidth = Math.max(5, (prod.revenue / maxRevenue) * 100);

                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-stone-900 font-semibold truncate pr-2">
                          {idx + 1}. {prod.name}
                        </span>
                        <span className="font-mono text-stone-900 tabular-nums shrink-0 font-bold">
                          {formatMoney(prod.revenue)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-amber-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentWidth}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-stone-500 font-mono shrink-0">
                          {prod.quantity} sold
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sales by Category Breakdown */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-stone-900 mb-3">
              Sales by Stationery Category
            </h3>

            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No category data available</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {categoryBreakdown.map(([cat, amount]) => {
                  const percentOfTotal = netRevenue > 0 ? ((amount / netRevenue) * 100).toFixed(1) : '0';

                  return (
                    <div key={cat} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-medium text-stone-800 block">{cat}</span>
                        <span className="text-[11px] text-stone-400 font-mono">{percentOfTotal}% of total revenue</span>
                      </div>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        {formatMoney(amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
