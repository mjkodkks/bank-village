import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { StatsModule } from './stats/stats.module';
import { ReportsModule } from './reports/reports.module';
import { InterestModule } from './interest/interest.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    AccountsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StatsModule,
    ReportsModule,
    InterestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
