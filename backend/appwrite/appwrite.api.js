//imports
import { Client, Storage, ID } from "appwrite";
import { InputFile } from "node-appwrite/file"

//create new instances of client and storage
const client = new Client();
const storage = new Storage(client);

client
    .setEndpoint(process.env.APPWRITE_API) // Your API Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
;

//****************************************************
//now, here is how to do the various add,list,deletes, etc
//this is asynchronous process! please bear that in mind when developing
//****************************************************


//ts-check
//to save a file
export async function appwriteSave(image) {

    const newImageId = ID.unique()

    const savePromise = storage.createFile(
        process.env.APPWRITE_BUCKET_ID,
        newImageId, //this thing generates a unique id that it stores it with!
        InputFile.fromBuffer(image.buffer,newImageId)  //this one is the input file
    )
    
    let newFileId = ""
    
    return savePromise.then(function (response) {
        newFileId = response.$id
        return newFileId
    }, function (error) {
        return error
    })
    
}

//get a url back
export function appwriteGetImageUrl(imageId) {
    const imageUrl = storage.getFileView(process.env.APPWRITE_BUCKET_ID, imageId)
    return imageUrl + "&mode=admin"
} 


//get a image back
export function appwriteGetFile(imageId) {
    const imageUrl = storage.getFile(process.env.APPWRITE_BUCKET_ID, imageId)
    return imageUrl
} 

//list all files
export function appwriteListFiles() {
    const fileList = storage.listFiles(process.env.APPWRITE_BUCKET_ID)
    return fileList
}

//delete a file
export function appwriteDeleteFile(imageId) {
    const deletedFile = storage.deleteFile(process.env.APPWRITE_BUCKET_ID, imageId)
    return deletedFile
}