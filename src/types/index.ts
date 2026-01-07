export type UserRole = 'customer' | 'admin';

export type ProductCategory = 
  | 'kläder-dam'
  | 'kläder-herr'
  | 'skor-dam'
  | 'skor-herr'
  | 'parfym'
  | 'skönhet'
  | 'hemredskap'
  | 'accessoarer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  active: boolean;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  stripePaymentIntentId?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  priceAtPurchase: number;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  userId?: string;
  sessionId?: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIKey {
  id: string;
  name: string;
  encryptedKey: string;
  iv: string;
  provider: string;
  createdBy: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type PaymentMethod = 'card' | 'paypal' | 'klarna';

export type ShippingProvider = 'dhl' | 'postnord' | 'db-schenker';

export interface ShippingOption {
  id: ShippingProvider;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export interface PaymentIntentRequest {
  cartItems: CartItem[];
  paymentMethod: PaymentMethod;
  shippingProvider?: ShippingProvider;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  orderId: string;
}
