import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;

  salt: string;
  passwordHash: string;

  checkPassword(this: IUser, password: string): boolean;
  toSafeObject(): Partial<IUser>;
}
