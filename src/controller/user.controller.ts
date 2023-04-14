import { UserService } from "../services/user";
import { IControllerResponse, IUser, IUserController, VerifyUserType } from "../lib/interface";
import { UserLoginType, UserVerificationType } from "../lib/type";
import { produceError } from "../helpers/error";

class UserController implements IUserController {
    private service: UserService;

    constructor({
        service = new UserService(),
    } = {}) {
        this.service = service
    }


    async create(values: IUser): Promise<IControllerResponse | any> {
        try {
            const data = await this.service.create(values)
            return { message: "User created successfully", status: 201, data }
        } catch (err) {
            return err
        }
    }

    async login(values: UserLoginType): Promise<IControllerResponse | any> {
        try {
            const data = await this.service.login(values)
            return { message: "User sign in successful", status: 200, data }
        } catch (err: any) {
            return err
        }
    }

    async verify(values: VerifyUserType, context: any): Promise<IControllerResponse | any> {
        try {
            if (!context.user) return produceError(401, "User not authenticated")

            const data = await this.service.verifyUser(values)
            return { message: "User successfully verified", status: 200, data }
        } catch (err: any) {
            return err
        }
    }
}

export const userController = new UserController()