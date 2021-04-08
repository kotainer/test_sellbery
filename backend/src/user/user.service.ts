import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ASK_SORT, USER } from './const';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiListResult } from './interfaces/api-list-result.type';
import { ListQuery } from './interfaces/list-query.type';
import { IUser } from './interfaces/user.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER) private readonly postModel: Model<IUser>) {}

  public async getUsers(query: ListQuery): Promise<ApiListResult<IUser[]>> {
    const sort = {
      [query.sort]: query.order === ASK_SORT ? 1 : -1,
    };
    const users = await this.postModel
      .find({})
      .sort(sort)
      .select(['name', 'email'])
      .limit(+query.limit)
      .skip(+query.skip);
    const count = await this.postModel.countDocuments({});

    return {
      list: users,
      count,
    };
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
