import mongoose from "mongoose";


export interface Rating extends mongoose.Document {
    username: string;
    note: number;
    comment: string;
}

export interface Movie extends mongoose.Document {
    _id: string;
    name: string;
    releaseDate: Date;
    duration: number;
    actors: string[];
    username: string;
    averageNote: number;
    ratings: Rating[];
}

const RatingSchema = new mongoose.Schema({
        username: {type: String, required: true},
        note: {type: Number, required: true},
        comment: {type: String, required: false},
    },
    {
        versionKey: false,
    },);

const MovieSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        releaseDate: {type: Date, required: true},
        duration: {type: String, required: true},
        actors: {type: [String], required: true},
        username: {type: String, required: true},
        averageNote: {type: Number, required: true},
        ratings: {type: [RatingSchema], required: true}
    },
    {
        versionKey: false,
    },
);

export const MovieModel = mongoose.model<Movie>("Movie", MovieSchema, "Movies");
export const RatingModel = mongoose.model<Rating>("Rating", RatingSchema );
