import { createClient } from '@libsql/client/web';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoAuthToken) {
  console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

async function runMigration() {
  console.log('🚀 Running customer info migration...\n');

  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'database', 'migrations', '003_add_customer_info.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split by semicolon and filter empty statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        await client.execute(statement);
        console.log(`✅ Statement ${i + 1} executed successfully\n`);
      } catch (error: any) {
        // Ignore "duplicate column" errors as they mean the column already exists
        if (error.message && error.message.includes('duplicate column')) {
          console.log(`⚠️  Column already exists, skipping...\n`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('\nNew fields added to users table:');
    console.log('  - full_name');
    console.log('  - phone');
    console.log('  - address_line1');
    console.log('  - address_line2');
    console.log('  - city');
    console.log('  - postal_code');
    console.log('  - country');
    console.log('\nNew fields added to orders table:');
    console.log('  - shipping_name');
    console.log('  - shipping_email');
    console.log('  - shipping_phone');
    console.log('  - shipping_address_line1');
    console.log('  - shipping_address_line2');
    console.log('  - shipping_city');
    console.log('  - shipping_postal_code');
    console.log('  - shipping_country');
    console.log('  - shipping_carrier');
    console.log('  - shipping_cost');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
