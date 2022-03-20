import { expect } from "chai";
import Scanner from "../src/Scanner";
import Token from "../src/Token";
import TokenType from "../src/enum/TokenType";

describe.skip("Scanner", () => {
  let scanner: Scanner;
  beforeEach(() => {
    scanner = new Scanner();
  });

  it("Should be able to load source code.", () => {
    // Arrange
    const source = "my source code";

    // Act
    scanner.load(source);

    // Assert
    expect(scanner.getSource()).to.be.equal(source);
  });

  it("Should be able to peek current character.", () => {
    // Arrange
    const source = "my source code";
    const expectedPeek = "m";

    // Act
    scanner.load(source);
    const actualPeek = scanner.peek();

    // Assert
    expect(actualPeek).to.equal(expectedPeek);
  });

  it("Peek should return undefined if source is not loaded.", () => {
    // Arrange

    // Act
    const actualPeek = scanner.peek();

    // Assert
    expect(actualPeek).to.be.undefined;
  });

  it("Should be able to move foward source code.", () => {
    // Arrange
    const source = "my source code";
    const expectedChar = "y";

    // Act
    scanner.load(source);
    const actualChar = scanner.advance();

    // Assert
    expect(actualChar).to.equal(expectedChar);
  });

  it("Advance should return undefined if ", () => {
    // Arrange
    const source = "my source code";
    const expectedChar = "y";

    // Act
    scanner.load(source);
    const actualChar = scanner.advance();

    // Assert
    expect(actualChar).to.equal(expectedChar);
  });

  it("Should be able to add a new token to the list.", () => {
    // Arrange
    const expectedToken = new Token(
      TokenType.STRING,
      "example",
      "example",
      1,
      0
    );

    // Act
    scanner.load("example");
    for (let i = 0; i <= 7; i++) {
      scanner.advance();
    }
    scanner.addToken(TokenType.STRING, "example");

    // Assert
    expect(scanner.getTokenList()).to.have.lengthOf(1);

    const actualToken = scanner.getTokenList()[0];
    expect(actualToken.getType()).to.be.equal(expectedToken.getType());
    expect(actualToken.getLexeme()).to.be.equal(expectedToken.getLexeme());
    expect(actualToken.getLiteral()).to.be.equal(expectedToken.getLiteral());
    expect(actualToken.getLine()).to.be.equal(expectedToken.getLine());
    expect(actualToken.getColumn()).to.be.equal(expectedToken.getColumn());
  });

  it("Token should not be added if source is not loaded.", () => {
    // Arrange

    // Act
    scanner.addToken(TokenType.STRING, "example");

    // Assert
    expect(scanner.getTokenList()).to.have.lengthOf(0);
  });

  describe("Token identification", () => {
    describe("Single character token", () => {
      it("Should be able to identify '(' token.", () => {
        // Arrange
        const source = "(";
        const expectedTokenType = TokenType.LEFT_PAREN;
        const expectedLexeme = "(";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        scanner.scanToken();
        const tokenList = scanner.getTokenList();
        const actualToken = tokenList[0];

        // Assert
        expect(tokenList).to.have.lengthOf(1);
        expect(tokenList[0].getType()).be.equal(expectedTokenType);
        expect(tokenList[0].getLexeme()).be.equal(expectedLexeme);
        expect(tokenList[0].getLiteral()).be.equal(expectedLiteral);
        expect(tokenList[0].getLine()).be.equal(expectedLine);
        expect(tokenList[0].getColumn()).be.equal(expectedColumn);
      });
    });
  });
});
