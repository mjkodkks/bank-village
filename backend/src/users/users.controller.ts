import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create USER (สร้างสมาชิก)',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get profile (ดึงข้อมูล profile ของตัวเอง)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const { username } = req.user;
    const user = this.usersService.findOneByUsernameNoPassword(username);
    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get all adminList (ดึงข้อมูลแอดมินทั้งหมด)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('adminList')
  getAdminList() {
    const user = this.usersService.findAdminAll();
    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get user profile by username (ค้นหาข้อมูลสมาชิกจาก username)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/username/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get user profile by id (ค้นหาข้อมูลสมาชิกจาก user id)',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOneById(@Param('id') id: number) {
    return this.usersService.findOneByIdNoPassword(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update user profile by id (แก้ไขข้อมูลสมาชิกจาก user id)',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete user (ลบ user ออกจากระบบจาก id)',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
