import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password } = registerDto;
    const hashedPassword =  await hash(password, 10);
    registerDto = { ...registerDto, password: hashedPassword };
    return this.usersRepository.insert(registerDto);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.find({ where: [{email}] });
    if (!user[0]) { 
      throw new HttpException('User or password are incorrect', 404);
    }
    const checkPassword =  await bcrypt.compare(password, user[0].password)
    if (!checkPassword){
      throw new HttpException('User or password are incorrect', 403);      
    } 

    const payload = {
      id: user[0].id,
      email: user[0].email
    };
    const token = this.jwtService.sign(payload);
    const data =  {
      user: user[0],
      token
    };
    return data;
  }
}

