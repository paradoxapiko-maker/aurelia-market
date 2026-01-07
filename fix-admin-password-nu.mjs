// FIX: Uppdatera admin-lösenord OMEDELBART
import { createClient } from '@libsql/client/web';
import bcrypt from 'bcryptjs';

console.log('🔧 FIXAR ADMIN-LÖSENORD\n');
console.log('='.repeat(70));

const TURSO_URL = 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njc3NjUzMDksImlkIjoiYTU1OTcwMzctMzQ1Zi00ODQ2LTgyMTYtNWJkNzEyYmRkMmRlIiwicmlkIjoiMDMxOTcwYzYtMzllNS00MzYyLWIwMDItM2M4OGYzNDNjOGZkIn0.JuHL0gDgcdH0Yg1euuPpFBURYGc8Q2i5FvnAJdGtYcy41ErdYtbkRkMGrxbGLtUWMTWklX8Fee6uLRXOhmmjDQ';

const adminEmail = 'ngabulokana@gmail.com';
const adminPassword = 'admin123456'; // NYTT ENKELT LÖSENORD

async function fixAdminPassword() {
  try {
    console.log('1️⃣ Ansluter till Turso...');
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    });
    console.log('✅ Ansluten');
    
    console.log('\n2️⃣ Kontrollerar om admin finns...');
    const checkResult = await client.execute({
      sql: 'SELECT id, email, role FROM users WHERE email = ?',
      args: [adminEmail]
    });
    
    if (checkResult.rows.length === 0) {
      console.log('❌ Admin finns inte! Skapar admin...');
      
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      
      await client.execute({
        sql: `INSERT INTO users (email, password_hash, role, created_at, updated_at) 
              VALUES (?, ?, 'admin', datetime('now'), datetime('now'))`,
        args: [adminEmail, passwordHash]
      });
      
      console.log('✅ Admin skapad!');
    } else {
      console.log('✅ Admin finns:', checkResult.rows[0].email);
      
      console.log('\n3️⃣ Hashar nytt lösenord...');
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      console.log('✅ Lösenord hashat');
      
      console.log('\n4️⃣ Uppdaterar admin-lösenord...');
      await client.execute({
        sql: 'UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE email = ?',
        args: [passwordHash, adminEmail]
      });
      console.log('✅ Lösenord uppdaterat');
    }
    
    console.log('\n5️⃣ Verifierar att det fungerar...');
    const verifyResult = await client.execute({
      sql: 'SELECT id, email, password_hash, role FROM users WHERE email = ?',
      args: [adminEmail]
    });
    
    if (verifyResult.rows.length > 0) {
      const user = verifyResult.rows[0];
      const isValid = await bcrypt.compare(adminPassword, user.password_hash);
      
      if (isValid) {
        console.log('✅ Lösenord verifierat - fungerar!');
      } else {
        console.log('❌ Lösenord verifiering misslyckades');
        return false;
      }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ ADMIN-LÖSENORD FIXAT!');
    console.log('='.repeat(70));
    console.log('\n📋 ADMIN-INLOGGNING:');
    console.log('Email:', adminEmail);
    console.log('Lösenord:', adminPassword);
    console.log('\n🌐 Testa på:');
    console.log('http://localhost:3001/login');
    console.log('http://localhost:3001/admin/login');
    
    return true;
  } catch (error) {
    console.log('\n❌ FEL:', error.message);
    console.log(error);
    return false;
  }
}

fixAdminPassword().catch(console.error);
