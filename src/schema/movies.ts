const typeDef = `
    type Rating {
        username: String!
        note: Int!
        comment: String
    }

    type Movie {
        id: ID!
        name: String!
        releaseDate: String!
        duration: Int!
        actors: [String!]!
        username: String!
        averageNote: Int!
        ratings: [Rating]
    }
    
    extend type Query {
        getAllMovies: [Movie!]!
        getMovie (movieId: String!): Movie
    }
    
    input MovieInput {
        name: String!
        releaseDate: String!
        duration: Int!
        actors: [String!]!
    }

    extend type Mutation {
        addMovie (input: MovieInput): Movie
        rateMovie (movieId: String!, note: Int!, comment: String): Movie
        removeMovie (movieId: String!): Boolean
    }
    
    type Subscription {
        ratingAdded (movieId: String!): Rating
    }     
`;
export default typeDef;
