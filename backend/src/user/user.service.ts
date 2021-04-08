import { NotFoundException, Injectable, ConflictException } from '@nestjs/common';
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
  constructor(@InjectModel(USER) private readonly userModel: Model<IUser>) {}

  /**
   * Получение списка пользователей
   * @param {ListQuery} query параметры фильтрации
   */
  public async getUsers(query: ListQuery): Promise<ApiListResult<IUser[]>> {
    const sort = {
      [query.sort]: query.order === ASK_SORT ? 1 : -1,
    };
    const users = await this.userModel
      .find({})
      .sort(sort)
      .select(['name', 'email'])
      .limit(+query.limit)
      .skip(+query.skip);
    const count = await this.userModel.countDocuments({});

    return {
      list: users,
      count,
    };
  }

  /**
   * Получение пользователя по идентификатору
   * @param {String} id идентификатор пользователя
   */
  public async getUserById(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).select(['name', 'email']).lean();

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user as IUser;
  }

  /**
   * Создание пользователя
   * @param {CreateUserDTO} dto данные для создания пользователя
   */
  public async createUser(dto: CreateUserDTO): Promise<Partial<IUser>> {
    if (await this.emailExists(dto.email)) {
      throw new ConflictException(`Email '${dto.email}' already taken`);
    }

    const user = await this.userModel.create(dto);

    return user.toSafeObject();
  }

  /**
   * Обновление пользователя
   * @param {String} userId идентификатор пользователя
   * @param {UpdateUserDTO} dto данные для обновления
   */
  public async updateUser(userId: string, dto: UpdateUserDTO): Promise<Partial<IUser>> {
    if (dto.email) {
      const emailPossibility = await this.checkEmailPossibility(userId, dto.email);

      if (!emailPossibility) {
        throw new ConflictException(`Email '${dto.email}' already taken`);
      }
    }

    await this.userModel.updateOne({ _id: userId }, dto);

    return this.getUserById(userId);
  }

  /**
   * Проверка существования пользователя с такой почтой
   * @param {String} email email пользователя
   */
  private async emailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).lean();

    return !!user;
  }

  /**
   * Проверка возможности обновление почты
   * @param {String} userId идентификатор пользователя
   * @param {String} email email пользователя
   */
  private async checkEmailPossibility(userId: string, email: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({
        _id: {
          $ne: userId,
        },
        email,
      })
      .lean();

    return !user;
  }
}
