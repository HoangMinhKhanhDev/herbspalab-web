#!/usr/bin/env node
/**
 * Deployment verification script for Hostinger
 * Run after deployment to verify:
 * - Environment variables are set correctly
 * - Database is accessible
 * - API is responding
 * - Uploads directory exists
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'JWT_SECRET',
  'DATABASE_URL',
  'CORS_ORIGIN',
  'FRONTEND_URL',
  'DOMAIN',
];

const OPTIONAL_ENV_VARS = [
  'UPLOADS_DIR',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
];

console.log('🔍 Verifying Hostinger deployment...\n');

let passed = 0;
let failed = 0;
let warnings = 0;

// Check environment variables
console.log('📋 Checking environment variables...');
for (const envVar of REQUIRED_ENV_VARS) {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ✅ ${envVar}: ${envVar === 'JWT_SECRET' || envVar === 'DATABASE_URL' ? '***' : value}`);
    passed++;
  } else {
    console.log(`  ❌ ${envVar}: NOT SET (required)`);
    failed++;
  }
}

for (const envVar of OPTIONAL_ENV_VARS) {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ⚠️  ${envVar}: ${envVar.includes('SECRET') || envVar.includes('PASS') ? '***' : value}`);
  } else {
    console.log(`  ℹ️  ${envVar}: not set (optional)`);
  }
}

// Check database
console.log('\n💾 Checking database...');
try {
  const dbPath = process.env.DATABASE_URL;
  if (dbPath && dbPath.startsWith('file:')) {
    const filePath = dbPath.replace('file:', '');
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`  ✅ Database file exists: ${filePath}`);
      console.log(`     Size: ${(stats.size / 1024).toFixed(2)} KB`);
      passed++;
    } else {
      console.log(`  ❌ Database file NOT found: ${filePath}`);
      console.log(`     Run: npx prisma db push`);
      failed++;
    }
  } else {
    console.log(`  ⚠️  DATABASE_URL is not a file path: ${dbPath}`);
    warnings++;
  }
} catch (err) {
  console.log(`  ❌ Error checking database: ${err.message}`);
  failed++;
}

// Check uploads directory
console.log('\n📁 Checking uploads directory...');
try {
  const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
  if (fs.existsSync(uploadsDir)) {
    console.log(`  ✅ Uploads directory exists: ${uploadsDir}`);
    const files = fs.readdirSync(uploadsDir);
    console.log(`     Files: ${files.length}`);
    passed++;
  } else {
    console.log(`  ⚠️  Uploads directory NOT found: ${uploadsDir}`);
    console.log(`     Will be created on first upload`);
    warnings++;
  }
} catch (err) {
  console.log(`  ⚠️  Error checking uploads: ${err.message}`);
  warnings++;
}

// Check API health (if running)
console.log('\n🌐 Checking API health...');
try {
  const response = execSync('curl -s http://localhost:5000/api/health || echo "API not running"', { encoding: 'utf8', timeout: 5000 });
  if (response.includes('status":"ok"')) {
    console.log(`  ✅ API is responding`);
    passed++;
  } else {
    console.log(`  ⚠️  API not running or not responding`);
    console.log(`     ${response.trim()}`);
    warnings++;
  }
} catch (err) {
  console.log(`  ⚠️  Could not check API: ${err.message}`);
  warnings++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n❌ Deployment verification FAILED');
  console.log('Please fix the issues above and re-run this script.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Deployment verification PASSED with warnings');
  console.log('Review warnings above to ensure everything is configured correctly.');
  process.exit(0);
} else {
  console.log('\n✅ Deployment verification PASSED');
  console.log('Your application is ready to use!');
  process.exit(0);
}
