const controllerStudent = require("../controllersGraphql/Student");
const controllerTemary = require("../controllersGraphql/temary");
const controllerUser = require("../controllersGraphql/User");
const { resolvers } = require("./resolvers");
const { studentType, GraphQLDate, UserType } = require("./types");
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
      users: {
        type: new GraphQLList(UserType),
        resolve: async () => {
          return await controllerUser.getUsers();
        },
      },
    },
  }),
  MutationRoot: new GraphQLObjectType({
    name: "MutationRoot",
    description: "Aqui se van a realizar todas las mutaciones",
    fields: {
      AddNewPackageToStudent: {
        description: "Asignarle un nuevo package a un student.",
        type: GraphQLBoolean,
        args: {
          email: {
            description: "Email del user",
            type: new GraphQLNonNull(GraphQLString),
          },
          lesson: {
            description: "Num de lessons",
            type: new GraphQLNonNull(GraphQLString),
          },
          months: {
            description: "",
            type: GraphQLString,
            defaultValue: 1,
          },
          time: {
            description: "",
            type: new GraphQLNonNull(GraphQLString),
          },
          idiom: {
            description: "",
            type: new GraphQLNonNull(GraphQLString),
          },
          kids: {
            description: "",
            type: GraphQLBoolean,
            defaultValue: false,
          },
        },
        resolve: async (_, args) => {
          console.log(args);
          return true;
          // return await controllerStudent.addPackage(args);
        },
      },
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
      createTemary: {
        description:
          "Crear un nuevo temario / remplazar el temario ya realizado",
        type: GraphQLBoolean,
        args: {
          nameLevel: {
            type: new GraphQLNonNull(GraphQLString),
            description: "Name del level del temary",
          },
          content_param: {
            type: new GraphQLNonNull(GraphQLString),
            description: "content del level",
          },
        },
        resolve: async (_, args) => {
          console.log(args);
          return await controllerTemary.createOneTemary(args);
        },
      },
      addNewStudent: {
        description: "Add un estudent de user to student",
        type: GraphQLBoolean,
        args: {
          email: {
            description: "Email del user",
            type: new GraphQLNonNull(GraphQLString),
          },
          lesson: {
            description: "Num de lessons",
            type: new GraphQLNonNull(GraphQLString),
          },
          months: {
            description: "",
            type: GraphQLString,
            defaultValue: 1,
          },
          time: {
            description: "",
            type: new GraphQLNonNull(GraphQLString),
          },
          idiom: {
            description: "",
            type: new GraphQLNonNull(GraphQLString),
          },
          kids: {
            description: "",
            type: GraphQLBoolean,
            defaultValue: false,
          },
        },
        resolve: async (_, args) => {
          return await controllerStudent.addNewStudent(args);
        },
      },
    },
  }),
};
