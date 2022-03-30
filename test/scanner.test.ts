import { expect } from "chai";
import Scanner from "../src/Scanner";
import Token from "../src/Token";
import TokenType from "../src/enum/TokenType";

describe("Scanner", () => {
  let scanner: Scanner;
  beforeEach(() => {
    scanner = new Scanner();
  });

  it("Scanner shall be able to load source code.", () => {
    // Arrange
    const source = "my source code";

    // Act
    scanner.load(source);

    // Assert
    expect(scanner.getSource()).to.be.equal(source);
  });

  it("Scanner shall be able to peek current character.", () => {
    // Arrange
    const source = "my source code";
    const expectedPeek = "m";

    // Act
    scanner.load(source);
    const actualPeek = scanner.peek();

    // Assert
    expect(actualPeek).to.equal(expectedPeek);
  });

  it("Scanner shall be able to peek by 'n' characters ahead of current position.", () => {
    // Arrange
    const n = 1;
    const source = "my source code";
    const expectedPeek = "y";

    // Act
    scanner.load(source);
    const actualPeek = scanner.peekNext(n);

    // Assert
    expect(actualPeek).to.equal(expectedPeek);
  });

  it("Peek shall return undefined if source is not loaded.", () => {
    // Arrange

    // Act
    const actualPeek = scanner.peek();

    // Assert
    expect(actualPeek).to.be.undefined;
  });

  it("PeekNext shall return undefined if source is not loaded.", () => {
    // Arrange
    const n = 1;

    // Act
    const actualPeek = scanner.peekNext(n);

    // Assert
    expect(actualPeek).to.be.undefined;
  });

  it("PeekNext shall return undefined if 'n' exceeds source.", () => {
    // Arrange
    const n = 2;
    const source = "my";

    // Act
    scanner.load(source);
    const actualPeek = scanner.peekNext(n);

    // Assert
    expect(actualPeek).to.be.undefined;
  });

  it("Scanner shall be able to move foward source code.", () => {
    // Arrange
    const source = "my source code";
    const expectedChar = "y";

    // Act
    scanner.load(source);
    scanner.advance();
    const actualChar = scanner.peek();

    // Assert
    expect(actualChar).to.equal(expectedChar);
  });

  it("Advance shall return the next character to read.", () => {
    // Arrange
    const source = "my source code";
    const expectedChar = "m";

    // Act
    scanner.load(source);
    const actualChar = scanner.advance();

    // Assert
    expect(actualChar).to.equal(expectedChar);
  });

  it("Advance shall return undefined if source is not loaded.", () => {
    // Arrange

    // Act
    const actualChar = scanner.advance();

    // Assert
    expect(actualChar).to.be.undefined;
  });

  it("Scanner shall be able to add a new token to the list.", () => {
    // Arrange
    const expectedToken = new Token(
      TokenType.STRING,
      "example",
      "example",
      0,
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

  it("Scanner shall return 'EOF' token when it reaches the end.", () => {
    // Arrange
    const source = "";
    const expectedTokenType = TokenType.EOF;

    // Act
    scanner.load(source);
    const actualTokenList = scanner.scanTokens();

    const lastToken = actualTokenList.slice(-1)[0];
    const actualTokenType = lastToken.getType();

    // Assert
    expect(actualTokenType).to.be.equal(expectedTokenType);
  });

  describe("White space", () => {
    it("Scanner shall change line on break line.", () => {
      // Arrange
      const source = "()\n<=";
      const expectedLine = 1;

      // Act
      scanner.load(source);
      scanner.scanTokens();

      // Assert
      expect(scanner.getLine()).to.equal(expectedLine);
    });

    it("Scanner shall skip white space.", () => {
      // Arrange
      const source = " \r \t \n ";

      // Act
      scanner.load(source);
      const actualTokenList = scanner.scanTokens();

      // Assert
      expect(actualTokenList).to.have.lengthOf(1);
    });

    it("Scanner shall skip in line comments.", () => {
      // Arrange
      const source = "// ( )";

      // Act
      scanner.load(source);
      const actualTokenList = scanner.scanTokens();

      // Assert
      expect(actualTokenList).to.have.lengthOf(1);
    });

    it("Scanner shall skip multiple line comments.", () => {
      // Arrange
      const source = "/*()\n[]*/";

      // Act
      scanner.load(source);
      const actualTokenList = scanner.scanTokens();

      // Assert
      expect(actualTokenList).to.have.lengthOf(1);
      expect(scanner.getLine()).to.be.equal(1);
    });
  });

  describe("Token identification", () => {
    describe("Single character token", () => {
      it("Scanner shall be able to identify 'LEFT_PAREN' token.", () => {
        // Arrange
        const source = "(";
        const expectedTokenType = TokenType.LEFT_PAREN;
        const expectedLexeme = "(";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'RIGHT_PAREN' token.", () => {
        // Arrange
        const source = ")";
        const expectedTokenType = TokenType.RIGHT_PAREN;
        const expectedLexeme = ")";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'LEFT_BRACE' token.", () => {
        // Arrange
        const source = "{";
        const expectedTokenType = TokenType.LEFT_BRACE;
        const expectedLexeme = "{";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'RIGHT_BRACE' token.", () => {
        // Arrange
        const source = "}";
        const expectedTokenType = TokenType.RIGHT_BRACE;
        const expectedLexeme = "}";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'COMMA' token.", () => {
        // Arrange
        const source = ",";
        const expectedTokenType = TokenType.COMMA;
        const expectedLexeme = ",";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'DOT' token.", () => {
        // Arrange
        const source = ".";
        const expectedTokenType = TokenType.DOT;
        const expectedLexeme = ".";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'MINUS' token.", () => {
        // Arrange
        const source = "-";
        const expectedTokenType = TokenType.MINUS;
        const expectedLexeme = "-";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'PLUS' token.", () => {
        // Arrange
        const source = "+";
        const expectedTokenType = TokenType.PLUS;
        const expectedLexeme = "+";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'SEMICOLON' token.", () => {
        // Arrange
        const source = ";";
        const expectedTokenType = TokenType.SEMICOLON;
        const expectedLexeme = ";";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'SLASH' token.", () => {
        // Arrange
        const source = "/";
        const expectedTokenType = TokenType.SLASH;
        const expectedLexeme = "/";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'STAR' token.", () => {
        // Arrange
        const source = "*";
        const expectedTokenType = TokenType.STAR;
        const expectedLexeme = "*";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });
    });

    describe("Single / Double character token", () => {
      it("Scanner shall be able to identify 'BANG' token.", () => {
        // Arrange
        const source = "!";
        const expectedTokenType = TokenType.BANG;
        const expectedLexeme = "!";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'BANG_EQUAL' token.", () => {
        // Arrange
        const source = "!=";
        const expectedTokenType = TokenType.BANG_EQUAL;
        const expectedLexeme = "!=";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'EQUAL' token.", () => {
        // Arrange
        const source = "=";
        const expectedTokenType = TokenType.EQUAL;
        const expectedLexeme = "=";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'EQUAL_EQUAL' token.", () => {
        // Arrange
        const source = "==";
        const expectedTokenType = TokenType.EQUAL_EQUAL;
        const expectedLexeme = "==";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'GRATER' token.", () => {
        // Arrange
        const source = ">";
        const expectedTokenType = TokenType.GRATER;
        const expectedLexeme = ">";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'GREATER_EQUAL' token.", () => {
        // Arrange
        const source = ">=";
        const expectedTokenType = TokenType.GREATER_EQUAL;
        const expectedLexeme = ">=";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'LESS' token.", () => {
        // Arrange
        const source = "<";
        const expectedTokenType = TokenType.LESS;
        const expectedLexeme = "<";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'LESS_EQUAL' token.", () => {
        // Arrange
        const source = "<=";
        const expectedTokenType = TokenType.LESS_EQUAL;
        const expectedLexeme = "<=";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });
    });

    describe("Literals tokens", () => {
      describe("String", () => {
        it("Scanner shall be able to identify empty 'STRING' token.", () => {
          // Arrange
          const source = '""';
          const expectedTokenType = TokenType.STRING;
          const expectedLexeme = '""';
          const expectedLiteral = "";
          const expectedLine = 0;
          const expectedColumn = 0;

          // Act
          scanner.load(source);
          const tokenList = scanner.scanTokens();
          const actualToken = tokenList[0];

          // Assert
          expect(actualToken.getType()).be.equal(expectedTokenType);
          expect(actualToken.getLexeme()).be.equal(expectedLexeme);
          expect(actualToken.getLiteral()).be.equal(expectedLiteral);
          expect(actualToken.getLine()).be.equal(expectedLine);
          expect(actualToken.getColumn()).be.equal(expectedColumn);
        });

        it("Scanner shall be able to identify single word 'STRING' token.", () => {
          // Arrange
          const source = '"example"';
          const expectedTokenType = TokenType.STRING;
          const expectedLexeme = '"example"';
          const expectedLiteral = "example";
          const expectedLine = 0;
          const expectedColumn = 0;

          // Act
          scanner.load(source);
          const tokenList = scanner.scanTokens();
          const actualToken = tokenList[0];

          // Assert
          expect(actualToken.getType()).be.equal(expectedTokenType);
          expect(actualToken.getLexeme()).be.equal(expectedLexeme);
          expect(actualToken.getLiteral()).be.equal(expectedLiteral);
          expect(actualToken.getLine()).be.equal(expectedLine);
          expect(actualToken.getColumn()).be.equal(expectedColumn);
        });

        it("Scanner shall be able to identify multiple words 'STRING' token.", () => {
          // Arrange
          const source = '"my string example"';
          const expectedTokenType = TokenType.STRING;
          const expectedLexeme = '"my string example"';
          const expectedLiteral = "my string example";
          const expectedLine = 0;
          const expectedColumn = 0;

          // Act
          scanner.load(source);
          const tokenList = scanner.scanTokens();
          const actualToken = tokenList[0];

          // Assert
          expect(actualToken.getType()).be.equal(expectedTokenType);
          expect(actualToken.getLexeme()).be.equal(expectedLexeme);
          expect(actualToken.getLiteral()).be.equal(expectedLiteral);
          expect(actualToken.getLine()).be.equal(expectedLine);
          expect(actualToken.getColumn()).be.equal(expectedColumn);
        });

        it("Scanner shall be able to identify multiple line 'STRING' token.", () => {
          // Arrange
          const source = '"my \n example"';
          const expectedTokenType = TokenType.STRING;
          const expectedLexeme = '"my \n example"';
          const expectedLiteral = "my \n example";
          const expectedLine = 0;
          const expectedColumn = 0;
          const expectedScannerLine = 1;

          // Act
          scanner.load(source);
          const tokenList = scanner.scanTokens();
          const actualToken = tokenList[0];

          // Assert
          expect(actualToken.getType()).be.equal(expectedTokenType);
          expect(actualToken.getLexeme()).be.equal(expectedLexeme);
          expect(actualToken.getLiteral()).be.equal(expectedLiteral);
          expect(actualToken.getLine()).be.equal(expectedLine);
          expect(actualToken.getColumn()).be.equal(expectedColumn);
          expect(scanner.getLine()).to.be.equal(expectedScannerLine);
        });
      });

      describe("Numbers", () => {
        it("Scanner shall be able to identify single int digit 'NUMBER' token.", () => {
          // Arrange
          const source = "7";
          const expectedTokenType = TokenType.NUMBER;
          const expectedLexeme = "7";
          const expectedLiteral = 7;
          const expectedLine = 0;
          const expectedColumn = 0;

          // Act
          scanner.load(source);
          const tokenList = scanner.scanTokens();
          const actualToken = tokenList[0];

          // Assert
          expect(actualToken.getType()).be.equal(expectedTokenType);
          expect(actualToken.getLexeme()).be.equal(expectedLexeme);
          expect(actualToken.getLiteral()).be.equal(expectedLiteral);
          expect(actualToken.getLine()).be.equal(expectedLine);
          expect(actualToken.getColumn()).be.equal(expectedColumn);
        });

        it("Scanner shall be able to identify multiple int digits 'NUMBER' token.", () => {
          // Arrange
          const source = "71253";
          const expectedTokenType = TokenType.NUMBER;
          const expectedLexeme = "71253";
          const expectedLiteral = 71253;
          const expectedLine = 0;
          const expectedColumn = 0;

          // Act
          scanner.load(source);
          const tokenList = scanner.scanTokens();
          const actualToken = tokenList[0];

          // Assert
          expect(actualToken.getType()).be.equal(expectedTokenType);
          expect(actualToken.getLexeme()).be.equal(expectedLexeme);
          expect(actualToken.getLiteral()).be.equal(expectedLiteral);
          expect(actualToken.getLine()).be.equal(expectedLine);
          expect(actualToken.getColumn()).be.equal(expectedColumn);
        });

        it("Scanner shall be able to identify decimal 'NUMBER' token.", () => {
          // Arrange
          const source = "23.64";
          const expectedTokenType = TokenType.NUMBER;
          const expectedLexeme = "23.64";
          const expectedLiteral = 23.64;
          const expectedLine = 0;
          const expectedColumn = 0;

          // Act
          scanner.load(source);
          const tokenList = scanner.scanTokens();
          const actualToken = tokenList[0];

          // Assert
          expect(actualToken.getType()).be.equal(expectedTokenType);
          expect(actualToken.getLexeme()).be.equal(expectedLexeme);
          expect(actualToken.getLiteral()).be.equal(expectedLiteral);
          expect(actualToken.getLine()).be.equal(expectedLine);
          expect(actualToken.getColumn()).be.equal(expectedColumn);
        });
      });

      it("Scanner shall be able to identify 'IDENTIFIER' token.", () => {
        // Arrange
        const source = "some_name";
        const expectedTokenType = TokenType.IDENTIFIER;
        const expectedLexeme = "some_name";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });
    });

    describe("Keywords tokens", () => {
      it("Scanner shall be able to identify 'AND' token.", () => {
        // Arrange
        const source = "and";
        const expectedTokenType = TokenType.AND;
        const expectedLexeme = "and";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'CLASS' token.", () => {
        // Arrange
        const source = "class";
        const expectedTokenType = TokenType.CLASS;
        const expectedLexeme = "class";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'ELSE' token.", () => {
        // Arrange
        const source = "else";
        const expectedTokenType = TokenType.ELSE;
        const expectedLexeme = "else";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'FALSE' token.", () => {
        // Arrange
        const source = "false";
        const expectedTokenType = TokenType.FALSE;
        const expectedLexeme = "false";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'FUN' token.", () => {
        // Arrange
        const source = "fun";
        const expectedTokenType = TokenType.FUN;
        const expectedLexeme = "fun";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'FOR' token.", () => {
        // Arrange
        const source = "for";
        const expectedTokenType = TokenType.FOR;
        const expectedLexeme = "for";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'IF' token.", () => {
        // Arrange
        const source = "if";
        const expectedTokenType = TokenType.IF;
        const expectedLexeme = "if";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'NIL' token.", () => {
        // Arrange
        const source = "nil";
        const expectedTokenType = TokenType.NIL;
        const expectedLexeme = "nil";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'OR' token.", () => {
        // Arrange
        const source = "or";
        const expectedTokenType = TokenType.OR;
        const expectedLexeme = "or";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'PRINT' token.", () => {
        // Arrange
        const source = "print";
        const expectedTokenType = TokenType.PRINT;
        const expectedLexeme = "print";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'RETURN' token.", () => {
        // Arrange
        const source = "return";
        const expectedTokenType = TokenType.RETURN;
        const expectedLexeme = "return";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'SUPER' token.", () => {
        // Arrange
        const source = "super";
        const expectedTokenType = TokenType.SUPER;
        const expectedLexeme = "super";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'THIS' token.", () => {
        // Arrange
        const source = "this";
        const expectedTokenType = TokenType.THIS;
        const expectedLexeme = "this";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'TRUE' token.", () => {
        // Arrange
        const source = "true";
        const expectedTokenType = TokenType.TRUE;
        const expectedLexeme = "true";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'VAR' token.", () => {
        // Arrange
        const source = "var";
        const expectedTokenType = TokenType.VAR;
        const expectedLexeme = "var";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });

      it("Scanner shall be able to identify 'WHILE' token.", () => {
        // Arrange
        const source = "while";
        const expectedTokenType = TokenType.WHILE;
        const expectedLexeme = "while";
        const expectedLiteral = null;
        const expectedLine = 0;
        const expectedColumn = 0;

        // Act
        scanner.load(source);
        const tokenList = scanner.scanTokens();
        const actualToken = tokenList[0];

        // Assert
        expect(actualToken.getType()).be.equal(expectedTokenType);
        expect(actualToken.getLexeme()).be.equal(expectedLexeme);
        expect(actualToken.getLiteral()).be.equal(expectedLiteral);
        expect(actualToken.getLine()).be.equal(expectedLine);
        expect(actualToken.getColumn()).be.equal(expectedColumn);
      });
    });
  });
});
