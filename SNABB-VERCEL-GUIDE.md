# ⚡ SNABB VERCEL DEPLOYMENT-GUIDE

**Tid:** ~15 minuter totalt  
**Status:** Redo att deploya ✅

---

## 🚀 3 ENKLA STEG

### 1️⃣ KOPPLA GITHUB (2 min)
1. Gå till https://vercel.com/dashboard
2. Klicka "Add New..." → "Project"
3. Välj **paradoxapiko-maker/aurelia-market**
4. Klicka "Import" (DEPLOY INTE ÄN!)

### 2️⃣ LÄGG TILL MILJÖVARIABLER (5 min)
Kopiera dessa från `.env.local` till Vercel:

```
DEMO_MODE=false
TURSO_DATABASE_URL=[från .env.local]
TURSO_AUTH_TOKEN=[från .env.local]
JWT_SECRET=[från .env.local]
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=[från .env.local]
STRIPE_SECRET_KEY=[från .env.local]
NEXT_PUBLIC_APP_URL=https://din-url.vercel.app
```

### 3️⃣ DEPLOY (3-6 min)
1. Klicka "Deploy"
2. Vänta ~3-6 minuter
3. Kopiera din Vercel URL
4. Uppdatera `NEXT_PUBLIC_APP_URL` med din URL
5. Klicka "Redeploy"

---

## ✅ TESTA

### Registrering:
- URL: `https://din-url.vercel.app/register`
- Email: `test@gmail.com`
- Lösenord: `testpassword123`

### Admin:
- URL: `https://din-url.vercel.app/admin/login`
- Email: `ngabulokana@gmail.com`
- Lösenord: `a-z, A-Z, 0-9`

---

## 🔧 FELSÖKNING

### "Databas ej tillgänglig"
→ Kontrollera `TURSO_DATABASE_URL` och `TURSO_AUTH_TOKEN` i Vercel

### "Inloggning misslyckades"
→ Kontrollera att `JWT_SECRET` är samma som i `.env.local`

### "Admin kan inte logga in"
→ Använd `/admin/login` (inte `/login`)

---

## 📊 VERIFIERING

Efter deployment, kontrollera:
- [ ] Registrering fungerar
- [ ] Inloggning fungerar
- [ ] Admin-login fungerar
- [ ] 6 produkter visas
- [ ] Varukorg fungerar

---

**Klart! Din e-handel är live!** 🎉

**Detaljerad guide:** Se `VERCEL-DEPLOYMENT-FINAL-2025-01-07.md`
