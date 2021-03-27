const { ApolloServer, gql } = require("apollo-server");
const low = require("lowdb");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db._.mixin(lodashId);

const collection = db.get("products");

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

  input ProductInput {
    name: String!
    price: Int!
    imgUrl: String!
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
  }
`;

const resolvers = {
  Query: {
    products: () => db.get("products"),
  },
  Mutation: {
    addProduct: (_, { input }) => {
      const product = collection.insert(input).write();
      return product;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
