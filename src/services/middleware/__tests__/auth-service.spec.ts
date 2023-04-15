import { IUser } from "../../../lib/interface"
import { OptionalQuery } from "../../../lib/type/db"
import { AuthService } from "../auth.service"

describe("AuthService", () => {

    describe("authenticateUser", () => {
        it("shoud return null because token was not received", async () => {
            const data = await new AuthService({
                userRepo: {
                    findOne: async (values: OptionalQuery<IUser>) => values
                } as any,
    
                jwtTokenManager: {
                    verifyToken: async (token: string) => ({id: "demo-user-id", email: "demo-email"})
                } as any
            }).authenticateUser({req: {
                headers: {
                    authorization: ""
                }
            }} as any)

            expect(data).toMatchObject({user: null})
        })

        it("shoud return null because token details was not found", async () => {
            const data = await new AuthService({
                userRepo: {
                    findOne: async (values: OptionalQuery<IUser>) => values
                } as any,
    
                jwtTokenManager: {
                    verifyToken: async (token: string) => null
                } as any
            }).authenticateUser({req: {
                headers: {
                    authorization: "Beare hfjfkks"
                }
            }} as any)

            expect(data).toMatchObject({user: null})
        })

        it("shoud return user token details", async () => {
            const data = await new AuthService({
                userRepo: {
                    findOne: async (values: OptionalQuery<IUser>) => values
                } as any,
    
                jwtTokenManager: {
                    verifyToken: async (token: string) => ({id: "demo-user-id", email: "demo-email"})
                } as any
            }).authenticateUser({req: {
                headers: {
                    authorization: "Beare hfjfkks"
                }
            }} as any)

            expect(data).toMatchObject({user: {id: "demo-user-id", email: "demo-email"}})
        })
    })
})