import { RuntimeValue, MK_NULL, NumberValue, ObjectValue, NativeFnValue, FunctionValue} from "../values.ts";
import Environment from "../environment.ts";
import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, ObjectLiteral} from "../../frontend/ast.ts";
import { evaluate } from "../interpreter.ts";

function eval_numeric_binary_expr (leftHandSide: NumberValue, rightHandSide: NumberValue, operator: string): NumberValue{
    let result: number;

    if (operator == "+"){
        result = leftHandSide.value + rightHandSide.value;
    } else if (operator == "-"){
        result = leftHandSide.value - rightHandSide.value;
    } else if (operator == "*"){
        result = leftHandSide.value * rightHandSide.value;
    } else if (operator == "/"){
        result = leftHandSide.value / rightHandSide.value;
    } else {
        result = leftHandSide.value % rightHandSide.value;
    }


    return { value: result, type: "number"};
    
    

}


export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeValue{

    const leftHandSide = evaluate(binop.left, env);
    const rightHandSide = evaluate(binop.right, env);

    if (leftHandSide.type == "number" && rightHandSide.type == "number"){
        return eval_numeric_binary_expr(leftHandSide as NumberValue, rightHandSide as NumberValue, binop.operator);
    }

    //one or both are NULL
    return MK_NULL();
}

export function eval_identifier(ident: Identifier, env: Environment): RuntimeValue{
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeValue{
    if (node.assigne.kind !== "Identifier"){
        throw `Invalid left hand side of assignment expression ${JSON.stringify(node.assigne)}`;
    }

    const varname = (node.assigne as Identifier).symbol;
    return env.assignVar(varname, evaluate(node.value, env));
    
    
}


export function eval_object_expr(obj: ObjectLiteral, env: Environment): RuntimeValue{
    const object = {type: "object", properties: new Map()} as ObjectValue;

    for (const { key, value} of obj.properties){

        const runtimeValue = (value == undefined) ? env.lookupVar(key) : evaluate(value, env);

        object.properties.set(key, runtimeValue)
    }

    return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeValue {
	const args = expr.args.map((arg) => evaluate(arg, env));
	const fn = evaluate(expr.caller, env);

	if (fn.type == "native-fn") {
		const result = (fn as NativeFnValue).call(args, env);
		return result;
	}

	if (fn.type == "function") {
		const func = fn as FunctionValue;
		const scope = new Environment(func.declarationEnv);

		// Create the variables for the parameters list
		for (let i = 0; i < func.parameters.length; i++) {
			// TODO Check the bounds here.
			// verify arity of function
			const varname = func.parameters[i];
			scope.declareVar(varname, args[i], false);
		}

		let result: RuntimeValue = MK_NULL();
		// Evaluate the function body line by line
		for (const stmt of func.body) {
			result = evaluate(stmt, scope);
		}

		return result;
	}

	throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}