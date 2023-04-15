import { IUser, VerifyUserType } from "../../lib/interface"
import { UserLoginType } from "../../lib/type"
import { UserController } from "../user.controller"


describe("UserController", () => {
    let userController: UserController

    beforeAll(() => {
        userController = new UserController({
            service: {
                create: (values: IUser) => ({ ...values }),
                login: (values: UserLoginType) => ({ ...values }),
                verifyUser: (values: VerifyUserType) => ({ ...values })
            }
        })
    })

    describe("create", () => {
        it("should successfully create a user", async () => {

            const data = await userController.create({is_verified: false, email: "demo-email", password: "demo-pass", full_name: "gabs"})

            expect(data).toMatchObject({
                message: "User created successfully", status: 201, data : {is_verified: false, email: "demo-email", password: "demo-pass", full_name: "gabs"}
            })
        })
    })

    describe("login", () => {
        it("should successfully login a user", async () => {

            const data = await userController.login({ email: "demo-email", password: "demo-pass"})

            expect(data).toMatchObject({
                message: "User sign in successful", status: 200, data : {email: "demo-email", password: "demo-pass"}
            })
        })
    })

    describe("verify", () => {
        it("should successfully verify a user", async () => {

            const data = await userController.verify({ 
                user_account_number: 909090,
                user_bank_code: "090",
                user_account_name: "Gabbie amah",
                user: {is_verified: false, email: "demo-email", password: "demo-pass", full_name: "gabs"}
            }, {user: "demo-email" })

            expect(data).toMatchObject({
                message: "User successfully verified", status: 200, data : {
                    user_account_number: 909090,
                    user_bank_code: "090",
                    user_account_name: "Gabbie amah",
                    user: {is_verified: false, email: "demo-email", password: "demo-pass", full_name: "gabs"}
                }
            })
        })
    })
})