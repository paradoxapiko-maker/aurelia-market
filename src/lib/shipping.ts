// Shipping configuration for Aurelia Market

export interface ShippingCarrier {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
  logo?: string;
}

export const SHIPPING_CARRIERS: ShippingCarrier[] = [
  {
    id: 'postnord',
    name: 'PostNord',
    price: 49,
    estimatedDays: '2-4',
    description: 'Hemleverans med PostNord',
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    price: 79,
    estimatedDays: '1-2',
    description: 'Snabb leverans med DHL',
  },
  {
    id: 'db-schenker',
    name: 'DB Schenker',
    price: 59,
    estimatedDays: '2-3',
    description: 'Pålitlig leverans med DB Schenker',
  },
];

export const FREE_SHIPPING_THRESHOLD = 500;

export function calculateShipping(subtotal: number, carrierId?: string): number {
  // Free shipping for orders over threshold
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  // If no carrier selected, return 0 (will be selected during checkout)
  if (!carrierId) {
    return 0;
  }

  // Find carrier and return price
  const carrier = SHIPPING_CARRIERS.find(c => c.id === carrierId);
  return carrier ? carrier.price : 0;
}

export function getShippingCarrier(carrierId: string): ShippingCarrier | undefined {
  return SHIPPING_CARRIERS.find(c => c.id === carrierId);
}

export function isFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

export function getAmountUntilFreeShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return FREE_SHIPPING_THRESHOLD - subtotal;
}
