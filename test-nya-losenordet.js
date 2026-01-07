// Test med nya admin-lösenordet
console.log('🔐 TESTAR NYA ADMIN-LÖSENORDET\n');

async function testNewPassword() {
  const email = 'ngabulokana@gmail.com';
  const password = 'admin123456'; // NYTT LÖSENORD
  
  console.log('Email:', email);
  console.log('Lösenord:', password);
  console.log('\nSkickar request...\n');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ ADMIN-INLOGGNING FUNGERAR!');
      console.log('Roll:', data.user.role);
      console.log('Token:', data.token.substring(0, 50) + '...');
    } else {
      console.log('\n❌ Inloggning misslyckades:', data.error);
    }
  } catch (error) {
    console.log('\n❌ Fel:', error.message);
  }
}

testNewPassword();
