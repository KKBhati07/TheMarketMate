export interface User {
  id?: number;
  name: string;
  uuid: string;
  profile_url?: string;
  email: string;
  is_admin: boolean;
  admin: boolean;
  contact_no: string | null;
  deleted?: boolean;
}

export interface ProfileDetails {
  name: string;
  email: string;
  uuid: string;
  profile_url?: string;
  self?: boolean;
  contact_no: string | null;
}

export interface UpdateUserPayload {
  uuid: string;
  name: string;
  email: string;
  contactNo?: string;
  profileImage?: File;
}
