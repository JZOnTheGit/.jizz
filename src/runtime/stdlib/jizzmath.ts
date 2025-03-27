/**
 * JizzMath Module for JIZZ Programming Language
 * Provides mathematical functions and constants
 */

import { MK_NATIVE_FN, MK_NUMBER, RuntimeValue, NumberValue, ObjectValue } from "../values";
import Environment from "../environment";

// Create the JizzMath object that will be exported
export function createJizzMathObject(): ObjectValue {
    const mathObj = { type: "object", properties: new Map() } as ObjectValue;
    
    // Constants
    mathObj.properties.set("PI", MK_NUMBER(Math.PI));
    mathObj.properties.set("E", MK_NUMBER(Math.E));
    
    // Basic functions
    mathObj.properties.set("floor", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "JizzMath.floor() requires one argument";
        }
        
        if (args[0].type !== "number") {
            throw `Cannot floor non-number value`;
        }
        
        const value = Math.floor((args[0] as NumberValue).value);
        return MK_NUMBER(value);
    }));
    
    mathObj.properties.set("ceil", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "JizzMath.ceil() requires one argument";
        }
        
        if (args[0].type !== "number") {
            throw `Cannot ceil non-number value`;
        }
        
        const value = Math.ceil((args[0] as NumberValue).value);
        return MK_NUMBER(value);
    }));
    
    mathObj.properties.set("round", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "JizzMath.round() requires one argument";
        }
        
        if (args[0].type !== "number") {
            throw `Cannot round non-number value`;
        }
        
        const value = Math.round((args[0] as NumberValue).value);
        return MK_NUMBER(value);
    }));
    
    mathObj.properties.set("sqrt", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "JizzMath.sqrt() requires one argument";
        }
        
        if (args[0].type !== "number") {
            throw `Cannot sqrt non-number value`;
        }
        
        const num = (args[0] as NumberValue).value;
        if (num < 0) {
            throw "Cannot calculate square root of negative number";
        }
        
        const value = Math.sqrt(num);
        return MK_NUMBER(value);
    }));
    
    mathObj.properties.set("abs", MK_NATIVE_FN((args, _) => {
        if (args.length === 0) {
            throw "JizzMath.abs() requires one argument";
        }
        
        if (args[0].type !== "number") {
            throw `Cannot abs non-number value`;
        }
        
        const value = Math.abs((args[0] as NumberValue).value);
        return MK_NUMBER(value);
    }));
    
    mathObj.properties.set("min", MK_NATIVE_FN((args, _) => {
        if (args.length < 1) {
            throw "JizzMath.min() requires at least one argument";
        }
        
        // Check all args are numbers
        for (const arg of args) {
            if (arg.type !== "number") {
                throw `Cannot compare non-number value`;
            }
        }
        
        const values = args.map(arg => (arg as NumberValue).value);
        const value = Math.min(...values);
        return MK_NUMBER(value);
    }));
    
    mathObj.properties.set("max", MK_NATIVE_FN((args, _) => {
        if (args.length < 1) {
            throw "JizzMath.max() requires at least one argument";
        }
        
        // Check all args are numbers
        for (const arg of args) {
            if (arg.type !== "number") {
                throw `Cannot compare non-number value`;
            }
        }
        
        const values = args.map(arg => (arg as NumberValue).value);
        const value = Math.max(...values);
        return MK_NUMBER(value);
    }));
    
    mathObj.properties.set("random", MK_NATIVE_FN((args, _) => {
        return MK_NUMBER(Math.random());
    }));
    
    mathObj.properties.set("pow", MK_NATIVE_FN((args, _) => {
        if (args.length < 2) {
            throw "JizzMath.pow() requires two arguments: base and exponent";
        }
        
        if (args[0].type !== "number" || args[1].type !== "number") {
            throw `Cannot perform power operation on non-number values`;
        }
        
        const base = (args[0] as NumberValue).value;
        const exponent = (args[1] as NumberValue).value;
        
        return MK_NUMBER(Math.pow(base, exponent));
    }));
    
    return mathObj;
}

// Function to add JizzMath to environment
export function setupJizzMath(env: Environment): void {
    env.declareVar("JizzMath", createJizzMathObject(), true);
} 