import { config } from 'dotenv';

const path = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
config({ path });

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();