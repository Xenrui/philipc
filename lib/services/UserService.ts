import { UserRepository } from '@/lib/repositories/UserRepository';
import { SafeUser, UserRow } from '@/types/user.types';

export class UserService {
    private sanitizeUser(user: UserRow): SafeUser {
        const { password, ...sanitized } = user;

        return sanitized;
    }

    async getUserById(id: number): Promise<SafeUser | null> {
        const service = new UserRepository();

        const user = await service.findById(id);

        if (!user) {
            return null;
        }

        return this.sanitizeUser(user);
    }
}
