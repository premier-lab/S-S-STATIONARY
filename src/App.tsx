/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { PosRegister } from './components/pos/PosRegister';
import { SalesLedger } from './components/sales/SalesLedger';
import { InventoryManager } from './components/inventory/InventoryManager';
import { CustomersManager } from './components/customers/CustomersManager';
import { DailyZReport } from './components/analytics/DailyZReport';
import { SettingsManager } from './components/settings/SettingsManager';
import { ReceiptModal } from './components/receipt/ReceiptModal';
import { HeldSalesModal } from './components/pos/HeldSalesModal';
import { Sale, Customer } from './types';
import { X, UserPlus, Phone, MapPin } from 'lucide-react';

function ShopAppContent() {
  const { currentReceipt, setCurrentReceipt, addCustomer, settings } = useShop();
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  // Quick customer create from POS
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custType, setCustType] = useState<Customer['type']>('Individual');

  const handleQuickAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    addCustomer({
      name: custName.trim(),
      phone: custPhone.trim(),
      type: custType,
      creditBalance: 0
    });

    setCustName('');
    setCustPhone('');
    setIsNewCustomerModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHeldModal={() => setIsHeldModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'pos' && (
          <PosRegister
            onOpenCustomerModal={() => setIsNewCustomerModalOpen(true)}
            onOpenHeldModal={() => setIsHeldModalOpen(true)}
          />
        )}

        {activeTab === 'ledger' && (
          <SalesLedger
            onViewReceipt={(sale) => setCurrentReceipt(sale)}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager />
        )}

        {activeTab === 'customers' && (
          <CustomersManager />
        )}

        {activeTab === 'analytics' && (
          <DailyZReport />
        )}

        {activeTab === 'settings' && (
          <SettingsManager />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">{settings.shopName}</span>
            <span aria-hidden="true">·</span>
            <span>Sales Register & POS</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{settings.address}</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400 text-[11px] font-mono">
            <span>Tel: {settings.phone}</span>
            <span aria-hidden="true">·</span>
            <span>Cashier: {settings.activeCashier}</span>
          </div>
        </div>
      </footer>

      {/* Printable Thermal Receipt Modal */}
      <ReceiptModal
        sale={currentReceipt}
        onClose={() => setCurrentReceipt(null)}
      />

      {/* Parked / Held Sales Modal */}
      <HeldSalesModal
        isOpen={isHeldModalOpen}
        onClose={() => setIsHeldModalOpen(false)}
      />

      {/* Quick Add Customer Modal */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900">Add Customer Account</h3>
              <button onClick={() => setIsNewCustomerModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAddCustomer} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Customer / School Name *
                </label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Joy Valley Academy or John M."
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Customer Type
                </label>
                <select
                  value={custType}
                  onChange={(e) => setCustType(e.target.value as any)}
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
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <ShopAppContent />
    </ShopProvider>
  );
}
