import { userController } from "../../controller/user.controller"
import { authService } from "../../services/middleware/auth.service"


export const resolvers = {
    Query: {
        hello: () => "hello to back-drop",
        verify: (_parent: any, args: any, context: any) => userController.verify({ ...args.data, user: context.user }, context)
    },

    Mutation: {
        addUser: (_parent: any, args: any) => userController.create(args.data),
        login: (_parent: any, args: any) => userController.login(args.data),
        verify: (_parent: any, args: any, context: any) => userController.verify({ ...args.data, user: context.user }, context)

    }
}