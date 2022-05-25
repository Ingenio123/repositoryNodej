const { resolvers } = require("./resolvers");
const { studentType } = require("./types");
const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
} = require("graphql");
const controllerStudent = require("../controllersGraphql/Student");

module.exports = {
  QueryRoot: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      student: {
        type: new GraphQLList(studentType),
        async resolve() {
          return await controllerStudent.getAllStudents();
        },
      },
      studentOne: {
        type: studentType,
        args: { id: { type: GraphQLString } },
        async resolve(parent, args) {
          return await controllerStudent.getOneStudent(args);
        },
      },
    },
  }),
  MutationRoot: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({}),
  }),
};
