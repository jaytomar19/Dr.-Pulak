import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@drpulakvatsya.com';
  const password = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!';
  const name = process.env.ADMIN_SEED_NAME || 'Dr. Pulak Vatsya';

  console.log(`Seeding database with admin user: ${email}`);

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const adminUser = await prisma.admin_users.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password_hash: hashedPassword,
        name,
        role: 'doctor',
      },
    });

    console.log(`Successfully created/updated admin user: ${adminUser.email} (Role: ${adminUser.role})`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
