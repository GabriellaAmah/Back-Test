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
    phone_number: number
    is_verified: boolean
}

export interface IUserModel extends IUser, BaseModel<IUser> { }

