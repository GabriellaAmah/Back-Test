import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express, { Request } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './graphQl/schema';
import { resolvers } from './graphQl/resolver';
import { PORT } from "./config"
import { db } from './db/dbConnection';
import { authService } from './services/middleware/auth.service';

const app = express();
export const httpServer = http.createServer(app);


// Set up Apollo Server
export const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

export function setupApp(server: any){
  return app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => authService.authenticateUser({ req })
    }),
  );
}

async function initServer() {
  try {
    await server.start();

    setupApp(server)

    await db.getConnection()

    httpServer.listen(PORT, () => console.log(`🚀 Server ready at ${PORT}`));
  } catch (error) {
    console.log("A fatal server error")
    process.exit()
  }
}

initServer()