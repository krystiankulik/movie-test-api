import {Movie, MovieModel, RatingModel} from "../models";
import {Context, MovieInfo} from "../types";
import {PubSub} from "apollo-server";
import {withFilter} from 'graphql-subscriptions';

const pubsub = new PubSub();

const translateMovieModel = (movie: Movie): MovieInfo => ({
    id: movie._id,
    name: movie.name,
    releaseDate: movie.releaseDate.toUTCString(),
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

export const ratingSubscription = {
    subscribe: withFilter(() => (pubsub.asyncIterator(["RATING_ADDED"])),
        (payload, variables) => {
            return payload.ratingAdded.movieId == variables.movieId;
        })
}

export async function addMovie(_: void, args: any, ctx: Context,): Promise<MovieInfo> {

    const {userInfo} = ctx;
    if (!userInfo) {
        throw new Error("Not authenticated!");
    }

    const {name, releaseDate, duration, actors} = args.input;

    const foundMovie = await MovieModel.findOne({name: name});
    if (foundMovie) {
        throw Error("Movie with this name already exists");
    }

    const movie: Movie = new MovieModel({
        name,
        releaseDate: new Date(releaseDate),
        duration,
        actors: actors,
        username: userInfo.username,
        averageNote: 0,
        ratings: [],
    });
    await movie.save();

    return translateMovieModel(movie);
}

const getNewAverageNote = (ratingSize: number, averageNote: number, newNote: number) =>
    (averageNote * ratingSize + newNote) / (ratingSize + 1);

export async function rateMovie(_: void, args: any, ctx: Context,): Promise<MovieInfo> {

    const {userInfo} = ctx;
    if (!userInfo) {
        throw new Error("Not authenticated!");
    }

    const {movieId, note, comment} = args;
    const normalizedNote = Math.floor(note);

    if (normalizedNote < 1 || normalizedNote > 5) {
        throw new Error("Note value should be between 1 and 5.");
    }

    const movie = await MovieModel.findOne({_id: movieId});

    if (!movie) {
        throw new Error("Movie not found.");
    }

    if (movie.ratings.filter(rating => rating.username === userInfo.username).length > 0) {
        throw new Error("Movie is already rated.");
    }

    movie.averageNote = getNewAverageNote(movie.ratings.length, movie.averageNote, normalizedNote);

    const rating = new RatingModel({
        username: userInfo.username,
        note: normalizedNote,
        comment: comment,
    })

    movie.ratings.push(rating);
    await movie.save();

    pubsub.publish("RATING_ADDED", {
        ratingAdded: {
            username: userInfo.username,
            note: normalizedNote,
            comment: comment,
            movieId: movie._id,
        }
    });
    return translateMovieModel(movie);
}

export async function removeMovie(
    _: void,
    _args: any,
    ctx: Context,): Promise<Boolean> {

    const {userInfo} = ctx;
    if (!userInfo) {
        throw new Error("Not authenticated!");
    }

    const {movieId} = _args;
    const result = await MovieModel.deleteOne({username: userInfo.username, id: movieId});
    return result.deletedCount !== 0;
}

export async function getMovie(
    _: void,
    _args: any): Promise<MovieInfo | null> {
    const {movieId} = _args;
    const movie = await MovieModel.findOne({_id: movieId});
    return movie ? translateMovieModel(movie) : null;
}

export async function getAllMovies(
    _: void,
    _args: any): Promise<MovieInfo[]> {
    const movies: Movie[] = await MovieModel.find({});
    return movies.map(translateMovieModel);
}
