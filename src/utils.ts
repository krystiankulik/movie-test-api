import {Movie} from "./models";
import {MovieInfo} from "./types";
import dayjs from "dayjs";

export const translateMovieModel = (movie: Movie): MovieInfo => ({
    id: movie._id,
    name: movie.name,
    releaseDate: dayjs(movie.releaseDate),
    duration: movie.duration,
    actors: movie.actors,
    username: movie.username,
    averageNote: movie.averageNote,
    ratings: movie.ratings.map(rating => ({
        username: rating.username,
        note: rating.note,
        comment: rating.comment
    }))
})

export const getNewAverageNote = (ratingSize: number, averageNote: number, newNote: number) =>
    (averageNote * ratingSize + newNote) / (ratingSize + 1);
