// Test Authentication Against Running Server
const testEmail = `test${Date.now()}@gmail.com`;
const testPassword = 'testpassword123';

console.log('🧪 TESTAR AUTENTISERING MOT SERVERN\n');
console.log('='.repeat(50));
console.log('Server: http://localhost:3001');
console.log('Email:', testEmail);
console.log('Lösenord:', testPassword);
console.log('='.repeat(50));

async function testAuth() {
  // Test 1: Register
  console.log('\n📝 TEST 1: Registrering');
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
    
    console.log('Status:', registerResponse.status);
    console.log('Response:', JSON.stringify(registerData, null, 2));
    
    if (!registerResponse.ok) {
      console.log('❌ Registrering misslyckades');
      console.log('Fel:', registerData.error);
      return false;
    }
    
    console.log('✅ Registrering lyckades!');
    console.log('Användare:', registerData.user.email);
    console.log('Roll:', registerData.user.role);
    
  } catch (error) {
    console.log('❌ Fel vid registrering:', error.message);
    return false;
  }
  
  // Test 2: Login
  console.log('\n🔐 TEST 2: Inloggning');
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
    
    console.log('Status:', loginResponse.status);
    console.log('Response:', JSON.stringify(loginData, null, 2));
    
    if (!loginResponse.ok) {
      console.log('❌ Inloggning misslyckades');
      console.log('Fel:', loginData.error);
      return false;
    }
    
    console.log('✅ Inloggning lyckades!');
    console.log('Användare:', loginData.user.email);
    console.log('Roll:', loginData.user.role);
    
  } catch (error) {
    console.log('❌ Fel vid inloggning:', error.message);
    return false;
  }
  
  return true;
}

testAuth().then(success => {
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ ALLA TESTER GODKÄNDA!');
    console.log('\n🎉 AUTENTISERING FUNGERAR PERFEKT!');
  } else {
    console.log('❌ VISSA TESTER MISSLYCKADES');
    console.log('\nKontrollera server-loggen för mer information.');
  }
}).catch(console.error);
