import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const {
      username,
      password,
      citizenId,
      role,
      firstname,
      surname,
      address,
      tel,
    } = createUserDto;

    if (role === 'ADMIN') {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.upsert({
        create: {
          username,
          password: hashPassword,
          citizenId,
          role: 'ADMIN',
          firstname,
          surname,
          address,
          tel,
        },
        update: {},
        where: {
          username: username,
        },
      });
      console.log(user);
    } else {
      const user = await this.prisma.user.create({
        data: {
          citizenId,
          role: 'USER',
          firstname,
          surname,
          address,
          tel,
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
        tel: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return alluser;
  }

  findAdminAll() {
    const alluser = this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        surname: true,
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
        tel: true,
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
        tel: true,
      },
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userUpdate = this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: id,
      },
    });
    return userUpdate;
  }

  async remove(id: number) {
    const removeUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          id,
        },
        select: {
          accountId: true,
        },
      });

      if (!user) {
        return null;
      }
      const deleteTransaction = {};
      for (const acc of user.accountId) {
        const count = await tx.transaction.deleteMany({
          where: {
            accountId: acc.id,
          },
        });
        deleteTransaction[acc.id] = count;
      }

      const deleteAccount = await tx.account.deleteMany({
        where: {
          userId: +id,
        },
      });

      const deleteUser = await tx.user.delete({
        where: {
          id,
        },
      });

      console.log(deleteAccount);

      return [deleteUser, deleteAccount, deleteTransaction];
    });
    return removeUser;
  }
}
