import { prisma } from "./prisma-client";

export async function seedTestDatabase() {
    //deletes everything under user
    await prisma.user.deleteMany();

    // If any of you guys want to change this test data feel free.

    const users = [
        {
            username: "kc325423",
            nickname: "Random guy",
            description: "First random user test guy",
            password: "dfgusdhgls",
            avatar_url: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1744362533~exp=1744366133~hmac=04e1b1307000082639a4fb0e03834e3ecda1683cf6c7e88bbd48f7e22ddf9072&w=740",
            email: "randomguy23423@gmail.com"
        },
        {
            username: "RafalCzajka",
            nickname: "Raf",
            description: "Second test user",
            password: "oneOfThePasswordsOfAllTime",
            avatar_url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
            email: "rafal@gmail.com"
        },
        {
            username: "OscarFinn",
            nickname: "Oscar",
            description: "Third test user",
            password: "oneOfThePasswordsOfAllTime",
            avatar_url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
            email: "oscar@gmail.com"
        },
        {
            username: "ValentinPenev",
            nickname: "Valentin",
            description: "Fourth test user",
            password: "oneOfThePasswordsOfAllTime",
            avatar_url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
            email: "valentin@gmail.com"
        },
        {
            username: "HenryTso",
            nickname: "Henry",
            description: "Fifth test user",
            password: "oneOfThePasswordsOfAllTime",
            avatar_url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
            email: "henry@gmail.com"
        },
    ];


    //Insert test data into users table
    await prisma.user.createMany({ data: users});
}