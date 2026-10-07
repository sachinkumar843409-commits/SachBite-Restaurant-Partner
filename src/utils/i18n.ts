export type Language = 'en' | 'hi' | 'hinglish';

export interface TranslationStrings {
  // Navigation & Headers
  orders: string;
  menu: string;
  analytics: string;
  payouts: string;
  hub: string;
  liveOrders: string;
  kdsMode: string;
  testOrder: string;
  online: string;
  closed: string;
  
  // Orders
  activeOrders: string;
  refresh: string;
  markFoodReady: string;
  printKot: string;
  prepTime: string;
  acceptOrder: string;
  rejectOrder: string;
  kitchenNote: string;
  
  // Menu
  menuCatalog: string;
  addDish: string;
  inStock: string;
  soldOut: string;
  bulk86: string;
  bestseller: string;
  
  // Analytics & Payouts
  netRevenue: string;
  totalOrders: string;
  avgOrderValue: string;
  instantPayout: string;
  bankAccount: string;
  
  // Hub
  storeTimings: string;
  staffPin: string;
  disputes: string;
  packagingRules: string;
  tableQr: string;
  closingChecklist: string;
  offers: string;
  reviews: string;
  subscription: string;
  fssaiVault: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    orders: 'Orders',
    menu: 'Menu',
    analytics: 'Sales',
    payouts: 'Payouts',
    hub: 'Hub',
    liveOrders: 'Live Orders Feed',
    kdsMode: 'KDS Tablet',
    testOrder: 'Test Order',
    online: 'Online',
    closed: 'Closed',
    activeOrders: 'Active Orders',
    refresh: 'Refresh',
    markFoodReady: 'Food Ready (Packed)',
    printKot: 'Print KOT',
    prepTime: 'Prep Time',
    acceptOrder: 'Accept Order',
    rejectOrder: 'Reject Order',
    kitchenNote: 'Kitchen Note',
    menuCatalog: 'Menu Catalog',
    addDish: 'Add New Dish',
    inStock: 'In Stock',
    soldOut: 'Sold Out (86)',
    bulk86: 'Bulk 86 Stock',
    bestseller: 'Bestseller',
    netRevenue: 'Net Revenue',
    totalOrders: 'Total Orders',
    avgOrderValue: 'Avg Order (AOV)',
    instantPayout: 'Instant IMPS Payout',
    bankAccount: 'Settlement Bank Account',
    storeTimings: 'Store Timings',
    staffPin: 'Staff & PIN Lock',
    disputes: 'Order Disputes',
    packagingRules: 'Packaging Charges',
    tableQr: 'Table QR Standee',
    closingChecklist: 'Closing Checklist',
    offers: 'Offers & Coupons',
    reviews: 'Reviews & Ratings',
    subscription: '0% Commission',
    fssaiVault: 'FSSAI Vault',
  },
  hi: {
    orders: 'ऑर्डर्स',
    menu: 'मेन्यू',
    analytics: 'बिक्री',
    payouts: 'भुगतान',
    hub: 'हब',
    liveOrders: 'लाइव ऑर्डर्स',
    kdsMode: 'किचन KDS',
    testOrder: 'टेस्ट ऑर्डर',
    online: 'ऑनलाइन (चालू)',
    closed: 'बंद',
    activeOrders: 'सक्रिय ऑर्डर्स',
    refresh: 'ताज़ा करें',
    markFoodReady: 'खाना तैयार (पैक हुआ)',
    printKot: 'KOT पर्ची प्रिंट',
    prepTime: 'तैयारी का समय',
    acceptOrder: 'ऑर्डर स्वीकार करें',
    rejectOrder: 'ऑर्डर रद्द करें',
    kitchenNote: 'किचन नोट',
    menuCatalog: 'मेन्यू सूची',
    addDish: 'नया व्यंजन जोड़ें',
    inStock: 'उपलब्ध (In Stock)',
    soldOut: 'खत्म (Sold Out)',
    bulk86: 'एकसाथ 86 स्टॉक',
    bestseller: 'सबसे लोकप्रिय',
    netRevenue: 'कुल कमाई (नेट)',
    totalOrders: 'कुल ऑर्डर्स',
    avgOrderValue: 'औसत ऑर्डर मूल्य',
    instantPayout: 'तुरंत बैंक निकासी',
    bankAccount: 'बैंक खाता विवरण',
    storeTimings: 'दुकान का समय',
    staffPin: 'स्टाफ और पिन लॉक',
    disputes: 'शिकायत व रिफंड',
    packagingRules: 'पैकिंग शुल्क',
    tableQr: 'टेबल QR स्टैन्डी',
    closingChecklist: 'दुकान बंद चेकलिस्ट',
    offers: 'कूपन व छूट',
    reviews: 'ग्राहक समीक्षाएं',
    subscription: '0% कमीशन मेंबरशिप',
    fssaiVault: 'FSSAI लाइसेंस',
  },
  hinglish: {
    orders: 'Orders',
    menu: 'Menu',
    analytics: 'Sales & Kamai',
    payouts: 'Bank Payouts',
    hub: 'Partner Hub',
    liveOrders: 'Live Orders Feed',
    kdsMode: 'Kitchen KDS',
    testOrder: 'Test Order',
    online: 'Store Online',
    closed: 'Store Closed',
    activeOrders: 'Active Orders',
    refresh: 'Refresh Karein',
    markFoodReady: 'Food Ready (Pack Ho Gaya)',
    printKot: 'KOT Slip Print',
    prepTime: 'Cooking Time',
    acceptOrder: 'Order Accept Karein',
    rejectOrder: 'Reject Karein',
    kitchenNote: 'Chef Note',
    menuCatalog: 'Menu Items',
    addDish: 'Naya Dish Add Karein',
    inStock: 'Stock Me Hai',
    soldOut: 'Khatam (86’d)',
    bulk86: 'Bulk 86 Stock',
    bestseller: 'Bestseller Dish',
    netRevenue: 'Total Kamai',
    totalOrders: 'Total Orders',
    avgOrderValue: 'Avg Order Value',
    instantPayout: 'Turant Bank Payout',
    bankAccount: 'Settlement Bank',
    storeTimings: 'Store Timings & Hours',
    staffPin: 'Staff & Security PIN',
    disputes: 'Customer Complaints',
    packagingRules: 'Packaging Charges',
    tableQr: 'Table QR Standee',
    closingChecklist: 'Closing Checklist',
    offers: 'Offers & Discounts',
    reviews: 'Customer Reviews',
    subscription: '0% Commission Plan',
    fssaiVault: 'FSSAI License Vault',
  },
};
