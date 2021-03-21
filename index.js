const { ApolloServer, gql } = require("apollo-server");
const low = require("lowdb");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const typeDefs = gql`
  type Product {
    id: ID
    name: String
    price: Int
    imgUrl: String
  }

  type Query {
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    products: () => db.get("products"),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
