import { createInterface } from "readline";

enum SyntaxKind {
  INVALID_TOKEN = "INVALID_TOKEN",
  NUMBER_TOKEN = "NUMBER_TOKEN",
  WHITE_SPACE_TOKEN = "WHITE_SPACE_TOKEN",
  PLUS_TOKEN = "PLUS_TOKEN",
  MINUS_TOKEN = "MINUS_TOKEN",
  STAR_TOKEN = "STAR_TOKEN",
  SLASH_TOKEN = "SLASH_TOKEN",
  OPEN_PARENTHESIS_TOKEN = "OPEN_PARENTHESIS_TOKEN",
  CLOSE_PARENTHESIS_TOKEN = "CLOSE_PARENTHESIS_TOKEN",
  END_OF_FILE_TOKEN = "END_OF_FILE_TOKEN",
}

class SyntaxToken {
  public kind: SyntaxKind;
  public position: number;
  public text: string;
  public value: any;

  constructor(kind: SyntaxKind, position: number, text: string, value: any) {
    this.kind = kind;
    this.position = position;
    this.text = text;
    this.value = value;
  }
}

class Lexer {
  private readonly completeText: string;
  private position: number;

  constructor(text: string) {
    this.completeText = text;
    this.position = 0;
  }

  private CurrentChar(): string {
    if (this.position >= this.completeText.length) {
      return "\0";
    }

    return this.completeText[this.position];
  }

  private Next(): void {
    this.position++;
  }

  public NextToken(): SyntaxToken {
    let start = this.position;
    let length: number;
    let text: string;

    if (this.position >= this.completeText.length) {
      return new SyntaxToken(
        SyntaxKind.END_OF_FILE_TOKEN,
        this.position,
        "\0",
        null
      );
    }

    if (Number(this.CurrentChar())) {
      start = this.position;

      while (Number(this.CurrentChar())) {
        this.Next();
      }

      length = this.position - start;
      text = this.completeText.substring(start, start + length);
      let value: number = Number(text);
      return new SyntaxToken(SyntaxKind.NUMBER_TOKEN, start, text, value);
    }

    if (this.CurrentChar() === " ") {
      while (this.CurrentChar() === " ") {
        this.Next();
      }

      length = this.position - start;
      text = this.completeText.substring(start, start + length);
      return new SyntaxToken(SyntaxKind.WHITE_SPACE_TOKEN, start, text, null);
    }

    if (this.CurrentChar() === "+") {
      return new SyntaxToken(SyntaxKind.PLUS_TOKEN, this.position++, "+", null);
    } else if (this.CurrentChar() === "-") {
      return new SyntaxToken(
        SyntaxKind.MINUS_TOKEN,
        this.position++,
        "-",
        null
      );
    } else if (this.CurrentChar() === "*") {
      return new SyntaxToken(SyntaxKind.STAR_TOKEN, this.position++, "*", null);
    } else if (this.CurrentChar() === "/") {
      return new SyntaxToken(
        SyntaxKind.SLASH_TOKEN,
        this.position++,
        "/",
        null
      );
    } else if (this.CurrentChar() === "(") {
      return new SyntaxToken(
        SyntaxKind.OPEN_PARENTHESIS_TOKEN,
        this.position++,
        "(",
        null
      );
    } else if (this.CurrentChar() === ")") {
      return new SyntaxToken(
        SyntaxKind.CLOSE_PARENTHESIS_TOKEN,
        this.position++,
        ")",
        null
      );
    }

    return new SyntaxToken(
      SyntaxKind.INVALID_TOKEN,
      this.position++,
      this.completeText.substring(this.position - 1, this.position),
      null
    );
  }
}

const main = async () => {
  let lexer: Lexer;

  process.stdout.write("> ");
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  for await (const line of readline) {
    if (!line) return;

    lexer = new Lexer(line);

    while (true) {
      let token: SyntaxToken = lexer.NextToken();
      if (token.kind === SyntaxKind.END_OF_FILE_TOKEN) {
        break;
      }

      console.log(
        `${token.kind} : ${token.text} ${token.value ? `: ${token.value}` : ""}`
      );
    }
  }
};

main();
