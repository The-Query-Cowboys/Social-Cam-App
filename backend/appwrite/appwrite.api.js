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
//this is asynchronous process! please bearthat in mind when developing
//****************************************************

//to save a file
export function appwriteSave(file) {

    const uniqueId = ID.unique()

    const savePromise = storage.createFile(
        process.env.APPWRITE_BUCKET_ID,
        uniqueId, //this thing generates a unique id that it stores it with!
        InputFile.fromBuffer(file.buffer, uniqueId) //this one is the input file
    )

    let newFile = ""

    return savePromise.then(function (response) {
        const newFileId = response.$id
        return newFileId

    }, function (error) {
        return error
    })
}

//to get whole file back

export function appwriteGetFile(storage_id) {
    return storage.getFile(process.env.APPWRITE_BUCKET_ID, storage_id)
        .then((file) => {
            return file
        })
        .catch((error) => {
            return error
        })
}

//to view file url! this is probably what we want

export function appwriteGetImageUrl(storage_id) {
    return storage.getFileView(process.env.APPWRITE_BUCKET_ID, storage_id) + "&mode=admin"
}

//to list files in a bucket

export function appwriteListFiles() {
    return storage.listFiles(process.env.APPWRITE_BUCKET_ID)
}

//to delete file

export function appwriteDeleteFile(storage_id) {
    return storage.deleteFile(process.env.APPWRITE_BUCKET_ID, storage_id)
}

