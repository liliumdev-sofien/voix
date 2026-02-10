
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixAdmin() {
  const email = 'ahmed@voix.com';
  const password = 'ahmed68459845';
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    console.log('User exists. Resetting password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword, role: 'ADMIN' },
    });
    console.log('Password reset successfully.');
  } else {
    console.log('User does not exist. Creating...');
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        speaker: {
            create: {
                displayName: 'Ahmed Admin',
                gender: 'MALE',
            }
        }
      },
    });
    console.log('Admin user created successfully.');
  }
}

fixAdmin()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
