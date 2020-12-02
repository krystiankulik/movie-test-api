import * as setup from "../../__tests__/setup";
import {addMovie} from "../movies";
import dayjs = require("dayjs");
import {MovieModel} from "../../models";

let testMongo: setup.TestMongoConn;

beforeEach(async () => {
    testMongo = await setup.beforeEach();
})

afterEach(() => setup.afterEach(testMongo));

describe("Test addMovie", () => {

    it("should create new movie", async () => {
        const response = await addMovie(undefined, {
            input: {
                name: "some movie",
                releaseDate: '2020-12-12',
                duration: 124,
                actors: ["Actor actor"],
            },
        }, {
            userInfo: {
                id: "id",
                username: "username"
            }
        });

        expect(response.name).toEqual("some movie");
        const movie = await MovieModel.findOne({name: response.name});
        expect(movie).toBeDefined();
    });

    it("should throw an error if movie already exist", async () => {
        const movie = new MovieModel({
            name: "some movie",
            releaseDate: dayjs('2020-12-12').toDate(),
            duration: 124,
            actors: ["Actor actor"],
            username: "username",
            averageNote: 0,
            ratings: [],
        });
        await movie.save();

        let error;
        try {
            await addMovie(undefined, {
                input: {
                    name: "some movie",
                    releaseDate: '2020-12-12',
                    duration: 124,
                    actors: ["Actor actor"],
                },
            }, {
                userInfo: {
                    id: "id",
                    username: "username"
                }
            });
        } catch (e) {
            error = e;
        }
        expect(error).toEqual(new Error("Movie with this name already exists"))
    });
});

// Tests for other movies resolvers would be looking similar (If I would write them).
