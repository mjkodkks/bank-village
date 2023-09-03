import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.upsert({
      create: { username, password: hashPassword },
      update: {},
      where: {
        username: username,
      },
    });

    console.log(user);

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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
