import {
  AppSettings,
  BankDetails,
  CouponPromotion,
  CustomerReview,
  DisputeClaim,
  MenuItem,
  OperatingHours,
  Order,
  PackagingSettings,
  PayoutRecord,
  RestaurantProfile,
  StaffMember,
  SupportTicket,
} from '../types';

const LIVE_BASE_URL = 'https://sachbite.in/api';
const PROXY_BASE_URL = '/api/remote';
const DEMO_STORAGE_KEY_PREFIX = 'sb_demo_';

const DEFAULT_SETTINGS: AppSettings = {
  subscriptionPricePro: 499,
  subscriptionPriceBusiness: 999,
  businessUpiId: 'sachbite@icici',
  businessUpiName: 'SachBite Foods Pvt Ltd',
  supportPhone: '+91 98765 43210',
  supportEmail: 'partner@sachbite.in',
};

const DEFAULT_WEEKLY_SCHEDULE: Record<string, OperatingHours> = {
  Monday: { open: '10:30', close: '23:30', isClosedOnDay: false },
  Tuesday: { open: '10:30', close: '23:30', isClosedOnDay: false },
  Wednesday: { open: '10:30', close: '23:30', isClosedOnDay: false },
  Thursday: { open: '10:30', close: '23:30', isClosedOnDay: false },
  Friday: { open: '10:30', close: '00:00', isClosedOnDay: false },
  Saturday: { open: '10:00', close: '00:30', isClosedOnDay: false },
  Sunday: { open: '10:00', close: '00:30', isClosedOnDay: false },
};

const DEFAULT_PACKAGING: PackagingSettings = {
  chargeType: 'fixed_per_order',
  fixedFee: 20,
  minOrderValue: 149,
  freeDeliveryAbove: 499,
  instructionsForRider: 'Handle with care. Hot biryani handi sealed.',
};

const DEFAULT_DEMO_PROFILE: RestaurantProfile = {
  name: 'Tandoori Tales & Biryani Hub',
  contactEmail: 'partner@tandooritales.com',
  contactPhone: '+91 98765 12345',
  tags: 'North Indian, Biryani, Mughlai, Kebabs',
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  subscriptionPlan: 'pro',
  subscriptionStatus: 'active',
  subscriptionStart: new Date(Date.now() - 15 * 86400000).toISOString(),
  subscriptionEnd: new Date(Date.now() + 15 * 86400000).toISOString(),
  isOpen: true,
  autoAcceptOrders: false,
  rushModeBuffer: 0,
  openingTime: '10:30',
  closingTime: '23:30',
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  packagingSettings: DEFAULT_PACKAGING,
  address: 'Shop 12-14, Ground Floor, Royal Plaza, Frazer Road, Patna, Bihar - 800001',
  fssaiNumber: '10423000001928',
  gstin: '10AAACT1234F1Z8',
  rating: 4.6,
  totalRatingsCount: 348,
  bankDetails: {
    accountHolder: 'Tandoori Tales Hospitality LLP',
    accountNumber: '50200049281729',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank Ltd',
    upiId: 'tandooritales@hdfcbank',
    isVerified: true,
  },
};

const DEFAULT_DEMO_STAFF: StaffMember[] = [
  {
    id: 'st_1',
    name: 'Rajesh Sharma',
    phone: '+91 98234 11223',
    role: 'Store Manager',
    pin: '1234',
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'st_2',
    name: 'Chef Mohammed Ansari',
    phone: '+91 94310 55667',
    role: 'Kitchen Chef',
    pin: '7788',
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'st_3',
    name: 'Vikas Kumar',
    phone: '+91 91234 88990',
    role: 'Cashier',
    pin: '4455',
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];

const DEFAULT_DEMO_DISPUTES: DisputeClaim[] = [
  {
    id: 'disp_1',
    orderId: 'SB-84880',
    customerName: 'Kunal Sen',
    issueType: 'Spilled Packaging',
    customerComment: 'The gravy container leaked slightly inside the carry bag.',
    claimAmount: 60,
    status: 'Resolved (Merchant Credit)',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    merchantNotes: 'Issued ₹60 wallet credit to customer. Replaced container seal tape in kitchen.',
  },
  {
    id: 'disp_2',
    orderId: 'SB-84905',
    customerName: 'Ankita Roy',
    issueType: 'Missing Item',
    customerComment: 'Ordered 2 Chaas, received 1 only.',
    claimAmount: 45,
    status: 'Pending Review',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const DEFAULT_DEMO_MENU: MenuItem[] = [
  {
    _id: 'item_1',
    name: 'Special Chicken Dum Biryani',
    price: 280,
    originalPrice: 340,
    category: 'Biryani',
    icon: '🍗',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    available: true,
    isVeg: false,
    foodType: 'non-veg',
    isBestSeller: true,
    isRecommended: true,
    prepTimeMinutes: 20,
    spiceLevel: 'Medium',
    description: 'Slow-cooked aromatic basmati rice layered with tender spiced chicken pieces, mint & saffron.',
    variants: [
      { name: 'Half (1 Pc Chicken + Egg)', price: 210 },
      { name: 'Full (2 Pcs Chicken + Egg + Aloo)', price: 280 },
      { name: 'Family Pack (4 Pcs Chicken + 2 Eggs)', price: 599 },
    ],
    addOns: [
      { name: 'Extra Salan & Raita', price: 30 },
      { name: 'Boiled Egg (1 Pc)', price: 20 },
    ],
  },
  {
    _id: 'item_2',
    name: 'Paneer Butter Masala',
    price: 220,
    originalPrice: 260,
    category: 'Main Course',
    icon: '🧀',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    available: true,
    isVeg: true,
    foodType: 'veg',
    isBestSeller: true,
    prepTimeMinutes: 15,
    spiceLevel: 'Mild',
    description: 'Fresh malai cottage cheese cubes simmered in rich velvety tomato-cashew gravy.',
    variants: [
      { name: 'Regular Portion', price: 220 },
      { name: 'Large Portion', price: 320 },
    ],
    addOns: [{ name: 'Extra Butter / Cream Dollop', price: 25 }],
  },
  {
    _id: 'item_3',
    name: 'Butter Naan (2 Pcs)',
    price: 60,
    category: 'Breads',
    icon: '🫓',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    available: true,
    isVeg: true,
    foodType: 'veg',
    prepTimeMinutes: 8,
    description: 'Crispy, fluffy traditional clay oven flatbread brushed with generous Amul butter.',
  },
  {
    _id: 'item_4',
    name: 'Chicken Malai Tikka (6 Pcs)',
    price: 260,
    originalPrice: 300,
    category: 'Starters',
    icon: '🍢',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
    available: true,
    isVeg: false,
    foodType: 'non-veg',
    isRecommended: true,
    prepTimeMinutes: 18,
    spiceLevel: 'Mild',
    description: 'Boneless chicken marinated with melted cheese, cardamom cream and charcoal grilled.',
  },
  {
    _id: 'item_5',
    name: 'Crispy Veg Spring Rolls',
    price: 150,
    category: 'Starters',
    icon: '🥢',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: false,
    isVeg: true,
    foodType: 'veg',
    prepTimeMinutes: 12,
    description: 'Crunchy golden rolls stuffed with shredded vegetables and sweet chili dip.',
  },
  {
    _id: 'item_6',
    name: 'Gulab Jamun (2 Pcs)',
    price: 70,
    category: 'Desserts',
    icon: '🍯',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    available: true,
    isVeg: true,
    foodType: 'veg',
    prepTimeMinutes: 5,
    description: 'Warm, melt-in-mouth milk dumplings soaked in cardamom rose sugar syrup.',
  },
  {
    _id: 'item_7',
    name: 'Masala Chaas / Spiced Buttermilk',
    price: 45,
    category: 'Beverages',
    icon: '🥛',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    available: true,
    isVeg: true,
    foodType: 'veg',
    prepTimeMinutes: 5,
    description: 'Refreshing churned curd flavored with roasted cumin, mint, and rock salt.',
  },
];

const DEFAULT_DEMO_ORDERS: Order[] = [
  {
    _id: 'ord_9012',
    orderId: 'SB-84920',
    date: new Date(Date.now() - 4 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98234 56789',
    customerAddress: 'Flat 402, Lotus Residency, Near City Mall, Frazer Rd, Patna',
    status: 'Preparing',
    items: [
      { name: 'Special Chicken Dum Biryani', price: 280, quantity: 2, variant: 'Full (2 Pcs Chicken + Egg + Aloo)' },
      { name: 'Chicken Malai Tikka (6 Pcs)', price: 260, quantity: 1 },
      { name: 'Masala Chaas / Spiced Buttermilk', price: 45, quantity: 2 },
    ],
    itemTotal: 910,
    taxTotal: 45.5,
    packagingFee: 20,
    deliveryFee: 30,
    discountAmount: 50,
    grandTotal: 955.5,
    paymentMethod: 'UPI Paid (Online)',
    notes: 'Please make biryani medium spicy. Pack extra green chutney.',
    prepTimeMinutes: 20,
    acceptedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    rider: {
      name: 'Santosh Kumar',
      phone: '+91 94310 99881',
      vehicleNumber: 'BR 01 EA 4912',
      rating: 4.8,
      status: 'arriving',
      etaMinutes: 6,
    },
    deliveryOtp: '7492',
  },
  {
    _id: 'ord_9011',
    orderId: 'SB-84918',
    date: new Date(Date.now() - 18 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    customerName: 'Ananya Verma',
    customerPhone: '+91 94312 88765',
    customerAddress: 'House 14B, Kankarbagh Main Rd, Opp SBI Bank, Patna',
    status: 'Out for Delivery',
    items: [
      { name: 'Paneer Butter Masala', price: 220, quantity: 1 },
      { name: 'Butter Naan (2 Pcs)', price: 60, quantity: 2 },
      { name: 'Gulab Jamun (2 Pcs)', price: 70, quantity: 1 },
    ],
    itemTotal: 410,
    taxTotal: 20.5,
    packagingFee: 20,
    grandTotal: 450.5,
    paymentMethod: 'Cash on Delivery',
    rider: {
      name: 'Ravi Prakash',
      phone: '+91 91234 44556',
      vehicleNumber: 'BR 01 BX 9081',
      rating: 4.9,
      status: 'out_for_delivery',
      etaMinutes: 12,
    },
    deliveryOtp: '3180',
  },
  {
    _id: 'ord_9010',
    orderId: 'SB-84905',
    date: new Date(Date.now() - 95 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 95 * 60000).toISOString(),
    customerName: 'Vikram Singh',
    customerPhone: '+91 91234 77665',
    customerAddress: 'Office 301, Tech Tower, Bailey Road, Patna',
    status: 'Delivered',
    items: [
      { name: 'Special Chicken Dum Biryani', price: 280, quantity: 3 },
      { name: 'Masala Chaas / Spiced Buttermilk', price: 45, quantity: 3 },
    ],
    grandTotal: 975,
    paymentMethod: 'UPI Paid (Online)',
  },
  {
    _id: 'ord_9009',
    orderId: 'SB-84880',
    date: new Date(Date.now() - 210 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 210 * 60000).toISOString(),
    customerName: 'Pooja Kumari',
    customerPhone: '+91 98711 22334',
    customerAddress: 'Apt 12, Ashiana Greens, Danapur, Patna',
    status: 'Delivered',
    items: [
      { name: 'Paneer Butter Masala', price: 220, quantity: 2 },
      { name: 'Butter Naan (2 Pcs)', price: 60, quantity: 4 },
    ],
    grandTotal: 680,
    paymentMethod: 'UPI Paid (Online)',
  },
];

const DEFAULT_DEMO_COUPONS: CouponPromotion[] = [
  {
    id: 'c_1',
    code: 'SACHBITE50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 249,
    maxDiscount: 100,
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 25 * 86400000).toISOString(),
    isActive: true,
    totalRedemptions: 142,
  },
  {
    id: 'c_2',
    code: 'FESTIVE75',
    discountType: 'flat',
    discountValue: 75,
    minOrderValue: 399,
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    isActive: true,
    totalRedemptions: 68,
  },
];

const DEFAULT_DEMO_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    customerName: 'Amitabh Sen',
    rating: 5,
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    orderId: 'SB-84880',
    comment: 'The Chicken Dum Biryani was phenomenal! Piping hot and aromatic. Excellent sealed packaging.',
    tags: ['Tasty Food', 'Hot & Fresh', 'Spill-Proof'],
    merchantReply: 'Thank you so much Amitabh Ji! Delighted you enjoyed the dum biryani flavors.',
    repliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'rev_2',
    customerName: 'Pooja Verma',
    rating: 4,
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    orderId: 'SB-84812',
    comment: 'Paneer was super soft and gravy rich. Loved the butter naans as well.',
    tags: ['Great Taste', 'Fast Delivery'],
  },
];

const DEFAULT_DEMO_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay_1',
    payoutId: 'PAY-SB-2026-904',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    amount: 14850.0,
    status: 'completed',
    ordersCount: 42,
    utrNumber: 'CMS401928472910',
    bankAccountMasked: '•••• 1729 (HDFC Bank)',
  },
  {
    id: 'pay_2',
    payoutId: 'PAY-SB-2026-903',
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    amount: 18420.5,
    status: 'completed',
    ordersCount: 56,
    utrNumber: 'CMS401817290118',
    bankAccountMasked: '•••• 1729 (HDFC Bank)',
  },
];

const DEFAULT_DEMO_TICKETS: SupportTicket[] = [
  {
    id: 'tick_1',
    ticketNumber: 'TKT-8921',
    subject: 'Request for Menu Category Reordering',
    category: 'Menu & Catalog',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastMessage: 'Your Biryani category has been placed on the top banner.',
    messages: [
      { sender: 'merchant', text: 'Please move Biryani category to the first position.', time: '3 days ago' },
      { sender: 'support', text: 'Hi Partner! Updated your catalog display order. Check your live menu.', time: '2 days ago' },
    ],
  },
];

class ApiClient {
  private token: string | null = null;
  private isDemoMode: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('sb_partner_token');
      this.isDemoMode = localStorage.getItem('sb_is_demo_mode') === 'true';
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('sb_partner_token', token);
      } else {
        localStorage.removeItem('sb_partner_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public setDemoMode(val: boolean) {
    this.isDemoMode = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_is_demo_mode', String(val));
    }
  }

  public getIsDemoMode(): boolean {
    return this.isDemoMode;
  }

  private getHeaders(isMultipart = false): Record<string, string> {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; error: string | null }> {
    const isMultipart = options.body instanceof FormData;
    const headers = { ...this.getHeaders(isMultipart), ...(options.headers as Record<string, string> || {}) };

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const directUrl = `${LIVE_BASE_URL}${cleanEndpoint}`;
    const proxyUrl = `${PROXY_BASE_URL}${cleanEndpoint}`;

    try {
      const response = await fetch(directUrl, { ...options, headers });
      if (!response.ok) {
        let errMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson.message || errJson.error) {
            errMessage = errJson.message || errJson.error;
          }
        } catch {}
        return { data: null as unknown as T, error: errMessage };
      }
      const data = await response.json();
      return { data, error: null };
    } catch {
      try {
        const proxyResponse = await fetch(proxyUrl, { ...options, headers });
        if (!proxyResponse.ok) {
          let errMessage = `HTTP ${proxyResponse.status}: ${proxyResponse.statusText}`;
          try {
            const errJson = await proxyResponse.json();
            if (errJson.message || errJson.error) {
              errMessage = errJson.message || errJson.error;
            }
          } catch {}
          return { data: null as unknown as T, error: errMessage };
        }
        const data = await proxyResponse.json();
        return { data, error: null };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Network error';
        return { data: null as unknown as T, error: errorMessage };
      }
    }
  }

  // --- Auth APIs ---

  public async login(username: string, password: string): Promise<{ success: boolean; token?: string; restaurantName?: string; error?: string }> {
    if (username === 'demo' || username === 'partner@sachbite.in' || this.isDemoMode) {
      const mockToken = 'demo_sb_token_' + Date.now();
      this.setToken(mockToken);
      this.setDemoMode(true);
      return {
        success: true,
        token: mockToken,
        restaurantName: 'Tandoori Tales & Biryani Hub',
      };
    }

    const { data, error } = await this.request<{ success: boolean; token?: string; restaurantName?: string; message?: string }>(
      '/restaurant-auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );

    if (error || !data?.token) {
      return {
        success: false,
        error: error || data?.message || 'Invalid username or password',
      };
    }

    this.setToken(data.token);
    this.setDemoMode(false);
    return {
      success: true,
      token: data.token,
      restaurantName: data.restaurantName || 'Restaurant Partner',
    };
  }

  public async verifySession(): Promise<{ valid: boolean; restaurantName?: string }> {
    if (!this.token) return { valid: false };

    if (this.token.startsWith('demo_sb_token_') || this.isDemoMode) {
      return { valid: true, restaurantName: 'Tandoori Tales & Biryani Hub' };
    }

    const { data, error } = await this.request<{ success?: boolean; valid?: boolean; restaurantName?: string }>(
      '/restaurant-auth/verify',
      {
        method: 'POST',
        body: JSON.stringify({ token: this.token }),
      }
    );

    if (error || (data && data.valid === false) || (data && data.success === false)) {
      this.setToken(null);
      return { valid: false };
    }

    return { valid: true, restaurantName: data?.restaurantName };
  }

  public async logout(): Promise<void> {
    if (this.token && !this.token.startsWith('demo_sb_token_')) {
      await this.request('/restaurant-auth/logout', {
        method: 'POST',
        body: JSON.stringify({ token: this.token }),
      }).catch(() => {});
    }
    this.setToken(null);
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      await new Promise((r) => setTimeout(r, 600));
      return { success: true };
    }

    const { error } = await this.request('/restaurant-auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (error) return { success: false, error };
    return { success: true };
  }

  // --- Profile & Operations APIs ---

  public async getProfile(): Promise<{ profile: RestaurantProfile | null; error?: string }> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}profile`);
    if (stored) {
      try {
        return { profile: { ...DEFAULT_DEMO_PROFILE, ...JSON.parse(stored) } };
      } catch {}
    }

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { profile: DEFAULT_DEMO_PROFILE };
    }

    const { data, error } = await this.request<RestaurantProfile | { restaurant: RestaurantProfile }>('/restaurant/me');

    if (error) {
      return { profile: DEFAULT_DEMO_PROFILE, error };
    }

    const profile = (data && 'restaurant' in data ? data.restaurant : data) as RestaurantProfile;
    return { profile: { ...DEFAULT_DEMO_PROFILE, ...profile } };
  }

  public async updateProfile(fields: Partial<RestaurantProfile>): Promise<{ success: boolean; profile?: RestaurantProfile; error?: string }> {
    const current = (await this.getProfile()).profile || DEFAULT_DEMO_PROFILE;
    const updated = { ...current, ...fields };
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}profile`, JSON.stringify(updated));

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { success: true, profile: updated };
    }

    const { data, error } = await this.request<RestaurantProfile | { success: boolean; restaurant?: RestaurantProfile }>(
      '/restaurant/me',
      {
        method: 'PUT',
        body: JSON.stringify(fields),
      }
    );

    if (error) {
      return { success: true, profile: updated };
    }

    const resProfile = (data && 'restaurant' in data ? data.restaurant : data) as RestaurantProfile;
    return { success: true, profile: { ...updated, ...resProfile } };
  }

  public async uploadImage(file: File): Promise<{ url: string | null; error?: string }> {
    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ url: reader.result as string });
        reader.onerror = () => resolve({ url: null, error: 'Failed to read image' });
        reader.readAsDataURL(file);
      });
    }

    const formData = new FormData();
    formData.append('image', file);

    const { data, error } = await this.request<{ url?: string; image?: string; secure_url?: string }>(
      '/restaurant/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (error || (!data?.url && !data?.image && !data?.secure_url)) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ url: reader.result as string });
        reader.readAsDataURL(file);
      });
    }

    return { url: data?.url || data?.image || data?.secure_url || null };
  }

  // --- Menu APIs ---

  public async getMenu(): Promise<{ items: MenuItem[]; error?: string }> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}menu`);
    if (stored) {
      try {
        return { items: JSON.parse(stored) };
      } catch {}
    }

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { items: DEFAULT_DEMO_MENU };
    }

    const { data, error } = await this.request<MenuItem[] | { menu: MenuItem[]; items?: MenuItem[] }>('/restaurant/menu');

    if (error) {
      return { items: DEFAULT_DEMO_MENU, error };
    }

    let items: MenuItem[] = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && Array.isArray(data.menu)) {
      items = data.menu;
    } else if (data && Array.isArray(data.items)) {
      items = data.items;
    }

    return { items: items.length > 0 ? items : DEFAULT_DEMO_MENU };
  }

  public async addMenuItem(item: Omit<MenuItem, '_id'>): Promise<{ success: boolean; item?: MenuItem; error?: string }> {
    const current = (await this.getMenu()).items;
    const newItem: MenuItem = {
      ...item,
      _id: 'item_' + Date.now(),
      available: item.available !== undefined ? item.available : true,
    };
    const updated = [newItem, ...current];
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}menu`, JSON.stringify(updated));

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { success: true, item: newItem };
    }

    const { data, error } = await this.request<MenuItem | { success: boolean; item?: MenuItem }>(
      '/restaurant/menu',
      {
        method: 'POST',
        body: JSON.stringify(item),
      }
    );

    if (error) {
      return { success: true, item: newItem };
    }

    const created = (data && 'item' in data ? data.item : data) as MenuItem;
    return { success: true, item: created || newItem };
  }

  public async updateMenuItem(itemId: string, fields: Partial<MenuItem>): Promise<{ success: boolean; item?: MenuItem; error?: string }> {
    const current = (await this.getMenu()).items;
    const updated = current.map((i) => (i._id === itemId || i.id === itemId ? { ...i, ...fields } : i));
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}menu`, JSON.stringify(updated));

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { success: true, item: updated.find((i) => i._id === itemId || i.id === itemId) };
    }

    const { data, error } = await this.request<MenuItem | { success: boolean; item?: MenuItem }>(
      `/restaurant/menu/${itemId}`,
      {
        method: 'PUT',
        body: JSON.stringify(fields),
      }
    );

    if (error) {
      return { success: true, item: updated.find((i) => i._id === itemId || i.id === itemId) };
    }

    const item = (data && 'item' in data ? data.item : data) as MenuItem;
    return { success: true, item };
  }

  public async deleteMenuItem(itemId: string): Promise<{ success: boolean; error?: string }> {
    const current = (await this.getMenu()).items;
    const updated = current.filter((i) => i._id !== itemId && i.id !== itemId);
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}menu`, JSON.stringify(updated));

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { success: true };
    }

    await this.request(`/restaurant/menu/${itemId}`, { method: 'DELETE' }).catch(() => {});
    return { success: true };
  }

  // --- Orders APIs ---

  public async getOrders(): Promise<{ orders: Order[]; error?: string }> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}orders`);
    if (stored) {
      try {
        return { orders: JSON.parse(stored) };
      } catch {}
    }

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { orders: DEFAULT_DEMO_ORDERS };
    }

    const { data, error } = await this.request<Order[] | { orders: Order[] }>('/restaurant/orders');

    if (error) {
      return { orders: DEFAULT_DEMO_ORDERS, error };
    }

    let orders: Order[] = [];
    if (Array.isArray(data)) {
      orders = data;
    } else if (data && Array.isArray(data.orders)) {
      orders = data.orders;
    }

    return { orders: orders.length > 0 ? orders : DEFAULT_DEMO_ORDERS };
  }

  public async updateOrderStatus(orderId: string, status: Order['status'], extra?: Partial<Order>): Promise<{ success: boolean; order?: Order }> {
    const current = (await this.getOrders()).orders;
    const updated = current.map((ord) => {
      if (ord._id === orderId || ord.id === orderId || ord.orderId === orderId) {
        return { ...ord, status, ...extra };
      }
      return ord;
    });
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}orders`, JSON.stringify(updated));
    return { success: true, order: updated.find((o) => o._id === orderId || o.orderId === orderId) };
  }

  public async simulateNewOrder(): Promise<Order> {
    const randomItems = [
      { name: 'Special Chicken Dum Biryani', price: 280, quantity: 1 + Math.floor(Math.random() * 2), variant: 'Full' },
      { name: 'Paneer Butter Masala', price: 220, quantity: 1 },
      { name: 'Butter Naan (2 Pcs)', price: 60, quantity: 2 + Math.floor(Math.random() * 2) },
      { name: 'Chicken Malai Tikka (6 Pcs)', price: 260, quantity: 1 },
      { name: 'Gulab Jamun (2 Pcs)', price: 70, quantity: 2 },
    ];
    const picked = randomItems.slice(0, 1 + Math.floor(Math.random() * 3));
    const subtotal = picked.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax + 20 + 30;

    const names = ['Rohan Kapoor', 'Neha Singhania', 'Amit Choudhary', 'Kavita Joshi', 'Siddharth Roy', 'Priya Anand'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomNum = Math.floor(10000 + Math.random() * 90000);

    const newOrder: Order = {
      _id: 'ord_' + Date.now(),
      orderId: `SB-${randomNum}`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      customerName: randomName,
      customerPhone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerAddress: `Flat ${Math.floor(100 + Math.random() * 900)}, Royal Palms, Boring Road, Patna`,
      status: 'Order Confirmed',
      items: picked,
      itemTotal: subtotal,
      taxTotal: tax,
      packagingFee: 20,
      deliveryFee: 30,
      grandTotal: total,
      paymentMethod: 'UPI Paid (Online)',
      notes: 'Please pack extra spoon and tissue papers.',
      prepTimeMinutes: 20,
      acceptedAt: new Date().toISOString(),
      rider: {
        name: 'Deepak Verma',
        phone: '+91 98210 33445',
        vehicleNumber: 'BR 01 DG 7812',
        rating: 4.8,
        status: 'arriving',
        etaMinutes: 8,
      },
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
    };

    const current = (await this.getOrders()).orders;
    const updated = [newOrder, ...current];
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}orders`, JSON.stringify(updated));
    return newOrder;
  }

  // --- Staff APIs ---

  public async getStaff(): Promise<StaffMember[]> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}staff`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_DEMO_STAFF;
  }

  public async addStaff(member: Omit<StaffMember, 'id' | 'createdAt'>): Promise<StaffMember> {
    const current = await this.getStaff();
    const newStaff: StaffMember = {
      ...member,
      id: 'st_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...current, newStaff];
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}staff`, JSON.stringify(updated));
    return newStaff;
  }

  public async deleteStaff(id: string): Promise<void> {
    const current = await this.getStaff();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}staff`, JSON.stringify(updated));
  }

  // --- Customer Disputes & Complaints APIs ---

  public async getDisputes(): Promise<DisputeClaim[]> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}disputes`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_DEMO_DISPUTES;
  }

  public async resolveDispute(id: string, resolution: DisputeClaim['status'], notes?: string): Promise<void> {
    const current = await this.getDisputes();
    const updated = current.map((d) => (d.id === id ? { ...d, status: resolution, merchantNotes: notes } : d));
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}disputes`, JSON.stringify(updated));
  }

  // --- Marketing & Coupons APIs ---

  public async getCoupons(): Promise<CouponPromotion[]> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}coupons`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_DEMO_COUPONS;
  }

  public async saveCoupon(coupon: Omit<CouponPromotion, 'id' | 'totalRedemptions'>): Promise<CouponPromotion> {
    const current = await this.getCoupons();
    const newCoupon: CouponPromotion = {
      ...coupon,
      id: 'c_' + Date.now(),
      totalRedemptions: 0,
    };
    const updated = [newCoupon, ...current];
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}coupons`, JSON.stringify(updated));
    return newCoupon;
  }

  public async toggleCoupon(id: string): Promise<void> {
    const current = await this.getCoupons();
    const updated = current.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}coupons`, JSON.stringify(updated));
  }

  public async deleteCoupon(id: string): Promise<void> {
    const current = await this.getCoupons();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}coupons`, JSON.stringify(updated));
  }

  // --- Reviews & Ratings APIs ---

  public async getReviews(): Promise<CustomerReview[]> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}reviews`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_DEMO_REVIEWS;
  }

  public async replyReview(reviewId: string, reply: string): Promise<void> {
    const current = await this.getReviews();
    const updated = current.map((r) =>
      r.id === reviewId ? { ...r, merchantReply: reply, repliedAt: new Date().toISOString() } : r
    );
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}reviews`, JSON.stringify(updated));
  }

  // --- Finance & Payouts APIs ---

  public async getPayouts(): Promise<PayoutRecord[]> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}payouts`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_DEMO_PAYOUTS;
  }

  public async requestInstantPayout(amount: number): Promise<PayoutRecord> {
    const current = await this.getPayouts();
    const newRecord: PayoutRecord = {
      id: 'pay_' + Date.now(),
      payoutId: `PAY-SB-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      amount,
      status: 'processing',
      ordersCount: 8,
      bankAccountMasked: '•••• 1729 (HDFC Bank)',
    };
    const updated = [newRecord, ...current];
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}payouts`, JSON.stringify(updated));
    return newRecord;
  }

  public async updateBankDetails(details: BankDetails): Promise<void> {
    const profile = (await this.getProfile()).profile;
    if (profile) {
      await this.updateProfile({ bankDetails: { ...details, isVerified: true } });
    }
  }

  // --- Support Tickets APIs ---

  public async getTickets(): Promise<SupportTicket[]> {
    const stored = localStorage.getItem(`${DEMO_STORAGE_KEY_PREFIX}tickets`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_DEMO_TICKETS;
  }

  public async createTicket(ticket: { subject: string; category: SupportTicket['category']; message: string }): Promise<SupportTicket> {
    const current = await this.getTickets();
    const newTicket: SupportTicket = {
      id: 'tick_' + Date.now(),
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticket.subject,
      category: ticket.category,
      status: 'Open',
      createdAt: new Date().toISOString(),
      lastMessage: ticket.message,
      messages: [{ sender: 'merchant', text: ticket.message, time: 'Just now' }],
    };
    const updated = [newTicket, ...current];
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}tickets`, JSON.stringify(updated));
    return newTicket;
  }

  public async replyTicket(ticketId: string, text: string): Promise<void> {
    const current = await this.getTickets();
    const updated = current.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          lastMessage: text,
          messages: [...t.messages, { sender: 'merchant' as const, text, time: 'Just now' }],
        };
      }
      return t;
    });
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}tickets`, JSON.stringify(updated));
  }

  // --- Settings & Subscription APIs ---

  public async getSettings(): Promise<{ settings: AppSettings; error?: string }> {
    const { data, error } = await this.request<AppSettings | { settings: AppSettings }>('/settings');

    if (error || !data) {
      return { settings: DEFAULT_SETTINGS };
    }

    const settings = ('settings' in data ? data.settings : data) as AppSettings;
    return {
      settings: {
        subscriptionPricePro: settings.subscriptionPricePro || DEFAULT_SETTINGS.subscriptionPricePro,
        subscriptionPriceBusiness: settings.subscriptionPriceBusiness || DEFAULT_SETTINGS.subscriptionPriceBusiness,
        businessUpiId: settings.businessUpiId || DEFAULT_SETTINGS.businessUpiId,
        businessUpiName: settings.businessUpiName || DEFAULT_SETTINGS.businessUpiName,
        supportPhone: settings.supportPhone || DEFAULT_SETTINGS.supportPhone,
        supportEmail: settings.supportEmail || DEFAULT_SETTINGS.supportEmail,
      },
    };
  }

  public async requestSubscription(plan: 'pro' | 'business', upiReference: string): Promise<{ success: boolean; error?: string }> {
    const current = (await this.getProfile()).profile || DEFAULT_DEMO_PROFILE;
    const updated: RestaurantProfile = {
      ...current,
      subscriptionPlan: plan,
      subscriptionStatus: 'pending',
    };
    localStorage.setItem(`${DEMO_STORAGE_KEY_PREFIX}profile`, JSON.stringify(updated));

    if (this.isDemoMode || (this.token && this.token.startsWith('demo_sb_token_'))) {
      return { success: true };
    }

    await this.request('/restaurant/subscription/request', {
      method: 'POST',
      body: JSON.stringify({ plan, upiReference }),
    }).catch(() => {});

    return { success: true };
  }
}

export const api = new ApiClient();
