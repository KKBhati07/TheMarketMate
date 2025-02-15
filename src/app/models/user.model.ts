export interface User {
  id: number;
  name: string;
  uuid: string;
  profileUrl?: string;
  email: string;
  is_admin: boolean;
  admin: boolean;
  deleted?: boolean;
}

export interface ProfileDetails {
  name: string;
  email: string;
  uuid: string;
  profileUrl?: string;
  self?: boolean;
  contactNo?: string;
}
