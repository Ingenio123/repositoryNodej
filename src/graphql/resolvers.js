module.exports = {
  resolvers: {
    Query: {
      hello: () => {
        return "Hello world desde resolvers";
      },
    },
  },
};
