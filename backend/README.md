# installation

```
npm i -g @nestjs/cli
npm install
```

# create project 
** only if first time prisma project This has already be done and can be skipped for this **

```nest new prisma```

# create config files, only if first time prisma project 

** This has already be done and can be skipped for this **

```npx prisma init```

This creates a folder "prisma" and a schema.prisma file

please update prisma file with connection **this is done for this project**

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

# possible issues

if error below

PrismaClientInitializationError: error: Environment variable not found: DATABASE_URL.
  -->  schema.prisma:9
   | 
 8 |   provider     = "postgresql"
 9 |   url          = env("DATABASE_URL")

run

```npx prisma generate```

# please create a .env file under "BACKEND", add these 2 linesTS2307.

```
//Database connection details
DATABASE_URL="postgresql://postgres.qldazwkczfyhhcxwwxly:BabaMghtdfs@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.qldazwkczfyhhcxwwxly:BabaMghtdfs@aws-0-eu-west-2.pooler.supabase.com:5432/postgres"


//appwrite connection details
<<<<<<< HEAD
APIEndpoint='https://cloud.appwrite.io/v1'
projectId='67f8f680002b6a18bfc3'
bucketId='67f8f69b003be8ed659d'

=======
APPWRITE_API='https://cloud.appwrite.io/v1'
APPWRITE_PROJECT_ID='67f8f680002b6a18bfc3'
APPWRITE_BUCKET_ID='67f8f69b003be8ed659d'
>>>>>>> main
```

For local testing db also create ``.env.test``:
```
DATABASE_URL="postgresql://[username]:[password]@localhost:5432/social_cam_test?schema=public"
DIRECT_URL="postgresql://[username]:[password]@localhost:5432/social_cam_test"
```

# where is what

prisma/schema.prisma -- contains the database connector, and table schemas



prisma/seed.ts -- this one has the whole data stuff

cloud -- folder will have all the cloud stuff to appwrite

src/app.service.ts and app.controller.ts -- these ones will be for the API

# how to run

this will connect to the db and create tables

** we might need to delete the data before redeploy **
```npx migrate reset```

```npx prisma migrate dev --name init```

This will run the seeding into metadata

```npx ts-node prisma/seed.metaData.ts```

to seed test data

```npm run seed```


# useful links

Our supabase database link is

https://supabase.com/dashboard/project/qldazwkczfyhhcxwwxly/editor

Our appwrite (CLOUD) link is

https://cloud.appwrite.io/console/project-kc2423342123/storage

# tutorials
this was written by Oscar/Rafal, covers seeding, prisma and stuff

https://docs.google.com/document/d/1gDW7A42dLiJrkxSDA8zimhaLvciTx3NLtOvG4Mo4puk/edit?pli=1&tab=t.0

this written by kawai, covers appwrite example, **written in node, please change to TS**

```
//imports and stuff
//need to run npm i appwrite node-appwrite
import { Client, Storage, ID } from "appwrite";
import { InputFile } from "node-appwrite/file"

//This is a free tier app write account.  The cloud can be access via the link below
//https://cloud.appwrite.io/console/project-67f8f680002b6a18bfc3/storage
//It has project id and a bucket id, pictures have their own id

//useremail: randomguy1234@gmail.com
//password: randomguy1234.

const APIEndpoint = 'https://cloud.appwrite.io/v1'
const projectId = '67f8f680002b6a18bfc3'
const bucketId = '67f8f69b003be8ed659d'

//create new instances of client and storage
const client = new Client();
const storage = new Storage(client);

client
    .setEndpoint(APIEndpoint) // Your API Endpoint
    .setProject(projectId) // Your project ID
;

//****************************************************
//now, here is how to do the various add,list,deletes, etc
//this is asynchronous process! please bearthat in mind when developing
//****************************************************



//to save a file
const savePromise = storage.createFile(
    bucketId,
    ID.unique(), //this thing generates a unique id that it stores it with!
    InputFile.fromPath("./images/marker.png", "marker.png" ) //this one is the input file
)

let newFile = ""

savePromise.then(function (response) {
    console.log(response, "<< file saved")
    const newFileId = response.$id
    console.log(newFileId, "<<newFile id")
}, function (error) {
    console.log(error), "<< failed to save"
})



//to get whole file back

const randomTestPicture = "67f78edf0037471b9f60"
const promise = storage.getFile(bucketId, randomTestPicture);

promise.then(function (response) {
    console.log(response); // Success
}, function (error) {
    console.log(error); // Failure
});

//to view file url! this is probably what we want
const result = storage.getFileView('bucketId', randomTestPicture)

console.log(result, "<<image url")


//to list files in a bucket

const files = await storage.listFiles(
    bucketId
    //,[] quesries (optional)
    //, "<SEARCH>" search (optional)
)

console.log(files, "<<< files")

//to delete file

const deleteFileResult = await storage.deleteFile(
    bucketId,
    "67f8d8b8003aafb59bf5"
)

console.log(deleteFileResult, "<<deleted file")

```