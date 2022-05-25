const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} = graphql;
//Object Types
const courseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    _id: { type: GraphQLString },
    DatepayCourse: { type: GraphQLString },
    ExpiresCourse: { type: GraphQLBoolean },
    lessonTotal: { type: GraphQLString },
    lesson: { type: GraphQLString },
    months: { type: GraphQLString },
    time: { type: GraphQLString },
    idiom: { type: GraphQLString },
    expiresCours: { type: GraphQLString },
    score: { type: GraphQLInt },
    kids: { type: GraphQLBoolean },
  }),
});
module.exports = {
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
