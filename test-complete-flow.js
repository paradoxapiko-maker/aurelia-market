// Test Complete Authentication Flow
const testEmail = `test${Date.now()}@gmail.com`;
const testPassword = 'testpassword123';

console.log('🧪 TESTAR KOMPLETT AUTENTISERINGSFLÖDE\n');
console.log('='.repeat(50));

async function testCompleteFlow() {
  // Step 1: Register
  console.log('\n📝 STEG 1: Registrera ny användare');
  console.log('Email:', testEmail);
  console.log('Lösenord:', testPassword);
  
  try {
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const registerData = await registerResponse.json();
    
    if (!registerResponse.ok) {
      console.log('❌ Registrering misslyckades:', registerData.error);
      return false;
    }
    
    console.log('✅ Registrering lyckades!');
    console.log('   Användare:', registerData.user.email);
    console.log('   Roll:', registerData.user.role);
    console.log('   Token:', registerData.token ? 'Genererad ✓' : 'Saknas ✗');
    
  } catch (error) {
    console.log('❌ Fel vid registrering:', error.message);
    return false;
  }
  
  // Step 2: Login with same credentials
  console.log('\n🔐 STEG 2: Logga in med samma användare');
  
  try {
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ Inloggning misslyckades:', loginData.error);
      return false;
    }
    
    console.log('✅ Inloggning lyckades!');
    console.log('   Användare:', loginData.user.email);
    console.log('   Roll:', loginData.user.role);
    console.log('   Token:', loginData.token ? 'Genererad ✓' : 'Saknas ✗');
    
  } catch (error) {
    console.log('❌ Fel vid inloggning:', error.message);
    return false;
  }
  
  // Step 3: Test wrong password
  console.log('\n🚫 STEG 3: Testa felaktigt lösenord');
  
  try {
    const wrongResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongpassword',
      }),
    });

    const wrongData = await wrongResponse.json();
    
    if (wrongResponse.ok) {
      console.log('❌ Felaktigt lösenord accepterades (BUG!)');
      return false;
    }
    
    console.log('✅ Felaktigt lösenord avvisades korrekt');
    console.log('   Felmeddelande:', wrongData.error);
    
  } catch (error) {
    console.log('❌ Fel vid test:', error.message);
    return false;
  }
  
  return true;
}

testCompleteFlow().then(success => {
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ ALLA TESTER GODKÄNDA!');
    console.log('\n🎉 DATABASEN FUNGERAR PERFEKT!');
    console.log('\nAutentiseringssystemet är nu fullt funktionellt:');
    console.log('- ✅ Registrering fungerar');
    console.log('- ✅ Inloggning fungerar');
    console.log('- ✅ Säkerhet fungerar');
    console.log('- ✅ Databas fungerar');
    console.log('\nDu kan nu gå vidare till nästa steg!');
  } else {
    console.log('❌ VISSA TESTER MISSLYCKADES');
    console.log('\nKontrollera server-loggen för mer information.');
  }
}).catch(console.error);
