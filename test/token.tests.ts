import { expect } from "chai";
import TokenType from "../src/enum/TokenType";
import Token from "../src/Token";

describe("Token tests", () => {
  describe("");

  it("Should be able to create token with expected properties but without literal value.", () => {
    // Arrange
    const expectedType = TokenType.PLUS;
    const expectedLexeme = "+";
    const expectedLiteral = null;
    const expectedLine = 1;
    const expectedColumn = 0;

    // Act
    const token = new Token(TokenType.PLUS, "+", null, 1, 0);

    // Assert
    expect(token.getType()).to.be.equal(expectedType);
    expect(token.getLexeme()).to.be.equal(expectedLexeme);
    expect(token.getLiteral()).to.be.equal(expectedLiteral);
    expect(token.getLine()).to.be.equal(expectedLine);
    expect(token.getColumn()).to.be.equal(expectedColumn);
  });

  it("Should be able to create token with expected properties.", () => {
    // Arrange
    const expectedType = TokenType.STRING;
    const expectedLexeme = "example";
    const expectedLiteral = "example";
    const expectedLine = 1;
    const expectedColumn = 0;

    // Act
    const token = new Token(TokenType.STRING, "example", "example", 1, 0);

    // Assert
    expect(token.getType()).to.be.equal(expectedType);
    expect(token.getLexeme()).to.be.equal(expectedLexeme);
    expect(token.getLiteral()).to.be.equal(expectedLiteral);
    expect(token.getLine()).to.be.equal(expectedLine);
    expect(token.getColumn()).to.be.equal(expectedColumn);
  });

  it("Should format to string properly.", () => {
    // Arrange
    const expectedString = "STRING example example";
    const token = new Token(TokenType.STRING, "example", "example", 1, 23);

    // Act
    const actualString = token.toString();
    // Assert
    expect(actualString).to.be.equal(expectedString);
  });
});
