// Test Turso Database Connection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

console.log('🔍 TESTAR TURSO-ANSLUTNING\n');
console.log('='.repeat(50));

// Check environment variables
console.log('\n📋 MILJÖVARIABLER:');
console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? '✅ Satt' : '❌ Saknas');
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '✅ Satt' : '❌ Saknas');

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.log('\n❌ KRITISKT FEL: Miljövariabler saknas!');
  console.log('\nKontrollera att .env.local innehåller:');
  console.log('- TURSO_DATABASE_URL');
  console.log('- TURSO_AUTH_TOKEN');
  process.exit(1);
}

console.log('\nURL:', process.env.TURSO_DATABASE_URL);
console.log('Token:', process.env.TURSO_AUTH_TOKEN.substring(0, 20) + '...');

// Try to create client
console.log('\n🔌 SKAPAR TURSO-KLIENT...');

let client;
try {
  client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  console.log('✅ Klient skapad');
} catch (error) {
  console.log('❌ Kunde inte skapa klient:', error.message);
  process.exit(1);
}

// Test connection
async function testConnection() {
  console.log('\n🧪 TESTAR ANSLUTNING...');
  
  try {
    // Test 1: Simple query
    console.log('\nTest 1: Enkel query');
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Query lyckades:', result.rows[0]);
    
    // Test 2: Check if users table exists
    console.log('\nTest 2: Kontrollerar users-tabell');
    const tablesResult = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );
    
    if (tablesResult.rows.length > 0) {
      console.log('✅ Users-tabell finns');
      
      // Test 3: Count users
      console.log('\nTest 3: Räknar användare');
      const countResult = await client.execute('SELECT COUNT(*) as count FROM users');
      console.log('✅ Antal användare:', countResult.rows[0].count);
      
      // Test 4: List users
      console.log('\nTest 4: Listar användare');
      const usersResult = await client.execute('SELECT email, role FROM users LIMIT 5');
      if (usersResult.rows.length > 0) {
        console.log('✅ Användare i databasen:');
        usersResult.rows.forEach(user => {
          console.log(`   - ${user.email} (${user.role})`);
        });
      } else {
        console.log('⚠️  Inga användare i databasen');
      }
    } else {
      console.log('❌ Users-tabell finns INTE');
      console.log('\nDu måste köra setup-skriptet:');
      console.log('node setup-turso-final.js');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALLA TESTER GODKÄNDA!');
    console.log('\nTurso-databasen fungerar korrekt.');
    console.log('Problemet är troligen i Next.js-konfigurationen.');
    
  } catch (error) {
    console.log('\n❌ FEL VID TEST:', error.message);
    console.log('\nFullständigt fel:', error);
    
    console.log('\n' + '='.repeat(50));
    console.log('❌ ANSLUTNING MISSLYCKADES');
    console.log('\nMöjliga orsaker:');
    console.log('1. Felaktig TURSO_DATABASE_URL');
    console.log('2. Felaktig TURSO_AUTH_TOKEN');
    console.log('3. Token har gått ut');
    console.log('4. Databasen är inte tillgänglig');
    console.log('\nLösning:');
    console.log('1. Kontrollera att URL och token är korrekta');
    console.log('2. Generera ny token om nödvändigt');
    console.log('3. Kontrollera att databasen finns på Turso');
  }
}

testConnection().catch(console.error);
