// Test Login After Turso Fix
const testEmail = 'test@example.com';
const testPassword = 'testpassword123';

console.log('🧪 TESTAR LOGIN EFTER TURSO-FIX\n');
console.log('='.repeat(50));

async function testLogin() {
  console.log('\n🔐 Testar login...');
  console.log('Email:', testEmail);
  console.log('Lösenord:', testPassword);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    console.log('\nStatus:', response.status, response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ LOGIN LYCKADES!');
      console.log('Användare:', data.user.email);
      console.log('Roll:', data.user.role);
      console.log('Token:', data.token ? 'Genererad ✓' : 'Saknas ✗');
      return true;
    } else {
      console.log('\n❌ LOGIN MISSLYCKADES');
      console.log('Fel:', data.error);
      
      if (data.error === 'Databas ej tillgänglig. Kontakta support.') {
        console.log('\n⚠️  DATABAS-FEL KVARSTÅR!');
        console.log('\nMöjliga orsaker:');
        console.log('1. Servern laddade inte .env.local korrekt');
        console.log('2. Turso-klienten skapades inte');
        console.log('3. Miljövariabler är inte tillgängliga i API-route');
      }
      
      return false;
    }
  } catch (error) {
    console.log('\n❌ FEL:', error.message);
    return false;
  }
}

async function testRegister() {
  const newEmail = `test${Date.now()}@gmail.com`;
  
  console.log('\n📝 Testar registrering...');
  console.log('Email:', newEmail);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: newEmail,
        password: 'testpassword123',
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ REGISTRERING LYCKADES!');
      console.log('Användare:', data.user.email);
      console.log('Roll:', data.user.role);
      return true;
    } else {
      console.log('\n❌ REGISTRERING MISSLYCKADES');
      console.log('Fel:', data.error);
      return false;
    }
  } catch (error) {
    console.log('\n❌ FEL:', error.message);
    return false;
  }
}

async function runTests() {
  const loginResult = await testLogin();
  const registerResult = await testRegister();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTAT\n');
  console.log('Login:', loginResult ? '✅ OK' : '❌ MISSLYCKADES');
  console.log('Registrering:', registerResult ? '✅ OK' : '❌ MISSLYCKADES');
  
  if (loginResult && registerResult) {
    console.log('\n✅ ALLA TESTER GODKÄNDA!');
    console.log('\nDatabasen fungerar nu korrekt.');
    console.log('Inloggning och registrering fungerar.');
  } else {
    console.log('\n❌ VISSA TESTER MISSLYCKADES');
    console.log('\nKontrollera server-loggen för mer information.');
  }
}

runTests().catch(console.error);
