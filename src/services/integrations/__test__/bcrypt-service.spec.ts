import { PasswordManagerService } from "../bcrypt.service"

describe("PasswordManagerService", () => {
    let passwordMangerService: PasswordManagerService

    beforeAll(() => {
        passwordMangerService = new PasswordManagerService({
            hashingManager: {
                hashSync: (password: string, salt: any) => password,
                compareSync: (hashedPassword: string, palanText: string) => true
            } as any
        })
    })

    describe("hashPassword", () => {
        it("should has a password", async () => {
            const data = await passwordMangerService.hashPassword("helloworld")

            expect(data).toBe("helloworld")
        })
    })

    describe("verify password", () => {
        it("should verify a password", async () => {
            const data = await passwordMangerService.verifyPassword("helloworld", "dummy")

            expect(data).toBe(true)
        })
    })
})