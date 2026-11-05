import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Store, 
  UserCheck, 
  DollarSign, 
  Percent, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetToDefaults, 
    exportDatabaseJson, 
    importDatabaseJson 
  } = useShop();

  const [form, setForm] = useState({ ...settings });
  const [saveNotice, setSaveNotice] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...form,
      taxRate: Number(form.taxRate) || 0
    });
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJson(content);
      if (success) {
        setImportStatus('Database successfully restored!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Error: Invalid backup file format.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-stone-900 tracking-tight">Shop & Register Settings</h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure shop name, currency, cashier profile, receipt layout, and backups
        </p>
      </div>

      {saveNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Shop settings updated successfully!</span>
        </div>
      )}

      {importStatus && (
        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
          importStatus.startsWith('Error') 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          <span>{importStatus}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Shop Identity */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Store className="w-4 h-4 text-stone-600" />
            <h2 className="text-sm font-bold text-stone-900">Shop Identity & Receipt Header</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Shop Business Name *
              </label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={form.shopSubtitle}
                onChange={(e) => setForm({ ...form, shopSubtitle: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Shop Phone / M-Pesa Contact
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Shop Physical Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
        </div>

        {/* Cashier & Currency */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <UserCheck className="w-4 h-4 text-stone-600" />
            <h2 className="text-sm font-bold text-stone-900">Cashier & Currency Settings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Active Cashier Name *
              </label>
              <input
                type="text"
                required
                value={form.activeCashier}
                onChange={(e) => setForm({ ...form, activeCashier: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Printed on receipts and assigned to sales audits
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Currency Symbol / Code *
              </label>
              <input
                type="text"
                required
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                placeholder="KSh, $, UGX, TZS, GBP, EUR"
                className="w-full text-xs font-mono font-bold px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                e.g. KSh, UGX, $, £, €, R, TZS
              </p>
            </div>
          </div>
        </div>

        {/* Tax / VAT Settings */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-stone-600" />
              <h2 className="text-sm font-bold text-stone-900">Tax / VAT Billing</h2>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.taxEnabled}
                onChange={(e) => setForm({ ...form, taxEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900"></div>
              <span className="ml-2 text-xs font-medium text-stone-700">
                {form.taxEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {form.taxEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tax Label Name
                </label>
                <input
                  type="text"
                  value={form.taxName}
                  onChange={(e) => setForm({ ...form, taxName: e.target.value })}
                  placeholder="VAT or Sales Tax"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  value={form.taxRate}
                  onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Receipt Footer Note */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <FileCheck className="w-4 h-4 text-stone-600" />
            <h2 className="text-sm font-bold text-stone-900">Receipt Footer Disclaimer / Policy</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Custom Receipt Note (Printed at bottom of thermal slips)
            </label>
            <textarea
              rows={2}
              value={form.receiptFooter}
              onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

      {/* Database Backup & Restore section */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-stone-900">Data Management & Backup</h2>
        <p className="text-xs text-stone-500">
          Export your complete shop sales, inventory, and customer databases to a secure JSON file, or restore a previous backup.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={exportDatabaseJson}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <label className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore From Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all sales and inventory to standard stationery sample data? (Your existing custom entries will be refreshed)")) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-600" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
