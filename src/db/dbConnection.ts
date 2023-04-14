import { Sequelize } from "sequelize"
import { DatabaseInitialization } from "../lib/type/db"
import { POSTGRES_URL, TEST_POSTGRES_URL } from "../config"

export class SetupDatabaseConnection {
    private url: string
    private static sequelize: Sequelize
    private isTest: boolean

    constructor({ isTest = false, url }: DatabaseInitialization) {
        this.isTest = isTest
        this.url = url

        Promise.resolve(this.connect())
    }

    async connect(): Promise<Sequelize> {
        try {
            const sequelize = new Sequelize(this.url, {logging: false})

            SetupDatabaseConnection.sequelize = sequelize

            await this.testDbConnection()

            await SetupDatabaseConnection.sequelize.sync({ alter: true })

            return SetupDatabaseConnection.sequelize

        } catch (error: any) {
            return error
        }
    }

    async testDbConnection() {
        try {
            await SetupDatabaseConnection.sequelize.authenticate();
            console.log("Connection has been established successfully.");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return error
        }
    }

    getConnection() {
        return SetupDatabaseConnection.sequelize
    }
}

export const db = new SetupDatabaseConnection({ url: process.env.NODE_ENV === "test" ? TEST_POSTGRES_URL : POSTGRES_URL, isTest: process.env.NODE_ENV === "test" ? true : false })