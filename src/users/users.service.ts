import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '../helper/utils';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.model.exists({ email });

    return !!user;
  };

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const hashPassword = await hashPasswordHelper(password);
    const isEmailExist = await this.isEmailExist(email);

    if (isEmailExist) throw new BadRequestException('Email already exists');

    const userCreated = await this.model.create({
      name,
      email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashPassword,
    });

    return userCreated;
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.model.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.model
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return { results, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
