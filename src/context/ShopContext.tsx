import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Product, 
  Sale, 
  Customer, 
  ShopSettings, 
  CartItem, 
  HeldSale, 
  CreditPaymentRecord,
  PaymentMethod 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SALES, 
  INITIAL_CUSTOMERS, 
  INITIAL_SETTINGS 
} from '../data/initialData';

interface ShopContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, addedStock: number) => void;
  lowStockProducts: Product[];

  // Cart / POS
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQty: (productId: string, quantity: number) => void;
  updateCartItemPrice: (productId: string, unitPrice: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  cartDiscount: number;
  setCartDiscount: (val: number) => void;
  cartDiscountType: 'fixed' | 'percent';
  setCartDiscountType: (type: 'fixed' | 'percent') => void;
  cartTotal: number;
  cartTaxAmount: number;

  // Held / Parked Sales
  heldSales: HeldSale[];
  holdCurrentSale: (note?: string) => void;
  restoreHeldSale: (id: string) => void;
  deleteHeldSale: (id: string) => void;

  // Sales Registration
  sales: Sale[];
  registerSale: (paymentData: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    paymentReference?: string;
    notes?: string;
    overrideCustomerId?: string;
    overrideCustomerName?: string;
  }) => Sale;
  refundSale: (saleId: string, reason: string) => void;

  // Receipt Modal
  currentReceipt: Sale | null;
  setCurrentReceipt: (sale: Sale | null) => void;
  printReceipt: (sale: Sale) => void;

  // Customers & Credit
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalSpent' | 'salesCount'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  recordCreditPayment: (data: {
    customerId: string;
    amount: number;
    paymentMethod: 'cash' | 'mobile_money' | 'card';
    reference?: string;
    notes?: string;
  }) => void;
  creditPayments: CreditPaymentRecord[];

  // Settings
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  resetToDefaults: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonString: string) => boolean;

  // Currency Formatter
  formatMoney: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'ss_stationery_products_v1',
  SALES: 'ss_stationery_sales_v1',
  CUSTOMERS: 'ss_stationery_customers_v1',
  SETTINGS: 'ss_stationery_settings_v1',
  HELD_SALES: 'ss_stationery_held_v1',
  CREDIT_PAYMENTS: 'ss_stationery_credit_payments_v1'
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState<ShopSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Sales
  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Held Sales
  const [heldSales, setHeldSales] = useState<HeldSale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HELD_SALES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Credit Payments
  const [creditPayments, setCreditPayments] = useState<CreditPaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CREDIT_PAYMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart State (session based)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-001');
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [cartDiscountType, setCartDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [currentReceipt, setCurrentReceipt] = useState<Sale | null>(null);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HELD_SALES, JSON.stringify(heldSales));
  }, [heldSales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDIT_PAYMENTS, JSON.stringify(creditPayments));
  }, [creditPayments]);

  // Format money helper
  const formatMoney = (amount: number): string => {
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
    return `${settings.currency} ${formattedNum}`;
  };

  // Low stock list
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.minStockAlert > 0 && p.stock <= p.minStockAlert);
  }, [products]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (cartDiscount <= 0) return 0;
    if (cartDiscountType === 'percent') {
      return (cartSubtotal * Math.min(100, cartDiscount)) / 100;
    }
    return Math.min(cartSubtotal, cartDiscount);
  }, [cartSubtotal, cartDiscount, cartDiscountType]);

  const cartTaxAmount = useMemo(() => {
    if (!settings.taxEnabled || settings.taxRate <= 0) return 0;
    const taxableBase = Math.max(0, cartSubtotal - discountAmount);
    return (taxableBase * settings.taxRate) / 100;
  }, [cartSubtotal, discountAmount, settings.taxEnabled, settings.taxRate]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + cartTaxAmount);
  }, [cartSubtotal, discountAmount, cartTaxAmount]);

  // Cart Actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, unitPrice: product.price, discount: 0 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartItemQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateCartItemPrice = (productId: string, unitPrice: number) => {
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, unitPrice: Math.max(0, unitPrice) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setCartDiscountType('fixed');
  };

  // Hold Sale
  const holdCurrentSale = (note?: string) => {
    if (cart.length === 0) return;
    const currentCustomer = customers.find(c => c.id === selectedCustomerId);
    const newHeld: HeldSale = {
      id: `held-${Date.now()}`,
      timestamp: Date.now(),
      customerName: currentCustomer ? currentCustomer.name : 'Walk-in Customer',
      items: [...cart],
      notes: note
    };
    setHeldSales(prev => [newHeld, ...prev]);
    clearCart();
  };

  const restoreHeldSale = (id: string) => {
    const saleToRestore = heldSales.find(h => h.id === id);
    if (!saleToRestore) return;
    setCart(saleToRestore.items);
    setHeldSales(prev => prev.filter(h => h.id !== id));
  };

  const deleteHeldSale = (id: string) => {
    setHeldSales(prev => prev.filter(h => h.id !== id));
  };

  // Register Sale
  const registerSale = ({
    paymentMethod,
    amountPaid,
    paymentReference,
    notes,
    overrideCustomerId,
    overrideCustomerName
  }: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    paymentReference?: string;
    notes?: string;
    overrideCustomerId?: string;
    overrideCustomerName?: string;
  }): Sale => {
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    const effectiveCustomerId = overrideCustomerId || selectedCustomerId;
    const customerObj = customers.find(c => c.id === effectiveCustomerId);
    const effectiveCustomerName = overrideCustomerName || (customerObj ? customerObj.name : 'Walk-in Customer');

    const timestamp = Date.now();
    const date = new Date(timestamp);
    const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, '');
    const dailyCount = sales.filter(s => {
      const sDate = new Date(s.timestamp);
      return sDate.toDateString() === date.toDateString();
    }).length + 1;
    const receiptNumber = `REC-${yymmdd}-${String(dailyCount).padStart(3, '0')}`;

    // Line items
    const lineItems = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      sku: item.product.sku,
      category: item.product.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      costPrice: item.product.cost,
      subtotal: item.unitPrice * item.quantity,
      unit: item.product.unit
    }));

    // Deduct stock for non-service items (services have sku starting with SRV- or stock 9999)
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const soldItem = cart.find(ci => ci.product.id === p.id);
        if (soldItem && p.stock < 9000) {
          return {
            ...p,
            stock: Math.max(0, p.stock - soldItem.quantity)
          };
        }
        return p;
      });
    });

    const changeGiven = paymentMethod === 'cash' ? Math.max(0, amountPaid - cartTotal) : 0;
    const effectiveAmountPaid = paymentMethod === 'credit' ? 0 : (paymentMethod === 'cash' ? Math.min(amountPaid, cartTotal) : cartTotal);

    const newSale: Sale = {
      id: `sale-${timestamp}`,
      receiptNumber,
      timestamp,
      dateFormatted: date.toLocaleString(),
      cashier: settings.activeCashier,
      customerId: customerObj?.id,
      customerName: effectiveCustomerName,
      customerPhone: customerObj?.phone,
      items: lineItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      discountType: cartDiscountType,
      taxRate: settings.taxEnabled ? settings.taxRate : 0,
      taxAmount: cartTaxAmount,
      total: cartTotal,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? amountPaid : cartTotal,
      changeGiven,
      paymentReference,
      status: 'completed',
      notes
    };

    // Update customer stats
    if (customerObj) {
      setCustomers(prev => prev.map(c => {
        if (c.id === customerObj.id) {
          const addedCredit = paymentMethod === 'credit' ? cartTotal : 0;
          return {
            ...c,
            totalSpent: c.totalSpent + cartTotal,
            salesCount: c.salesCount + 1,
            creditBalance: c.creditBalance + addedCredit
          };
        }
        return c;
      }));
    }

    setSales(prev => [newSale, ...prev]);
    clearCart();
    setCurrentReceipt(newSale);
    return newSale;
  };

  // Refund / Void Sale
  const refundSale = (saleId: string, reason: string) => {
    const targetSale = sales.find(s => s.id === saleId);
    if (!targetSale || targetSale.status === 'refunded') return;

    // Restore stock
    setProducts(prev => {
      return prev.map(p => {
        const soldItem = targetSale.items.find(item => item.productId === p.id);
        if (soldItem && p.stock < 9000) {
          return { ...p, stock: p.stock + soldItem.quantity };
        }
        return p;
      });
    });

    // If it was bought on credit, reduce customer credit balance
    if (targetSale.paymentMethod === 'credit' && targetSale.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === targetSale.customerId) {
          return {
            ...c,
            creditBalance: Math.max(0, c.creditBalance - targetSale.total)
          };
        }
        return c;
      }));
    }

    setSales(prev => prev.map(s => {
      if (s.id === saleId) {
        return {
          ...s,
          status: 'refunded',
          refundReason: reason,
          refundedAt: Date.now()
        };
      }
      return s;
    }));
  };

  // Print Receipt
  const printReceipt = (sale: Sale) => {
    setCurrentReceipt(sale);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const restockProduct = (id: string, addedStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, p.stock + addedStock) };
      }
      return p;
    }));
  };

  // Customer CRUD & Credit payments
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalSpent' | 'salesCount'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      totalSpent: 0,
      salesCount: 0
    };
    setCustomers(prev => [...prev, newCust]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const recordCreditPayment = ({
    customerId,
    amount,
    paymentMethod,
    reference,
    notes
  }: {
    customerId: string;
    amount: number;
    paymentMethod: 'cash' | 'mobile_money' | 'card';
    reference?: string;
    notes?: string;
  }) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const newPayment: CreditPaymentRecord = {
      id: `cpay-${Date.now()}`,
      customerId,
      customerName: customer.name,
      amount,
      timestamp: Date.now(),
      cashier: settings.activeCashier,
      paymentMethod,
      reference,
      notes
    };

    setCreditPayments(prev => [newPayment, ...prev]);

    // Reduce customer credit balance
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          creditBalance: Math.max(0, c.creditBalance - amount)
        };
      }
      return c;
    }));
  };

  // Settings
  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.HELD_SALES);
    localStorage.removeItem(STORAGE_KEYS.CREDIT_PAYMENTS);

    setProducts(INITIAL_PRODUCTS);
    setSales(INITIAL_SALES);
    setCustomers(INITIAL_CUSTOMERS);
    setSettings(INITIAL_SETTINGS);
    setHeldSales([]);
    setCreditPayments([]);
    clearCart();
  };

  const exportDatabaseJson = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      products,
      sales,
      customers,
      creditPayments
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ss-stationery-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.sales && Array.isArray(data.sales)) setSales(data.sales);
      if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
      if (data.settings) setSettings(data.settings);
      if (data.creditPayments && Array.isArray(data.creditPayments)) setCreditPayments(data.creditPayments);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        lowStockProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        updateCartItemPrice,
        clearCart,
        cartSubtotal,
        selectedCustomerId,
        setSelectedCustomerId,
        cartDiscount,
        setCartDiscount,
        cartDiscountType,
        setCartDiscountType,
        cartTotal,
        cartTaxAmount,
        heldSales,
        holdCurrentSale,
        restoreHeldSale,
        deleteHeldSale,
        sales,
        registerSale,
        refundSale,
        currentReceipt,
        setCurrentReceipt,
        printReceipt,
        customers,
        addCustomer,
        updateCustomer,
        recordCreditPayment,
        creditPayments,
        settings,
        updateSettings,
        resetToDefaults,
        exportDatabaseJson,
        importDatabaseJson,
        formatMoney
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
