// Token type definitions
export enum TokenType {
    // Literal Types
    Number,
    Identifier,
    String,
    TemplateString,
    
    // Operators
    Equals, //=
    BinaryOperator, //+ - * / %
    ComparisonOperator, // < > <= >= == !=
    LogicalOperator, // && || !
    QuestionMark, // ?
    
    // Grouping Tokens
    OpenParen, //(
    CloseParen, //)
    OpenBrace, //{  
    CloseBrace, //}
    OpenBracket, //[
    CloseBracket, //]
    
    // Keywords
    Let, //ts
    Const, //const
    If, //if
    Else, //else
    Skibidi, //skibidi (was while)
    Too, //too (was for)
    Return,
    Try, //try
    Catch, //catch
    Throw,
    
    // Separators
    Semicolon, //;
    Comma, //,
    Colon, //:
    Dot, //.

    Fn, //fn

    EOF, //signified the end of file
}

// Keywords dictionary
const KEYWORDS: Record<string, TokenType> = {
    ts: TokenType.Let,
    const: TokenType.Const,
    typeshii: TokenType.Fn,  // changed from "fn" to "typeshii" for function declarations
    if: TokenType.If,
    else: TokenType.Else,
    skibidi: TokenType.Skibidi,  // only skibidi for while loops
    too: TokenType.Too,          // only too for for loops
    return: TokenType.Return,
    try: TokenType.Try,
    catch: TokenType.Catch,
    throw: TokenType.Throw,
}

// Token interface definition
export interface Token {
    value: string;
    type: TokenType;
    line: number;  // Add line number tracking
}

// Helper functions
function create_token(value = "", type: TokenType, line: number): Token {
    return { value, type, line };
}

function isalpha(src: string) {
    return src.toUpperCase() != src.toLowerCase() || src === '_';
}

function isvalididentifier(src: string) {
    return isalpha(src) || isint(src);
}

function isskippable(src: string) {
    return src == " " || src == "\n" || src == "\t" || src == "\r";
}

function isint(src: string) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return(c >= bounds[0] && c <= bounds[1]);
}

function iswhitespace(str: string): boolean {
    return /\s/.test(str);
}

// Main tokenizer function
export function tokensize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const lines = sourceCode.split("\n");
    let currentLine = 1;

    for (const line of lines) {
        if (line.trim() === "" || line.trim().startsWith("//")) {
            currentLine++;
            continue;
        }

        let i = 0;
        while (i < line.length) {
            if (isskippable(line[i])) {
                i++;
                continue;
            }

            // Handle comments
            if (line[i] === '/' && line[i + 1] === '/') {
                // Skip until end of line
                while (i < line.length && line[i] !== '\n') {
                    i++;
                }
                continue;
            }

            // Handle string literals
            if (line[i] === '"') {
                let value = "";
                i++; // Move past the opening quote
                while (i < line.length && line[i] !== '"') {
                    value += line[i];
                    i++;
                }
                if (i >= line.length) {
                    throw `Error at line ${currentLine}: Unterminated string literal`;
                }
                i++; // Move past the closing quote
                tokens.push({ type: TokenType.String, value: value, line: currentLine });
                continue;
            }

            // Handle operators and other single-character tokens
            if (line[i] === '(') {
                tokens.push({ type: TokenType.OpenParen, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === ')') {
                tokens.push({ type: TokenType.CloseParen, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === '{') {
                tokens.push({ type: TokenType.OpenBrace, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === '}') {
                tokens.push({ type: TokenType.CloseBrace, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === '[') {
                tokens.push({ type: TokenType.OpenBracket, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === ']') {
                tokens.push({ type: TokenType.CloseBracket, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === ':') {
                tokens.push({ type: TokenType.Colon, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === ';') {
                tokens.push({ type: TokenType.Semicolon, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === ',') {
                tokens.push({ type: TokenType.Comma, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === '.') {
                tokens.push({ type: TokenType.Dot, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === '?') {
                tokens.push({ type: TokenType.QuestionMark, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === '=') {
                if (i + 1 < line.length && line[i + 1] === '=') {
                    tokens.push({ type: TokenType.ComparisonOperator, value: "==", line: currentLine });
                    i += 2;
                } else {
                    tokens.push({ type: TokenType.Equals, value: "=", line: currentLine });
                    i++;
                }
            } else if (line[i] === '+' || line[i] === '-' || line[i] === '*' || line[i] === '/' || line[i] === '%') {
                // Check for comments first
                if (line[i] === '/' && line[i + 1] === '/') {
                    // Skip until end of line
                    while (i < line.length && line[i] !== '\n') {
                        i++;
                    }
                    continue;
                }
                
                tokens.push({ type: TokenType.BinaryOperator, value: line[i], line: currentLine });
                i++;
            } else if (line[i] === '&' && i + 1 < line.length && line[i + 1] === '&') {
                tokens.push({ type: TokenType.LogicalOperator, value: "&&", line: currentLine });
                i += 2;
            } else if (line[i] === '|' && i + 1 < line.length && line[i + 1] === '|') {
                tokens.push({ type: TokenType.LogicalOperator, value: "||", line: currentLine });
                i += 2;
            } else if (line[i] === '!') {
                if (i + 1 < line.length && line[i + 1] === '=') {
                    tokens.push({ type: TokenType.ComparisonOperator, value: "!=", line: currentLine });
                    i += 2;
                } else {
                    tokens.push({ type: TokenType.LogicalOperator, value: "!", line: currentLine });
                    i++;
                }
            } else if ("<>".includes(line[i])) {
                let operator = line[i];
                i++;
                
                if (i < line.length && line[i] === '=') {
                    operator += '=';
                    i++;
                }
                tokens.push({ type: TokenType.ComparisonOperator, value: operator, line: currentLine });
            } else if (isint(line[i]) || (line[i] === '.' && i + 1 < line.length && isint(line[i + 1]))) {
                let num = "";
                let hasDecimal = false;
                
                // Handle leading decimal point
                if (line[i] === '.') {
                    num = "0.";
                    hasDecimal = true;
                    i++;
                }
                
                while (i < line.length) {
                    if (isint(line[i])) {
                        num += line[i];
                    } else if (line[i] === '.' && !hasDecimal) {
                        num += line[i];
                        hasDecimal = true;
                    } else {
                        break;
                    }
                    i++;
                }
                tokens.push({ type: TokenType.Number, value: num, line: currentLine });
            } else if (isalpha(line[i])) {
                let ident = "";
                while (i < line.length && isvalididentifier(line[i])) {
                    ident += line[i];
                    i++;
                }
                
                const reserved = KEYWORDS[ident];
                if (reserved) {
                    tokens.push({ type: reserved, value: ident, line: currentLine });
                } else {
                    tokens.push({ type: TokenType.Identifier, value: ident, line: currentLine });
                }
            } else if (iswhitespace(line[i])) {
                i++;
            } else {
                throw `Error at line ${currentLine}: Unrecognized character found: ${line[i]}`;
            }
        }
        currentLine++;
    }

    tokens.push({ type: TokenType.EOF, value: "EndOfFile", line: currentLine });
    return tokens;
}

// Test the tokenizer
//const source = await Deno.readTextFile("./test.txt")
//for(const token of tokensize(source)){
//    console.log(token);
//}
