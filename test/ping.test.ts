import { expect } from "chai";
import { ping } from "../src/ping";

describe("ping tests", () => {
  it("Ping should return pong.", () => {
    // Arrange
    const expected = "pong";

    // Act
    const actual = ping();

    // Assert
    expect(actual).to.be.equal(expected);
  });
});
