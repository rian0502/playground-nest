import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email.toLowerCase() },
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                name: user.name,
                role: user.role
            }
        };
    }

    async refreshToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);

            const newAccessToken = await this.jwtService.signAsync(
                { sub: payload.sub, email: payload.email, role: payload.role },
                { expiresIn: '15m' }
            );
            
            return { access_token: newAccessToken };
        } catch (error) { 
            throw new UnauthorizedException('Refresh token is invalid or expired');
        }
     }

    async register(registerDto: RegisterDto) {
        const userExists = await this.prisma.user.findUnique({
            where: { email: registerDto.email.toLowerCase() },
        });
        if (userExists) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: registerDto.name,
                email: registerDto.email.toLowerCase(),
                password: hashedPassword,
                role: Role.CASHIER,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return user;
    }
}
