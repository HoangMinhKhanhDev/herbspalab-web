import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@herbspalab.com';
  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123@', salt);

    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      }
    });
    console.log('✅ Admin account created: admin@herbspalab.com / Admin123@');
  } else {
    console.log('ℹ️ Admin account already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
