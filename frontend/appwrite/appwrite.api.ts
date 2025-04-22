import { Client, Storage, ID, Models } from "appwrite";
//import dotenv from "dotenv";
import * as FileSystem from "expo-file-system";

//dotenv.config();

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
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_API as string)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string);

  const storage = new Storage(client);

  return { client, storage };
};

/**
 * Save a file to Appwrite storage
 * @param file File object with buffer data
 * @returns Promise with file ID or error
 */

export const uploadImageToAppwrite = async (uri: string) => {
  //console.log("Starting upload with FormData");
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    //console.log(fileInfo, "file info");

    // Create a unique file ID
    const fileId = ID.unique();

    // Create FormData - the key here is how we append the file
    const formData = new FormData();
    formData.append("fileId", fileId);

    // This is the critical part - how the file is appended to FormData
    formData.append("file", {
      uri: uri,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    //console.log("FormData created, sending to Appwrite");

    // Direct fetch to Appwrite API
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_APPWRITE_API}/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID}/files`,
      {
        method: "POST",
        headers: {
          "X-Appwrite-Project": process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed with status:", response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    console.log(result, "<--- final appwrite upload");
    //console.log(result, "Upload result with actual content");
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
/**
 * Get file details from Appwrite storage
 * @param storage_id ID of the file to retrieve
 * @returns Promise with file details or error
 */
export function appwriteGetFile(
  storage_id: string
): Promise<Models.File | Error> {
  const { storage } = createClient();

  return storage
    .getFile(process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID as string, storage_id)
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
export async function appwriteGetImageUrl(
  storage_id: string
): Promise<string | { message: string }> {
  const { storage } = createClient();

  try {
    const filePreview = await storage.getFileView(
      process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID as string,
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
    .listFiles(process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID as string)
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
export function appwriteDeleteFile(
  storage_id: string
): Promise<object | Error> {
  const { storage } = createClient();

  return storage
    .deleteFile(
      process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID as string,
      storage_id
    )
    .then((result: object) => {
      return result;
    })
    .catch((error: Error) => {
      return error;
    });
}
