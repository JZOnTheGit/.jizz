import { MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeValue, NumberValue, StringValue, BooleanValue, ObjectValue, MK_STRING } from "./values";
import { StringPrototype } from "./stdlib/string";

export function createGlobalEnv(){
    const env = new Environment();
    env.declareVar("frfr", MK_BOOL(true), true);
    env.declareVar("cap", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    // Add Math library functions
    // Create Math object
    const mathObj = {type: "object", properties: new Map()} as ObjectValue;
    
    // Math.floor
    mathObj.properties.set("floor", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "Math.floor() requires one argument";
        }
        
        if (args[0].type !== "number") {
            throw `Cannot floor non-number value`;
        }
        
        const value = Math.floor((args[0] as NumberValue).value);
        return MK_NUMBER(value);
    }));
    
    env.declareVar("Math", mathObj, true);

    // Add ask function for user input
    env.declareVar("ask", MK_NATIVE_FN((args, _) => {
        const prompt = args.length > 0 && args[0].type === "string" 
            ? (args[0] as StringValue).value 
            : "";
        
        // Use readline-sync for synchronous input
        const readline = require('readline-sync');
        const input = readline.question(prompt);
        return MK_STRING(input);
    }), true);

    // Add int conversion function
    env.declareVar("int", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "int() requires one argument";
        }
        
        let value;
        if (args[0].type === "string") {
            value = parseInt((args[0] as StringValue).value);
        } else if (args[0].type === "number") {
            value = Math.floor((args[0] as NumberValue).value);
        } else {
            throw `Cannot convert ${args[0].type} to int`;
        }
        
        if (isNaN(value)) {
            throw `Cannot convert to int: invalid input`;
        }
        
        return MK_NUMBER(value);
    }), true);

    // Add str conversion function
    env.declareVar("str", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "str() requires one argument";
        }
        
        let value;
        switch (args[0].type) {
            case "string":
                value = (args[0] as StringValue).value;
                break;
            case "number":
                value = (args[0] as NumberValue).value.toString();
                break;
            case "boolean":
                value = (args[0] as BooleanValue).value ? "frfr" : "cap";
                break;
            case "null":
                value = "null";
                break;
            default:
                value = "[" + args[0].type + "]";
        }
        
        return MK_STRING(value);
    }), true);

    //define a native builtin method
    env.declareVar("buss", MK_NATIVE_FN((args, scope) => {
        // Format each argument to show only its value
        const formattedArgs = args.map(arg => {
            switch (arg.type) {
                case "number":
                    return (arg as NumberValue).value;
                case "string":
                    return (arg as StringValue).value;
                case "boolean":
                    return (arg as BooleanValue).value;
                case "null":
                    return "null";
                case "object": {
                    const obj = arg as ObjectValue;
                    const entries = Array.from(obj.properties.entries());
                    const formattedProps = entries.map(([key, value]) => {
                        let propValue;
                        switch (value.type) {
                            case "number":
                                propValue = (value as NumberValue).value;
                                break;
                            case "string":
                                propValue = `"${(value as StringValue).value}"`;
                                break;
                            case "boolean":
                                propValue = (value as BooleanValue).value;
                                break;
                            case "null":
                                propValue = "null";
                                break;
                            default:
                                propValue = `[${value.type}]`;
                        }
                        return `${key}: ${propValue}`;
                    });
                    return `{ ${formattedProps.join(", ")} }`;
                }
                case "native-fn":
                case "function":
                    return "[function]";
                default:
                    return String(arg);
            }
        });
        console.log(...formattedArgs);
        return MK_NULL();
    }), true);

    function timeFunction(_args: RuntimeValue[], _env: Environment): RuntimeValue{
        return MK_NUMBER(Date.now());
    }
    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);

    // Add string prototype methods to global environment
    StringPrototype.forEach((value, key) => {
        env.declareVar(`String_${key}`, value, true);
    });

    return env;
}

export default class Environment{
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;

    constructor(parentEnv?: Environment){
        const global = parentEnv ? true : false;
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();

        
    }

    public declareVar(varname: string, value: RuntimeValue, constant: boolean): RuntimeValue{
        if (this.variables.has(varname)){
            throw `Cannot declare variable ${varname}. As its already defined.`;
        }
        this.variables.set(varname, value);

        if(constant){
            this.constants.add(varname);
        }
        return value;
    }

    public assignVar(varname: string, value: RuntimeValue): RuntimeValue{
        const env = this.resolve(varname);
        if (env.constants.has(varname)){
            throw `Cannot reassign to variable ${varname}. As it was declared constant.`;
        }
        env.variables.set(varname, value);

        return value;

    }

    public lookupVar(varname: string): RuntimeValue{
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeValue;
    }


    public resolve (varname: string): Environment{
        if (this.variables.has(varname))
            return this;

        if (this.parent == undefined)
            throw `Cannot resolve variable ${varname}. As its not defined.`;

        return this.parent.resolve(varname);
    }
    

   
    
}