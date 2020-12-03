import {currentUser, login, register} from "./auth";
import {addMovie, editMovie, getAllMovies, movieSubscription, rateMovie, removeMovie} from "./movies";
import {dateScalar} from "./dateScalar";

const resolverMap = {
    Query: {
        currentUser,
        getAllMovies,
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
        movieAffected: movieSubscription,
    },
    Date: dateScalar
};

export default resolverMap;
