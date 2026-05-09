import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name!: string;
    @IsEmail()
    email!: string;
    @IsNotEmpty()
    password!: string;
    @IsNotEmpty()
    @IsEnum(Role)
    role!: Role;
}