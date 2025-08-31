import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const {
      username,
      password,
      citizenId,
      customerId,
      role,
      firstname,
      surname,
      address,
      tel,
    } = createUserDto;

    try {
      if (role === 'ADMIN') {
        if (!username || !password) {
          throw new BadRequestException(
            'Username and password are required for ADMIN role',
          );
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await this.prisma.user.upsert({
          where: { username },
          create: {
            username,
            password: hashPassword,
            citizenId,
            customerId,
            role: 'ADMIN',
            firstname,
            surname,
            address,
            tel,
          },
          update: {
            // optional: decide what fields can be updated if username already exists
            firstname,
            surname,
            address,
            tel,
          },
        });

        return user;
      } else {
        const user = await this.prisma.user.create({
          data: {
            citizenId,
            customerId,
            role: 'USER',
            firstname,
            surname,
            address,
            tel,
          },
        });
        return user;
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if (
            error.meta &&
            error.meta.target &&
            Array.isArray(error.meta.target)
          ) {
            const fields = error.meta.target.join(', ');
            throw new BadRequestException(
              `Duplicate field value violates unique constraint on fields: ${fields}`,
            );
          }
          // Unique constraint failed
          throw new BadRequestException(
            `User with given unique field already exists`,
          );
        }
      }
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    const alluser = this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickName: true,
        citizenId: true,
        customerId: true,
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
        customerId: true,
      },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        data: updateUserDto,
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(error);
        if (error.code === 'P2025') {
          // Record not found
          throw new NotFoundException(`User with id ${id} not found`);
        }
        if (error.code === 'P2002') {
          if (
            error.meta &&
            error.meta.target &&
            Array.isArray(error.meta.target)
          ) {
            const fields = error.meta.target.join(', ');
            const check = error.meta.target.includes('customerId');
            if (check) {
              throw new BadRequestException(
                `มีผู้ใช้ในระบบที่มี ${check ? 'เลขทะเบียนสมาชิกนี้' : 'ข้อมูลนี้'} อยู่แล้ว`,
              );
            } else {
              throw new BadRequestException(
                `Duplicate field value violates unique constraint on fields: ${fields}`,
              );
            }
          }

          // Unique constraint failed
          throw new BadRequestException(
            'Duplicate field value violates unique constraint',
          );
        }
      }

      // Fallback for unexpected errors
      throw new BadRequestException(error.message);
    }
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
