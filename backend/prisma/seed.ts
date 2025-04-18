import { PrismaService } from '../src/prisma.service';

const prisma = new PrismaService();

export async function seedTestDatabase() {
  const users = [
    {
      username: 'kc325423',
      nickname: 'Random guy',
      description: 'First random user test guy',
      auth_id: 'sia_2viJJur679lZKg4F66UiS1PEbSP',
      storage_id: '67f9386500316bb3c9e7',
      email: 'randomguy23423@gmail.com',
    },
    {
      username: 'RafalCzajka',
      nickname: 'Raf',
      description: 'Second test user',
      auth_id: 'sia_2viJJur679lZKg4F66UiS1PEbSP',
      storage_id: '67f9382c0019dea7ac32',
      email: 'rafal@gmail.com',
    },
    {
      username: 'OscarFinn',
      nickname: 'Oscar',
      description: 'Third test user',
      auth_id: 'sia_2viJJur679lZKg4F66UiS1PEbSP',
      storage_id: '67f938240002514c4ded',
      email: 'oscar@gmail.com',
    },
    {
      username: 'ValentinPenev',
      nickname: 'Valentin',
      description: 'Fourth test user',
      auth_id: 'sia_2viJJur679lZKg4F66UiS1PEbSP',
      storage_id: '67f9380c003d7ff27ca2',
      email: 'valentin@gmail.com',
    },
    {
      username: 'HenryTso',
      nickname: 'Henry',
      description: 'Fifth test user',
      auth_id: 'sia_2viJJur679lZKg4F66UiS1PEbSP',
      storage_id: '67f937f70039b87ada61',
      email: 'henry@gmail.com',
    },
  ];
  const events = [
    {
      event_owner_id: 2,
      event_title: 'Northcoders Graduation',
      event_description: 'Test event',
      storage_id: '67f937f70039b87ada61',
      album_id: 1,
      event_date: '2025-04-25T14:00:00Z',
      event_date_end: '2025-04-25T17:00:00Z',
      event_location: 'Manchester',
      private: true,
    },
    {
      event_owner_id: 1,
      event_title: 'Test event',
      event_description: 'Test event',
      storage_id: '67f9380c003d7ff27ca2',
      album_id: 2,
      event_location: 'somewhere',
      private: false,
    },
  ];
  const pictures = [
    {
      album_id: 1,
      storage_id: '67f9386500316bb3c9e7',
      type_id: 3,
    },
    {
      album_id: 1,
      storage_id: '67f9382c0019dea7ac32',
      type_id: 1,
    },
    {
      album_id: 2,
      storage_id: '67f938240002514c4ded',
      type_id: 1,
    },
  ];
  const albums = [
    {
      album_name: 'Northcoders graduation',
    },
    {
      album_name: 'test album',
    },
  ];
  const userEvents = [
    {
      event_id: 1,
      user_id: 2,
      status_id: 2,
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
  ];
  const userStatuses = [
    { status: 'invited' },
    { status: 'attending' },
    { status: 'attended' },
  ];
  const pictureTypes = [
    { type: 'event' },
    { type: 'profile' },
    { type: 'album' },
  ];

  const comments = [
    {
      event_id: 1,
      comment: 'Looking forward to it',
      user_id: 2,
      comment_date: '2025-04-14T10:00:00Z',
      votes: 4,
    },
    {
      event_id: 2,
      comment: 'Test comment',
      user_id: 1,
      comment_date: '2025-04-14T10:00:00Z',
      votes: 4,
    },
  ];
  await prisma.$transaction([
    //deletes everything under user
    prisma.$executeRawUnsafe(`TRUNCATE TABLE
    "UserEvent",
    "UserPushToken",
    "User",
    "Event",
    "Picture",
    "Album",
    "UserStatus",
    "PictureType",
    "Comment"
    RESTART IDENTITY CASCADE;
  `),
    prisma.user.createMany({ data: users }),
    prisma.event.createMany({ data: events }),
    prisma.picture.createMany({ data: pictures }),
    prisma.album.createMany({ data: albums }),
    prisma.userEvent.createMany({ data: userEvents }),
    prisma.userStatus.createMany({ data: userStatuses }),
    prisma.pictureType.createMany({ data: pictureTypes }),
    prisma.comment.createMany({ data: comments }),
  ]);
}
