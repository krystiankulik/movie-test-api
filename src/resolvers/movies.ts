import {Movie, MovieModel, RatingModel} from "../models";
import {Context, MovieDeletionInfo, MovieInfo, UserInfo} from "../types";
import {PubSub} from "apollo-server";
import {withFilter} from 'graphql-subscriptions';
import {getNewAverageNote, translateMovieModel} from "../utils";

const pubsub = new PubSub();

const getUserInfo = (ctx: Context): UserInfo => {
    const {userInfo} = ctx;
    if (!userInfo) {
        throw new Error("Not authenticated!");
    }
    return userInfo;
}

export const ratingSubscription = {
    subscribe: withFilter(() => (pubsub.asyncIterator(["RATING_ADDED"])),
        (payload, variables) => {
            return payload.ratingAdded.movieId == variables.movieId;
        })
}

export async function addMovie(_: void, args: any, ctx: Context,): Promise<MovieInfo> {
    const userInfo = getUserInfo(ctx);

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

export async function editMovie(_: void, args: any, ctx: Context,): Promise<MovieInfo> {

    const userInfo = getUserInfo(ctx);

    const {movieId, name, releaseDate, duration, actors} = args.input;

    const foundMovie = await MovieModel.findOne({_id: movieId});

    if (!foundMovie) {
        throw Error("No movie with provided id exists.");
    }

    if (userInfo.username !== foundMovie.username) {
        throw Error("Access denied.");
    }

    foundMovie.name = name;
    foundMovie.releaseDate = releaseDate;
    foundMovie.duration = duration;
    foundMovie.actors = actors;
    await foundMovie.save();

    return translateMovieModel(foundMovie);
}


export async function rateMovie(_: void, args: any, ctx: Context,): Promise<MovieInfo> {

    const userInfo = getUserInfo(ctx);

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
    ctx: Context,): Promise<MovieDeletionInfo> {

    const userInfo = getUserInfo(ctx);

    const {movieId} = _args;
    const result = await MovieModel.deleteOne({username: userInfo.username, _id: movieId});
    return result.deletedCount !== 0 ? {id: movieId} : {id: null};
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
