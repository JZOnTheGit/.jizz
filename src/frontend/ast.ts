import Environment from "../runtime/environment";

export type NodeType = 
//expressions
| "Program" 
| "VarDeclaration"
| "FunctionDeclaration"
| "AssignmentExpr"
| "MemberExpr"
| "CallExpr"
| "LogicalExpr"
| "TernaryExpr"

//statements
| "NumericLiteral" 
| "StringLiteral"
| "Identifier" 
| "BinaryExpr" 
| "UnaryExpr" 
| "FunctionDeclaration"
| "IfStatement"
| "WhileStatement"
| "ForStatement"
| "ReturnStatement"
| "ArrayLiteral"
| "TryStatement"
| "CatchClause"
| "ThrowStatement"

| "Property"
| "ObjectLiteral";





export interface Stmt {
    kind: NodeType;
    [key: string]: any; // Allow additional properties
}

export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration";
    constant: boolean,
    identifier: string,
    value?: Expr;
}

export interface FunctionDeclaration extends Stmt {
    type: "function";
    parameters: string[],
    body: Stmt[];
    name: string;
    declarationEnv: Environment;
}

//expression

export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr",
    assigne: Expr,
    value: Expr,
}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string;
}

export interface CallExpr extends Expr {
    kind: "CallExpr";
    caller: Expr;
    args: Expr[];
}

export interface MemberExpr extends Expr {
    kind: "MemberExpr";
    object: Expr;
    property: Expr;
    computed: boolean;
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}

export interface StringLiteral extends Expr {
    kind: "StringLiteral";
    value: string;
}

export interface Property extends Expr {
    kind: "Property";
    key: string,
    value: Expr,
}

export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: Property[]
}

export interface IfStatement extends Stmt {
    kind: "IfStatement";
    condition: Expr;
    thenBranch: Stmt[];
    elifBranches: Array<{condition: Expr, body: Stmt[]}>;
    elseBranch?: Stmt[];
}

export interface WhileStatement extends Stmt {
    kind: "WhileStatement";
    condition: Expr;
    body: Stmt[];
}

export interface ForStatement extends Stmt {
    kind: "ForStatement";
    initializer?: Stmt;  // Can be either VarDeclaration or expression
    condition?: Expr;    // Can be optional
    increment?: Expr;    // Can be optional
    body: Stmt[];
}

export interface ReturnStatement extends Stmt {
    kind: "ReturnStatement";
    value?: Expr;
}

export interface LogicalExpr extends Expr {
    kind: "LogicalExpr";
    left: Expr;
    right: Expr;
    operator: string;  // "&&", "||", "!"
}

export interface TernaryExpr extends Expr {
    kind: "TernaryExpr";
    condition: Expr;
    trueExpr: Expr;
    falseExpr: Expr;
}

export interface ArrayLiteral extends Expr {
    kind: "ArrayLiteral";
    elements: Expr[];
}

export interface UnaryExpr extends Expr {
    kind: "UnaryExpr";
    operator: string;  // Currently just "!" for logical NOT
    operand: Expr;
}

export interface TryStatement extends Stmt {
    kind: "TryStatement";
    tryBlock: Stmt[];
    catchClause: CatchClause;
}

export interface CatchClause extends Stmt {
    kind: "CatchClause";
    parameter: string;
    body: Stmt[];
}

export interface ThrowStatement extends Stmt {
    kind: "ThrowStatement";
    argument: Expr;
}




