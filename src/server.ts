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
        }).listen(3300);
        console.log("GraphQl API running on port 3300.");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();
