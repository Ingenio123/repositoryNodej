const controllerStudent = require("../controllersGraphql/Student");
const { resolvers } = require("./resolvers");
const { studentType } = require("./types");
const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLInt,
} = require("graphql");

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
        args: {
          email: {
            description: "email of student",
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        async resolve(parent, args) {
          return await controllerStudent.getOneStudent(args);
        },
      },
    },
  }),
  MutationRoot: new GraphQLObjectType({
    name: "MutationRoot",
    description: "Aqui se van a realizar todas las mutaciones",
    fields: {
      addLessonOneStudent: {
        description:
          "Aqui se agregara lessons a un student que se buscar por _id",
        type: GraphQLBoolean,
        args: {
          email: {
            description: "Email del student",
            type: new GraphQLNonNull(GraphQLString),
          },
          idiom: {
            description: "Idioma que desea agregar mas lessons",
            type: new GraphQLNonNull(GraphQLString),
          },
          kids: {
            description:
              " false | true segun el package que desea agregar mas lessons",
            type: new GraphQLNonNull(GraphQLBoolean),
          },
          numClassAdd: {
            description: "Numero de clases que vamos agregar",
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        resolve: async (parent, args) => {
          console.log(parent);
          return await controllerStudent.addLessons(args);
        },
      },
    },
  }),
};
