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
            auth_id: "sia_2viJJur679lZKg4F66UiS1PEbSP",
            storage_id: "67f9386500316bb3c9e7",
            email: "randomguy23423@gmail.com"
        },
        {
            username: "RafalCzajka",
            nickname: "Raf",
            description: "Second test user",
            auth_id: "sia_2viJJur679lZKg4F66UiS1PEbSP",
            storage_id: "67f9382c0019dea7ac32",
            email: "rafal@gmail.com"
        },
        {
            username: "OscarFinn",
            nickname: "Oscar",
            description: "Third test user",
            auth_id: "sia_2viJJur679lZKg4F66UiS1PEbSP",
            storage_id: "67f938240002514c4ded",
            email: "oscar@gmail.com"
        },
        {
            username: "ValentinPenev",
            nickname: "Valentin",
            description: "Fourth test user",
            auth_id: "sia_2viJJur679lZKg4F66UiS1PEbSP",
            storage_id: "67f9380c003d7ff27ca2",
            email: "valentin@gmail.com"
        },
        {
            username: "HenryTso",
            nickname: "Henry",
            description: "Fifth test user",
            auth_id: "sia_2viJJur679lZKg4F66UiS1PEbSP",
            storage_id: "67f937f70039b87ada61",
            email: "henry@gmail.com"
        },
    ];

    //Insert test data into users table
    await prisma.user.createMany({ data: users });

    const events = [
        {
            event_owner_id: 2,
            event_title: "Northcoders Graduation",
            event_description: "Test event",
            storage_id: "67f937f70039b87ada61",
            album_id: 1,
            event_date: "2025-04-25T14:00:00Z",
            event_date_end: "2025-04-25T17:00:00Z",
            event_location: "Manchester",
            private: true,
        },
        {
            event_owner_id: 1,
            event_title: "Test event",
            event_description: "Test event",
            storage_id: "67f9380c003d7ff27ca2",
            album_id: 2,
            event_location: "somewhere",
            private: false,
        }
    ]

    await prisma.event.createMany({ data: events });

    const pictures = [
        {
            album_id: 1,
            storage_id: "67f9386500316bb3c9e7",
            type_id: 3,
        },
        {
            album_id: 1,
            storage_id: "67f9382c0019dea7ac32",
            type_id: 1,
        },
        {
            album_id: 2,
            storage_id: "67f938240002514c4ded",
            type_id: 1,
        }
    ]

    await prisma.picture.createMany({ data: pictures });

    const albums = [
        {
            album_name: "Northcoders graduation",
        },
        {
            album_name: "test album"
        }
    ]

    await prisma.album.createMany({ data: albums })

    const userEvents = [
        {
            event_id: 1,
            user_id: 2,
            status_id: 2
        },
        {
            event_id: 1,
            user_id: 1,
            status_id: 1,
        },
        {
            event_id: 1,
            user_id: 3,
            status_id: 2,
        },
        {
            event_id: 1,
            user_id: 4,
            status_id: 2,
        },
        {
            event_id: 1,
            user_id: 5,
            status_id: 2,
        },
        {
            event_id: 2,
            user_id: 3,
            status_id: 3,
        },
    ]

    await prisma.userEvent.createMany({ data: userEvents });

    const userStatuses = [
        { status: "invited" },
        { status: "attending" },
        { status: "attended" }
    ]

    await prisma.userStatus.createMany({ data: userStatuses });

    const pictureTypes = [
        { type: "event" },
        { type: "profile" },
        { type: "album" }
    ]

    await prisma.pictureType.createMany({ data: pictureTypes });

    const comments = [
        {
            event_id: 1,
            comment: "Looking forward to it",
            user_id: 2,
            comment_date: "2025-04-14T10:00:00Z",
            votes: 4
        },
        {
            event_id: 2,
            comment: "Test comment",
            user_id: 1,
            comment_date: "2025-04-14T10:00:00Z",
            votes: 4
        }
    ]

    await prisma.comment.createMany({ data: comments })
}