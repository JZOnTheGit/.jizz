import { RuntimeValue, MK_NULL, NumberValue, ObjectValue, NativeFnValue, FunctionValue, StringValue, MK_STRING, MK_BOOL} from "../values";
import Environment from "../environment";
import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, MemberExpr, ObjectLiteral} from "../../frontend/ast";
import { evaluate } from "../interpreter";

function eval_numeric_binary_expr (leftHandSide: NumberValue, rightHandSide: NumberValue, operator: string): RuntimeValue {
    // Handle arithmetic operators
    if (operator == "+") {
        return { type: "number", value: leftHandSide.value + rightHandSide.value } as NumberValue;
    } else if (operator == "-") {
        return { type: "number", value: leftHandSide.value - rightHandSide.value } as NumberValue;
    } else if (operator == "*") {
        return { type: "number", value: leftHandSide.value * rightHandSide.value } as NumberValue;
    } else if (operator == "/") {
        return { type: "number", value: leftHandSide.value / rightHandSide.value } as NumberValue;
    } else if (operator == "%") {
        return { type: "number", value: leftHandSide.value % rightHandSide.value } as NumberValue;
    }
    
    // Handle comparison operators
    else if (operator == ">=") {
        return MK_BOOL(leftHandSide.value >= rightHandSide.value);
    } else if (operator == "<=") {
        return MK_BOOL(leftHandSide.value <= rightHandSide.value);
    } else if (operator == ">") {
        return MK_BOOL(leftHandSide.value > rightHandSide.value);
    } else if (operator == "<") {
        return MK_BOOL(leftHandSide.value < rightHandSide.value);
    } else if (operator == "==") {
        return MK_BOOL(leftHandSide.value === rightHandSide.value);
    } else if (operator == "!=") {
        return MK_BOOL(leftHandSide.value !== rightHandSide.value);
    }

    return MK_NULL();
}


export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeValue{
    const leftHandSide = evaluate(binop.left, env);
    const rightHandSide = evaluate(binop.right, env);

    // Handle string operations
    if (leftHandSide.type == "string" || rightHandSide.type == "string") {
        // Convert both sides to strings for concatenation
        const leftStr = leftHandSide.type == "string" 
            ? (leftHandSide as StringValue).value 
            : String((leftHandSide as NumberValue).value);
        const rightStr = rightHandSide.type == "string" 
            ? (rightHandSide as StringValue).value 
            : String((rightHandSide as NumberValue).value);

        switch (binop.operator) {
            case "+":
                return MK_STRING(leftStr + rightStr);
            case "==":
                return MK_BOOL(leftStr === rightStr);
            case "!=":
                return MK_BOOL(leftStr !== rightStr);
            case "<":
                return MK_BOOL(leftStr < rightStr);
            case ">":
                return MK_BOOL(leftStr > rightStr);
            case "<=":
                return MK_BOOL(leftStr <= rightStr);
            case ">=":
                return MK_BOOL(leftStr >= rightStr);
            default:
                return MK_NULL();
        }
    }

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

export function eval_member_expr(expr: MemberExpr, env: Environment): RuntimeValue {
    const obj = evaluate(expr.object, env);
    
    if (obj.type !== 'object') {
        throw `Cannot access properties of non-object value: ${obj.type}`;
    }
    
    const objectValue = obj as ObjectValue;
    
    if (expr.computed) {
        // Handle computed property access obj["prop"]
        const prop = evaluate(expr.property, env);
        if (prop.type !== 'string') {
            throw `Object property name must be a string`;
        }
        
        const propName = (prop as StringValue).value;
        if (!objectValue.properties.has(propName)) {
            throw `Property '${propName}' does not exist on object`;
        }
        
        return objectValue.properties.get(propName) as RuntimeValue;
    } else {
        // Handle dot notation obj.prop
        if (expr.property.kind !== 'Identifier') {
            throw `Property must be an identifier in dot notation`;
        }
        
        const propName = (expr.property as Identifier).symbol;
        if (!objectValue.properties.has(propName)) {
            throw `Property '${propName}' does not exist on object`;
        }
        
        return objectValue.properties.get(propName) as RuntimeValue;
    }
}