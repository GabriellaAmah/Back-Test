import bcrypt from "bcryptjs";
import { IPasswordManger } from "../../lib/interface";

export class PasswordManagerService  implements IPasswordManger{
    private hashingManager: any

    constructor({
        hashingManager = bcrypt
    } = {}) {
        this.hashingManager = hashingManager
    }

    async hashPassword(password: string): Promise<string> {
        return await this.hashingManager.hashSync(password, 10)
    }

    async verifyPassword(hashedPassword: string, plainText: string): Promise<boolean> {
        return await this.hashingManager.compareSync(plainText, hashedPassword)
    }
}