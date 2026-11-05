import { Product, Customer, Sale, ShopSettings } from '../types';

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: "S&S STATIONARY",
  shopSubtitle: "Books, Office Equipment & Printing Services",
  phone: "+254 700 123 456",
  address: "Plot 14, Commercial Center, Shop #2",
  email: "contact@ss-stationary.com",
  currency: "KSh",
  taxName: "VAT",
  taxRate: 16,
  taxEnabled: false, // Default off for small stationery shops, can be enabled with 1 click
  receiptFooter: "Thank you for shopping at S&S STATIONARY! School & Office supplies available in wholesale & retail.",
  activeCashier: "Sylvia N."
};

export const INITIAL_PRODUCTS: Product[] = [
  // Notebooks & Paper
  {
    id: "prod-001",
    name: "A4 Ruled Exercise Book 200 Pages",
    category: "Notebooks & Paper",
    sku: "NB-A4-200",
    barcode: "6001001001",
    price: 180,
    cost: 120,
    stock: 85,
    unit: "pc",
    minStockAlert: 20,
    isPopular: true,
    description: "Standard hard cover 200 pages ruled exercise book"
  },
  {
    id: "prod-002",
    name: "A4 Spiral Bound Project Notebook",
    category: "Notebooks & Paper",
    sku: "NB-SPR-A4",
    barcode: "6001001002",
    price: 350,
    cost: 230,
    stock: 42,
    unit: "pc",
    minStockAlert: 10,
    isPopular: true,
    description: "Durable PP cover with wire-o spiral binding"
  },
  {
    id: "prod-003",
    name: "A4 Photocopy Paper 80gsm (Full Ream 500 Sheets)",
    category: "Notebooks & Paper",
    sku: "PP-REAM-80",
    barcode: "6001001003",
    price: 850,
    cost: 650,
    stock: 14,
    unit: "ream",
    minStockAlert: 15, // Currently low stock
    isPopular: true,
    description: "Multipurpose bright white 80gsm copy paper"
  },
  {
    id: "prod-004",
    name: "Pastel Sticky Notes 3x3 (100 Sheets)",
    category: "Notebooks & Paper",
    sku: "SN-PST-33",
    barcode: "6001001004",
    price: 120,
    cost: 70,
    stock: 60,
    unit: "pad",
    minStockAlert: 15,
    isPopular: false,
    description: "Self-adhesive repositionable memo notes"
  },
  {
    id: "prod-005",
    name: "Graph / Science Lab Book A4",
    category: "Notebooks & Paper",
    sku: "NB-SCI-A4",
    barcode: "6001001005",
    price: 250,
    cost: 160,
    stock: 35,
    unit: "pc",
    minStockAlert: 10,
    isPopular: false,
    description: "Alternate grid and ruled pages for laboratory records"
  },

  // Writing & Correction
  {
    id: "prod-006",
    name: "Bic Ballpoint Pen Blue 1.0mm",
    category: "Writing & Correction",
    sku: "PEN-BIC-BL",
    barcode: "6001002001",
    price: 30,
    cost: 18,
    stock: 240,
    unit: "pc",
    minStockAlert: 50,
    isPopular: true,
    description: "Smooth flowing medium point everyday writing pen"
  },
  {
    id: "prod-007",
    name: "Pilot G-2 Gel Ink Roller Pen Black 0.7mm",
    category: "Writing & Correction",
    sku: "PEN-PLT-G2",
    barcode: "6001002002",
    price: 180,
    cost: 110,
    stock: 48,
    unit: "pc",
    minStockAlert: 15,
    isPopular: true,
    description: "Refillable dynamic gel ink pen with rubber grip"
  },
  {
    id: "prod-008",
    name: "Permanent Marker Bullet Tip (Black)",
    category: "Writing & Correction",
    sku: "MK-PERM-BK",
    barcode: "6001002003",
    price: 100,
    cost: 60,
    stock: 55,
    unit: "pc",
    minStockAlert: 15,
    isPopular: false,
    description: "Quick-drying waterproof ink on almost any surface"
  },
  {
    id: "prod-009",
    name: "Fluorescent Highlighters (Pack of 4 Assorted)",
    category: "Writing & Correction",
    sku: "MK-HLT-4PK",
    barcode: "6001002004",
    price: 280,
    cost: 170,
    stock: 32,
    unit: "pack",
    minStockAlert: 10,
    isPopular: true,
    description: "Yellow, Green, Pink, Orange chisel tip markers"
  },
  {
    id: "prod-010",
    name: "Correction Pen / Fluid 7ml",
    category: "Writing & Correction",
    sku: "CR-PEN-07",
    barcode: "6001002005",
    price: 120,
    cost: 70,
    stock: 8, // Low stock
    unit: "pc",
    minStockAlert: 12,
    isPopular: false,
    description: "Fine metal tip for precise opaque white correction"
  },
  {
    id: "prod-011",
    name: "2B Graphite Pencils (Box of 12)",
    category: "Writing & Correction",
    sku: "PNC-2B-12",
    barcode: "6001002006",
    price: 240,
    cost: 140,
    stock: 28,
    unit: "box",
    minStockAlert: 10,
    isPopular: false,
    description: "Standard examination 2B drawing and writing pencils"
  },

  // School & Math Sets
  {
    id: "prod-012",
    name: "Oxford Mathematical Geometry Set",
    category: "School & Math Sets",
    sku: "MS-OXF-01",
    barcode: "6001003001",
    price: 450,
    cost: 310,
    stock: 22,
    unit: "tin",
    minStockAlert: 10,
    isPopular: true,
    description: "Original metal tin containing compass, divider, protractor, set squares"
  },
  {
    id: "prod-013",
    name: "Clear Acrylic 30cm Shatterproof Ruler",
    category: "School & Math Sets",
    sku: "RL-CLR-30",
    barcode: "6001003002",
    price: 50,
    cost: 25,
    stock: 110,
    unit: "pc",
    minStockAlert: 25,
    isPopular: true,
    description: "Metric and imperial scale with bevelled edge"
  },
  {
    id: "prod-014",
    name: "Scientific Calculator 240 Functions",
    category: "School & Math Sets",
    sku: "CALC-SCI-82",
    barcode: "6001003003",
    price: 1600,
    cost: 1150,
    stock: 9,
    unit: "pc",
    minStockAlert: 5,
    isPopular: true,
    description: "Two-line display scientific calculator approved for exams"
  },
  {
    id: "prod-015",
    name: "Student Safety Scissors 5-inch",
    category: "School & Math Sets",
    sku: "SC-SAF-05",
    barcode: "6001003004",
    price: 90,
    cost: 50,
    stock: 35,
    unit: "pc",
    minStockAlert: 10,
    isPopular: false,
    description: "Blunt tip stainless steel blade with ergonomic grip"
  },

  // Office & Filing
  {
    id: "prod-016",
    name: "A4 Heavy Duty Lever Arch Box File",
    category: "Office & Filing",
    sku: "FL-LVR-A4",
    barcode: "6001004001",
    price: 320,
    cost: 210,
    stock: 45,
    unit: "pc",
    minStockAlert: 15,
    isPopular: true,
    description: "Reinforced metal shoe with 75mm spine capacity"
  },
  {
    id: "prod-017",
    name: "Desktop Stapler #24/6 with 1000 Staples",
    category: "Office & Filing",
    sku: "STP-SET-24",
    barcode: "6001004002",
    price: 380,
    cost: 240,
    stock: 19,
    unit: "set",
    minStockAlert: 8,
    isPopular: false,
    description: "All-metal mechanism staples up to 25 sheets"
  },
  {
    id: "prod-018",
    name: "Clear Plastic Display Book 40 Pockets",
    category: "Office & Filing",
    sku: "FL-DSP-40",
    barcode: "6001004003",
    price: 260,
    cost: 160,
    stock: 26,
    unit: "pc",
    minStockAlert: 10,
    isPopular: false,
    description: "Presentation folder with copy-safe clear polypropylene pockets"
  },
  {
    id: "prod-019",
    name: "Heavy Duty 2-Hole Punch 30 Sheets",
    category: "Office & Filing",
    sku: "PCH-2H-30",
    barcode: "6001004004",
    price: 550,
    cost: 370,
    stock: 12,
    unit: "pc",
    minStockAlert: 5,
    isPopular: false,
    description: "Metal body with paper guide and waste confetti tray"
  },
  {
    id: "prod-020",
    name: "Packaging Tape Transparent 2-inch x 50m",
    category: "Office & Filing",
    sku: "TP-CLR-50",
    barcode: "6001004005",
    price: 150,
    cost: 90,
    stock: 38,
    unit: "roll",
    minStockAlert: 12,
    isPopular: false,
    description: "Strong acrylic adhesive box sealing tape"
  },

  // Art & Craft
  {
    id: "prod-021",
    name: "Coloured Pencils 24 Full Length Tin",
    category: "Art & Craft",
    sku: "ART-CP-24",
    barcode: "6001005001",
    price: 520,
    cost: 340,
    stock: 18,
    unit: "tin",
    minStockAlert: 8,
    isPopular: true,
    description: "Soft core blendable vibrant coloring pencils"
  },
  {
    id: "prod-022",
    name: "PVA All Purpose Liquid Glue 250ml",
    category: "Art & Craft",
    sku: "GL-PVA-250",
    barcode: "6001005002",
    price: 180,
    cost: 105,
    stock: 24,
    unit: "bottle",
    minStockAlert: 10,
    isPopular: false,
    description: "Non-toxic washable craft glue for wood, paper, cardboard"
  },
  {
    id: "prod-023",
    name: "Glue Stick 36g Non-Toxic",
    category: "Art & Craft",
    sku: "GL-STK-36",
    barcode: "6001005003",
    price: 90,
    cost: 50,
    stock: 65,
    unit: "pc",
    minStockAlert: 15,
    isPopular: true,
    description: "Smooth glide twist-up adhesive stick for classroom use"
  },

  // Printing & Services
  {
    id: "prod-024",
    name: "B&W Photocopy / Printing (A4 Per Page)",
    category: "Printing & Services",
    sku: "SRV-COPY-BW",
    barcode: "6001006001",
    price: 5,
    cost: 1.5,
    stock: 9999, // Service item
    unit: "page",
    minStockAlert: 0,
    isPopular: true,
    description: "Sharp black and white laser copy / print"
  },
  {
    id: "prod-025",
    name: "Color Printing (A4 Standard Text & Graphics)",
    category: "Printing & Services",
    sku: "SRV-PRNT-COL",
    barcode: "6001006002",
    price: 30,
    cost: 10,
    stock: 9999,
    unit: "page",
    minStockAlert: 0,
    isPopular: true,
    description: "Full color high resolution document printing"
  },
  {
    id: "prod-026",
    name: "Spiral Comb Binding (Up to 100 Pages)",
    category: "Printing & Services",
    sku: "SRV-BIND-100",
    barcode: "6001006003",
    price: 120,
    cost: 35,
    stock: 9999,
    unit: "doc",
    minStockAlert: 0,
    isPopular: true,
    description: "Plastic spine comb binding with clear acetate cover and leatherette back"
  },
  {
    id: "prod-027",
    name: "Document Lamination (A4 Waterproof)",
    category: "Printing & Services",
    sku: "SRV-LAM-A4",
    barcode: "6001006004",
    price: 80,
    cost: 25,
    stock: 9999,
    unit: "page",
    minStockAlert: 0,
    isPopular: true,
    description: "Thermal heat sealed 150 micron pouch lamination"
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "Walk-in Customer",
    phone: "",
    type: "Individual",
    creditBalance: 0,
    totalSpent: 4250,
    salesCount: 14,
    createdAt: "2026-01-10"
  },
  {
    id: "cust-002",
    name: "Sunrise Academy (Teacher Mary)",
    phone: "+254 711 223 344",
    email: "accounts@sunriseacademy.edu",
    type: "School / Teacher",
    creditBalance: 1450, // Has outstanding credit
    totalSpent: 28400,
    salesCount: 8,
    notes: "School supplier account. Pays monthly.",
    createdAt: "2026-02-15"
  },
  {
    id: "cust-003",
    name: "Apex Law Advocates",
    phone: "+254 722 556 677",
    email: "admin@apexadvocates.co",
    type: "Office / Corporate",
    creditBalance: 0,
    totalSpent: 19800,
    salesCount: 5,
    notes: "Reams of paper, lever arch files and binding services",
    createdAt: "2026-03-01"
  },
  {
    id: "cust-004",
    name: "Alex M. (High School Student)",
    phone: "+254 733 998 877",
    type: "Student",
    creditBalance: 150, // Small pending credit
    totalSpent: 3600,
    salesCount: 4,
    notes: "Science revision books & graph sheets",
    createdAt: "2026-04-12"
  }
];

// Realistic seeded sales
const now = Date.now();
const oneHour = 3600 * 1000;
const oneDay = 24 * oneHour;

export const INITIAL_SALES: Sale[] = [
  {
    id: "sale-101",
    receiptNumber: "REC-261105-001",
    timestamp: now - 35 * 60 * 1000,
    dateFormatted: new Date(now - 35 * 60 * 1000).toLocaleString(),
    cashier: "Sylvia N.",
    customerName: "Walk-in Customer",
    items: [
      {
        productId: "prod-001",
        name: "A4 Ruled Exercise Book 200 Pages",
        sku: "NB-A4-200",
        category: "Notebooks & Paper",
        quantity: 2,
        unitPrice: 180,
        costPrice: 120,
        subtotal: 360,
        unit: "pc"
      },
      {
        productId: "prod-006",
        name: "Bic Ballpoint Pen Blue 1.0mm",
        sku: "PEN-BIC-BL",
        category: "Writing & Correction",
        quantity: 3,
        unitPrice: 30,
        costPrice: 18,
        subtotal: 90,
        unit: "pc"
      }
    ],
    subtotal: 450,
    discount: 0,
    discountType: "fixed",
    taxRate: 0,
    taxAmount: 0,
    total: 450,
    paymentMethod: "cash",
    amountPaid: 500,
    changeGiven: 50,
    status: "completed"
  },
  {
    id: "sale-102",
    receiptNumber: "REC-261105-002",
    timestamp: now - 95 * 60 * 1000,
    dateFormatted: new Date(now - 95 * 60 * 1000).toLocaleString(),
    cashier: "Sylvia N.",
    customerId: "cust-003",
    customerName: "Apex Law Advocates",
    customerPhone: "+254 722 556 677",
    items: [
      {
        productId: "prod-003",
        name: "A4 Photocopy Paper 80gsm (Full Ream 500 Sheets)",
        sku: "PP-REAM-80",
        category: "Notebooks & Paper",
        quantity: 3,
        unitPrice: 850,
        costPrice: 650,
        subtotal: 2550,
        unit: "ream"
      },
      {
        productId: "prod-016",
        name: "A4 Heavy Duty Lever Arch Box File",
        sku: "FL-LVR-A4",
        category: "Office & Filing",
        quantity: 4,
        unitPrice: 320,
        costPrice: 210,
        subtotal: 1280,
        unit: "pc"
      }
    ],
    subtotal: 3830,
    discount: 130, // Promotional discount
    discountType: "fixed",
    taxRate: 0,
    taxAmount: 0,
    total: 3700,
    paymentMethod: "mobile_money",
    amountPaid: 3700,
    changeGiven: 0,
    paymentReference: "QKL98342H",
    status: "completed",
    notes: "Office order delivered to 2nd floor"
  },
  {
    id: "sale-103",
    receiptNumber: "REC-261105-003",
    timestamp: now - 3 * oneHour,
    dateFormatted: new Date(now - 3 * oneHour).toLocaleString(),
    cashier: "Sylvia N.",
    customerName: "Walk-in Customer",
    items: [
      {
        productId: "prod-012",
        name: "Oxford Mathematical Geometry Set",
        sku: "MS-OXF-01",
        category: "School & Math Sets",
        quantity: 1,
        unitPrice: 450,
        costPrice: 310,
        subtotal: 450,
        unit: "tin"
      },
      {
        productId: "prod-014",
        name: "Scientific Calculator 240 Functions",
        sku: "CALC-SCI-82",
        category: "School & Math Sets",
        quantity: 1,
        unitPrice: 1600,
        costPrice: 1150,
        subtotal: 1600,
        unit: "pc"
      }
    ],
    subtotal: 2050,
    discount: 50,
    discountType: "fixed",
    taxRate: 0,
    taxAmount: 0,
    total: 2000,
    paymentMethod: "card",
    amountPaid: 2000,
    changeGiven: 0,
    paymentReference: "AUTH-8921",
    status: "completed"
  },
  {
    id: "sale-104",
    receiptNumber: "REC-261104-004",
    timestamp: now - 1 * oneDay,
    dateFormatted: new Date(now - 1 * oneDay).toLocaleString(),
    cashier: "Sylvia N.",
    customerId: "cust-002",
    customerName: "Sunrise Academy (Teacher Mary)",
    customerPhone: "+254 711 223 344",
    items: [
      {
        productId: "prod-024",
        name: "B&W Photocopy / Printing (A4 Per Page)",
        sku: "SRV-COPY-BW",
        category: "Printing & Services",
        quantity: 150,
        unitPrice: 5,
        costPrice: 1.5,
        subtotal: 750,
        unit: "page"
      },
      {
        productId: "prod-026",
        name: "Spiral Comb Binding (Up to 100 Pages)",
        sku: "SRV-BIND-100",
        category: "Printing & Services",
        quantity: 5,
        unitPrice: 120,
        costPrice: 35,
        subtotal: 600,
        unit: "doc"
      }
    ],
    subtotal: 1350,
    discount: 0,
    discountType: "fixed",
    taxRate: 0,
    taxAmount: 0,
    total: 1350,
    paymentMethod: "credit",
    amountPaid: 0,
    changeGiven: 0,
    status: "completed",
    notes: "Term 3 exam papers printing on school account"
  }
];
