import { levensteinDistance } from "../../helpers";
import { produceError } from "../../helpers/error";
import { IUser, IUserModel, IUserService, UserAuthResponse, VerifyUserType } from "../../lib/interface";
import { UserLoginType, UserVerificationType } from "../../lib/type";
import { OptionalQuery } from "../../lib/type/db";
import { UserRepository } from "../../models/user";
import { PasswordManagerService } from "../integrations/bcrypt.service";
import { JwtService } from "../integrations/jwt.service";
import { PayStackIntegrationService } from "../integrations/paystack.service";
import * as _ from "lodash";

export class UserService implements IUserService{
    private repo: UserRepository;
    private hashingManager: PasswordManagerService;
    private jwtTokenManager: JwtService;
    private paystackService: PayStackIntegrationService

    constructor({
        repo = new UserRepository(),
        hashingManager = new PasswordManagerService(),
        jwtTokenManager = new JwtService(),
        paystackService = new PayStackIntegrationService()
    } = {}) {
        this.repo = repo
        this.hashingManager = hashingManager
        this.jwtTokenManager = jwtTokenManager
        this.paystackService = paystackService
    }

    async getUserByQuery(query: OptionalQuery<IUserModel>) {
        try {
            const user = await this.repo.findOne({ ...query })
            return user
        } catch (err: any) {
            return err
        }
    }

    async create(values: IUser): Promise<UserAuthResponse | any> {
        try {
            const emailExist = await this.getUserByQuery({ email: values.email })
            if (emailExist) {
                return produceError(429, "email exists")
            }
            const password = await this.hashingManager.hashPassword(values.password)
            const user = await this.repo.create({ ...values, password })

            const token = await this.jwtTokenManager.signJwtToken({ email: user.email, id: user.id })
            return { user, token }
        } catch (err) {
            return err
        }
    }

    async login(values: UserLoginType): Promise<UserAuthResponse | any> {
        const emailExist = await this.getUserByQuery({ email: values.email })
        if (!emailExist) {
            throw produceError(404, "invalid email or password")
        }

        const passwordVerified = await this.hashingManager.verifyPassword(emailExist.password, values.password)
        if (!passwordVerified) return produceError(412, "invalid email or password")

        const token = await this.jwtTokenManager.signJwtToken({ email: emailExist.email, id: emailExist.id })
        return { user: emailExist, token }
    }

    async verifyUser(values: VerifyUserType): Promise<VerifyUserType | any> {
        const { user, user_account_number, user_bank_code, user_account_name } = values
        if (user.is_verified) return produceError(429, "User cannot be verified twice")

        const userBankDetails = await this.paystackService.resolveBankAccountDetails(user_account_number, user_bank_code)
        if (!userBankDetails) return produceError(412, "An error occurred while getting bank details")

        if (user_account_name) {
            const validatedName = await this.validateUsernameLogic(user_account_name, userBankDetails.data.account_name)
            if (validatedName) await this.repo.update({ id: user.id }, { is_verified: true, full_name: user_account_name.toLocaleLowerCase() })
        } else {
            await this.repo.update({ id: user.id }, { is_verified: true, full_name: userBankDetails.data.account_name.toLocaleLowerCase() })
        }

        return await this.getUserByQuery({id: user.id})
    }

    async validateUsernameLogic(userFullname: string, userBankName: string): Promise<boolean> {
        const ld = levensteinDistance(userFullname.toLowerCase(), userBankName.toLowerCase())
        return ld > 2 ? false : true
    }
}

