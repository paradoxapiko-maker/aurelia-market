// Test Turso with Web Client
import { createClient } from '@libsql/client/web';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

console.log('🔍 TESTAR TURSO MED WEB-KLIENT\n');
console.log('='.repeat(50));

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

console.log('\n📋 KONFIGURATION:');
console.log('URL:', tursoUrl ? '✅ Satt' : '❌ Saknas');
console.log('Token:', tursoToken ? '✅ Satt' : '❌ Saknas');

if (!tursoUrl || !tursoToken) {
  console.log('\n❌ Miljövariabler saknas!');
  process.exit(1);
}

console.log('\n🔌 SKAPAR KLIENT...');

let client;
try {
  client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });
  console.log('✅ Klient skapad');
} catch (error) {
  console.log('❌ Fel:', error.message);
  process.exit(1);
}

console.log('\n🧪 TESTAR ANSLUTNING...');

try {
  const result = await client.execute('SELECT 1 as test');
  console.log('✅ Anslutning fungerar!');
  console.log('   Resultat:', result.rows[0]);
  
  // Check users table
  const usersCheck = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
  );
  
  if (usersCheck.rows.length > 0) {
    console.log('\n✅ Users-tabell finns');
    
    const count = await client.execute('SELECT COUNT(*) as count FROM users');
    console.log('   Antal användare:', count.rows[0].count);
    
    const users = await client.execute('SELECT email, role FROM users LIMIT 3');
    if (users.rows.length > 0) {
      console.log('\n   Användare:');
      users.rows.forEach(u => console.log(`   - ${u.email} (${u.role})`));
    }
  } else {
    console.log('\n⚠️  Users-tabell finns INTE');
    console.log('   Kör: node setup-turso-final.js');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ TURSO FUNGERAR PERFEKT!');
  console.log('\nDatabasen är tillgänglig och fungerar.');
  
} catch (error) {
  console.log('\n❌ ANSLUTNINGSFEL:', error.message);
  console.log('\nFullständigt fel:', error);
  console.log('\n' + '='.repeat(50));
  console.log('❌ KUNDE INTE ANSLUTA TILL TURSO');
  console.log('\nKontrollera:');
  console.log('1. URL är korrekt');
  console.log('2. Token är giltig');
  console.log('3. Databasen finns på Turso');
}
