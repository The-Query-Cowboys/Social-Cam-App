import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedTestDatabase() {
    //deletes everything under user
    await prisma.user.deleteMany();

    // Check if posts should be included in the query

    const user = {
        "username": 'kc325423',
        "nickname": 'Random guy',
        "description": "First random user test guy",
        "password": "dfgusdhgls",
        "avatar_url": "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1744362533~exp=1744366133~hmac=04e1b1307000082639a4fb0e03834e3ecda1683cf6c7e88bbd48f7e22ddf9072&w=740",
        "email": "randomguy23423@gmail.com"
    }


    // Pass 'user' object into query
    const createUser = await prisma.user.create({ data: user })
}

seedTestDatabase()