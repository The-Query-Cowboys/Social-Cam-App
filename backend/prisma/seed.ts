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
    {
      event_owner_id: 3,
      event_title: 'Watch TV',
      event_description: 'We get together and watch tv...',
      storage_id: '6802292a000533bf6663',
      album_id: 3,
      event_location: 'somewhere on earth',
      private: false,
    },
    {
      event_owner_id: 4,
      event_title: 'Play football',
      event_description: 'anyone fancy a kick about?',
      storage_id: '680229d400253806a380',
      album_id: 4,
      event_location: 'greenland',
      private: false,
    },
    {
      event_owner_id: 5,
      event_title: 'Do NC code together',
      event_description: 'Coding together, friends forever',
      storage_id: '680227ec0012b93bbb71',
      album_id: 5,
      event_location: 'macdonalds islands',
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
    {
      album_id: 2,
      storage_id: '680193830032129a85d8',
      type_id: 1,
    },
    {
      album_id: 1,
      storage_id: '6801938f000f210b02e8',
      type_id: 1,
    },
    {
      album_id: 2,
      storage_id: '680193b70001967d2da0',
      type_id: 1,
    },
    {
      album_id: 1,
      storage_id: '680193c4002c110d542d',
      type_id: 1,
    },
    {
      album_id: 2,
      storage_id: '680193ce00048f1b6de4',
      type_id: 1,
    },
    {
      album_id: 2,
      storage_id: '680193db0003922831a7',
      type_id: 1,
    },
    {
      album_id: 2,
      storage_id: '680193e80017967b90a8',
      type_id: 1,
    },
    {
      album_id: 5,
      storage_id: '680227f50006a3b8e0c8',
      type_id: 1,
    },
    {
      album_id: 5,
      storage_id: '680227fe000487e9c904',
      type_id: 1,
    },
    {
      album_id: 5,
      storage_id: '680228060023951e4b87',
      type_id: 1,
    },
    {
      album_id: 3,
      storage_id: '68022934002a5a5d6847',
      type_id: 1,
    },
    {
      album_id: 3,
      storage_id: '680229400010c1b8c47d',
      type_id: 1,
    },
    {
      album_id: 3,
      storage_id: '6802294a0039410bee4d',
      type_id: 1,
    },
    {
      album_id: 4,
      storage_id: '680229db0038a5b5f66f',
      type_id: 1,
    },
    {
      album_id: 4,
      storage_id: '680229e4000530d274f0',
      type_id: 1,
    },
    {
      album_id: 4,
      storage_id: '680229ec0028a1e4f91a',
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
    {
      album_name: 'tv',
    },
    {
      album_name: 'football',
    },
    {
      album_name: 'coding',
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
    {
      event_id: 5,
      user_id: 4,
      status_id: 2,
    },
    {
      event_id: 5,
      user_id: 5,
      status_id: 2,
    },
    {
      event_id: 5,
      user_id: 3,
      status_id: 3,
    },
    {
      event_id: 3,
      user_id: 3,
      status_id: 3,
    },
    {
      event_id: 3,
      user_id: 1,
      status_id: 2,
    },
    {
      event_id: 3,
      user_id: 2,
      status_id: 1,
    },
    {
      event_id: 4,
      user_id: 4,
      status_id: 2,
    },
    {
      event_id: 4,
      user_id: 5,
      status_id: 2,
    },
    {
      event_id: 4,
      user_id: 3,
      status_id: 3,
    },
    {
      event_id: 4,
      user_id: 1,
      status_id: 3,
    }
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