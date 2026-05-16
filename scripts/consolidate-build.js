import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('📦 Consolidating build outputs...');

// Create build directory
const buildDir = path.join(rootDir, 'build');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir, { recursive: true });

// Copy frontend/dist to build/
const frontendDist = path.join(rootDir, 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  console.log('📁 Copying frontend/dist to build/');
  copyRecursiveSync(frontendDist, buildDir);
} else {
  console.error('❌ frontend/dist not found!');
  process.exit(1);
}

// Copy backend/dist to build/server
const backendDist = path.join(rootDir, 'backend', 'dist');
if (fs.existsSync(backendDist)) {
  const serverDir = path.join(buildDir, 'server');
  console.log('📁 Copying backend/dist to build/server');
  copyRecursiveSync(backendDist, serverDir);
} else {
  console.error('❌ backend/dist not found!');
  process.exit(1);
}

// Copy backend/package.json to build/server
const backendPackageJson = path.join(rootDir, 'backend', 'package.json');
const serverPackageJson = path.join(buildDir, 'server', 'package.json');
if (fs.existsSync(backendPackageJson)) {
  console.log('📁 Copying backend/package.json to build/server');
  fs.copyFileSync(backendPackageJson, serverPackageJson);
}

// Copy backend/prisma to build/server
const backendPrisma = path.join(rootDir, 'backend', 'prisma');
const serverPrisma = path.join(buildDir, 'server', 'prisma');
if (fs.existsSync(backendPrisma)) {
  console.log('📁 Copying backend/prisma to build/server');
  copyRecursiveSync(backendPrisma, serverPrisma);
}

// Copy backend/uploads (create .gitkeep if needed)
const backendUploads = path.join(rootDir, 'backend', 'uploads');
const serverUploads = path.join(buildDir, 'server', 'uploads');
fs.mkdirSync(serverUploads, { recursive: true });
if (fs.existsSync(backendUploads)) {
  const gitkeep = path.join(backendUploads, '.gitkeep');
  if (fs.existsSync(gitkeep)) {
    fs.copyFileSync(gitkeep, path.join(serverUploads, '.gitkeep'));
  }
}

// Create root package.json for Hostinger Node.js (entry point)
const rootPackageJson = {
  name: 'herbspalab',
  version: '1.0.0',
  private: true,
  type: 'module',
  scripts: {
    start: 'node server/index.js'
  },
  engines: {
    node: '>=20'
  }
};
fs.writeFileSync(
  path.join(buildDir, 'package.json'),
  JSON.stringify(rootPackageJson, null, 2)
);
console.log('📄 Created root package.json for Hostinger Node.js');

console.log('✅ Build consolidation complete!');
console.log(`📦 Build output: ${buildDir}`);
console.log('');
console.log('⚠️  Hostinger config required:');
console.log('   - App type: Node.js (NOT Create React App)');
console.log('   - Entry point: server/index.js');
console.log('   - NODE_ENV=production in environment variables');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
