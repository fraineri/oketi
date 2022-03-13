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

  advance(): void {
    this.#current += 1;
  }

  // scan(): Token[] {
  //   const currentChar = this.peek();
  //   switch (currentChar) {
  //     case "(":
  //   }
  //   return tokenList;
  // }

  addToken(tokenType: TokenType, literal: any): void {
    if (!this.#source) return;

    const lexeme: string = this.#source.slice(this.#start, this.#current);
    this.#tokenList.push(
      new Token(tokenType, lexeme, literal, this.#line, this.#start)
    );
  }

  getSource(): String | undefined {
    return this.#source;
  }

  getTokenList(): Token[] {
    return this.#tokenList;
  }
}
