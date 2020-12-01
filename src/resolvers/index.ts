import {currentUser, register, login} from "./auth";
import {addMovie, editMovie, getAllMovies, getMovie, rateMovie, ratingSubscription, removeMovie} from "./movies";

const resolverMap = {
    Query: {
        currentUser,
        getAllMovies,
        getMovie
    },
    Mutation: {
        login,
        register,
        addMovie,
        rateMovie,
        removeMovie,
        editMovie,
    },
    Subscription: {
        ratingAdded: ratingSubscription
    }
};

export default resolverMap;
