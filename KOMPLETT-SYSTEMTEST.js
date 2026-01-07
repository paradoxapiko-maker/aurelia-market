// KOMPLETT SYSTEMTEST - Testar ALLT innan Vercel deployment
const testEmail = `test${Date.now()}@gmail.com`;
const testPassword = 'testpassword123';
const adminEmail = 'ngabulokana@gmail.com';
const adminPassword = 'a-z, A-Z, 0-9';

console.log('🔍 KOMPLETT SYSTEMTEST\n');
console.log('='.repeat(70));
console.log('Detta test verifierar ALLA delar av systemet:');
console.log('1. Databas-anslutning');
console.log('2. Registrering');
console.log('3. Inloggning');
console.log('4. Admin-inloggning');
console.log('5. Produkter');
console.log('6. API-endpoints');
console.log('='.repeat(70));

let allTestsPassed = true;
const results = {
  database: false,
  register: false,
  login: false,
  adminLogin: false,
  products: false,
  api: false
};

// Test 1: Databas
async function testDatabase() {
  console.log('\n📊 TEST 1: DATABAS-ANSLUTNING');
  console.log('-'.repeat(70));
  
  try {
    const { createClient } = await import('@libsql/client/web');
    
    const client = createClient({
      url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
      authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njc3NjUzMDksImlkIjoiYTU1OTcwMzctMzQ1Zi00ODQ2LTgyMTYtNWJkNzEyYmRkMmRlIiwicmlkIjoiMDMxOTcwYzYtMzllNS00MzYyLWIwMDItM2M4OGYzNDNjOGZkIn0.JuHL0gDgcdH0Yg1euuPpFBURYGc8Q2i5FvnAJdGtYcy41ErdYtbkRkMGrxbGLtUWMTWklX8Fee6uLRXOhmmjDQ'
    });
    
    // Test simple query
    await client.execute('SELECT 1');
    console.log('✅ Databas-anslutning fungerar');
    
    // Test tables
    const tables = await client.execute(`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
    `);
    console.log(`✅ Tabeller: ${tables.rows.length} st`);
    
    // Test users
    const users = await client.execute('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Användare: ${users.rows[0].count} st`);
    
    // Test products
    const products = await client.execute('SELECT COUNT(*) as count FROM products');
    console.log(`✅ Produkter: ${products.rows[0].count} st`);
    
    results.database = true;
    return true;
  } catch (error) {
    console.log('❌ DATABAS FEL:', error.message);
    allTestsPassed = false;
    return false;
  }
}

// Test 2: Registrering
async function testRegister() {
  console.log('\n📝 TEST 2: REGISTRERING');
  console.log('-'.repeat(70));
  console.log('Email:', testEmail);
  console.log('Lösenord:', testPassword);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ REGISTRERING MISSLYCKADES');
      console.log('Status:', response.status);
      console.log('Fel:', data.error);
      allTestsPassed = false;
      return false;
    }
    
    console.log('✅ Registrering lyckades');
    console.log('✅ Användare skapad:', data.user.email);
    console.log('✅ Roll:', data.user.role);
    console.log('✅ Token genererad:', data.token ? 'Ja' : 'Nej');
    
    results.register = true;
    return true;
  } catch (error) {
    console.log('❌ REGISTRERING FEL:', error.message);
    allTestsPassed = false;
    return false;
  }
}

// Test 3: Inloggning
async function testLogin() {
  console.log('\n🔐 TEST 3: INLOGGNING');
  console.log('-'.repeat(70));
  console.log('Email:', testEmail);
  console.log('Lösenord:', testPassword);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ INLOGGNING MISSLYCKADES');
      console.log('Status:', response.status);
      console.log('Fel:', data.error);
      allTestsPassed = false;
      return false;
    }
    
    console.log('✅ Inloggning lyckades');
    console.log('✅ Användare:', data.user.email);
    console.log('✅ Roll:', data.user.role);
    console.log('✅ Token genererad:', data.token ? 'Ja' : 'Nej');
    
    results.login = true;
    return true;
  } catch (error) {
    console.log('❌ INLOGGNING FEL:', error.message);
    allTestsPassed = false;
    return false;
  }
}

// Test 4: Admin-inloggning
async function testAdminLogin() {
  console.log('\n👑 TEST 4: ADMIN-INLOGGNING');
  console.log('-'.repeat(70));
  console.log('Email:', adminEmail);
  console.log('Lösenord:', adminPassword);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ ADMIN-INLOGGNING MISSLYCKADES');
      console.log('Status:', response.status);
      console.log('Fel:', data.error);
      allTestsPassed = false;
      return false;
    }
    
    if (data.user.role !== 'admin') {
      console.log('❌ ANVÄNDAREN ÄR INTE ADMIN');
      console.log('Roll:', data.user.role);
      allTestsPassed = false;
      return false;
    }
    
    console.log('✅ Admin-inloggning lyckades');
    console.log('✅ Admin:', data.user.email);
    console.log('✅ Roll:', data.user.role);
    console.log('✅ Token genererad:', data.token ? 'Ja' : 'Nej');
    
    results.adminLogin = true;
    return true;
  } catch (error) {
    console.log('❌ ADMIN-INLOGGNING FEL:', error.message);
    allTestsPassed = false;
    return false;
  }
}

// Test 5: Produkter
async function testProducts() {
  console.log('\n📦 TEST 5: PRODUKTER');
  console.log('-'.repeat(70));
  
  try {
    const response = await fetch('http://localhost:3001/api/products');
    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ PRODUKTER MISSLYCKADES');
      console.log('Status:', response.status);
      allTestsPassed = false;
      return false;
    }
    
    console.log('✅ Produkter hämtade:', data.length, 'st');
    
    if (data.length > 0) {
      console.log('✅ Första produkten:', data[0].name);
      console.log('✅ Pris:', data[0].price, 'kr');
    }
    
    results.products = true;
    return true;
  } catch (error) {
    console.log('❌ PRODUKTER FEL:', error.message);
    allTestsPassed = false;
    return false;
  }
}

// Test 6: API Health
async function testAPI() {
  console.log('\n🔌 TEST 6: API-ENDPOINTS');
  console.log('-'.repeat(70));
  
  try {
    // Test products endpoint
    const productsRes = await fetch('http://localhost:3001/api/products');
    console.log('✅ /api/products:', productsRes.status);
    
    results.api = true;
    return true;
  } catch (error) {
    console.log('❌ API FEL:', error.message);
    allTestsPassed = false;
    return false;
  }
}

// Kör alla tester
async function runAllTests() {
  await testDatabase();
  await testRegister();
  await testLogin();
  await testAdminLogin();
  await testProducts();
  await testAPI();
  
  // Sammanfattning
  console.log('\n' + '='.repeat(70));
  console.log('📊 TESTRESULTAT');
  console.log('='.repeat(70));
  console.log('Databas:         ', results.database ? '✅ OK' : '❌ FEL');
  console.log('Registrering:    ', results.register ? '✅ OK' : '❌ FEL');
  console.log('Inloggning:      ', results.login ? '✅ OK' : '❌ FEL');
  console.log('Admin-inloggning:', results.adminLogin ? '✅ OK' : '❌ FEL');
  console.log('Produkter:       ', results.products ? '✅ OK' : '❌ FEL');
  console.log('API:             ', results.api ? '✅ OK' : '❌ FEL');
  console.log('='.repeat(70));
  
  if (allTestsPassed) {
    console.log('\n🎉 ALLA TESTER GODKÄNDA!');
    console.log('\n✅ SYSTEMET ÄR 100% FUNKTIONELLT');
    console.log('✅ REDO FÖR VERCEL DEPLOYMENT');
    console.log('\nNästa steg:');
    console.log('1. Pusha till GitHub');
    console.log('2. Koppla GitHub till Vercel');
    console.log('3. Lägg till miljövariabler');
    console.log('4. Deploy!');
  } else {
    console.log('\n❌ VISSA TESTER MISSLYCKADES');
    console.log('\n⚠️  SYSTEMET ÄR INTE REDO FÖR DEPLOYMENT');
    console.log('\nÅtgärda felen ovan innan deployment.');
  }
  
  return allTestsPassed;
}

runAllTests().catch(console.error);
