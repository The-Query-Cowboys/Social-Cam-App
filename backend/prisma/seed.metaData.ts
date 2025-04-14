import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedUserStatusDatabase() {
    // deletes everything
    await prisma.$executeRaw`TRUNCATE TABLE "UserStatus" RESTART IDENTITY CASCADE;`;
    await prisma.userStatus.deleteMany();

    // Data
    const userStatuses = [
        {"status": 'invited'},
        {"status": 'attending'},
        {"status": 'attended'}
    ]

   // Perform the insert
    userStatuses.forEach(async (row) => {
        await prisma.userStatus.create({ data: row })
    })
}

export async function seedPictureTypeDatabase() {
    // deletes everything
    await prisma.$executeRaw`TRUNCATE TABLE "PictureType" RESTART IDENTITY CASCADE;`;
    await prisma.pictureType.deleteMany();

    // Data
    const pictureTypes = [
        {"type": 'profile'},
        {"type": 'event'},
        {"type": 'album'}
    ]

   // Perform the insert    
   pictureTypes.forEach(async (row) => {
        await prisma.pictureType.create({ data: row })
    })
}

seedUserStatusDatabase()
seedPictureTypeDatabase()