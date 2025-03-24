import { FunctionDeclaration, ForStatement, IfStatement, Program, VarDeclaration, WhileStatement } from "../../frontend/ast";
import { evaluate } from "../interpreter";
import Environment from "../environment";
import { RuntimeValue, MK_NULL, FunctionValue, BooleanValue} from "../values";

export function eval_program(program: Program, env: Environment): RuntimeValue{
    let lastEvaluated: RuntimeValue = MK_NULL();

    for (const statement of program.body){
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

export function eval_var_declaration(declaration: VarDeclaration, env: Environment): RuntimeValue{
    
    const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL();
    return env.declareVar(declaration.identifier, value, declaration.constant);
    
}

export function eval_function_declaration(
	declaration: FunctionDeclaration,
	env: Environment
): RuntimeValue {
	// Create new function scope
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVar(declaration.name, fn, true);
}

export function eval_if_statement(ifStmt: IfStatement, env: Environment): RuntimeValue {
    // Evaluate the main if condition
    const conditionValue = evaluate(ifStmt.condition, env);
    
    // Check if condition is truthy
    if (isTruthy(conditionValue)) {
        let result: RuntimeValue = MK_NULL();
        // Execute the then branch
        for (const stmt of ifStmt.thenBranch) {
            result = evaluate(stmt, env);
        }
        return result;
    }
    
    // Check elif branches
    for (const elifBranch of ifStmt.elifBranches) {
        const elifCondition = evaluate(elifBranch.condition, env);
        if (isTruthy(elifCondition)) {
            let result: RuntimeValue = MK_NULL();
            for (const stmt of elifBranch.body) {
                result = evaluate(stmt, env);
            }
            return result;
        }
    }
    
    // If no conditions were true and there's an else branch, execute it
    if (ifStmt.elseBranch) {
        let result: RuntimeValue = MK_NULL();
        for (const stmt of ifStmt.elseBranch) {
            result = evaluate(stmt, env);
        }
        return result;
    }
    
    return MK_NULL();
}

export function eval_while_statement(whileStmt: WhileStatement, env: Environment): RuntimeValue {
    let result: RuntimeValue = MK_NULL();
    
    // Evaluate the condition
    while (isTruthy(evaluate(whileStmt.condition, env))) {
        // Create a new scope for each iteration
        const loopEnv = new Environment(env);
        
        // Execute the body
        for (const stmt of whileStmt.body) {
            result = evaluate(stmt, loopEnv);
        }
    }
    
    return result;
}

export function eval_for_statement(forStmt: ForStatement, env: Environment): RuntimeValue {
    // Create a new environment for the loop's scope
    const outerLoopEnv = new Environment(env);
    let result: RuntimeValue = MK_NULL();
    
    // Evaluate the initializer if it exists
    if (forStmt.initializer) {
        evaluate(forStmt.initializer, outerLoopEnv);
    }
    
    // Loop while the condition is true (or forever if no condition)
    while (!forStmt.condition || isTruthy(evaluate(forStmt.condition, outerLoopEnv))) {
        // Create a new environment for each iteration's body
        const iterationEnv = new Environment(outerLoopEnv);
        
        // Execute the body
        for (const stmt of forStmt.body) {
            result = evaluate(stmt, iterationEnv);
        }
        
        // Evaluate the increment expression if it exists
        if (forStmt.increment) {
            evaluate(forStmt.increment, outerLoopEnv);
        }
    }
    
    return result;
}

// Helper function to determine if a value is truthy
function isTruthy(value: RuntimeValue): boolean {
    switch (value.type) {
        case "boolean":
            return (value as BooleanValue).value;
        case "number":
            return (value as any).value !== 0;
        case "string":
            return (value as any).value !== "";
        case "null":
            return false;
        default:
            return true;
    }
}