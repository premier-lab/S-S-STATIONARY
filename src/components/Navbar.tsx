import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingCart, 
  Receipt, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  AlertCircle,
  Pause
} from 'lucide-react';

export type ActiveTab = 'pos' | 'ledger' | 'inventory' | 'customers' | 'analytics' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenHeldModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenHeldModal
}) => {
  const { settings, lowStockProducts, heldSales, cart } = useShop();

  const navItems = [
    { id: 'pos' as ActiveTab, label: 'Register (POS)', icon: ShoppingCart },
    { id: 'ledger' as ActiveTab, label: 'Sales Ledger', icon: Receipt },
    { id: 'inventory' as ActiveTab, label: 'Inventory', icon: Package, badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined },
    { id: 'customers' as ActiveTab, label: 'Customers & Credit', icon: Users },
    { id: 'analytics' as ActiveTab, label: 'Daily Reports', icon: BarChart3 },
    { id: 'settings' as ActiveTab, label: 'Shop Settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand Wordmark (Single text element as per Top Bar contract) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              S&S
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold tracking-tight text-stone-900 whitespace-nowrap block">
                {settings.shopName}
              </span>
              <span className="text-xs text-stone-600 block">
                {settings.shopSubtitle}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean hover states) */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action & Cashier context */}
          <div className="flex items-center gap-3 shrink-0">
            {heldSales.length > 0 && (
              <button
                onClick={onOpenHeldModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap"
                title="View Parked Sales"
              >
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Parked ({heldSales.length})</span>
              </button>
            )}

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-stone-900 whitespace-nowrap">
                {settings.activeCashier}
              </span>
              <span className="text-[11px] text-stone-600 whitespace-nowrap font-mono">
                Cashier on Duty
              </span>
            </div>

            <button
              onClick={() => setActiveTab('pos')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'pos' && cart.length > 0
                  ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                  : 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Register Sale {cart.length > 0 ? `(${cart.length})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-stone-900 text-white' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
