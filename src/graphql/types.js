const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLScalarType,
  Kind,
} = graphql;
//Object Types Course
const courseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    _id: { type: GraphQLString },
    DatepayCourse: { type: GraphQLString },
    ExpiresCourse: { type: GraphQLBoolean },
    lessonTotal: { type: GraphQLInt },
    lesson: { type: GraphQLString },
    months: { type: GraphQLString },
    time: { type: GraphQLString },
    idiom: { type: GraphQLString },
    expiresCours: { type: GraphQLDate },
    score: { type: GraphQLInt },
    kids: { type: GraphQLBoolean },
  }),
});

//Object types Student
const StudentTypeSchema = new GraphQLObjectType({
  name: "StudentType",
  fields: () => ({
    _id: { type: GraphqlID },
    email: { type: GraphQLString },
    courses: {
      type: new GraphQLList(courseType),
    },
  }),
});

const GraphQLDate = new GraphQLScalarType({
  name: "Date",
  description: "Custo Date",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    console.log(ast);
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
});

module.exports = {
  GraphQLDate,
  studentType: new GraphQLObjectType({
    name: "Student",
    fields: () => ({
      _id: { type: GraphQLString },
      FirstName: { type: GraphQLString },
      email: { type: GraphQLString },
      courses: {
        type: new GraphQLList(courseType),
      },
    }),
  }),
};
