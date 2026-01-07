/**
 * Test script to verify login works and diagnose browser cache issues
 * Run: node test-login-browser-cache.js
 */

const testLogin = async () => {
  console.log('='.repeat(60));
  console.log('BROWSER CACHE DIAGNOSTIC TEST');
  console.log('='.repeat(60));
  console.log('');

  const testCases = [
    {
      name: 'Admin Login',
      email: 'ngabulokana@gmail.com',
      password: 'admin123456'
    },
    {
      name: 'Test User Login',
      email: 'test@example.com',
      password: 'test123456'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   Email: ${testCase.email}`);
    console.log(`   Password: ${testCase.password}`);
    console.log('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          email: testCase.email,
          password: testCase.password
        })
      });

      const data = await response.json();

      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('   ✅ SUCCESS - Login works!');
        console.log(`   User ID: ${data.user.id}`);
        console.log(`   Email: ${data.user.email}`);
        console.log(`   Role: ${data.user.role}`);
        console.log(`   Token: ${data.token.substring(0, 20)}...`);
      } else {
        console.log('   ❌ FAILED');
        console.log(`   Error: ${data.error}`);
      }
    } catch (error) {
      console.log('   ❌ ERROR');
      console.log(`   ${error.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('DIAGNOSIS');
  console.log('='.repeat(60));
  console.log('');
  console.log('If tests show SUCCESS but browser shows "Databas ej tillgänglig":');
  console.log('');
  console.log('✅ Server is working correctly');
  console.log('✅ Database connection is working');
  console.log('✅ Login endpoint is working');
  console.log('❌ Browser is showing CACHED error message');
  console.log('');
  console.log('SOLUTION:');
  console.log('1. Hard refresh browser: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)');
  console.log('2. Clear browser cache completely');
  console.log('3. Open in Incognito/Private mode');
  console.log('4. Close and reopen browser completely');
  console.log('');
  console.log('If tests show FAILED:');
  console.log('1. Check if server is running on port 3001');
  console.log('2. Restart server: npm run dev');
  console.log('3. Check .env.local has correct Turso credentials');
  console.log('');
};

testLogin().catch(console.error);
