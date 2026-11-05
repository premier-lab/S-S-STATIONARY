export type Category = 
  | 'All'
  | 'Notebooks & Paper'
  | 'Writing & Correction'
  | 'School & Math Sets'
  | 'Office & Filing'
  | 'Art & Craft'
  | 'Printing & Services';

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  stock: number;
  unit: string; // 'pc', 'pack', 'ream', 'box', 'set', 'page'
  minStockAlert: number;
  description?: string;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number; // discount per item or line
}

export type PaymentMethod = 'cash' | 'mobile_money' | 'card' | 'credit';

export type SaleStatus = 'completed' | 'refunded' | 'voided';

export interface SaleLineItem {
  productId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  subtotal: number;
  unit: string;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  timestamp: number;
  dateFormatted: string;
  cashier: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: SaleLineItem[];
  subtotal: number;
  discount: number;
  discountType: 'fixed' | 'percent';
  taxRate: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeGiven: number;
  paymentReference?: string;
  status: SaleStatus;
  notes?: string;
  refundReason?: string;
  refundedAt?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'Individual' | 'School / Teacher' | 'Office / Corporate' | 'Student';
  creditBalance: number; // outstanding amount owed to shop
  totalSpent: number;
  salesCount: number;
  notes?: string;
  createdAt: string;
}

export interface CreditPaymentRecord {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  timestamp: number;
  cashier: string;
  paymentMethod: 'cash' | 'mobile_money' | 'card';
  reference?: string;
  notes?: string;
}

export interface ShopSettings {
  shopName: string;
  shopSubtitle: string;
  phone: string;
  address: string;
  email: string;
  currency: string;
  taxName: string;
  taxRate: number;
  taxEnabled: boolean;
  receiptFooter: string;
  activeCashier: string;
}

export interface HeldSale {
  id: string;
  timestamp: number;
  customerName: string;
  items: CartItem[];
  notes?: string;
}
