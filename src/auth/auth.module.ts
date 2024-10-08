import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'node:process';

@Module({
  imports: [TypeOrmModule.forFeature([User]),  
  JwtModule.register({
    global: true,
    secret: 'MySuperSecretKey',
    signOptions: { expiresIn: '12h' },
  }),
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
