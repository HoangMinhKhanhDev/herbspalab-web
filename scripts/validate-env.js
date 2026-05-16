#!/usr/bin/env node
/**
 * Environment configuration validation script
 * Run this before deployment to ensure all required env vars are set correctly
 * NOTE: On Hostinger, env vars are injected directly into process.env via hPanel
 */

const REQUIRED_VARS = [
  { name: 'NODE_ENV', expected: 'production', description: 'Production mode flag' },
  { name: 'JWT_SECRET', minLength: 48, description: 'JWT signing secret (min 48 chars)' },
  { name: 'DATABASE_URL', pattern: /^file:\/\//, description: 'SQLite database path with file:// prefix' },
  { name: 'CORS_ORIGIN', description: 'Comma-separated CORS whitelist' },
  { name: 'FRONTEND_URL', pattern: /^https?:\/\//, description: 'Frontend URL with http:// or https://' },
  { name: 'DOMAIN', pattern: /^https?:\/\//, description: 'Domain with http:// or https://' },
];

const OPTIONAL_VARS = [
  { name: 'UPLOADS_DIR', description: 'Absolute path for persistent uploads' },
  { name: 'STRIPE_SECRET_KEY', pattern: /^sk_/, description: 'Stripe secret key' },
  { name: 'STRIPE_WEBHOOK_SECRET', pattern: /^whsec_/, description: 'Stripe webhook secret' },
  { name: 'EMAIL_USER', description: 'SMTP email username' },
  { name: 'EMAIL_PASS', description: 'SMTP email password' },
];

const FORBIDDEN_VARS = ['PORT']; // Passenger manages port

console.log('🔍 Validating environment configuration...\n');
console.log('ℹ️  Checking process.env (Hostinger injects env vars directly)\n');

let passed = 0;
let failed = 0;
let warnings = 0;

// Check required vars
console.log('📋 Checking required environment variables:');
for (const varConfig of REQUIRED_VARS) {
  const value = process.env[varConfig.name];
  
  if (!value) {
    console.log(`  ❌ ${varConfig.name}: NOT SET`);
    console.log(`     ${varConfig.description}`);
    failed++;
  } else if (varConfig.expected && value !== varConfig.expected) {
    console.log(`  ❌ ${varConfig.name}: Expected "${varConfig.expected}", got "${value}"`);
    failed++;
  } else if (varConfig.minLength && value.length < varConfig.minLength) {
    console.log(`  ❌ ${varConfig.name}: Too short (${value.length} chars, min ${varConfig.minLength})`);
    failed++;
  } else if (varConfig.pattern && !varConfig.pattern.test(value)) {
    console.log(`  ❌ ${varConfig.name}: Invalid format`);
    console.log(`     ${varConfig.description}`);
    failed++;
  } else {
    const displayValue = varConfig.name.includes('SECRET') || varConfig.name.includes('PASS') 
      ? '***' 
      : (varConfig.name === 'DATABASE_URL' ? value.replace(/\/home\/[^/]+/, '/home/USER') : value);
    console.log(`  ✅ ${varConfig.name}: ${displayValue}`);
    passed++;
  }
}

// Check optional vars
console.log('\n📋 Checking optional environment variables:');
for (const varConfig of OPTIONAL_VARS) {
  const value = process.env[varConfig.name];
  
  if (!value) {
    console.log(`  ℹ️  ${varConfig.name}: not set (optional)`);
  } else if (varConfig.pattern && !varConfig.pattern.test(value)) {
    console.log(`  ⚠️  ${varConfig.name}: Invalid format (${varConfig.description})`);
    warnings++;
  } else {
    const displayValue = varConfig.name.includes('SECRET') || varConfig.name.includes('PASS') 
      ? '***' 
      : value;
    console.log(`  ✅ ${varConfig.name}: ${displayValue}`);
  }
}

// Check forbidden vars
console.log('\n📋 Checking forbidden environment variables:');
for (const varName of FORBIDDEN_VARS) {
  if (process.env[varName]) {
    console.log(`  ❌ ${varName}: SET (should NOT be set - Passenger manages this)`);
    failed++;
  } else {
    console.log(`  ✅ ${varName}: not set (correct)`);
  }
}

// Validate DATABASE_URL path if set
if (process.env.DATABASE_URL) {
  console.log('\n💾 Validating DATABASE_URL path:');
  const dbPath = process.env.DATABASE_URL.replace('file:', '');
  if (!dbPath.startsWith('/home/')) {
    console.log(`  ⚠️  DATABASE_URL should be an absolute path starting with /home/`);
    warnings++;
  } else {
    console.log(`  ✅ DATABASE_URL is an absolute path`);
  }
}

// Validate UPLOADS_DIR if set
if (process.env.UPLOADS_DIR) {
  console.log('\n📁 Validating UPLOADS_DIR path:');
  const uploadsPath = process.env.UPLOADS_DIR;
  if (!uploadsPath.startsWith('/home/')) {
    console.log(`  ⚠️  UPLOADS_DIR should be an absolute path starting with /home/`);
    warnings++;
  } else {
    console.log(`  ✅ UPLOADS_DIR is an absolute path`);
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n❌ Environment validation FAILED');
  console.log('Please fix the issues above before deploying.');
  console.log('\nReference: See HOSTINGER_ENV_TEMPLATE.md for configuration guide.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Environment validation PASSED with warnings');
  console.log('Review warnings above to ensure everything is configured correctly.');
  process.exit(0);
} else {
  console.log('\n✅ Environment validation PASSED');
  console.log('Your environment is ready for deployment!');
  process.exit(0);
}
