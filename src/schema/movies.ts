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
        averageNote: Float!
        ratings: [Rating]
    }
    
    type MovieDeletion {
        id: String
    }
    
    extend type Query {
        getAllMovies: [Movie!]!
        getMovie (movieId: String!): Movie
    }
    
    input AddMovieInput {
        name: String!
        releaseDate: String!
        duration: Int!
        actors: [String!]!
    }
    
    input EditMovieInput {
        movieId: String!
        name: String!
        releaseDate: String!
        duration: Int!
        actors: [String!]!
    }

    extend type Mutation {
        addMovie (input: AddMovieInput): Movie
        rateMovie (movieId: String!, note: Int!, comment: String): Movie
        removeMovie (movieId: String!): MovieDeletion
        editMovie (input: EditMovieInput): Movie
    }
    
    type Subscription {
        ratingAdded (movieId: String!): Rating
    }     
`;
export default typeDef;
