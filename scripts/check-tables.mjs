#!/usr/bin/env node

/**
 * Check if Document Vault tables exist
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Checking Document Vault tables...\n');

// Test documents table
const { data: docs, error: docsError } = await supabase
  .from('documents')
  .select('*')
  .limit(1);

if (docsError) {
  console.log('❌ documents table:', docsError.message);
} else {
  console.log('✅ documents table exists');
}

// Test config table
const { data: config, error: configError } = await supabase
  .from('document_vault_config')
  .select('*')
  .limit(1);

if (configError) {
  console.log('❌ document_vault_config table:', configError.message);
} else {
  console.log('✅ document_vault_config table exists');
}

console.log('\n');
