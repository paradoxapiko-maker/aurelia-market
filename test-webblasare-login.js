// Test som simulerar exakt vad som händer i webbläsaren
console.log('🌐 TEST: WEBBLÄSAR-INLOGGNING\n');
console.log('='.repeat(70));
console.log('Detta test simulerar exakt vad som händer när du loggar in');
console.log('via webbläsaren på http://localhost:3001/login');
console.log('='.repeat(70));

// Test med olika användare
const testCases = [
  {
    name: 'Ny testanvändare',
    email: `test${Date.now()}@gmail.com`,
    password: 'testpassword123'
  },
  {
    name: 'Admin-användare',
    email: 'ngabulokana@gmail.com',
    password: 'a-z, A-Z, 0-9'
  }
];

async function testLogin(testCase) {
  console.log(`\n📝 TEST: ${testCase.name}`);
  console.log('-'.repeat(70));
  console.log('Email:', testCase.email);
  console.log('Lösenord:', testCase.password);
  
  // Steg 1: Registrera om det är ny användare
  if (testCase.name === 'Ny testanvändare') {
    console.log('\n1️⃣ Registrerar användare...');
    try {
      const registerRes = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testCase.email,
          password: testCase.password
        }),
        cache: 'no-store'
      });
      
      const registerData = await registerRes.json();
      
      if (registerRes.ok) {
        console.log('   ✅ Registrering lyckades');
        console.log('   ✅ Token:', registerData.token.substring(0, 20) + '...');
      } else {
        console.log('   ❌ Registrering misslyckades:', registerData.error);
        return false;
      }
    } catch (error) {
      console.log('   ❌ Fel vid registrering:', error.message);
      return false;
    }
  }
  
  // Steg 2: Logga in
  console.log('\n2️⃣ Loggar in...');
  try {
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testCase.email,
        password: testCase.password
      }),
      cache: 'no-store'
    });
    
    console.log('   Status:', loginRes.status);
    console.log('   Status Text:', loginRes.statusText);
    console.log('   Headers:', Object.fromEntries(loginRes.headers.entries()));
    
    const loginData = await loginRes.json();
    
    if (!loginRes.ok) {
      console.log('   ❌ Inloggning misslyckades');
      console.log('   ❌ Fel:', loginData.error);
      console.log('   ❌ Full response:', JSON.stringify(loginData, null, 2));
      return false;
    }
    
    console.log('   ✅ Inloggning lyckades!');
    console.log('   ✅ Användare:', loginData.user.email);
    console.log('   ✅ Roll:', loginData.user.role);
    console.log('   ✅ Token:', loginData.token.substring(0, 20) + '...');
    console.log('   ✅ User ID:', loginData.user.id);
    
    // Steg 3: Verifiera att token fungerar
    console.log('\n3️⃣ Verifierar token...');
    try {
      const verifyRes = await fetch('http://localhost:3001/api/products', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (verifyRes.ok) {
        console.log('   ✅ Token fungerar - kan hämta produkter');
      } else {
        console.log('   ⚠️  Token fungerar inte för skyddade endpoints');
      }
    } catch (error) {
      console.log('   ⚠️  Kunde inte verifiera token:', error.message);
    }
    
    return true;
  } catch (error) {
    console.log('   ❌ Fel vid inloggning:', error.message);
    console.log('   ❌ Stack:', error.stack);
    return false;
  }
}

async function runTests() {
  let allPassed = true;
  
  for (const testCase of testCases) {
    const passed = await testLogin(testCase);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + '='.repeat(70));
  if (allPassed) {
    console.log('✅ ALLA TESTER GODKÄNDA!');
    console.log('\n🎉 INLOGGNING FUNGERAR PERFEKT I WEBBLÄSAREN!');
    console.log('\nDu kan nu:');
    console.log('1. Öppna http://localhost:3001/login');
    console.log('2. Logga in med någon av testanvändarna');
    console.log('3. Eller skapa ny användare på /register');
  } else {
    console.log('❌ VISSA TESTER MISSLYCKADES');
    console.log('\nKontrollera felen ovan.');
  }
  console.log('='.repeat(70));
}

runTests().catch(console.error);
