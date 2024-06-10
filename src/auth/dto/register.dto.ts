import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { PartialType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';


export class RegisterDto extends PartialType(LoginDto){
    @IsNotEmpty()
    name: string;   
}
