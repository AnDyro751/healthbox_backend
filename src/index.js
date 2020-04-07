const {merginTypes} = require("./types")
const {GraphQLServer} = require('graphql-yoga')
const {Prisma} = require('prisma-binding')
const {resolvers} = require("../resolvers")
const {prisma} = require("../generated/prisma-client")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const cors = require("cors")

const server = new GraphQLServer({
    typeDefs: merginTypes(),
    resolvers,
    context: request => {
        return {...request, prisma}
    }
})

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true // <-- REQUIRED backend setting
}

server.express.use(cookieParser())

server.express.use((req, res, next) => {
    const {authorization} = req.headers;
    req.access_token = authorization;

    if (authorization) {
        try {
            const {userId} = jwt.verify(authorization, "demo_secret")
            const {customerId} = jwt.verify(authorization, "demo_secret")
            req.customerId = customerId;
            req.userId = userId;

        } catch (e) {
            req.customerId = null;
            req.userId = null;
        }
    }
    next()
})

server.express.use(async (req, res, next) => {
    // if they aren't logged in, skip this
    if (!req.userId) return next()
    if (!req.customerId) return next()

    server.express.use(async (req, res, next) => {
        // if they aren't logged in, skip this
        if (!req.userId) return next()
        if (!req.customerId) return next()
        next()
    })

    next()
})


server.start({
    cors: {
        credentials: true
    }
}, () => console.log(`The server is running on http://localhost:4000`))