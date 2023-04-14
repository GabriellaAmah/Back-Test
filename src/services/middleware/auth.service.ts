import { UserRepository } from "../../models/user";
import { Request } from "express"
import { JwtService } from "../integrations/jwt.service";
import { produceError } from "../../helpers/error";

class AuthService {
    userRepo: UserRepository;
    private jwtTokenManager: JwtService

    constructor(
        { userRepo = new UserRepository(),
            jwtTokenManager = new JwtService() } = {}
    ) {
        this.userRepo = userRepo
        this.jwtTokenManager = jwtTokenManager
    }

    async authenticateUser({ req }: { req: Request }): Promise<any> {
        try {
            let user = null

            const splitedAuth = req.headers.authorization ? req.headers.authorization.split(" ") : []

            const token = splitedAuth[1]
            if (!token) return { user };

            const tokenDetails = await this.jwtTokenManager.verifyToken(token);
            if (!tokenDetails) return { user }

            user = await this.userRepo.findOne({ id: tokenDetails.id, email: tokenDetails.email })

            return { user };
        } catch (err) {
            return err
        }
    }

    checkIsUserValid({ parent, args, context }: { parent: any, args: any, context: any }, cb: any) {
        try {
            if (!context.user) return produceError(401, "User not authenticated")
            return cb()
        } catch (error) {
            return error
        }
    }
}

export const authService = new AuthService()