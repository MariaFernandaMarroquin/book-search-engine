const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
// const { expressMiddleware } = require('@apollo/server/express4')

//New code
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
}); //New code

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// New instance of Apollo Server with GraphQL - New code
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    //New code
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server runnning on port ${PORT}`);
      console.log(`Visit GraphQL at http://localhost:${PORT}/graphql`)
    })
  })
};

//Call the function to start the server - New Code
startApolloServer();




