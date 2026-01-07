// Test Turso Database Connection
import { createClient } from '@libsql/client/web';

console.log('🔍 TESTAR TURSO-DATABASANSLUTNING\n');
console.log('='.repeat(50));

// Credentials from .env.local
const TURSO_URL = 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njc3NjUzMDksImlkIjoiYTU1OTcwMzctMzQ1Zi00ODQ2LTgyMTYtNWJkNzEyYmRkMmRlIiwicmlkIjoiMDMxOTcwYzYtMzllNS00MzYyLWIwMDItM2M4OGYzNDNjOGZkIn0.JuHL0gDgcdH0Yg1euuPpFBURYGc8Q2i5FvnAJdGtYcy41ErdYtbkRkMGrxbGLtUWMTWklX8Fee6uLRXOhmmjDQ';

async function testConnection() {
  try {
    console.log('\n📡 STEG 1: Skapar Turso-klient...');
    console.log('URL:', TURSO_URL);
    console.log('Token:', TURSO_TOKEN.substring(0, 20) + '...');
    
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    });
    
    console.log('✅ Klient skapad');
    
    console.log('\n🔍 STEG 2: Testar enkel query...');
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Query lyckades:', result.rows);
    
    console.log('\n📊 STEG 3: Kontrollerar tabeller...');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    console.log('✅ Tabeller i databasen:');
    tables.rows.forEach(row => {
      console.log('  -', row.name);
    });
    
    console.log('\n👥 STEG 4: Kontrollerar användare...');
    const users = await client.execute('SELECT id, email, role FROM users');
    console.log('✅ Användare i databasen:', users.rows.length);
    users.rows.forEach(user => {
      console.log('  -', user.email, '(', user.role, ')');
    });
    
    console.log('\n📦 STEG 5: Kontrollerar produkter...');
    const products = await client.execute('SELECT id, name, price FROM products');
    console.log('✅ Produkter i databasen:', products.rows.length);
    products.rows.forEach(product => {
      console.log('  -', product.name, '-', product.price, 'kr');
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALLA TESTER GODKÄNDA!');
    console.log('\n🎉 DATABASEN FUNGERAR PERFEKT!');
    console.log('\nAnslutningen är OK. Problemet måste vara i Next.js-applikationen.');
    
    return true;
    
  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ FEL VID DATABASANSLUTNING!');
    console.log('\nFelmeddelande:', error.message);
    console.log('\nFel-detaljer:', error);
    
    console.log('\n🔧 MÖJLIGA LÖSNINGAR:');
    console.log('1. Kontrollera att Turso-token är giltig');
    console.log('2. Kontrollera att URL är korrekt');
    console.log('3. Kontrollera nätverksanslutning');
    
    return false;
  }
}

testConnection().catch(console.error);
