# Fraktalternativ - Implementerad 2025-01-08

## Översikt

Systemet har nu tre transportörer med olika fraktpriser och fri frakt vid köp över 500 kr.

## Transportörer

### 1. PostNord
- **Pris:** 49 kr
- **Leveranstid:** 2-4 arbetsdagar
- **Beskrivning:** Hemleverans med PostNord

### 2. DHL Express
- **Pris:** 79 kr
- **Leveranstid:** 1-2 arbetsdagar
- **Beskrivning:** Snabb leverans med DHL

### 3. DB Schenker
- **Pris:** 59 kr
- **Leveranstid:** 2-3 arbetsdagar
- **Beskrivning:** Pålitlig leverans med DB Schenker

## Fri Frakt

- **Gräns:** 500 kr
- **Regel:** Vid beställningar över 500 kr får kunden fri frakt
- **Under gränsen:** Kunden måste välja och betala för en transportör

## Funktioner

### Varukorg (Cart)
- Visar progress bar för fri frakt
- Indikerar hur mycket som saknas till fri frakt
- Visar "Gratis" när gränsen är nådd

### Checkout
- **Under 500 kr:**
  - Kunden måste välja transportör
  - Visar alla tre alternativ med priser och leveranstider
  - Standard: PostNord (billigast)
  
- **Över 500 kr:**
  - Visar stort "Grattis! Fri Frakt!" meddelande
  - Ingen transportörsval krävs
  - Systemet använder snabbaste tillgängliga transportör

### Ordersammanfattning
- Visar delsumma
- Visar fraktkostnad (eller "Gratis")
- Visar moms (25%)
- Visar totalt belopp inklusive frakt

## Teknisk Implementation

### Nya Filer
- `src/lib/shipping.ts` - Fraktkonfiguration och beräkningar

### Uppdaterade Filer
- `src/store/cartStore.ts` - Lagt till transportörsval och fraktberäkningar
- `src/app/checkout/page.tsx` - Lagt till transportörsval UI
- `src/app/cart/page.tsx` - Lagt till fri frakt progress bar

### API
Checkout API (`/api/checkout/create-payment-intent`) tar nu emot:
```typescript
{
  cartItems: CartItem[],
  paymentMethod: string,
  shippingCarrier: string | null,  // null vid fri frakt
  shippingCost: number,             // 0 vid fri frakt
  total: number                     // inkluderar frakt
}
```

## Användargränssnitt

### Progress Bar
- Visar visuellt hur nära kunden är fri frakt
- Blå färg med procent-indikator
- Uppdateras dynamiskt när produkter läggs till/tas bort

### Transportörsval
- Radio buttons för varje transportör
- Visar namn, beskrivning, leveranstid och pris
- Markerad transportör får guld-färg
- Hover-effekt på alla alternativ

### Fri Frakt Badge
- Grön bakgrund med checkmark
- Tydligt "Grattis!" meddelande
- Förklarar att snabbaste transportör används

## Beräkningar

### Fraktkostnad
```typescript
function calculateShipping(subtotal: number, carrierId?: string): number {
  if (subtotal >= 500) return 0;  // Fri frakt
  if (!carrierId) return 0;        // Ingen vald än
  return carrier.price;            // Transportörens pris
}
```

### Totalt
```typescript
total = subtotal + shippingCost
```

### Moms
```typescript
moms = Math.round(total * 0.2)  // 25% moms
```

## Testning

### Test 1: Under 500 kr
1. Lägg produkter för < 500 kr i varukorgen
2. Gå till checkout
3. Verifiera att transportörsval visas
4. Välj transportör
5. Verifiera att fraktkostnad läggs till totalen

### Test 2: Över 500 kr
1. Lägg produkter för > 500 kr i varukorgen
2. Gå till checkout
3. Verifiera att "Grattis! Fri Frakt!" visas
4. Verifiera att ingen fraktkostnad läggs till

### Test 3: Progress Bar
1. Lägg produkter för 300 kr i varukorgen
2. Verifiera att progress bar visar 60% (300/500)
3. Lägg till mer för 200 kr
4. Verifiera att "Grattis!" meddelande visas

## Framtida Förbättringar

- Spåra leveranser med transportörernas API:er
- Lägg till fler transportörer
- Dynamiska fraktpriser baserat på vikt/storlek
- Postnummer-baserad fraktberäkning
- Leveransadress-validering
- Leveranstidsgaranti

## Konfiguration

Alla fraktinställningar finns i `src/lib/shipping.ts`:

```typescript
export const SHIPPING_CARRIERS = [
  { id: 'postnord', name: 'PostNord', price: 49, ... },
  { id: 'dhl', name: 'DHL Express', price: 79, ... },
  { id: 'db-schenker', name: 'DB Schenker', price: 59, ... },
];

export const FREE_SHIPPING_THRESHOLD = 500;
```

För att ändra priser eller gräns, uppdatera dessa värden.

## Support

Vid problem:
1. Kontrollera att `src/lib/shipping.ts` är korrekt importerad
2. Verifiera att cart store har `selectedCarrier` state
3. Kontrollera att checkout API hanterar shipping-parametrar
4. Testa i webbläsarens console för fel

## Sammanfattning

✅ Tre transportörer implementerade (PostNord, DHL, DB Schenker)
✅ Olika priser för varje transportör
✅ Fri frakt vid köp över 500 kr
✅ Progress bar visar vägen till fri frakt
✅ Tydlig UI för transportörsval
✅ Automatisk beräkning av totalkostnad
✅ Responsiv design för mobil och desktop
