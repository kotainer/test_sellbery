import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER } from './const';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { IUser } from './interfaces/user.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER) private readonly postModel: Model<IUser>) {}

  public async getUsers(): Promise<IUser[]> {
    const users = await this.postModel.find({}).select(['name', 'email']);

    return users as IUser[];
  }

  public async getUserById(id: string): Promise<IUser> {
    const user = await this.postModel.findById(id).select(['name', 'email']).lean();

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user as IUser;
  }

  public async createUser(dto: CreateUserDTO): Promise<Partial<IUser>> {
    const user = await this.postModel.create(dto);

    return user.toSafeObject();
  }

  public async updateUser(userId: string, dto: UpdateUserDTO): Promise<Partial<IUser>> {
    await this.postModel.updateOne({ _id: userId }, dto);

    return this.getUserById(userId);
  }
}
