# 🚀 BÖRJA HÄR - VERCEL DEPLOYMENT

**Din e-handel är 100% redo!** Följ dessa steg för att deploya till Vercel.

---

## ⚡ SNABBSTART (15 minuter)

### Steg 1: Öppna Vercel
👉 Gå till: https://vercel.com/dashboard

### Steg 2: Importera från GitHub
1. Klicka **"Add New..."** → **"Project"**
2. Välj **paradoxapiko-maker/aurelia-market**
3. Klicka **"Import"** (DEPLOY INTE ÄN!)

### Steg 3: Lägg Till Miljövariabler
Öppna `.env.local` och kopiera dessa 7 variabler till Vercel:

```
DEMO_MODE=false
TURSO_DATABASE_URL=[kopiera från .env.local]
TURSO_AUTH_TOKEN=[kopiera från .env.local]
JWT_SECRET=[kopiera från .env.local]
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=[kopiera från .env.local]
STRIPE_SECRET_KEY=[kopiera från .env.local]
NEXT_PUBLIC_APP_URL=https://din-url.vercel.app
```

### Steg 4: Deploy
1. Klicka **"Deploy"**
2. Vänta ~3-6 minuter
3. ✅ Klart!

### Steg 5: Uppdatera URL
1. Kopiera din Vercel URL
2. Gå till **Settings** → **Environment Variables**
3. Uppdatera `NEXT_PUBLIC_APP_URL` med din URL
4. Klicka **"Redeploy"**

### Steg 6: Testa
- **Registrera:** https://din-url.vercel.app/register
- **Logga in:** https://din-url.vercel.app/login
- **Admin:** https://din-url.vercel.app/admin/login
  - Email: ngabulokana@gmail.com
  - Lösenord: a-z, A-Z, 0-9

---

## 📚 DETALJERADE GUIDER

### För Nybörjare:
👉 **SNABB-VERCEL-GUIDE.md** - Enkel 3-stegs guide

### För Fullständig Guide:
👉 **VERCEL-DEPLOYMENT-FINAL-2025-01-07.md** - Komplett med felsökning

### För Översikt:
👉 **KLAR-FOR-VERCEL-2025-01-07.md** - Vad som är klart och nästa steg

---

## ✅ VAD SOM ÄR KLART

- ✅ Autentisering fungerar 100%
- ✅ Databas konfigurerad (Turso)
- ✅ Admin-användare finns
- ✅ 6 produkter tillagda
- ✅ GitHub pushat
- ✅ Redo för Vercel

---

## 🔧 FELSÖKNING

### "Databas ej tillgänglig"
→ Kontrollera Turso-credentials i Vercel

### "Inloggning misslyckades"
→ Kontrollera att JWT_SECRET är samma som i .env.local

### "Admin kan inte logga in"
→ Använd /admin/login (inte /login)

---

## 💡 TIPS

- Deployment tar ~3-6 minuter
- Varje push till GitHub deployar automatiskt
- Kontrollera Function Logs i Vercel för debugging

---

**Lycka till!** 🎉

**Nästa steg:** Öppna **SNABB-VERCEL-GUIDE.md**
