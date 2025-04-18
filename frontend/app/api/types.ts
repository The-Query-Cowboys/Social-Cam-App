// User-related interfaces
export interface User {
  user_id: number;
  username: string;
  nickname: string;
  description: string;
  auth_id: string;
  storage_id: string;
  email: string;
}

export interface UserPushToken {
  token_id: number;
  user_id: number;
  token: string;
}

// Event-related interfaces
export interface Event {
  event_id: number;
  event_owner_id: number;
  event_title: string;
  event_description: string;
  storage_id: string;
  album_id: number;
  event_date: string;
  event_date_end: string;
  album_delay: number;
  event_location: string;
  private: boolean;
}

export interface CreateEventDto {
  event_owner_id: number;
  event_title: string;
  event_description: string;
  storage_id: string;
  event_location: string;
  album_delay?: number;
  private: boolean;
  event_date?: string;
  event_date_end?: string;
}

export interface UpdateEventDto {
  event_title?: string;
  event_description?: string;
  storage_id?: string;
  event_location?: string;
  album_delay?: number;
  private?: boolean;
  event_date?: string;
  event_date_end?: string;
}

// UserEvent-related interfaces
export interface UserEvent {
  userEvent_id: number;
  event_id: number;
  user_id: number;
  status_id: number;
}

export interface UserStatus {
  status_id: number;
  status: string;
}

// Album-related interfaces
export interface Album {
  album_id: number;
  album_name: string;
}

// Picture-related interfaces
export interface Picture {
  picture_id: number;
  album_id?: number;
  storage_id: string;
  type_id: number;
}

export interface PictureType {
  type_id: number;
  type: string;
}

// Token response
export interface TokenResponse {
  token: string;
}
