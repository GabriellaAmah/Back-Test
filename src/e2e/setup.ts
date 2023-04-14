import { db } from "../db/dbConnection";
import { server, setupApp } from "../index"

export async function startTestServer() {
    try {
        await db.getConnection().sync({ force: true })
        setupApp(server)

    } catch (error) {
        return error
    }
}

export async function stopServer() {
    await db.getConnection().drop()
    await server.stop()
}