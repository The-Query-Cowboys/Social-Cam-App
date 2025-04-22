import axios from "axios";
import { CreateEventDto, UpdateEventDto } from "./types";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "https://social-cam-app-api.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsers = async () => {
  const response = await api.get("users");
  return response.data;
};

export const getUserById = async (userId: number) => {
  const response = await api.get(`users/${userId}`);
  return response.data;
};

export const getUserByAuthId = async (authId: string) => {
  const response = await api.get(`users/clerk/${authId}`);
  return response.data;
};

export const getUserEvents = async (userId: number, status?: number[]) => {
  let url = `users/${userId}/events`;
  if (status && status.length > 0) {
    url += `?status=${status.join(",")}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const createUser = async (
  username: string,
  email: string,
  authId: string
) => {
  const response = await api.post("users", {
    username,
    email,
    auth_id: authId,
  });
  return response.data;
};

export const updateUser = async (userId: number, userData: FormData) => {
  const response = await api.patch(`users/${userId}`, userData, {});
  return response.data;
};

// TOKEN API CALLS
export const getToken = async (userId: number) => {
  const response = await api.get(`token/${userId}`);
  return response.data;
};

// EVENT API CALLS
export const getEvents = async () => {
  const response = await api.get("events");
  return response.data;
};

export const createEvent = async (eventData: CreateEventDto) => {
  const response = await api.post("events", eventData);
  return response.data;
};

export const updateEvent = async (
  eventId: number,
  eventData: UpdateEventDto
) => {
  const response = await api.patch(`events/${eventId}`, eventData);
  return response.data;
};

export const inviteToEvent = async (eventId: number, userId: number) => {
  const response = await api.post(`events/${eventId}/invite`, { userId });
  return response.data;
};

export const updateUserEventStatus = async (
  eventId: number,
  userId: number,
  statusId: number
) => {
  const response = await api.patch(`events/${eventId}/users/${userId}/status`, {
    statusId,
  });
  return response.data;
};

export const scheduleEventNotifications = async (eventId: number) => {
  const response = await api.post(`events/${eventId}/schedule-notifications`);
  return response.data;
};

// ALBUM API CALLS
export const getAlbumByEventId = async (eventId: string) => {
  const response = await api.get(`albums/${eventId}`);
  return response.data;
};

export const createAlbum = async (albumName: string) => {
  const response = await api.post("albums", { album_name: albumName });
  return response.data;
};

export const addPicturesToAlbum = async (
  albumId: number,
  pictureIds: number[]
) => {
  const response = await api.patch(`albums/${albumId}?action=add`, {
    pictures: pictureIds.map((id) => ({ picture_id: id })),
  });
  return response.data;
};

export const removePicturesFromAlbum = async (
  albumId: number,
  pictureIds: number[]
) => {
  const response = await api.patch(`albums/${albumId}?action=remove`, {
    pictures: pictureIds.map((id) => ({ picture_id: id })),
  });
  return response.data;
};

// PICTURE API CALLS
export const getPictureById = async (pictureId: number) => {
  const response = await api.get(`pictures/${pictureId}`);
  return response.data;
};

export const getAlbumPictures = async (albumId: number) => {
  const response = await api.get(`pictures/album/${albumId}`);
  return response.data;
};

export const createPicture = async (storageId: string, albumId?: number) => {
  const response = await api.post("pictures", {
    album_id: albumId,
    storage_id: storageId,
  });
  return response.data;
};

export const registerPushToken = async (userId: number, token: string) => {
  try {
    const response = await api.post(`users/${userId}/push-tokens`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering push token:", error);
    throw error;
  }
};

export const getUserPushTokens = async (userId: number) => {
  try {
    const response = await api.get(`users/${userId}/push-tokens`);
    return response.data;
  } catch (error) {
    console.error("Error fetching push tokens:", error);
    throw error;
  }
};

export const deletePushToken = async (userId: number, token: string) => {
  try {
    const response = await api.delete(`users/${userId}/push-tokens`, {
      data: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting push token:", error);
    throw error;
  }
};
