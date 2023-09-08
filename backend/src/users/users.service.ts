import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { username, password, citizenId, isAdmin } = createUserDto;

    if (isAdmin) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.upsert({
        create: { username, password: hashPassword, citizenId, role: 'ADMIN' },
        update: {},
        where: {
          username: username,
        },
      });
      console.log(user);
    } else {
      const user = await this.prisma.user.upsert({
        create: { username, citizenId, role: 'USER' },
        update: {},
        where: {
          username: username,
        },
      });
      console.log(user);
    }
    return 'create success';
  }

  findAll() {
    const alluser = this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickName: true,
        citizenId: true,
        brithday: true,
        role: true,
        firstname: true,
        surname: true,
        address: true,
        lastLogin: true,
        createdAt: true,
      },
    });
    return alluser;
  }

  async findOneByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    return user;
  }

  async findOneByUsernameNoPassword(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        citizenId: true,
        brithday: true,
        role: true,
        firstname: true,
        surname: true,
        address: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findOneByIdNoPassword(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        citizenId: true,
        brithday: true,
        role: true,
        firstname: true,
        surname: true,
        address: true,
        lastLogin: true,
        createdAt: true,
        accountId: true,
      },
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const { address, nickName, citizenId, brithday, firstname, surname } =
      updateUserDto;
    this.prisma.user.update({
      data: {
        address,
        nickName,
        citizenId,
        brithday,
        firstname,
        surname,
      },
      where: {
        id: id,
      },
    });
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
