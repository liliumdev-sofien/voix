import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'ahmed@voix.com';
  const passwordHash = await bcrypt.hash('ahmed68459845', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user ${admin.email} upserted`);

  // Create Speaker profile for Admin
  const speaker = await prisma.speaker.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      displayName: 'Admin Speaker',
      gender: 'MALE', 
      dialect: 'TUNIS_CAPITAL',
    },
  });
  
  console.log(`Speaker profile for admin created: ${speaker.displayName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
