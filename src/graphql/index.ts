import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloGraphQLServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
    
        }
            type Mutation {
            ${User.mutations}
            
            }
        
    
        
        `, //Schema definitions
    resolvers: {
      Query: { ...User.resolvers.queries },

      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  // Start GQL Server

  await gqlServer.start();
  return gqlServer;
}

export default createApolloGraphQLServer;
