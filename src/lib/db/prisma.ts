import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/nextjs-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: dev ? ['query', 'error', 'warn'] : ['error'],
  });

if (dev) globalForPrisma.prisma = prisma;

