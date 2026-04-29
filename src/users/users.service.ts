import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users: User[] = [];
    private idCounter = 1;

    findAll(): User[] {
        return this.users;
    }

    findOne(id: number): User {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    create(dto: CreateUserDto): User {
        const newUser: User = {
            id: this.idCounter++,
            name: dto.name,
            email: dto.email,
            createdAt: new Date(),
        };

        this.users.push(newUser);
        return newUser;
    }

}
