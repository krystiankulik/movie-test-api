import {getNewAverageNote} from "../utils";

describe("Test applying new average note", () => {

    it("assign first average note", () => {
        const result = getNewAverageNote(0, 0, 1);
        expect(result).toEqual(1)
    })

    it("should correctly calculate new average note", () => {
        // for [3, 5, 2, 4] average = 3.5
        const result = getNewAverageNote(4, 3.5, 4);
        expect(result).toEqual(3.6)
    })

})
