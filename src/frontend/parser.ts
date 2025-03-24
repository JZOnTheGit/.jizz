import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration, AssignmentExpr, ObjectLiteral, Property, CallExpr, MemberExpr, FunctionDeclaration, StringLiteral, IfStatement, ReturnStatement } from "./ast";
import { Token, TokenType, tokensize} from "./lexer";

export default class Parser {
    private tokens: Token[] = [];
    
    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private peek() {
        return this.tokens[1] as Token;
    }

    private eat() {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err: any) {
        const current = this.at();
        if (!current || current.type !== type) {
            if (err.startsWith("Error at line")) {
                throw err;
            }
            throw `Error at line ${current.line}: ${err}`;
        }
        return this.eat();
    }

    public produceAST (sourceCode: string): Program {

        this.tokens = tokensize(sourceCode);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        // parse while end of file
        while(this.not_eof()){
            program.body.push(this.parse_stmt())
        }


        return program;
    }

    private parse_stmt (): Stmt {
        switch (this.at().type){
            case TokenType.Let:
                return this.parse_var_declaration();
            case TokenType.Const:
                return this.parse_var_declaration();
            case TokenType.Fn:
                return this.parse_function_declaration();
            case TokenType.If:
                return this.parse_if_statement();
            case TokenType.Skibidi:
                return this.parse_while_statement();
            case TokenType.Too:
                return this.parse_for_statement();
            case TokenType.Return:
                return this.parse_return_statement();
            default: {
                const expr = this.parse_expr();
                
                // Handle optional semicolon after expressions
                if (this.at().type === TokenType.Semicolon) {
                    this.eat(); // eat semicolon
                }
                
                return expr;
            }
        }
    }

    private parse_function_declaration(): Stmt {
        try {
            this.eat(); // eat fn keyword
            const name = this.expect(
                TokenType.Identifier,
                "Expected function name following fn keyword"
            ).value;

            

            const args = this.parse_args();
        
            const params: string[] = [];
            for (const arg of args) {
                if (arg.kind !== "Identifier") {
                    throw `Expected parameters to be identifiers`;
                }

                params.push((arg as Identifier).symbol);
            }

            this.expect(
                TokenType.OpenBrace,
                "Expected function body following declaration"
            );
            const body: Stmt[] = [];

            while (
                this.at().type !== TokenType.EOF &&
                this.at().type !== TokenType.CloseBrace
            ) {
                body.push(this.parse_stmt());
            }

            this.expect(
                TokenType.CloseBrace,
                "Expected closing brace after function body"
            );

            const fn = {
                body,
                name,
                parameters: params,
                kind: "FunctionDeclaration",
            } as FunctionDeclaration;

            return fn;
        } catch (error) {
            if (typeof error === "string") {
                throw error;
            }
            throw `Error at line ${this.at().line}: ${error}`;
        }
    }
    parse_var_declaration(): Stmt {
        const startToken = this.at();  // Store the starting token
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(TokenType.Identifier, "Expected identifier name after let/const").value;
       
        if (this.at().type == TokenType.Semicolon) {
            this.eat(); //expect semicolon
            if (isConstant) {
                throw `Error at line ${startToken.line}: Constants must be initialized with a value`;
            }

            return {
                kind: "VarDeclaration",
                constant: false,
                identifier,
            } as VarDeclaration;
        }

        this.expect(TokenType.Equals, "Expected equals sign (=) after variable name");
        const value = this.parse_expr();
        const declaration = {
            kind: "VarDeclaration",
            constant: isConstant,
            identifier,
            value,
        } as VarDeclaration;

        // Use the line number from the last expression's token
        const currentToken = this.at();
        const lastExprToken = value.kind === "StringLiteral" || value.kind === "NumericLiteral" ? 
            { line: (value as any).line || startToken.line } : 
            { line: currentToken.line };

        if (currentToken.type !== TokenType.Semicolon) {
            throw `Error at line ${lastExprToken.line}: Missing semicolon (;) after variable declaration`;
        }
        this.eat(); // eat the semicolon
        return declaration;
    }

    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr();

        if (this.at().type == TokenType.Equals) {
            this.eat();
            const value = this.parse_assignment_expr();
            return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        return left;
    }

    private parse_object_expr(): Expr {
        if (this.at().type !== TokenType.OpenBrace) {
            return this.parse_comparison_expr();
        }

        this.eat();
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
            const key = this.expect(TokenType.Identifier, "Object literal key expected").value;
            
            //allows shorthand key: pair -> {key,}
            if (this.at().type == TokenType.Comma) {
                this.eat();
                // Create an Identifier expression for the shorthand property
                const identExpr = { kind: "Identifier", symbol: key } as Identifier;
                properties.push({key, kind: "Property", value: identExpr} as Property);
                continue;
            }
            //allows shorthand key: pair -> {key}
            else if (this.at().type == TokenType.CloseBrace) {
                // Create an Identifier expression for the shorthand property
                const identExpr = { kind: "Identifier", symbol: key } as Identifier;
                properties.push({key, kind: "Property", value: identExpr} as Property);
                continue;
            }

            this.expect(TokenType.Colon, "Expected : after object literal key");
            const value = this.parse_expr();

            properties.push({key, value, kind: "Property"});
            if(this.at().type != TokenType.CloseBrace) {
                this.expect(TokenType.Comma, "Expected (,) or closing bracket after object literal property");
            }
        }

        this.expect(TokenType.CloseBrace, "Expected closing brace (]) after object literal");
        return {kind: "ObjectLiteral", properties} as ObjectLiteral;
    }

    private parse_comparison_expr(): Expr {
        let left = this.parse_additive_expr();

        while (this.at().type == TokenType.ComparisonOperator) {
            const operator = this.eat().value;
            const right = this.parse_additive_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();

        while (this.at().type == TokenType.BinaryOperator && (this.at().value == "+" || this.at().value == "-")) {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_call_member_expr();

        while (this.at().type == TokenType.BinaryOperator && (this.at().value == "*" || this.at().value == "/" || this.at().value == "%")) {
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_call_member_expr(): Expr {
        let member = this.parse_member_expr();

        while (this.at().type == TokenType.OpenParen) {
            member = this.parse_call_expr(member);
        }

        return member;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();

        while (
            this.at().type == TokenType.Dot || 
            this.at().type == TokenType.OpenBracket
        ) {
            const operator = this.eat();
            let property: Expr;
            let computed: boolean;

            if (operator.type == TokenType.Dot) {
                computed = false;
                property = this.parse_primary_expr();
                if (property.kind != "Identifier") {
                    throw `Cannot use dot operator without right hand side being a identifier`;
                }
            } else {
                computed = true;
                property = this.parse_expr();
                this.expect(TokenType.CloseBracket, "Expected closing bracket after array index");
            }

            object = {
                kind: "MemberExpr",
                object,
                property,
                computed
            } as MemberExpr;
        }

        return object;
    }

    private parse_call_expr (caller: Expr): Expr {
        let call_expr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parse_args(),
        } as CallExpr;

        if (this.at().type == TokenType.OpenParen){
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args (): Expr[] {
        this.expect(TokenType.OpenParen, "Expected opening parenthesis");

        const args = this.at().type == TokenType.CloseParen ? [] : this.parse_arguments_list();


        this.expect(TokenType.CloseParen, "Expected closing parenthesis");

        return args;
    }

    private parse_arguments_list (): Expr[] {
        const args = [this.parse_expr()];

        while (this.at().type == TokenType.Comma && this.eat()){
            args.push(this.parse_assignment_expr()) 

        }

        return args;
    }

    //orders of prescidence
    // AssignmentExpr
    // ObjectLiteral
   
    // AddictiveExpr
    // MultiplicativeExpr
    // CallExpr
    // MemberExpr
  
    // PrimaryExpr

    private parse_primary_expr (): Expr {
        const tk = this.at().type;

        switch (tk){
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;

            case TokenType.String:
                return { kind: "StringLiteral", value: this.eat().value } as StringLiteral;

            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;

            case TokenType.OpenParen: {
                this.eat(); // eat opening paren
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen, "Expected closing parenthesis");
                return value;
            }

            default:
                throw `Error at line ${this.at().line}: Unexpected token ${TokenType[this.at().type]}`;
        }
    }

    private parse_if_statement(): Stmt {
        const ifToken = this.at();  // Store the 'if' token for error reporting
        this.eat(); // eat 'if'
        
        // Check for missing parenthesis
        if (this.at().type !== TokenType.OpenParen) {
            throw `Error at line ${ifToken.line}: Expected opening parenthesis after if keyword`;
        }
        this.eat(); // eat '('
        
        const condition = this.parse_expr();
        
        if (this.at().type !== TokenType.CloseParen) {
            throw `Error at line ${ifToken.line}: Expected closing parenthesis after if condition`;
        }
        this.eat(); // eat ')'
        
        if (this.at().type !== TokenType.OpenBrace) {
            throw `Error at line ${ifToken.line}: Expected opening brace after if condition`;
        }
        this.eat(); // eat '{'
        
        const thenBranch: Stmt[] = [];
        while (this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
            thenBranch.push(this.parse_stmt());
        }
        
        if (this.at().type !== TokenType.CloseBrace) {
            throw `Error at line ${ifToken.line}: Missing closing brace for if statement`;
        }
        this.eat(); // eat '}'
        
        const elifBranches: Array<{condition: Expr, body: Stmt[]}> = [];
        let elseBranch: Stmt[] | undefined;
        
        while (this.at().type === TokenType.Else) {
            const elseToken = this.at();  // Store the 'else' token for error reporting
            this.eat(); // eat 'else'
            
            if (this.at().type === TokenType.If) {
                // else if branch
                this.eat(); // eat 'if'
                if (this.at().type !== TokenType.OpenParen) {
                    throw `Error at line ${elseToken.line}: Expected opening parenthesis after else if`;
                }
                this.eat(); // eat '('
                
                const elifCondition = this.parse_expr();
                
                if (this.at().type !== TokenType.CloseParen) {
                    throw `Error at line ${elseToken.line}: Expected closing parenthesis after else if condition`;
                }
                this.eat(); // eat ')'
                
                if (this.at().type !== TokenType.OpenBrace) {
                    throw `Error at line ${elseToken.line}: Expected opening brace after else if condition`;
                }
                this.eat(); // eat '{'
                
                const elifBody: Stmt[] = [];
                while (this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
                    elifBody.push(this.parse_stmt());
                }
                
                if (this.at().type !== TokenType.CloseBrace) {
                    throw `Error at line ${elseToken.line}: Missing closing brace for else if statement`;
                }
                this.eat(); // eat '}'
                
                elifBranches.push({condition: elifCondition, body: elifBody});
            } else {
                // else branch
                if (this.at().type !== TokenType.OpenBrace) {
                    throw `Error at line ${elseToken.line}: Expected opening brace after else`;
                }
                this.eat(); // eat '{'
                
                elseBranch = [];
                while (this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
                    elseBranch.push(this.parse_stmt());
                }
                
                if (this.at().type !== TokenType.CloseBrace) {
                    throw `Error at line ${elseToken.line}: Missing closing brace for else statement`;
                }
                this.eat(); // eat '}'
                break; // else is always the last branch
            }
        }
        
        return {
            kind: "IfStatement",
            condition,
            thenBranch,
            elifBranches,
            elseBranch,
        } as IfStatement;
    }

    private parse_return_statement(): Stmt {
        this.eat(); // eat 'return'
        
        let value: Expr | undefined;
        if (this.at().type !== TokenType.Semicolon) {
            value = this.parse_expr();
        }
        
        if (this.at().type === TokenType.Semicolon) {
            this.eat(); // eat semicolon
        }
        
        return {
            kind: "ReturnStatement",
            value
        } as ReturnStatement;
    }

    private parse_while_statement(): Stmt {
        const skibidiToken = this.at();  // Store the 'skibidi' token for error reporting
        this.eat(); // eat 'skibidi'
        
        // Check for opening parenthesis
        if (this.at().type !== TokenType.OpenParen) {
            throw `Error at line ${skibidiToken.line}: Expected opening parenthesis after skibidi keyword`;
        }
        this.eat(); // eat '('
        
        const condition = this.parse_expr();
        
        // Check for closing parenthesis
        if (this.at().type !== TokenType.CloseParen) {
            throw `Error at line ${skibidiToken.line}: Expected closing parenthesis after skibidi condition`;
        }
        this.eat(); // eat ')'
        
        // Check for opening brace
        if (this.at().type !== TokenType.OpenBrace) {
            throw `Error at line ${skibidiToken.line}: Expected opening brace after skibidi condition`;
        }
        this.eat(); // eat '{'
        
        const body: Stmt[] = [];
        while (this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parse_stmt());
        }
        
        // Check for closing brace
        if (this.at().type !== TokenType.CloseBrace) {
            throw `Error at line ${skibidiToken.line}: Missing closing brace for skibidi statement`;
        }
        this.eat(); // eat '}'
        
        return {
            kind: "WhileStatement",
            condition,
            body,
        };
    }

    private parse_for_statement(): Stmt {
        const tooToken = this.at();  // Store the 'too' token for error reporting
        this.eat(); // eat 'too'
        
        // Check for opening parenthesis
        if (this.at().type !== TokenType.OpenParen) {
            throw `Error at line ${tooToken.line}: Expected opening parenthesis after too keyword`;
        }
        this.eat(); // eat '('
        
        // Parse initializer - either a var declaration or an expression
        let initializer: Stmt | undefined;
        if (this.at().type === TokenType.Semicolon) {
            // No initializer
            this.eat(); // eat semicolon
        } else if (this.at().type === TokenType.Let || this.at().type === TokenType.Const) {
            initializer = this.parse_var_declaration();
        } else {
            initializer = this.parse_expr();
            if (this.at().type !== TokenType.Semicolon) {
                throw `Error at line ${tooToken.line}: Expected semicolon after too initializer`;
            }
            this.eat(); // eat semicolon
        }
        
        // Parse condition
        let condition: Expr | undefined;
        if (this.at().type !== TokenType.Semicolon) {
            condition = this.parse_expr();
        }
        
        if (this.at().type !== TokenType.Semicolon) {
            throw `Error at line ${tooToken.line}: Expected semicolon after too condition`;
        }
        this.eat(); // eat semicolon
        
        // Parse increment
        let increment: Expr | undefined;
        if (this.at().type !== TokenType.CloseParen) {
            increment = this.parse_expr();
        }
        
        if (this.at().type !== TokenType.CloseParen) {
            throw `Error at line ${tooToken.line}: Expected closing parenthesis after too increment`;
        }
        this.eat(); // eat ')'
        
        // Check for opening brace
        if (this.at().type !== TokenType.OpenBrace) {
            throw `Error at line ${tooToken.line}: Expected opening brace after too header`;
        }
        this.eat(); // eat '{'
        
        const body: Stmt[] = [];
        while (this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parse_stmt());
        }
        
        // Check for closing brace
        if (this.at().type !== TokenType.CloseBrace) {
            throw `Error at line ${tooToken.line}: Missing closing brace for too statement`;
        }
        this.eat(); // eat '}'
        
        return {
            kind: "ForStatement",
            initializer,
            condition,
            increment,
            body,
        };
    }
}