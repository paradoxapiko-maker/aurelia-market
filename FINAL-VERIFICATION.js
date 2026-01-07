/**
 * FINAL VERIFICATION SCRIPT
 * Verifies all systems are working before deployment
 * Run: node FINAL-VERIFICATION.js
 */

const testAll = async () => {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 FINAL SYSTEM VERIFICATION');
  console.log('='.repeat(70) + '\n');

  let allPassed = true;

  // Test 1: Admin Login
  console.log('📋 Test 1: Admin Login via API');
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ngabulokana@gmail.com',
        password: 'admin123456'
      })
    });

    const data = await response.json();

    if (response.ok && data.user && data.user.role === 'admin') {
      console.log('   ✅ PASS - Admin login works');
      console.log(`   User: ${data.user.email}`);
      console.log(`   Role: ${data.user.role}`);
    } else {
      console.log('   ❌ FAIL - Admin login failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown'}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ FAIL - Connection error');
    console.log(`   ${error.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 2: Test User Login
  console.log('📋 Test 2: Test User Login via API');
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123456'
      })
    });

    const data = await response.json();

    if (response.ok && data.user && data.user.role === 'customer') {
      console.log('   ✅ PASS - Test user login works');
      console.log(`   User: ${data.user.email}`);
      console.log(`   Role: ${data.user.role}`);
    } else {
      console.log('   ❌ FAIL - Test user login failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown'}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ FAIL - Connection error');
    console.log(`   ${error.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 3: Products API
  console.log('📋 Test 3: Products API');
  try {
    const response = await fetch('http://localhost:3001/api/products');
    const data = await response.json();

    if (response.ok && data.products && Array.isArray(data.products) && data.products.length > 0) {
      console.log('   ✅ PASS - Products API works');
      console.log(`   Products found: ${data.products.length}`);
      console.log(`   Sample: ${data.products[0].name} - ${data.products[0].price} kr`);
    } else {
      console.log('   ❌ FAIL - Products API failed');
      console.log(`   Status: ${response.status}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ FAIL - Connection error');
    console.log(`   ${error.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 4: Registration
  console.log('📋 Test 4: Registration API');
  const testEmail = `test${Date.now()}@example.com`;
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'test123456'
      })
    });

    const data = await response.json();

    if (response.ok && data.user) {
      console.log('   ✅ PASS - Registration works');
      console.log(`   New user: ${data.user.email}`);
    } else {
      console.log('   ❌ FAIL - Registration failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown'}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ FAIL - Connection error');
    console.log(`   ${error.message}`);
    allPassed = false;
  }

  console.log('');
  console.log('='.repeat(70));
  
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED - SYSTEM READY FOR DEPLOYMENT!');
    console.log('='.repeat(70));
    console.log('');
    console.log('Next steps:');
    console.log('1. Clear browser cache (Ctrl+Shift+R)');
    console.log('2. Test login in browser at http://localhost:3001/login');
    console.log('3. Push to GitHub: git push origin main');
    console.log('4. Deploy to Vercel');
    console.log('');
    console.log('Admin credentials:');
    console.log('  Email: ngabulokana@gmail.com');
    console.log('  Password: admin123456');
    console.log('');
  } else {
    console.log('❌ SOME TESTS FAILED - CHECK ERRORS ABOVE');
    console.log('='.repeat(70));
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check if server is running: npm run dev');
    console.log('2. Check server logs for errors');
    console.log('3. Verify .env.local has correct values');
    console.log('4. Restart server if needed');
    console.log('');
  }
};

testAll().catch(console.error);
