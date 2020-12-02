import mongoose from "mongoose";
import yargs from "yargs";
import {ApolloServer} from "apollo-server";
import {getUserInfo} from "./auth";
import typeDefs from "./schema";
import resolvers from "./resolvers";

const args = yargs.option("mongo-uri", {
    describe: "Mongo URI",
    default: "mongodb://localhost:27017/movies",
    type: "string",
    group: "Mongo",
}).argv;

async function start() {
    try {
        await mongoose.connect(args["mongo-uri"], {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("Connected to DB.");

        await new ApolloServer({
            typeDefs,
            resolvers,
            cors: true, // not super secure, but should be enough for the purpose of the app
            subscriptions: {
                onConnect: (connectionParams: any) => {
                    if (connectionParams.authToken) {
                        const userInfo = getUserInfo(connectionParams.authToken);
                        if (!userInfo) {
                            throw new Error('Missing auth token!');
                        }
                    }
                },
            },
            context: ({req, connection}) => {
                if (connection) {
                    return connection.context;
                }
                return {
                    userInfo:
                        getUserInfo(req.headers.authorization || "")
                }
            },
        }).listen(3001);
        console.log("GraphQl API running on port 3001.");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();
