import { RuntimeValue, MK_NULL, NumberValue, ObjectValue, NativeFnValue, FunctionValue, StringValue, MK_STRING, MK_BOOL, BooleanValue} from "../values";
import Environment from "../environment";
import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, MemberExpr, ObjectLiteral, LogicalExpr, TernaryExpr, ArrayLiteral, UnaryExpr} from "../../frontend/ast";
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


export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeValue {
    const leftHandSide = evaluate(binop.left, env);
    
    // Short-circuit evaluation for logical operators
    if (binop.operator === "&&") {
        if (!isTruthy(leftHandSide)) {
            return leftHandSide; // Return the falsy value
        }
        const rightHandSide = evaluate(binop.right, env);
        return rightHandSide;
    } 
    
    if (binop.operator === "||") {
        if (isTruthy(leftHandSide)) {
            return leftHandSide; // Return the truthy value
        }
        const rightHandSide = evaluate(binop.right, env);
        return rightHandSide;
    }
    
    // Non-short-circuit operators - evaluate both sides
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

    // One or both are NULL
    return MK_NULL();
}

export function eval_identifier(ident: Identifier, env: Environment): RuntimeValue{
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeValue{
    // Evaluate the right-hand side of the assignment first
    const value = evaluate(node.value, env);
    
    // Handle different types of assignment targets
    if (node.assigne.kind === "Identifier") {
        // Simple variable assignment: x = value
        const varname = (node.assigne as Identifier).symbol;
        return env.assignVar(varname, value);
    } 
    else if (node.assigne.kind === "MemberExpr") {
        // Object/array property assignment: obj.prop = value or arr[index] = value
        const memberExpr = node.assigne as MemberExpr;
        const object = evaluate(memberExpr.object, env);
        
        if (object.type !== 'object') {
            throw `Cannot set property of non-object value: ${object.type}`;
        }
        
        const objectValue = object as ObjectValue;
        
        // Handle the property name (computed or direct)
        let propName: string;
        
        if (memberExpr.computed) {
            // Array index or computed property: obj[prop] = value
            const prop = evaluate(memberExpr.property, env);
            
            if (prop.type === 'number') {
                // Handle array indexing with numbers
                propName = (prop as NumberValue).value.toString();
            } else if (prop.type === 'string') {
                // Handle object property access with string
                propName = (prop as StringValue).value;
            } else {
                throw `Object/array property name must be a string or number, got: ${prop.type}`;
            }
        } else {
            // Direct object property: obj.prop = value
            if (memberExpr.property.kind !== 'Identifier') {
                throw `Property must be an identifier in dot notation`;
            }
            
            propName = (memberExpr.property as Identifier).symbol;
        }
        
        // Set the property on the object
        objectValue.properties.set(propName, value);
        
        // Update length property for arrays if needed
        if (propName.match(/^\d+$/)) {
            const index = parseInt(propName);
            const currentLength = objectValue.properties.has('length') ? 
                (objectValue.properties.get('length') as NumberValue).value : 0;
                
            if (index >= currentLength) {
                objectValue.properties.set('length', { type: 'number', value: index + 1 } as NumberValue);
            }
        }
        
        return value;
    }
    
    throw `Invalid left-hand side of assignment expression: ${node.assigne.kind}`;
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
        // Handle computed property access obj["prop"] or array[index]
        const prop = evaluate(expr.property, env);
        let propName: string;
        
        if (prop.type === 'number') {
            // Handle array indexing
            propName = (prop as NumberValue).value.toString();
        } else if (prop.type === 'string') {
            // Handle object property access
            propName = (prop as StringValue).value;
        } else {
            throw `Object property name must be a string or number, got: ${prop.type}`;
        }
        
        // Return the property value or null if not found (for arrays)
        if (!objectValue.properties.has(propName)) {
            // For arrays, non-existent indices should return null instead of throwing
            if (propName.match(/^\d+$/) && objectValue.properties.has('length')) {
                return MK_NULL();
            }
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

export function eval_logical_expr(expr: LogicalExpr, env: Environment): RuntimeValue {
    // Handle logical operators: &&, ||, !
    const operator = expr.operator;
    
    // Special case for ! (NOT) operator which is unary
    if (operator === "!") {
        const rightVal = evaluate(expr.right, env);
        return MK_BOOL(!isTruthy(rightVal));
    }
    
    // For && and ||, evaluate the left side first
    const leftVal = evaluate(expr.left, env);
    
    // Short-circuit evaluation for && and ||
    if (operator === "&&") {
        // If left is falsy, return it without evaluating right
        if (!isTruthy(leftVal)) {
            return leftVal;
        }
        // Otherwise, return right value
        return evaluate(expr.right, env);
    } 
    else if (operator === "||") {
        // If left is truthy, return it without evaluating right
        if (isTruthy(leftVal)) {
            return leftVal;
        }
        // Otherwise, return right value
        return evaluate(expr.right, env);
    }
    
    return MK_NULL(); // Fallback
}

export function eval_ternary_expr(expr: TernaryExpr, env: Environment): RuntimeValue {
    // Evaluate the condition
    const condition = evaluate(expr.condition, env);
    
    // Based on condition's truthiness, evaluate and return either true or false expression
    if (isTruthy(condition)) {
        return evaluate(expr.trueExpr, env);
    } else {
        return evaluate(expr.falseExpr, env);
    }
}

export function eval_array_literal(expr: ArrayLiteral, env: Environment): RuntimeValue {
    // Create an array object
    const array = { type: "object", properties: new Map() } as ObjectValue;
    
    // Evaluate each element and store in the array
    for (let i = 0; i < expr.elements.length; i++) {
        const value = evaluate(expr.elements[i], env);
        array.properties.set(i.toString(), value);
    }
    
    // Set the length property
    array.properties.set("length", { type: "number", value: expr.elements.length } as NumberValue);
    
    return array;
}

// Helper function to determine if a value is truthy
function isTruthy(value: RuntimeValue): boolean {
    switch (value.type) {
        case "boolean":
            return (value as BooleanValue).value;
        case "number":
            return (value as NumberValue).value !== 0;
        case "string":
            return (value as StringValue).value !== "";
        case "null":
            return false;
        default:
            return true;
    }
}

export function eval_unary_expr(expr: UnaryExpr, env: Environment): RuntimeValue {
    const operand = evaluate(expr.operand, env);
    
    switch (expr.operator) {
        case "!":
            // Logical NOT
            return MK_BOOL(!isTruthy(operand));
        case "-":
            // Unary minus
            if (operand.type !== "number") {
                throw `Cannot apply unary minus to non-number value: ${operand.type}`;
            }
            return { 
                type: "number", 
                value: -(operand as NumberValue).value 
            } as NumberValue;
        default:
            throw `Unsupported unary operator: ${expr.operator}`;
    }
}