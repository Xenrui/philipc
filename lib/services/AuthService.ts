import { UserRepository } from '@/lib/repositories/UserRepository';
import { CreateUserInput } from '@/types/user.types';
import bcrypt from 'bcryptjs';

interface LoginUserInput {
    username: string;
    password: string;
}

export class AuthService {
    private userRepo = new UserRepository();

    async login({ username, password }: LoginUserInput): Promise<number> {
        let user = await this.userRepo.findByUsername(username);

        if (!user) {
            user = await this.userRepo.findByEmail(username);
        }

        if (!user) {
            throw new Error('Invalid Credentials!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        return user.user_id;
    }

    async register(data: CreateUserInput): Promise<number> {
        const emailExists = await this.userRepo.emailExists(data.email);
        if (emailExists) {
            throw new Error('Email already exists');
        }

        const usernameExists = await this.userRepo.usernameExists(data.username);
        if (usernameExists) {
            throw new Error('Username already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        data.password = passwordHash;

        const userId = this.userRepo.create(data);

        return userId;
    }
}
