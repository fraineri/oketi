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
    this.#line = 1;
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
    return this.#tokenList;
  }

  scanToken(): void {
    const currentChar = this.advance();
    console.log("CURCH", currentChar);
    switch (currentChar) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN, null);
        break;
      default:
        console.log("Unexpected character.");
    }
  }

  addToken(tokenType: TokenType, literal: any): void {
    if (!this.#source) return;

    const lexeme: string = this.#source.slice(this.#start, this.#current);
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
