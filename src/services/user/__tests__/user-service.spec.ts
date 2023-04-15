import { UserService } from ".."
import { IJwtService, IUser, IUserModel } from "../../../lib/interface"
import { OptionalQuery } from "../../../lib/type/db"

describe("UserService", () => {
    describe("getUserByQuery", () => {
        it("should get a user data by query", async () => {
            const user = await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) => ({...values})
                } as any
            }).getUserByQuery({id: 245, email: "demo-email"})
            
            expect(user).toMatchObject({id: 245, email: "demo-email"})
        })
    })

    describe("create", () => {
        it("should create user", async () => {
            const user = await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) =>null,
                    create: async (values: IUser) => ({...values})
                } as any,

                hashingManager: {
                    hashPassword: async (password: string) => password
                } as any,

                jwtTokenManager: {
                    signJwtToken: async (values: any) => "hfgdhsja"
                } as any

            }).create({password: "fgjhasv", email: "demo-email", full_name: "amah", is_verified: true})
            
            expect(user).toMatchObject({user: {password: "fgjhasv", email: "demo-email", full_name: "amah", is_verified: true}})
        })

        it("should fail because user exists", async () => {
            const user = await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) => ({...values}),
                    create: async (values: IUser) => ({...values})
                } as any,

            }).create({password: "fgjhasv", email: "demo-email", full_name: "amah", is_verified: true})
            
            expect(user.message).toEqual("email exists")
        }
        )
    })

    describe("login", () => {
        it("should successfully login", async () => {
            const user = await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) =>({...values})
                } as any,

                hashingManager: {
                    verifyPassword: async (password: string) => true
                } as any,

                jwtTokenManager: {
                    signJwtToken: async (values: any) => "hfgdhsja"
                } as any

            }).login({password: "fgjhasv", email: "demo-email"})
            
            expect(user).toMatchObject({user: {email: "demo-email"}})
        })

        it("should fail because user does not exists", async () => {
            const user = await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) => null
                } as any,

            }).login({password: "fgjhasv", email: "demo-email"})
            
            expect(user.message).toEqual("invalid email or password")
        }
        )
    })

    describe("verifyUser", () => {
        it("should fail to verify because user is already verified", async () => {
            const user =  await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) => null
                } as any,

            }).verifyUser({
                user: {password: "fgjhasv", email: "demo-email", full_name: "amah", is_verified: true},
                user_account_number: 8989898,
                user_bank_code: "678",
                user_account_name: "Gabriella"
            })

            expect(user.message).toEqual("User cannot be verified twice")
        })

        it("should fail because bank details not resolved", async () => {
            const user =  await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) => null
                } as any,

                paystackService: {
                    resolveBankAccountDetails: async () => null
                } as any

            }).verifyUser({
                user: {password: "fgjhasv", email: "demo-email", full_name: "amah", is_verified: false},
                user_account_number: 8989898,
                user_bank_code: "678",
                user_account_name: "Gabriella"
            })

            expect(user.message).toEqual("An error occurred while getting bank details")
        })

        it("should succcessfully resolve user bank accont", async () => {
            const user =  await new UserService({
                repo: {
                    findOne: async (values: OptionalQuery<IUserModel>) => null,
                    update: async (query: any, values: any) => ({...query, ...values})
                } as any,

                paystackService: {
                    resolveBankAccountDetails: async () => ({data: {account_name: "Gabriella"}})
                } as any

            }).verifyUser({
                user: {password: "fgjhasv", email: "demo-email", full_name: "amah", is_verified: false, id: 234},
                user_account_number: 8989898,
                user_bank_code: "678",
                user_account_name: "Gabriella"
            })

            expect(user).toMatchObject({id: 234})
        })
    })
})