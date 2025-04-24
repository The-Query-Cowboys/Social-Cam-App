# Introduction

This backend provides APIs/functions/methods for the POSABLE app.

The API is hosted with render at https://social-cam-app-api.onrender.com/
The database is hosted at supabase
The cloud provider is appwrite

# Availables API

The following APIs is available

- GET /api/users
- GET /api/users/:user_id
- GET /api/users/clerk/:authId
- GET /api/users/username/:username
- GET /api/users/:user_id/events
- GET  /api/users/:userId/events/:eventId/status, GET
- POST /api/users
- PATCH /api/users/:user_id

- GET /api/albums/:event_id
- POST /api/albums
- PATCH /api/albums/:album_id
- DELETE /api/albums/:album_id

- GET /api/pictures/:picture_id
- GET /api/pictures/album/:album_id
- POST /api/pictures
- DELETE /api/pictures/:picture_id

- GET /api/token/:user_id

- GET /api/users/:userId/push-tokens
- POST /api/users/:userId/push-tokens
- DELETE /api/users/:userId/push-tokens

- GET /api/events
- POST /api/events
- PATCH /api/events/:eventId
- POST /api/events/:eventId/invite
- PATCH /api/events/:eventId/users/:userId/status
- DELETE /api/events/:eventId
- DELETE /api/events/:eventId/invite/:userId
- POST /api/events/:eventId/schedule-notifications
- GET /api/events/:eventId/users
- GET /api/events/:eventId



# Set up & Installation

The project is hosted at https://github.com/The-Query-Cowboys/Social-Cam-App

1. Clone to your local directory

```
git clone https://github.com/The-Query-Cowboys/Social-Cam-App.git
```

2. Create a .env file with the following parameters
- Database connection
```
DATABASE_URL=<DATABASE URL>
DIRECT_URL=<DATABASE DIRECT URL>
```
- Appwrite connection details
```
APPWRITE_API='https://cloud.appwrite.io/v1'
APPWRITE_PROJECT_ID=<PROJECT ID>
APPWRITE_BUCKET_ID=<BUCKET ID>
```
- Redis details
```
REDIS_HOST='fancy-lamb-16806.upstash.io'
REDIS_PASSWORD=<PASSWORD>
```

3. Install packages listed on package.json
```
npm install
```

# How to run the API

This can be started with
```
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
```

# How to set up the test environment

In order to set up a local test database:

First, create a **.env.test** file and add the relevant parameters.

Then, run the following commands to create and seed the database

```
npm run setup-test-db
npm run push:test
npm run seed:test
```

To kick off the tests, run

```
npm run test:e2e
```

## Issue

If you face any issue, please <a href="https://github.com/The-Query-Cowboys/Social-Cam-App/issues/new">raise an issue</a>.