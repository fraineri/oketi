import TokenType from "./enum/TokenType";
import Token from "./Token";

export default class Scanner {
  #source: String | undefined;
  #start: number;
  #current: number;
  #line: number;
  #tokenList: Token[];

  constructor() {
    this.#source = undefined;
    this.#start = 0;
    this.#current = 0;
    this.#line = 0;
    this.#tokenList = [];
  }

  load(source: String): void {
    this.#source = source;
  }

  peek(): string | undefined {
    return this.#source ? this.#source[this.#current] : undefined;
  }

  advance(): string | undefined {
    const currentChar = this.#source?.charAt(this.#current);
    this.#current += 1;
    return currentChar;
  }

  scanTokens(): Token[] {
    while (!this.isEOF()) {
      this.scanToken();
    }

    this.addToken(TokenType.EOF, "");
    return this.#tokenList;
  }

  scanToken(): void {
    const currentChar = this.advance();
    switch (currentChar) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN, null);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN, null);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE, null);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE, null);
        break;
      case ",":
        this.addToken(TokenType.COMMA, null);
        break;
      case ".":
        this.addToken(TokenType.DOT, null);
        break;
      case "-":
        this.addToken(TokenType.MINUS, null);
        break;
      case "+":
        this.addToken(TokenType.PLUS, null);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON, null);
        break;
      case "/":
        this.addToken(TokenType.SLASH, null);
        break;
      case "*":
        this.addToken(TokenType.STAR, null);
        break;
      case "!":
        if (this.peek() === "=") {
          this.advance();
          this.addToken(TokenType.BANG_EQUAL, null);
        } else {
          this.addToken(TokenType.BANG, null);
        }
        break;
      case "=":
        if (this.peek() === "=") {
          this.advance();
          this.addToken(TokenType.EQUAL_EQUAL, null);
        } else {
          this.addToken(TokenType.EQUAL, null);
        }
        break;
      case ">":
        if (this.peek() === "=") {
          this.advance();
          this.addToken(TokenType.GREATER_EQUAL, null);
        } else {
          this.addToken(TokenType.GRATER, null);
        }
        break;
      case "<":
        if (this.peek() === "=") {
          this.advance();
          this.addToken(TokenType.LESS_EQUAL, null);
        } else {
          this.addToken(TokenType.LESS, null);
        }
        break;
      default:
        console.log("Unexpected character.");
    }
  }

  addToken(tokenType: TokenType, literal: any): void {
    const lexeme: string = this.#source
      ? this.#source.slice(this.#start, this.#current)
      : "";
    this.#tokenList.push(
      new Token(tokenType, lexeme, literal, this.#line, this.#start)
    );
  }

  isEOF(): boolean {
    return !this.#source || this.#current >= this.#source.length;
  }

  getSource(): String | undefined {
    return this.#source;
  }

  getTokenList(): Token[] {
    return this.#tokenList;
  }
}
