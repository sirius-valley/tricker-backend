import { PrismaClient } from '@prisma/client';
import { Constants, Logger, NodeEnv } from '@utils';
import process from 'process';

const prisma = new PrismaClient();

async function runSeeding(): Promise<void> {
  Logger.debug('Seeding db with predefined Organizations');
  const org = await prisma.organization.upsert({
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

  Logger.debug('Seeding db with predefined Roles');
  await prisma.role.upsert({
    where: {
      name: 'Project Manager',
    },
    create: {
      name: 'Project Manager',
    },
    update: {},
  });

  await prisma.role.upsert({
    where: {
      name: 'Developer',
    },
    create: {
      name: 'Developer',
    },
    update: {},
  });

  const defAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;

  if (Constants.NODE_ENV === NodeEnv.DEV && defAdminEmail !== undefined && defAdminEmail !== '') {
    const user = await prisma.user.upsert({
      where: {
        email: process.env.DEFAULT_ADMIN_EMAIL!,
      },
      create: {
        email: process.env.DEFAULT_ADMIN_EMAIL!,
      },
      update: {},
    });

    await prisma.organizationAdministrator.create({
      data: {
        userId: user.id,
        organizationId: org.id,
      },
    });
  }
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
