# Kundinformation - Implementerad 2025-01-08

## Översikt

Systemet kräver nu fullständig kundinformation vid både registrering och gästköp för att säkerställa korrekt leverans.

## Krav

### Vid Registrering
Kunder måste ange:
- ✅ Fullständigt namn
- ✅ E-postadress
- ✅ Telefonnummer
- ✅ Gatuadress
- ⚪ Adressrad 2 (valfritt - lägenhet, c/o, etc.)
- ✅ Postnummer
- ✅ Stad
- ✅ Land (standard: Sverige)
- ✅ Lösenord (minst 8 tecken)

### Vid Gästköp
Samma information krävs innan kunden når kassan (kommer i nästa steg).

## Databas-ändringar

### Users Table - Nya Fält
```sql
- full_name VARCHAR(255)
- phone VARCHAR(50)
- address_line1 VARCHAR(255)
- address_line2 VARCHAR(255)
- city VARCHAR(100)
- postal_code VARCHAR(20)
- country VARCHAR(100) DEFAULT 'Sverige'
```

### Orders Table - Nya Fält
```sql
- shipping_name VARCHAR(255)
- shipping_email VARCHAR(255)
- shipping_phone VARCHAR(50)
- shipping_address_line1 VARCHAR(255)
- shipping_address_line2 VARCHAR(255)
- shipping_city VARCHAR(100)
- shipping_postal_code VARCHAR(20)
- shipping_country VARCHAR(100)
- shipping_carrier VARCHAR(50)
- shipping_cost DECIMAL(10, 2) DEFAULT 0
```

## Implementerade Ändringar

### 1. Databas Migration
- **Fil:** `database/migrations/003_add_customer_info.sql`
- **Script:** `scripts/run-customer-info-migration.ts`
- **Status:** ✅ Kördes framgångsrikt

### 2. Uppdaterat Registreringsformulär
- **Fil:** `src/app/register/page.tsx`
- **Ändringar:**
  - Tre sektioner: Personuppgifter, Leveransadress, Lösenord
  - Responsiv design (1 kolumn mobil, 2 kolumner desktop)
  - Visuella ikoner för varje sektion
  - Validering av alla fält

### 3. Uppdaterad AuthContext
- **Fil:** `src/contexts/AuthContext.tsx`
- **Ändringar:**
  - `register()` tar nu emot alla nya fält
  - Skickar fullständig information till API

### 4. Uppdaterad Register API
- **Fil:** `src/app/api/auth/register/route.ts`
- **Ändringar:**
  - Validering med Zod för alla fält
  - Sparar all kundinformation i databasen
  - Returnerar fullständig användarinformation

### 5. Uppdaterade Types
- **Fil:** `src/types/index.ts`
- **Nya interfaces:**
  - `RegisterData` - Utökad med alla fält
  - `ShippingInfo` - Ny interface för leveransinformation
  - `User` - Utökad med adressfält

## Användargränssnitt

### Registreringsformulär

#### Sektion 1: Personuppgifter
- Fullständigt namn (hela raden)
- E-post (vänster kolumn)
- Telefon (höger kolumn)

#### Sektion 2: Leveransadress
- Gatuadress (hela raden)
- Adressrad 2 (hela raden, valfritt)
- Postnummer (vänster kolumn)
- Stad (höger kolumn)
- Land (hela raden)

#### Sektion 3: Lösenord
- Lösenord (vänster kolumn)
- Bekräfta lösenord (höger kolumn)

### Design
- Grå bakgrund för varje sektion
- Guld-färgade ikoner
- Responsiv layout
- Tydliga labels och placeholders
- Validering i realtid

## Validering

### Frontend
- Alla obligatoriska fält måste fyllas i
- E-post måste vara giltig
- Telefon minst 5 tecken
- Lösenord minst 8 tecken
- Lösenorden måste matcha

### Backend (Zod)
```typescript
{
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(8, 'Lösenordet måste vara minst 8 tecken'),
  fullName: z.string().min(2, 'Namn måste vara minst 2 tecken'),
  phone: z.string().min(5, 'Telefonnummer krävs'),
  addressLine1: z.string().min(3, 'Gatuadress krävs'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'Stad krävs'),
  postalCode: z.string().min(5, 'Postnummer krävs'),
  country: z.string().default('Sverige'),
}
```

## Admin-fördelar

### Orderhantering
Administratören kan nu se:
- Kundens fullständiga namn
- Kontaktinformation (e-post och telefon)
- Fullständig leveransadress
- Vald transportör
- Fraktkostnad

### Leveranshantering
- All information finns i `orders` tabellen
- Ingen extra lookup behövs
- Kan exporteras direkt till fraktsedlar
- Enkel integration med transportörer

## Nästa Steg

### Gästköp (Kommer snart)
1. Skapa gästcheckout-formulär
2. Samla in samma information
3. Spara i orders-tabellen (utan user_id)
4. Skicka bekräftelse via e-post

### Checkout-uppdatering
1. För inloggade användare: Förfyll med sparad information
2. Möjlighet att ändra leveransadress
3. Spara ny adress som standard

## Testning

### Test 1: Registrering med Fullständig Information
1. Gå till `/register`
2. Fyll i alla fält
3. Klicka "Skapa Konto"
4. Verifiera att användaren skapas
5. Kontrollera att all information sparas

### Test 2: Validering
1. Försök registrera utan namn → Fel
2. Försök med ogiltig e-post → Fel
3. Försök med kort telefon → Fel
4. Försök med kort lösenord → Fel
5. Försök med olika lösenord → Fel

### Test 3: Databas
```sql
SELECT 
  email, full_name, phone, 
  address_line1, city, postal_code, country
FROM users
WHERE email = 'test@example.com';
```

## Säkerhet

### Personuppgifter (GDPR)
- All information krypteras i transit (HTTPS)
- Lösenord hashas med bcrypt
- Endast administratörer kan se kundinformation
- Kunder kan uppdatera sin information (kommer snart)

### Datalagring
- Sparas i Turso-databasen
- Backup enligt Turso:s policy
- Kan raderas på begäran

## Framtida Förbättringar

- [ ] Gästcheckout-formulär
- [ ] Redigera profil/adress
- [ ] Flera leveransadresser
- [ ] Adressvalidering (postnummer)
- [ ] Autofyll från postnummer
- [ ] Exportera till fraktsedlar
- [ ] Integration med transportörs-API:er

## Konfiguration

Inga nya environment variables krävs. Allt fungerar med befintlig Turso-konfiguration.

## Support

Vid problem:
1. Kontrollera att migrationen kördes: `npx tsx scripts/run-customer-info-migration.ts`
2. Verifiera att nya fält finns i databasen
3. Kontrollera att formuläret visar alla fält
4. Testa validering

## Sammanfattning

✅ Databas uppdaterad med kundinformationsfält
✅ Registreringsformulär utökat med alla fält
✅ API uppdaterad för att hantera ny information
✅ Validering på både frontend och backend
✅ Responsiv design för mobil och desktop
✅ Administratörer kan se fullständig kundinformation
⏳ Gästköp kommer i nästa steg

**Status:** Registrering klar, gästköp återstår
