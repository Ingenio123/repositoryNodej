const controllerStudent = require("../controllersGraphql/Student");
const { resolvers } = require("./resolvers");
const { studentType, GraphQLDate } = require("./types");
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
          idPackage: {
            description: "Id package en formato string",
            type: new GraphQLNonNull(GraphQLString),
          },
          numClassAdd: {
            description: "Numero de clases que vamos agregar",
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        resolve: async (parent, args) => {
          console.log(args);
          return await controllerStudent.addLessons(args);
        },
      },
      addNewDateExpires: {
        description: "Para agragar una nueva date expires",
        type: GraphQLBoolean,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString),
            description: "email del estudiante",
          },
          dateExpires: {
            type: GraphQLDate,
            description: "fecha de expiracion del package",
          },
          idPackage: {
            type: new GraphQLNonNull(GraphQLString),
            description: "Id del package",
          },
        },
        resolve: async (parent, args) => {
          console.log(args);
          return await controllerStudent.addNewExpiredDate(args);
        },
      },
    },
  }),
};
