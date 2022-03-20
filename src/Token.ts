import TokenType from "./enum/TokenType";

export default class Token {
  #type: TokenType;
  #lexeme: string;
  #literal: any;
  #line: number;
  #column: number;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: any,
    line: number,
    column: number
  ) {
    this.#type = type;
    this.#lexeme = lexeme;
    this.#literal = literal;
    this.#line = line;
    this.#column = column;
  }

  getType(): TokenType {
    return this.#type;
  }

  getLexeme(): string {
    return this.#lexeme;
  }

  getLiteral(): any {
    return this.#literal;
  }

  getLine(): number {
    return this.#line;
  }

  getColumn(): number {
    return this.#column;
  }

  toString() {
    return `[${this.#type} ${this.#literal} ${this.#lexeme} ${this.#line} ${
      this.#column
    }]`;
  }
}
