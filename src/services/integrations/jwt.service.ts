import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KET } from "../../config"
import { IJwtService } from "../../lib/interface";

export class JwtService implements IJwtService {
    private jwtTokenManger: any

    constructor({
        jwtTokenManger = jwt
    } = {}) {
        this.jwtTokenManger = jwtTokenManger
    }

    async signJwtToken(values: any): Promise<string> {
        return await this.jwtTokenManger.sign(values, JWT_SECRET_KET)
    }

    async verifyToken(token: string): Promise<any> {
        return await this.jwtTokenManger.verify(token, JWT_SECRET_KET)
    }
}