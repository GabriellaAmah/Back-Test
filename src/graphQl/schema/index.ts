export const typeDefs = `#graphql
    type User {
        full_name: String
        email: String
        is_verified: Boolean

    }

    type UserAuthData {
        user: User
        token: String
    }

    type UserLoginResponse {
        status: String,
        message: String,
        data: UserAuthData
    }

    type UserVerifyData {
        status: String,
        message: String,
        data: User
    }

    input UserDetails {
        full_name: String
        email: String
        password: String
    }

    input UserLoginDetails {
        email: String
        password: String
    }

    input UserVerifyDetails {
        user_account_name: String!
        user_account_number: String!
        user_bank_code: String!
    }

    input UserVerifyDetailsQuery {
        user_account_name: String
        user_account_number: String!
        user_bank_code: String!
    }


    type Query {
        hello: String
        verify(data: UserVerifyDetailsQuery): UserVerifyData
    }

    type Mutation {
        addUser(data: UserDetails): UserLoginResponse 
        login(data: UserLoginDetails): UserLoginResponse
        verify(data: UserVerifyDetails): UserVerifyData
    }
`;
