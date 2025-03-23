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
    
    // Grouping Tokens
    OpenParen, //(
    CloseParen, //)
    OpenBrace, //{  
    CloseBrace, //}
    OpenBracket, //[
    CloseBracket, //]
    
    // Keywords
    Let, //let
    Const, //const
    If, //if
    Else, //else
    Return,
    
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
    let: TokenType.Let,
    const: TokenType.Const,
    fn: TokenType.Fn,
    if: TokenType.If,
    else: TokenType.Else,
    return: TokenType.Return,
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

        console.log(`Tokenizing line ${currentLine}: ${line}`);
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
                const token = { type: TokenType.String, value: value, line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                continue;
            }

            // Handle operators and other single-character tokens
            if (line[i] === '(') {
                const token = { type: TokenType.OpenParen, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === ')') {
                const token = { type: TokenType.CloseParen, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === '{') {
                const token = { type: TokenType.OpenBrace, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === '}') {
                const token = { type: TokenType.CloseBrace, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === '[') {
                const token = { type: TokenType.OpenBracket, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === ']') {
                const token = { type: TokenType.CloseBracket, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === ':') {
                const token = { type: TokenType.Colon, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === ';') {
                const token = { type: TokenType.Semicolon, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === ',') {
                const token = { type: TokenType.Comma, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === '.') {
                const token = { type: TokenType.Dot, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if (line[i] === '=') {
                if (i + 1 < line.length && line[i + 1] === '=') {
                    const token = { type: TokenType.ComparisonOperator, value: "==", line: currentLine };
                    console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                    tokens.push(token);
                    i += 2;
                } else {
                    const token = { type: TokenType.Equals, value: "=", line: currentLine };
                    console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                    tokens.push(token);
                    i++;
                }
            } else if (line[i] === '+' || line[i] === '-' || line[i] === '*' || line[i] === '/') {
                // Check for comments first
                if (line[i] === '/' && line[i + 1] === '/') {
                    // Skip until end of line
                    while (i < line.length && line[i] !== '\n') {
                        i++;
                    }
                    continue;
                }
                
                const token = { type: TokenType.BinaryOperator, value: line[i], line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
                i++;
            } else if ("<>!".includes(line[i])) {
                let operator = line[i];
                i++;
                
                if (i < line.length && line[i] === '=') {
                    operator += '=';
                    i++;
                }
                const token = { type: TokenType.ComparisonOperator, value: operator, line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
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
                const token = { type: TokenType.Number, value: num, line: currentLine };
                console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                tokens.push(token);
            } else if (isalpha(line[i])) {
                let ident = "";
                while (i < line.length && isvalididentifier(line[i])) {
                    ident += line[i];
                    i++;
                }
                
                const reserved = KEYWORDS[ident];
                if (reserved) {
                    const token = { type: reserved, value: ident, line: currentLine };
                    console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                    tokens.push(token);
                } else {
                    const token = { type: TokenType.Identifier, value: ident, line: currentLine };
                    console.log(`Generated token: ${TokenType[token.type]} (${token.value})`);
                    tokens.push(token);
                }
            } else if (iswhitespace(line[i])) {
                i++;
            } else {
                throw `Error at line ${currentLine}: Unrecognized character found: ${line[i]}`;
            }
        }
        currentLine++;
    }

    const eofToken = { type: TokenType.EOF, value: "EndOfFile", line: currentLine };
    console.log(`Generated token: ${TokenType[eofToken.type]} (${eofToken.value})`);
    tokens.push(eofToken);
    return tokens;
}

// Test the tokenizer
//const source = await Deno.readTextFile("./test.txt")
//for(const token of tokensize(source)){
//    console.log(token);
//}
