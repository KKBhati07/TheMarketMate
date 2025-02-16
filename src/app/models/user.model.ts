export interface User {
  id?: number;
  name: string;
  uuid: string;
  profileUrl?: string;
  email: string;
  is_admin: boolean;
  admin: boolean;
  contactNo: string | null;
  deleted?: boolean;
}

export interface ProfileDetails {
  name: string;
  email: string;
  uuid: string;
  profileUrl?: string;
  self?: boolean;
  contactNo: string | null;
}

export interface UpdateUserPayload {
  uuid: string;
  name: string;
  email: string;
  contactNo?: string;
  profileImage?: File;
}
