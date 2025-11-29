import 'dotenv/config';
import { db } from '../db';
import { sql } from 'drizzle-orm';

async function createConfirmedUser() {
  const email = 'user@example.com';
  const password = 'password123';

  try {
    console.log('Attempting to create confirmed user via SQL...');

    // Check if user exists
    // We need to use raw SQL because auth schema is not in our drizzle schema
    // Note: This requires the database connection to have permissions on auth schema (postgres role usually does)

    // Delete existing user if any to avoid conflict issues
    await db.execute(sql`DELETE FROM auth.users WHERE email = ${email}`);

    await db.execute(sql`
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        ${email},
        crypt(${password}, gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        '',
        '',
        ''
      );
    `);

    console.log(`User ${email} created/updated successfully with password ${password}`);

    // Also need to ensure an entry in public.users if you had one, but we don't have a public.users table in the schema description provided earlier?
    // The schema had wallets, categories, transactions. They link to auth.users.id.
    // So we are good.

  } catch (error) {
    console.error('Error creating user:', error);
  }
  process.exit(0);
}

createConfirmedUser();
