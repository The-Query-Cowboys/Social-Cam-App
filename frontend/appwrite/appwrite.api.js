import { Client, Storage, ID, Models } from "appwrite";
import { InputFile } from "node-appwrite/file";
import * as dotenv from "dotenv";

dotenv.config();

// Define interfaces for better type safety
interface FileUpload {
  buffer: Buffer;
  filename?: string;
  mimetype?: string;
}

// Create a singleton client to avoid recreating the client for each function call
const createClient = (): { client: Client; storage: Storage } => {
  const client = new Client();
  client
      .setEndpoint(process.env.APPWRITE_API as string)
      .setProject(process.env.APPWRITE_PROJECT_ID as string);

  const storage = new Storage(client);

  return { client, storage };
};

/**
 * Save a file to Appwrite storage
 * @param file File object with buffer data
 * @returns Promise with file ID or error
 */
export function appwriteSave(file: FileUpload): Promise<string | Error> {
  const { storage } = createClient();
  const uniqueId = ID.unique();

  const savePromise = storage.createFile(
      process.env.APPWRITE_BUCKET_ID as string,
      uniqueId,
      InputFile.fromBuffer(file.buffer, uniqueId)
  );

  return savePromise.then(
      (response: Models.File) => {
        return response.$id;
      },
      (error: Error) => {
        return error;
      }
  );
}

/**
 * Get file details from Appwrite storage
 * @param storage_id ID of the file to retrieve
 * @returns Promise with file details or error
 */
export function appwriteGetFile(storage_id: string): Promise<Models.File | Error> {
  const { storage } = createClient();

  return storage
      .getFile(process.env.APPWRITE_BUCKET_ID as string, storage_id)
      .then((file: Models.File) => {
        return file;
      })
      .catch((error: Error) => {
        return error;
      });
}

/**
 * Get image URL for viewing from Appwrite storage
 * @param storage_id ID of the image file
 * @returns Promise with URL string or error message
 */
export async function appwriteGetImageUrl(storage_id: string): Promise<string | { message: string }> {
  const { storage } = createClient();

  try {
    const filePreview = await storage.getFileView(
        process.env.APPWRITE_BUCKET_ID as string,
        storage_id
    );

    if (filePreview !== undefined) {
      return filePreview + "&mode=admin";
    } else {
      return { message: "No image is found" };
    }
  } catch (error) {
    return { message: `Error getting image: ${error}` };
  }
}

/**
 * List all files in the specified bucket
 * @returns Promise with files list or error
 */
export function appwriteListFiles(): Promise<Models.FileList | Error> {
  const { storage } = createClient();

  return storage
      .listFiles(process.env.APPWRITE_BUCKET_ID as string)
      .then((files: Models.FileList) => {
        return files;
      })
      .catch((error: Error) => {
        return error;
      });
}

/**
 * Delete a file from Appwrite storage
 * @param storage_id ID of the file to delete
 * @returns Promise with deletion confirmation or error
 */
export function appwriteDeleteFile(storage_id: string): Promise<object | Error> {
  const { storage } = createClient();

  return storage
      .deleteFile(process.env.APPWRITE_BUCKET_ID as string, storage_id)
      .then((result: object) => {
        return result;
      })
      .catch((error: Error) => {
        return error;
      });
}