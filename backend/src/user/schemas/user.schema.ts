import { Schema } from 'mongoose';
import * as crypto from 'crypto';
import * as uuid from 'uuid';

import { IUser } from '../interfaces/user.type';

const schema: Schema<IUser> = new Schema({
  _id: { type: String, default: uuid.v4 },
  email: { type: String, required: true },
  name: { type: String },
  passwordHash: { type: String },
  salt: { type: String },
});

schema.virtual('password').set(function (this: IUser, password: string) {
  if (password) {
    this.salt = crypto.randomBytes(4).toString('hex');
    this.passwordHash = crypto
      .pbkdf2Sync(password, Buffer.from(this.salt, 'binary'), 10000, 64, 'sha1')
      .toString('base64');
  } else {
    this.salt = '';
    this.passwordHash = '';
  }
});

schema.methods.checkPassword = function (this: IUser, password: string): boolean {
  if (!password) {
    return false;
  }

  if (!this.passwordHash) {
    return false;
  }

  return (
    crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'binary'), 10000, 64, 'sha1').toString('base64') ===
    this.passwordHash
  );
};

schema.methods.toSafeObject = function (this: IUser): Partial<IUser> {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
  };
};

export default schema;
