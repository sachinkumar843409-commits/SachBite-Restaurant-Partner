export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
  isVerified?: boolean;
}

export interface OperatingHours {
  open: string;
  close: string;
  isClosedOnDay?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: 'Owner' | 'Store Manager' | 'Kitchen Chef' | 'Cashier' | 'Dispatcher';
  pin: string;
  isActive: boolean;
  createdAt: string;
}

export interface DisputeClaim {
  id: string;
  orderId: string;
  customerName: string;
  issueType: 'Spilled Packaging' | 'Missing Item' | 'Food Quality / Taste' | 'Rider Delayed';
  customerComment: string;
  claimAmount: number;
  status: 'Pending Review' | 'Resolved (Merchant Credit)' | 'Contested by Merchant' | 'SachBite Covered';
  createdAt: string;
  merchantNotes?: string;
}

export interface PackagingSettings {
  chargeType: 'fixed_per_order' | 'item_level' | 'free';
  fixedFee: number;
  minOrderValue: number;
  freeDeliveryAbove?: number;
  instructionsForRider?: string;
}

export interface RestaurantProfile {
  _id?: string;
  id?: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  tags?: string | string[];
  image?: string;
  subscriptionPlan: 'free' | 'pro' | 'business' | string;
  subscriptionStatus: 'active' | 'pending' | 'inactive' | 'expired' | string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  createdAt?: string;
  updatedAt?: string;

  // Operational Controls
  isOpen?: boolean;
  autoAcceptOrders?: boolean;
  rushModeBuffer?: number; // e.g. 0, 15, 30 mins added buffer
  openingTime?: string;
  closingTime?: string;
  weeklySchedule?: Record<string, OperatingHours>;
  address?: string;
  fssaiNumber?: string;
  gstin?: string;
  rating?: number;
  totalRatingsCount?: number;
  bankDetails?: BankDetails;
  packagingSettings?: PackagingSettings;
}

export interface MenuVariant {
  name: string;
  price: number;
}

export interface MenuAddOn {
  name: string;
  price: number;
}

export interface MenuItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  icon?: string;
  image?: string;
  available: boolean;
  restaurantId?: string;
  description?: string;
  isVeg?: boolean;
  foodType?: 'veg' | 'non-veg' | 'egg' | 'vegan';
  prepTimeMinutes?: number;
  isRecommended?: boolean;
  isBestSeller?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot & Spicy' | 'Extra Fiery';
  variants?: MenuVariant[];
  addOns?: MenuAddOn[];
  stockQuantity?: number;
  allergens?: string[];
  aiDescription?: string;
}

export interface OrderItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  addOns?: string[];
  notes?: string;
}

export interface DeliveryRider {
  name: string;
  phone: string;
  vehicleNumber: string;
  avatar?: string;
  rating?: number;
  status: 'assigned' | 'arriving' | 'at_restaurant' | 'out_for_delivery';
  etaMinutes?: number;
}

export interface Order {
  _id: string;
  id?: string;
  orderId?: string;
  date?: string;
  createdAt?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  status: 'Pending Acceptance' | 'Order Confirmed' | 'Preparing' | 'Food Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | string;
  grandTotal: number;
  itemTotal?: number;
  taxTotal?: number;
  deliveryFee?: number;
  discountAmount?: number;
  packagingFee?: number;
  paymentMethod?: string;
  notes?: string;
  prepTimeMinutes?: number;
  acceptedAt?: string;
  rider?: DeliveryRider;
  deliveryOtp?: string;
  cancellationReason?: string;
  packingProofImage?: string;
  packedAt?: string;
}

export interface PrinterSettings {
  deviceType: 'bluetooth' | 'usb' | 'wifi';
  printerName: string;
  paperWidth: '58mm' | '80mm';
  autoPrintOnNewOrder: boolean;
  printCopies: number;
  isConnected: boolean;
  cutPaper: boolean;
}

export interface HappyHourRule {
  id: string;
  title: string;
  tagline: string;
  discountPercent: number;
  startTime: string; // e.g. "12:00"
  endTime: string; // e.g. "15:30"
  isActive: boolean;
  daysActive: string[];
}

export interface RainModeSettings {
  isRainActive: boolean;
  extraPrepMinutes: number; // e.g. +15 mins
  restrictedRadiusKm: number; // e.g. 4 km
  weatherNotice: string;
}

export interface AppSettings {
  subscriptionPricePro: number;
  subscriptionPriceBusiness: number;
  businessUpiId: string;
  businessUpiName: string;
  supportPhone?: string;
  supportEmail?: string;
}

export interface CouponPromotion {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  totalRedemptions: number;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  orderId: string;
  comment: string;
  tags?: string[];
  merchantReply?: string;
  repliedAt?: string;
}

export interface PayoutRecord {
  id: string;
  payoutId: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'scheduled';
  ordersCount: number;
  utrNumber?: string;
  bankAccountMasked: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Orders' | 'Payments & Payouts' | 'Menu & Catalog' | 'Delivery Partner' | 'Other';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  lastMessage: string;
  messages: Array<{
    sender: 'merchant' | 'support';
    text: string;
    time: string;
  }>;
}

export interface OutletBranch {
  id: string;
  name: string;
  area: string;
  city: string;
  phone: string;
  isOpen: boolean;
  activeOrdersCount: number;
  todaySales: number;
  isCurrent?: boolean;
}

export interface RawIngredient {
  id: string;
  name: string;
  category: 'Dairy' | 'Meat & Poultry' | 'Grains & Flour' | 'Vegetables' | 'Spices & Oils' | 'Packaging';
  currentStock: number;
  unit: 'kg' | 'g' | 'liters' | 'units' | 'packets';
  minThreshold: number;
  costPerUnit: number;
  linkedDishesCount: number;
  lastRestocked: string;
  supplierName?: string;
}

export interface DineInTable {
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'billing';
  guestCount?: number;
  activeOrderId?: string;
  activeBillAmount?: number;
  occupiedSince?: string;
}

export interface LoyaltyCustomer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  favoriteDish: string;
  segment: 'VIP Gold' | 'Frequent Regular' | 'At Risk (Inactive)' | 'New Explorer';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export type TabType =
  | 'orders'
  | 'menu'
  | 'analytics'
  | 'finance'
  | 'marketing'
  | 'reviews'
  | 'subscription'
  | 'support'
  | 'profile';
