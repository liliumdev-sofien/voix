
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const approved = await prisma.recording.count({
    where: { qaStatus: 'APPROVED' }
  });
  const pending = await prisma.recording.count({
    where: { qaStatus: 'PENDING' }
  });
  console.log(`Approved: ${approved}`);
  console.log(`Pending: ${pending}`);
}

check()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
