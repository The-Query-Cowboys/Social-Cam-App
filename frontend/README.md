# 1. Installation
- go to your frontend directory in your IDE and run `npm install`

# 2. Create necessary keys, ids and files

## 2.1 Create appwrite account and create your project
- go to https://cloud.appwrite.io/ and create an account
- create an organization, ideally on the free tier
- enter your organization and click `+ Create project`
- when picking region make sure you pick the one geographically closest to you
- on the left hand side you should have a menu that has `Storage` option
- click it and then click `+ Create bucket` 
- the bucket will give you a bucket ID

## 2.2 Create a `.env` file and use the details from your appwrite account
- at the home page of your project you will have project ID in the format `650b41400013c442c622` at the top of the screen next to its name
- copy that ID and in the frontend folder of the cloned project create a `.env` file
- then use the project ID you just copied and make an entry `EXPO_PUBLIC_APPWRITE_PROJECT_ID='your project ID'`
- make another entry `EXPO_PUBLIC_APPWRITE_BUCKET_ID='your bucket ID'`. You can find your bucket ID inside of the bucket you created prior
- after that add `EXPO_PUBLIC_APPWRITE_API='https://cloud.appwrite.io/v1'`

## 2.3 Create a clerk account
- go to https://clerk.com and create an account
- pick the methods with which you want to log in to your newly created app
- once you've created the application go to `Configure` and scroll down to `API keys`
- there you will find a field `Public key`, copy it and make a new entry in your frontend `.env` file
- enter `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your public key`

# 3. Run the app either through `Expo Go` or your browser
For a better experience we recommend using the `Expo Go` phone app because the project was designed with it in mind

- go to the frontend directory with your IDE and run ` npx expo start --clear` 
and click on the link to view it through your browser or use your `Expo Go` app to start it
- *you can run the app either through the guest account or register one of your own