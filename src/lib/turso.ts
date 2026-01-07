import { createClient } from '@libsql/client/web';

// Turso database configuration
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

// Create Turso client with error handling
let tursoClient: ReturnType<typeof createClient> | null = null;

try {
  if (tursoUrl && tursoAuthToken) {
    tursoClient = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });
    
    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[TURSO] ✅ Client created successfully');
      console.log('[TURSO] URL:', tursoUrl);
    }
  } else {
    console.error('[TURSO] ❌ Missing configuration');
    console.error('[TURSO] URL:', tursoUrl ? 'Set' : 'Not set');
    console.error('[TURSO] Token:', tursoAuthToken ? 'Set' : 'Not set');
  }
} catch (error) {
  console.error('[TURSO] ❌ Failed to create client:', error);
  tursoClient = null;
}

export const turso = tursoClient;

// Helper function to check if database is available
export function isDatabaseAvailable(): boolean {
  return turso !== null;
}
