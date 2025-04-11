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

    const events = [
        {
            event_owner_id: 2,
            event_title: "Northcoders Graduation",
            event_description: "Test event",
            event_image_url: "https://www.stepex.co/wp-content/uploads/2022/04/stepex-northcoders-1.jpg",
            album_id: 1,
            event_date: "2025-04-25T14:00:00Z",
            event_location: "Manchester",
            private: true,
        },
        {
            event_owner_id: 1,
            event_title: "Test event",
            event_description: "Test event",
            event_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png",
            album_id: 2,
            event_location: "somewhere",
            private: false,
        }
    ]

    await prisma.event.createMany({data: events});

    const pictures = [
        {
            album_id: 1,
            picture_url: "https://instagram.fltn3-1.fna.fbcdn.net/v/t51.2885-19/432484829_1108995397036025_6081673761989307313_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=instagram.fltn3-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QGei5HtLVtKhyeDSx1WH-SozMcGWGkEqm-v_uvxwWNZSpdZljPPv4-TKeWb8nvwB3w&_nc_ohc=wFn6gLY_vzcQ7kNvwFk_FDZ&_nc_gid=oknbkIhNbxiherhzoyVbdA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfHJW5fvDW40li7rL4kNi7J8mmNfn-OxeAAMdhM0aqN47A&oe=67FF2029&_nc_sid=8b3546",
            type_id: 3,
        }
    ]
}