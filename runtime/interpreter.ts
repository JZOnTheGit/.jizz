import { RuntimeValue, NumberValue, MK_NULL} from "./values.ts";
import { NodeType, Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration, AssignmentExpr, ObjectLiteral, CallExpr, FunctionDeclaration} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { eval_var_declaration, eval_program, eval_function_declaration } from "./eval/statements.ts";
import { eval_assignment, eval_binary_expr, eval_identifier, eval_object_expr, eval_call_expr } from "./eval/expressions.ts";





export function evaluate(astNode: Stmt, env: Environment): RuntimeValue{

    switch(astNode.kind){

        case "NumericLiteral":
            return {
                value: ((astNode as NumericLiteral).value), 
                type: "number"
            } as NumberValue;


        case "Identifier":
            return eval_identifier(astNode as Identifier, env);

        case "ObjectLiteral":
            return eval_object_expr(astNode as ObjectLiteral, env);

        case "CallExpr":
            return eval_call_expr(astNode as CallExpr, env);

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);

        case "AssignmentExpr":
            return eval_assignment(astNode as AssignmentExpr, env);

        case "Program":
            return eval_program(astNode as Program, env);
        
        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);

        case "FunctionDeclaration":
            return eval_function_declaration(astNode as FunctionDeclaration, env);

        default:
            console.error("This AST has not yet been set up for interpreting this node kind: ", astNode);
            Deno.exit(0);
    }
}

