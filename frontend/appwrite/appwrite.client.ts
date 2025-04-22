import { Client, Storage } from "appwrite";

export async function appwriteGetImageUrl(storage_id: string) {
    const client = new Client();
    const storage = new Storage(client);

    client
        .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_API!)
        .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

    try {
        const filePreview = storage.getFileView(
            process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
            storage_id
        );
        return filePreview + "&mode=admin";
    } catch (error) {
        return { message: `Error getting image: ${error}` };
    }
}

