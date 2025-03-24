import { RuntimeValue, NumberValue, MK_NULL, MK_STRING, StringValue, MK_BOOL} from "./values";
import { NodeType, Stmt, Program, Expr, BinaryExpr, NumericLiteral, StringLiteral, Identifier, VarDeclaration, AssignmentExpr, ObjectLiteral, CallExpr, MemberExpr, FunctionDeclaration, IfStatement, WhileStatement, ForStatement, ReturnStatement, LogicalExpr, TernaryExpr, ArrayLiteral, UnaryExpr} from "../frontend/ast";
import Environment from "./environment";
import { eval_var_declaration, eval_program, eval_function_declaration, eval_if_statement, eval_while_statement, eval_for_statement } from "./eval/statements";
import { eval_assignment, eval_binary_expr, eval_identifier, eval_object_expr, eval_call_expr, eval_member_expr, eval_logical_expr, eval_ternary_expr, eval_array_literal, eval_unary_expr } from "./eval/expressions";

export function evaluate(astNode: Stmt, env: Environment): RuntimeValue{

    switch(astNode.kind){
        case "NumericLiteral":
            return {
                value: ((astNode as NumericLiteral).value), 
                type: "number"
            } as NumberValue;

        case "StringLiteral":
            return {
                value: ((astNode as StringLiteral).value),
                type: "string"
            } as StringValue;

        case "Identifier":
            return eval_identifier(astNode as Identifier, env);

        case "ObjectLiteral":
            return eval_object_expr(astNode as ObjectLiteral, env);

        case "ArrayLiteral":
            return eval_array_literal(astNode as ArrayLiteral, env);

        case "CallExpr":
            return eval_call_expr(astNode as CallExpr, env);

        case "MemberExpr":
            return eval_member_expr(astNode as MemberExpr, env);

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);

        case "LogicalExpr":
            return eval_logical_expr(astNode as LogicalExpr, env);

        case "TernaryExpr":
            return eval_ternary_expr(astNode as TernaryExpr, env);

        case "UnaryExpr":
            return eval_unary_expr(astNode as UnaryExpr, env);

        case "AssignmentExpr":
            return eval_assignment(astNode as AssignmentExpr, env);

        case "Program":
            return eval_program(astNode as Program, env);
        
        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);

        case "FunctionDeclaration":
            return eval_function_declaration(astNode as FunctionDeclaration, env);

        case "IfStatement":
            return eval_if_statement(astNode as IfStatement, env);

        case "WhileStatement":
            return eval_while_statement(astNode as WhileStatement, env);

        case "ForStatement":
            return eval_for_statement(astNode as ForStatement, env);

        case "ReturnStatement": {
            const returnStmt = astNode as ReturnStatement;
            return returnStmt.value ? evaluate(returnStmt.value, env) : MK_NULL();
        }

        default:
            console.error("This AST Node has not yet been setup for interpretation:", astNode);
            process.exit(0);
            return MK_NULL(); // This line will never be reached due to process.exit
    }
}

