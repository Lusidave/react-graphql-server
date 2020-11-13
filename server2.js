let express = require('express');
let express_graphql = require('express-graphql');
let { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');


// GraphQL schema :
let schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        lusidave(title: String): [Course]
    },

    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        createCourse(title: String, author: String, description: String, topic:String, url: String): [Course]
    }

    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

let coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course by Lusidave',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts By Lusidave',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

let getCourse = function(args) { 
    let id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

let getCourses = function(args) {
    if (args.topic) {
        let topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
} 

let getCoursesLusidave = function(args) {
    if (args.title) {
        let title = args.title;
        return coursesData.filter(course => course.title.includes(title));
    } else {
        return coursesData;
    }
}

let updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id) [0];
}

let createCourse = function(args){
    let add = coursesData.length +1 
     args.id = add
    coursesData.push(args);
    return coursesData;
}
// Resolver :
let root = {
    course: getCourse, 
    courses: getCourses,
    lusidave: getCoursesLusidave,
    updateCourseTopic: updateCourseTopic,
    createCourse: createCourse
};
 
// Create an express server and a GraphQL endpoint
let app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
