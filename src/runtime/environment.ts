import { MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeValue, NumberValue, StringValue, BooleanValue, ObjectValue, MK_STRING } from "./values";
import { StringPrototype } from "./stdlib/string";
import * as GameFunctions from "./stdlib/game";
import { setupJizzMath } from "./stdlib/jizzmath";

export function createGlobalEnv(){
    const env = new Environment();
    env.declareVar("frfr", MK_BOOL(true), true);
    env.declareVar("cap", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    // Add JizzMath instead of the built-in Math
    setupJizzMath(env);

    // Add Game functions directly to environment (not as an object)
    env.declareVar("createWindow", GameFunctions.createWindow, true);
    env.declareVar("closeWindow", GameFunctions.closeWindow, true);
    env.declareVar("clear", GameFunctions.clear, true);
    env.declareVar("drawRect", GameFunctions.drawRect, true);
    env.declareVar("drawCircle", GameFunctions.drawCircle, true);
    env.declareVar("drawText", GameFunctions.drawText, true);
    env.declareVar("isKeyPressed", GameFunctions.isKeyPressed, true);
    env.declareVar("startGameLoop", GameFunctions.startGameLoop, true);
    env.declareVar("checkRectCollision", GameFunctions.checkRectCollision, true);
    env.declareVar("checkCircleCollision", GameFunctions.checkCircleCollision, true);
    env.declareVar("playSound", GameFunctions.playSound, true);
    env.declareVar("stopSound", GameFunctions.stopSound, true);

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

    // Add string conversion function
    env.declareVar("str", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "str() requires one argument";
        }
        
        let strValue: string;
        const arg = args[0];
        
        switch (arg.type) {
            case "string":
                strValue = (arg as StringValue).value;
                break;
            case "number":
                strValue = (arg as NumberValue).value.toString();
                break;
            case "boolean":
                strValue = (arg as BooleanValue).value ? "frfr" : "cap";
                break;
            case "null":
                strValue = "null";
                break;
            case "object":
                strValue = "[object]";
                break;
            default:
                strValue = `[${arg.type}]`;
        }
        
        return MK_STRING(strValue);
    }), true);

    // Add built-in print function (buss)
    env.declareVar("buss", MK_NATIVE_FN((args, _) => {
        const output = args.map(arg => {
            if (arg.type === "string") {
                // Process escape sequences in strings
                return processEscapeSequences((arg as StringValue).value);
            }
            else if (arg.type === "number") return (arg as NumberValue).value;
            else if (arg.type === "boolean") return (arg as BooleanValue).value ? "frfr" : "cap";
            else if (arg.type === "null") return "null";
            else if (arg.type === "object") return "[object]";
            else return `[${arg.type}]`;
        }).join(" ");
        
        console.log(output);
        return MK_NULL();
    }), true);

    // Helper function to process escape sequences
    function processEscapeSequences(str: string): string {
        return str
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\r/g, '\r')
            .replace(/\\'/g, '\'')
            .replace(/\\"/g, '\"')
            .replace(/\\\\/g, '\\');
    }

    // Add String_ functions to global scope
    env.declareVar("String_length", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "String_length() requires one argument";
        }
        
        let str: string;
        if (args[0].type === "string") {
            str = (args[0] as StringValue).value;
        } else {
            throw "String_length() requires a string argument";
        }
        
        return MK_NUMBER(str.length);
    }), true);

    env.declareVar("String_toUpperCase", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "String_toUpperCase() requires one argument";
        }
        
        let str: string;
        if (args[0].type === "string") {
            str = (args[0] as StringValue).value;
        } else {
            throw "String_toUpperCase() requires a string argument";
        }
        
        return MK_STRING(str.toUpperCase());
    }), true);

    env.declareVar("String_toLowerCase", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "String_toLowerCase() requires one argument";
        }
        
        let str: string;
        if (args[0].type === "string") {
            str = (args[0] as StringValue).value;
        } else {
            throw "String_toLowerCase() requires a string argument";
        }
        
        return MK_STRING(str.toLowerCase());
    }), true);

    env.declareVar("String_substring", MK_NATIVE_FN((args, _) => {
        if (args.length < 2) {
            throw "String_substring() requires at least two arguments";
        }
        
        let str: string;
        if (args[0].type === "string") {
            str = (args[0] as StringValue).value;
        } else {
            throw "String_substring() requires a string as first argument";
        }
        
        let start: number;
        if (args[1].type === "number") {
            start = (args[1] as NumberValue).value;
        } else {
            throw "String_substring() requires a number as second argument";
        }
        
        let end: number = str.length;
        if (args.length > 2 && args[2].type === "number") {
            end = (args[2] as NumberValue).value;
        }
        
        return MK_STRING(str.substring(start, end));
    }), true);

    env.declareVar("String_trim", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "String_trim() requires one argument";
        }
        
        let str: string;
        if (args[0].type === "string") {
            str = (args[0] as StringValue).value;
        } else {
            throw "String_trim() requires a string argument";
        }
        
        return MK_STRING(str.trim());
    }), true);

    env.declareVar("String_split", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "String_split() requires at least one argument";
        }
        
        let str: string;
        if (args[0].type === "string") {
            str = (args[0] as StringValue).value;
        } else {
            throw "String_split() requires a string as first argument";
        }
        
        let separator = "";
        if (args.length > 1 && args[1].type === "string") {
            separator = (args[1] as StringValue).value;
        }
        
        const parts = str.split(separator);
        const array = { type: "object", properties: new Map() } as ObjectValue;
        
        for (let i = 0; i < parts.length; i++) {
            array.properties.set(i.toString(), MK_STRING(parts[i]));
        }
        
        array.properties.set("length", MK_NUMBER(parts.length));
        
        return array;
    }), true);

    return env;
}

// Time function
function timeFunction(_args: RuntimeValue[], _env: Environment): RuntimeValue{
    return MK_NUMBER(Date.now());
}

export default class Environment{
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;

    constructor(parentEnv?: Environment){
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVar(varname: string, value: RuntimeValue, constant: boolean): RuntimeValue{
        if(this.variables.has(varname)){
            throw `Cannot declare variable ${varname}. It is already defined.`;
        }

        this.variables.set(varname, value);
        if(constant){
            this.constants.add(varname);
        }
        return value;
    }

    public assignVar(varname: string, value: RuntimeValue): RuntimeValue{
        const env = this.resolve(varname);

        if(env.constants.has(varname)){
            throw `Cannot reassign to variable ${varname} because it is a constant.`;
        }

        env.variables.set(varname, value);
        return value;
    }

    public lookupVar(varname: string): RuntimeValue{
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeValue;
    }

    public resolve (varname: string): Environment{
        if(this.variables.has(varname)){
            return this;
        }

        if(this.parent == undefined){
            throw `Cannot resolve '${varname}' as it does not exist.`;
        }

        return this.parent.resolve(varname);
    }
}