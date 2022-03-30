import { expect } from "chai";
import TokenType from "../src/enum/TokenType";
import Token from "../src/Token";

describe("Token tests", () => {
  let token;
  let expectedType = TokenType.STRING;
  let expectedLexeme = "example";
  let expectedLiteral = "example";
  let expectedLine = 5;
  let expectedColumn = 3;

  before(() => {
    token = new Token(
      expectedType,
      expectedLexeme,
      expectedLiteral,
      expectedLine,
      expectedColumn
    );
  });

  it("Shall have a 'type' property.", () => {
    // Arrange

    // Act

    // Assert
    expect(token.getType()).to.exist;
    expect(token.getType()).to.be.equal(expectedType);
  });

  it("Shall have a 'lexeme' property.", () => {
    // Arrange

    // Act

    // Assert
    expect(token.getLexeme()).to.exist;
    expect(token.getLexeme()).to.be.equal(expectedLexeme);
  });

  it("Shall have a 'literal' property.", () => {
    // Arrange

    // Act

    // Assert
    expect(token.getLiteral()).to.exist;
    expect(token.getLiteral()).to.be.equal(expectedLiteral);
  });

  it("Shall have a 'line' property.", () => {
    // Arrange

    // Act

    // Assert
    expect(token.getLine()).to.exist;
    expect(token.getLine()).to.be.equal(expectedLine);
  });

  it("Shall have a 'column' property.", () => {
    // Arrange

    // Act

    // Assert
    expect(token.getColumn()).to.exist;
    expect(token.getColumn()).to.be.equal(expectedColumn);
  });

  it("Shall be able to represent itself in string format.", () => {
    // Arrange
    const expectedString = `[${expectedType} ${expectedLexeme} ${expectedLiteral} ${expectedLine} ${expectedColumn}]`;

    // Act
    const actualString = token.toString();

    // Assert
    expect(actualString).to.be.equal(expectedString);
  });
});
