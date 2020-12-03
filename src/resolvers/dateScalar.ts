import {GraphQLScalarType, Kind} from "graphql";
import dayjs from "dayjs";

export const dateScalar =  new GraphQLScalarType({
    name: "Date",
    description: "date scalar",
    parseValue(value) {
        return dayjs(value);
    },
    serialize(value) {
        return dayjs(value).format();
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return dayjs(ast.value);
        }
        return null;
    }
})
