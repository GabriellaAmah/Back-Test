import { Sequelize } from "sequelize"
import { DatabaseInitialization } from "../lib/type/db"
import { POSTGRES_URL } from "../config"

export class SetupDatabaseConnection {
    private isTest: boolean
    private url: string
    private static sequelize: Sequelize

    constructor({ isTest = false, url }: DatabaseInitialization) {
        this.isTest = isTest
        this.url = url

        this.connect()
    }

    async connect(): Promise<Sequelize> {
        try {
            if (this.isTest) {

            }
            const sequelize = new Sequelize(this.url)
            SetupDatabaseConnection.sequelize = sequelize

            await this.testDbConnection()

            await sequelize.sync({ alter: true })

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

export const db = new SetupDatabaseConnection({ url: POSTGRES_URL })