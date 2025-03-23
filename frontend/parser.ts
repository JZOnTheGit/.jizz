import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration, AssignmentExpr, ObjectLiteral, Property, CallExpr, MemberExpr, FunctionDeclaration} from "./ast.ts";
import { Token, TokenType, tokensize} from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];
    
    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at(){
        return this.tokens[0] as Token;
    }

    private eat (){
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect (type: TokenType, err: any){
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type ){
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type)
            Deno.exit(2);

        }

        return prev;
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
            default:
                return this.parse_expr();
        }
    }

    private parse_function_declaration(): Stmt {
		this.eat(); // eat fn keyword
		const name = this.expect(
			TokenType.Identifier,
			"Expected function name following fn keyword"
		).value;

        

		const args = this.parse_args();
    
		const params: string[] = [];
		for (const arg of args) {
			if (arg.kind !== "Identifier") {
				console.log(arg);
				throw "Inside function declaration expected parameters to be of type string.";
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
			"Closing brace expected inside function declaration"
		);

		const fn = {
			body,
			name,
			parameters: params,
			kind: "FunctionDeclaration",
		} as FunctionDeclaration;

		return fn;
	}
    parse_var_declaration(): Stmt {
        const isConstant = this.eat().type == TokenType.Const;

        const identifier = this.expect(TokenType.Identifier, "Expected identifier after const/let keyword").value;
       
        if (this.at().type == TokenType.Semicolon){
            this.eat(); //expect semicolon
            if (isConstant){
                throw "You need to assign a value to constant expression cuh, dumbass | no value provided";
            }

            return {
                kind: "VarDeclaration",
                constant: false,
                identifier,
                
            } as VarDeclaration;

        }

        this.expect(TokenType.Equals, "Expected = after identifier in variable declaration");

        const declaration = {
            kind: "VarDeclaration",
            constant: isConstant,
            identifier,
            value: this.parse_expr(),
        } as VarDeclaration;

        this.expect(TokenType.Semicolon, "Expected ; after variable declaration dumbass");

        return declaration;
        
        
    }

    private parse_expr (): Expr {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr (): Expr {

        const left = this.parse_object_expr();

        if (this.at().type == TokenType.Equals){
            this.eat();
            const value = this.parse_assignment_expr();
            return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        return left;

    }

    private parse_object_expr (): Expr {
        if (this.at().type !== TokenType.OpenBrace){
            return this.parse_additive_expr();
        }

        this.eat()
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type !== TokenType.CloseBrace){
            const key = this.expect(TokenType.Identifier, "Object literal key expected").value;
            
            //allows shorthand key: pair -> {key,}
            if (this.at().type == TokenType.Comma){
                this.eat();
                properties.push({key, kind: "Property"} as Property);
                continue;
            }
            //allows shorthand key: pair -> {key}
            else if (this.at().type == TokenType.CloseBrace){
                
                properties.push({key, kind: "Property"});
                continue;
            }

            this.expect(TokenType.Colon, "Expected : after object literal key");
            const value = this.parse_expr();

            properties.push({key, value, kind: "Property"});
            if(this.at().type != TokenType.CloseBrace){
                this.expect(TokenType.Comma, "Expected (,) or closing bracket after object literal property");
            }
                
        }

        this.expect(TokenType.CloseBrace, "Expected closing brace (]) after object literal");
        return {kind: "ObjectLiteral", properties} as ObjectLiteral;
    }

    private parse_additive_expr (): Expr {
        let left = this.parse_multiplicative_expr();

        while(this.at().value == "+" || this.at().value == "-"){
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

    private parse_multiplicative_expr (): Expr {
        let left = this.parse_call_member_expr();

        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%"){
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

    private parse_call_member_expr (): Expr {
        const member = this.parse_member_expr();

        if(this.at().type == TokenType.OpenParen){
            return this.parse_call_expr(member);
        }

        return member;


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

    private parse_member_expr (): Expr {
        let object = this.parse_primary_expr();

        while (
            this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket
        ){
            const operator = this.eat();
            let property: Expr;
            let computed: boolean;

            if(operator.type == TokenType.Dot){
                computed = false;
                property = this.parse_primary_expr();

                if (property.kind != "Identifier"){
                    throw "Cannot use dot operator without right hand side being a identifier";
                }
            } else{
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

            

            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;

            case TokenType.OpenParen:
                this.eat();
                const value = this.parse_expr();
                this.expect(
                    TokenType.CloseParen, 
                    "Unexpected token found inside parenthesised expression. Expected closing parenthesis idiot",
                );
                return value;

            default:
                console.log("Unexpected token found during parsing: ", this.at());
                Deno.exit(1);
           
        }
    }
}