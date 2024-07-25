import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  //Create Graphql Server
  const gqlServer = new ApolloServer({
    typeDefs: `
    type Query {
        hello: String!
        say(name: String): String


    }
    
    type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!) : Boolean
    
    }
    
    `, //Schema definitions
    resolvers: {
      Query: {
        hello: () => "Hello, GraphQL!",
        say: (_, { name }: { name: string }) => `Hello, ${name}!`,
      },

      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "random",
            },
          });
          return true;
        },
      },
    },
  });

  // Start GQL Server
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.send("Hello, Express!");
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

init();
