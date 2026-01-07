// DEBUG: Exakt vad händer när du loggar in via webbläsaren
console.log('🔍 DEBUG: LOGIN-PROBLEM\n');
console.log('='.repeat(70));
console.log('Detta test simulerar EXAKT vad som händer när du:');
console.log('1. Öppnar http://localhost:3001/login');
console.log('2. Fyller i email och lösenord');
console.log('3. Klickar på "Logga In"');
console.log('='.repeat(70));

const testCases = [
  {
    name: 'Admin (ngabulokana@gmail.com)',
    email: 'ngabulokana@gmail.com',
    password: 'a-z, A-Z, 0-9'
  },
  {
    name: 'Testanvändare (test@example.com)',
    email: 'test@example.com',
    password: 'test123456'
  }
];

async function debugLogin(testCase) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TEST: ${testCase.name}`);
  console.log('='.repeat(70));
  console.log('Email:', testCase.email);
  console.log('Lösenord:', testCase.password);
  
  try {
    console.log('\n📤 STEG 1: Skickar POST-request till /api/auth/login');
    console.log('URL:', 'http://localhost:3001/api/auth/login');
    console.log('Method:', 'POST');
    console.log('Headers:', { 'Content-Type': 'application/json' });
    console.log('Body:', JSON.stringify({ email: testCase.email, password: testCase.password }, null, 2));
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
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
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n📥 STEG 2: Mottog svar från servern');
    console.log('Status:', response.status, response.statusText);
    console.log('Tid:', duration, 'ms');
    console.log('Headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    const data = await response.json();
    
    console.log('\n📋 STEG 3: Parsade JSON-svar');
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.log('\n❌ INLOGGNING MISSLYCKADES');
      console.log('Felmeddelande:', data.error);
      console.log('\n🔍 MÖJLIGA ORSAKER:');
      console.log('1. Fel email eller lösenord');
      console.log('2. Användaren finns inte i databasen');
      console.log('3. Lösenordet är fel hashat');
      console.log('4. Databas-anslutning fungerar inte');
      return false;
    }
    
    console.log('\n✅ STEG 4: Inloggning lyckades!');
    console.log('Användare:', data.user.email);
    console.log('Roll:', data.user.role);
    console.log('User ID:', data.user.id);
    console.log('Token (första 50 tecken):', data.token.substring(0, 50) + '...');
    
    console.log('\n💾 STEG 5: Sparar i localStorage (simulerat)');
    console.log('localStorage.setItem("token", data.token)');
    console.log('localStorage.setItem("user", JSON.stringify(data.user))');
    
    console.log('\n🔄 STEG 6: Omdirigering (simulerat)');
    console.log('router.push("/products")');
    
    console.log('\n✅ KOMPLETT FLÖDE FUNGERAR!');
    console.log('Om detta fungerar här men inte i webbläsaren, kan problemet vara:');
    console.log('1. Browser cache - Tryck Ctrl+Shift+R för att rensa');
    console.log('2. Service Worker - Kontrollera i DevTools → Application');
    console.log('3. Browser extensions - Testa i inkognito-läge');
    console.log('4. CORS-problem - Kontrollera i DevTools → Console');
    
    return true;
  } catch (error) {
    console.log('\n❌ FEL UPPSTOD');
    console.log('Felmeddelande:', error.message);
    console.log('Stack trace:', error.stack);
    
    console.log('\n🔍 MÖJLIGA ORSAKER:');
    console.log('1. Servern körs inte på port 3001');
    console.log('2. Nätverksfel');
    console.log('3. CORS-blockering');
    console.log('4. Timeout');
    
    return false;
  }
}

async function runDebug() {
  console.log('\n🚀 STARTAR DEBUG-TESTER...\n');
  
  for (const testCase of testCases) {
    await debugLogin(testCase);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Vänta 1 sekund mellan tester
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('🏁 DEBUG KLAR');
  console.log('='.repeat(70));
  console.log('\n📝 NÄSTA STEG:');
  console.log('1. Om testerna ovan fungerar, öppna http://localhost:3001/login i webbläsaren');
  console.log('2. Öppna DevTools (F12)');
  console.log('3. Gå till Console-fliken');
  console.log('4. Gå till Network-fliken');
  console.log('5. Försök logga in');
  console.log('6. Kontrollera vad som händer i Console och Network');
  console.log('7. Skicka mig exakt felmeddelande du ser');
}

runDebug().catch(console.error);
