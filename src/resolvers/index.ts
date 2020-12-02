import {currentUser, register, login} from "./auth";
import {addMovie, editMovie, getAllMovies, getMovie, rateMovie, ratingSubscription, removeMovie} from "./movies";
import {dateScalar} from "./dateScalar";

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
    },
    Date: dateScalar
};

export default resolverMap;
