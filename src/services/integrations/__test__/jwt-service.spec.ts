
import { JwtService } from "../jwt.service"

describe("Jwtservice", () => {
    let jwtService: JwtService

    beforeAll(() => {
        jwtService = new JwtService({
            jwtTokenManger: {
                sign: (values: any, secret: string) => values,
                verify: (token: string, secret: string) => ({"id": "demo-id"})
            } as any
        })
    })

    describe("signJwtToken", () => {
        it("should sign a jwtToken", async () => {
            const data = await jwtService.signJwtToken("helloworld")

            expect(data).toBe("helloworld")
        })
    })

    describe("verify password", () => {
        it("should verify a password", async () => {
            const data = await jwtService.verifyToken("helloworld")

            expect(data).toMatchObject({"id": "demo-id"})
        })
    })
})