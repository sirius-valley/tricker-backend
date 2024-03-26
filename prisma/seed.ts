import { PrismaClient } from '@prisma/client';
import { Logger } from '@utils';

const prisma = new PrismaClient();

async function runSeeding(): Promise<void> {
  Logger.debug('Seeding db with predefined Organizations');
  await prisma.organization.upsert({
    where: {
      name: 'SIRIUS',
    },
    create: {
      name: 'SIRIUS',
    },
    update: {},
  });

  Logger.debug('Seeding db with predefined Issue Providers');
  await prisma.issueProvider.upsert({
    where: {
      name: 'LINEAR',
    },
    create: {
      name: 'LINEAR',
    },
    update: {},
  });
}

runSeeding()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
