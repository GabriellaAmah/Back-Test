import { Request } from "express"
import { OptionalQuery } from "../type/db"

export interface BaseModel<T> {
    [x: string]: any
    id?: number
    createdAt?: Date
    updatedAt?: Date
}

export interface IUser {
    email: string
    password: string
    full_name: string
    is_verified: boolean
}

export type ContextType = {
    user: IUserModel
}

export interface IUserModel extends IUser, BaseModel<IUser> { }

type ExpressObject = {
    req: Request,
    res?: Response
}

export type UserAuthResponse = {
    token: string
    user: IUserModel
}

export type VerifyUserType = {
    user_account_name?: string
    user_account_number: number
    user_bank_code: string
    user: IUserModel
}

export type IControllerResponse = {
    message: string
    status: number
    data: any
}

export interface IAuthService {
    authenticateUser(value: ExpressObject): Promise<IUser>
}

export interface IPasswordManger {
    hashPassword(password: string): Promise<string>,
    verifyPassword(hashed: string, plainText: string): Promise<boolean>
}

export interface IJwtService {
    signJwtToken(values: string): Promise<string>,
    verifyToken(token: string): Promise<any>
}

export interface IPaystackService {
    resolveBankAccountDetails(account_number: number, bank_code: string): Promise<any>
}

export interface IUserService {
    getUserByQuery(query: OptionalQuery<IUserModel>): Promise<IUserModel>,
    create(values: IUser): Promise<UserAuthResponse>,
    login(values: OptionalQuery<IUserModel>): Promise<UserAuthResponse>,
    verifyUser(values: VerifyUserType): Promise<IUserModel>
}

export interface IUserController {
    create(values: IUser): Promise<IControllerResponse>,
    login(values: OptionalQuery<IUserModel>): Promise<IControllerResponse>,
    verify(values: VerifyUserType, context: ContextType): Promise<IControllerResponse>
}

