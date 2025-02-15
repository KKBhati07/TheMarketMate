export interface Login{
  email: string;
  password: string;
}

export interface Signup{
  name: string;
  email: string;
  password: string;
}

export interface ErrorText{
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export type Redirect = 'login' | 'signup'
