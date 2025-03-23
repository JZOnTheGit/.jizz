// Token type definitions
export enum TokenType {
    // Literal Types
    Number,
    Identifier,
    String,
    
    // Operators
    Equals, //=
    BinaryOperator, //+ - * / %
    
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

}

// Token interface definition
export interface Token {
    value: string;
    type: TokenType;
}

// Helper functions
function token(value = "", type: TokenType): Token {
    return { value, type };
}

function isalpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isskippable(src: string) {
    return src == " " || src == "\n" || src == "\t" || src == "\r";
}

function isint(src: string) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return(c >= bounds[0] && c <= bounds[1]);
}

// Main tokenizer function
export function tokensize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    //build tokens
    while (src.length > 0) {
        // Handle single-character tokens
        if (src[0] == "("){
            tokens.push(token(src.shift(), TokenType.OpenParen));
                
        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if (src[0] == "{") {
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        }else if (src[0] == "}") {
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        }else if (src[0] == "[") {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        }else if (src[0] == "]") {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        }else if (src[0] == ";") {
            tokens.push(token(src.shift(), TokenType.Semicolon));
        } else if (src[0] == ",") {
            tokens.push(token(src.shift(), TokenType.Comma));
        } else if (src[0] == ":") {
            tokens.push(token(src.shift(), TokenType.Colon));
        } else if (src[0] == ".") {
            tokens.push(token(src.shift(), TokenType.Dot));
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else {
            // Handle multi-character tokens
            if(isint(src[0])) {
                // Parse numbers
                let num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));

            } else if (isalpha(src[0])) {
                // Parse identifiers and keywords
                let ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }

                //check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (typeof reserved == "number") {
                    
                    tokens.push(token(ident, reserved));
                } else {
                    tokens.push(token(ident, TokenType.Identifier));                }
            } else if (isskippable(src[0])) {
                // Skip whitespace
                src.shift();
            } else {
                // Handle invalid characters
                console.log("Unexpected character found in source: " + src[0]);
                Deno.exit(1);
            }
        }
    }

    tokens.push({type: TokenType.EOF, value: "EndOfFile"});
    return tokens;
}

// Test the tokenizer
//const source = await Deno.readTextFile("./test.txt")
//for(const token of tokensize(source)){
//    console.log(token);
//}
