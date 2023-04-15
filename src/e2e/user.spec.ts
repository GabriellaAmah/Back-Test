import { startTestServer, stopServer } from "./setup"
import request from "supertest"
import {PORT} from "../config"

const url = `http://localhost:${PORT}`

const createUser = async (password: string, email: string) => {
  const queryData = {
    query: `mutation AddUser {
      addUser(data: { email: "${email}", password: "${password}"}){
        data {
          token,
          user {
            email
            is_verified
          }
        }
      }
    }`
  }
  let response: any = await request(url).post("/graphql").send(queryData);

  response = JSON.parse(response.text)

  return response.data.addUser.data ? response.data.addUser.data.token : null
}

describe("User E2E", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test"
    try {
      await startTestServer()
    } catch (error) {
      return error
    }
  })

  afterAll(async () => {
    await stopServer()
  })

  describe("create user", () => {
    it("should successfully create user", async () => {
      const queryData = {
        query: `mutation AddUser {
                addUser(data: { email: "piqukji@gmail.com", password:"112233"}){
                  data {
                    token,
                    user {
                      email
                      is_verified
                    }
                  }
                }
              }`
      }
      let response: any = await request(url).post("/graphql").send(queryData);
      response = JSON.parse(response.text)

      expect(response.data.addUser.data).toMatchObject({ user: { is_verified: false, email: "piqukji@gmail.com" } })
      expect(typeof response.data.addUser.data.token).toBe("string")
    })

    it("should fail to create user because user email exists", async () => {
      const queryData = {
        query: `mutation AddUser {
                addUser(data: { email: "piqukji@gmail.com", password:"112233"}){
                  data {
                    token,
                    user {
                      email
                      is_verified
                    }
                  }
                }
              }`
      }

      const queryData2 = {
        query: `mutation AddUser {
                addUser(data: { email: "piqukji@gmail.com", password:"112233"}){
                  data {
                    token,
                    user {
                      email
                      is_verified
                    }
                  }
                }
              }`
      }

      await request(url).post("/graphql").send(queryData);
      let response: any = await request(url).post("/graphql").send(queryData);
      response = JSON.parse(response.text)

      expect(response.errors[0].message).toBe("email exists")
    })
  })

  describe("login", () => {
    it("should successfully login", async () => {
      await createUser("112233", "piq@gmail.com")

      const queryData = {
        query: `mutation login{
            login(data: {email: "piq@gmail.com", password:"112233"}){
              data {
                token,
                user {
                  email
                  is_verified
                }
              }
            }
          }`
      }
      let response: any = await request(url).post("/graphql").send(queryData);
      response = JSON.parse(response.text)

      expect(response.data.login.data).toMatchObject({ user: { is_verified: false, email: "piq@gmail.com" } })
      expect(typeof response.data.login.data.token).toBe("string")
    })

    it("should fail to login because email or password is invalid", async () => {
        await createUser("112233", "piq@gmail.com")
  
        const queryData = {
          query: `mutation login{
              login(data: {email: "piqhg@gmail.com", password:"112233"}){
                data {
                  token,
                  user {
                    email
                    is_verified
                  }
                }
              }
            }`
        }
        let response: any = await request(url).post("/graphql").send(queryData);
        response = JSON.parse(response.text)
  
        expect(response.errors[0].message).toBe("invalid email or password")
    })
  })

  describe("Verify user mutation", () => {
    it("should successfully verify user with mutation entry", async () => {
      const token = await createUser("112233", "piqupi@gmail.com")

      const queryData = {
        query: `mutation Verify {
          verify(data: {user_bank_code: "044", user_account_number: "0091027954", user_account_name: "GabrieLla Chinaza aMAEFULEE"}) {
            data{
                email
                is_verified
                full_name
            }
          }
        }`
      }

      let response: any = await request(url).post("/graphql").set('Authorization', 'Bearer ' + token).send(queryData);
      response = JSON.parse(response.text)

      expect(response.data.verify.data).toMatchObject({ email: "piqupi@gmail.com", is_verified: true} )
    })

    it("should fail to verify user because user is verified", async () => {
      const token = await createUser("112233", "piquppi@gmail.com")
  
      const queryData = {
        query: `mutation Verify {
          verify(data: {user_bank_code: "044", user_account_number: "0091027954", user_account_name: "GabrieLla Chinaza aMAEFULEE"}) {
            data{
                email
                is_verified
                full_name
            }
          }
        }`
      }
  
      await request(url).post("/graphql").set('Authorization', 'Bearer ' + token).send(queryData);
  
      let response: any =  await request(url).post("/graphql").set('Authorization', 'Bearer ' + token).send(queryData);
      response = JSON.parse(response.text)

      expect(response.errors[0].message).toBe("User cannot be verified twice")
    })
  
    it("should fail to verify user because user is not authenticated", async () => {
      const token = await createUser("112233", "piquppip@gmail.com")
  
      const queryData = {
        query: `mutation Verify {
          verify(data: {user_bank_code: "044", user_account_number: "0091027954", user_account_name: "GabrieLla Chinaza aMAEFULEE"}) {
            data{
                email
                is_verified
                full_name
            }
          }
        }`
      }
  
      await request(url).post("/graphql").send(queryData);
  
      let response: any =  await request(url).post("/graphql").send(queryData);
      response = JSON.parse(response.text)
      
      expect(response.errors[0].message).toBe("User not authenticated")
    })
  })

  describe("verify user with query entry", () => {
    it("should successfully verify user with mutation entry", async () => {
      const token = await createUser("112233", "try@gmail.com")

      const queryData = {
        query: `query verifyUser {
          verify(data: {user_bank_code: "044", user_account_number: "0091027954"}) {
            data {
              full_name
              email
              is_verified
            }
          }
        }`
      }

      let response: any = await request(url).post("/graphql").set('Authorization', 'Bearer ' + token).send(queryData);
      response = JSON.parse(response.text)

      expect(response.data.verify.data).toMatchObject({ email: "try@gmail.com", is_verified: true, full_name: "gabriella chinaza amaefule"} )
    })

    it("should successfully verify user with mutation entry and save entered fullname", async () => {
      const token = await createUser("112233", "tryat@gmail.com")

      const queryData = {
        query: `query verifyUser {
          verify(data: {user_bank_code: "044", user_account_number: "0091027954", user_account_name: "gabriealla chinaza amaefule"}) {
            data {
              full_name
              email
              is_verified
            }
          }
        }`
      }

      let response: any = await request(url).post("/graphql").set('Authorization', 'Bearer ' + token).send(queryData);
      response = JSON.parse(response.text)

      expect(response.data.verify.data).toMatchObject({ email: "tryat@gmail.com", is_verified: true, full_name: "gabriealla chinaza amaefule"} )
    })

  })
  
})