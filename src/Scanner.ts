import TokenType from "./enum/TokenType";
import Token from "./Token";

export default class Scanner {
  #source: String | undefined;
  #start: number;
  #current: number;
  #line: number;
  #tokenList: Token[];
  #hasError: boolean;

  constructor() {
    this.#source = undefined;
    this.#start = 0;
    this.#current = 0;
    this.#line = 0;
    this.#tokenList = [];
    this.#hasError = false;
  }

  load(source: String): void {
    this.#source = source;
  }

  peek(): string | undefined {
    return this.#source ? this.#source[this.#current] : undefined;
  }

  peekNext(n: number): string | undefined {
    if (!this.#source || n > this.#source.length - 1 - this.#current) {
      return undefined;
    }

    return this.#source[this.#current + n];
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
    if (!this.#source) return;

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
        if (this.peek() === "/") {
          while (!this.isEOL()) {
            this.advance();
          }
          this.#line += 1;
        } else if (this.peek() === "*") {
          let commentFlag = true;
          while (commentFlag && !this.isEOF()) {
            while (!this.isEOF() && this.peek() !== "*") {
              if (this.peek() === "\n") {
                this.#line += 1;
              }
              this.advance();
            }
            this.advance();
            if (this.peek() === "/") {
              commentFlag = false;
              this.advance();
            } else if (this.peek() === "\n") {
              this.#line += 1;
            }
          }
        } else {
          this.addToken(TokenType.SLASH, null);
        }
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
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.#line += 1;
        break;
      case '"':
        let newLineCounter = 0;
        while (this.peek() !== '"' && !this.isEOF()) {
          if (this.peek() === "\n") {
            newLineCounter += 1;
          }
          this.advance();
        }

        if (this.isEOF()) {
          break;
        }

        this.advance();

        this.addToken(
          TokenType.STRING,
          this.#source?.slice(this.#start + 1, this.#current - 1)
        );

        this.#line += newLineCounter;

        break;
      default:
        if (this.isNumber(currentChar)) {
          while (this.isNumber(this.peek())) {
            this.advance();
          }

          if (this.peek() === "." && this.isNumber(this.peekNext(1))) {
            this.advance();

            while (this.isNumber(this.peek())) {
              this.advance();
            }
          }

          this.addToken(
            TokenType.NUMBER,
            parseFloat(this.#source.slice(this.#start, this.#current))
          );
        } else if (this.isAlpha(currentChar)) {
          while (this.isAlphaNumeric(this.peek())) {
            this.advance();
          }

          switch (this.#source.slice(this.#start, this.#current)) {
            case "and":
              this.addToken(TokenType.AND, null);
              break;
            case "class":
              this.addToken(TokenType.CLASS, null);
              break;
            case "else":
              this.addToken(TokenType.ELSE, null);
            case "false":
              this.addToken(TokenType.FALSE, null);
            case "fun":
              this.addToken(TokenType.FUN, null);
            case "for":
              this.addToken(TokenType.FOR, null);
            case "if":
              this.addToken(TokenType.IF, null);
            case "nil":
              this.addToken(TokenType.NIL, null);
            case "or":
              this.addToken(TokenType.OR, null);
            case "print":
              this.addToken(TokenType.PRINT, null);
            case "return":
              this.addToken(TokenType.RETURN, null);
            case "super":
              this.addToken(TokenType.SUPER, null);
            case "this":
              this.addToken(TokenType.THIS, null);
            case "true":
              this.addToken(TokenType.TRUE, null);
            case "var":
              this.addToken(TokenType.VAR, null);
            case "while":
              this.addToken(TokenType.WHILE, null);
            default:
              this.addToken(TokenType.IDENTIFIER, null);
              break;
          }
        } else {
          console.log("Unexpected character.");
        }
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

  isEOL(): boolean {
    return this.isEOF() || this.peek() === "\n";
  }

  isNumber(char: string | undefined): boolean {
    return !!char && char >= "0" && char <= "9";
  }

  isAlpha(char: string | undefined): boolean {
    return (
      !!char &&
      ((char >= "a" && char <= "z") ||
        (char >= "A" && char <= "Z") ||
        char == "_")
    );
  }

  isAlphaNumeric(char: string | undefined): boolean {
    return this.isNumber(char) || this.isAlpha(char);
  }

  getSource(): String | undefined {
    return this.#source;
  }

  getTokenList(): Token[] {
    return this.#tokenList;
  }

  getLine(): number {
    return this.#line;
  }
}
