import { RuntimeValue, MK_NULL, MK_NUMBER, MK_BOOL, ObjectValue, NumberValue, StringValue, MK_NATIVE_FN, BooleanValue } from "../values";
import Environment from "../environment";

// Array methods implementation for the JIZZ language

// Push method: adds an element to the end of an array
export function arrayPush(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 2) {
        throw "push() requires at least two arguments: array and element to push";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "push() can only be called on arrays";
    }
    
    const arrayObj = array as ObjectValue;
    const itemsToPush = args.slice(1);
    
    // Get current length
    let length = 0;
    if (arrayObj.properties.has("length")) {
        const lengthVal = arrayObj.properties.get("length") as NumberValue;
        length = lengthVal.value;
    }
    
    // Push each element
    for (let i = 0; i < itemsToPush.length; i++) {
        arrayObj.properties.set((length + i).toString(), itemsToPush[i]);
    }
    
    // Update length
    const newLength = length + itemsToPush.length;
    arrayObj.properties.set("length", MK_NUMBER(newLength));
    
    return MK_NUMBER(newLength);
}

// Pop method: removes and returns the last element of an array
export function arrayPop(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 1) {
        throw "pop() requires an array argument";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "pop() can only be called on arrays";
    }
    
    const arrayObj = array as ObjectValue;
    
    // Get current length
    let length = 0;
    if (arrayObj.properties.has("length")) {
        const lengthVal = arrayObj.properties.get("length") as NumberValue;
        length = lengthVal.value;
    }
    
    if (length === 0) {
        return MK_NULL();
    }
    
    // Get the last element
    const lastIndex = (length - 1).toString();
    const lastElement = arrayObj.properties.has(lastIndex) 
        ? arrayObj.properties.get(lastIndex) as RuntimeValue 
        : MK_NULL();
    
    // Remove the element and update length
    arrayObj.properties.delete(lastIndex);
    arrayObj.properties.set("length", MK_NUMBER(length - 1));
    
    return lastElement;
}

// Shift method: removes and returns the first element of an array
export function arrayShift(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 1) {
        throw "shift() requires an array argument";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "shift() can only be called on arrays";
    }
    
    const arrayObj = array as ObjectValue;
    
    // Get current length
    let length = 0;
    if (arrayObj.properties.has("length")) {
        const lengthVal = arrayObj.properties.get("length") as NumberValue;
        length = lengthVal.value;
    }
    
    if (length === 0) {
        return MK_NULL();
    }
    
    // Get the first element
    const firstElement = arrayObj.properties.has("0") 
        ? arrayObj.properties.get("0") as RuntimeValue 
        : MK_NULL();
    
    // Shift all elements down
    for (let i = 0; i < length - 1; i++) {
        const nextIndex = (i + 1).toString();
        if (arrayObj.properties.has(nextIndex)) {
            arrayObj.properties.set(i.toString(), arrayObj.properties.get(nextIndex) as RuntimeValue);
        } else {
            arrayObj.properties.delete(i.toString());
        }
    }
    
    // Remove the last element and update length
    arrayObj.properties.delete((length - 1).toString());
    arrayObj.properties.set("length", MK_NUMBER(length - 1));
    
    return firstElement;
}

// Unshift method: adds elements to the beginning of an array
export function arrayUnshift(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 2) {
        throw "unshift() requires at least two arguments: array and element to add";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "unshift() can only be called on arrays";
    }
    
    const arrayObj = array as ObjectValue;
    const itemsToAdd = args.slice(1);
    
    // Get current length
    let length = 0;
    if (arrayObj.properties.has("length")) {
        const lengthVal = arrayObj.properties.get("length") as NumberValue;
        length = lengthVal.value;
    }
    
    // Move all existing elements up
    for (let i = length - 1; i >= 0; i--) {
        const oldIndex = i.toString();
        const newIndex = (i + itemsToAdd.length).toString();
        
        if (arrayObj.properties.has(oldIndex)) {
            arrayObj.properties.set(newIndex, arrayObj.properties.get(oldIndex) as RuntimeValue);
        }
    }
    
    // Add new elements at the beginning
    for (let i = 0; i < itemsToAdd.length; i++) {
        arrayObj.properties.set(i.toString(), itemsToAdd[i]);
    }
    
    // Update length
    const newLength = length + itemsToAdd.length;
    arrayObj.properties.set("length", MK_NUMBER(newLength));
    
    return MK_NUMBER(newLength);
}

// Length method: returns the length of an array
export function arrayLength(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 1) {
        throw "length() requires an array argument";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "length() can only be called on arrays";
    }
    
    const arrayObj = array as ObjectValue;
    
    // Get current length
    if (arrayObj.properties.has("length")) {
        return arrayObj.properties.get("length") as NumberValue;
    }
    
    return MK_NUMBER(0);
}

// Join method: joins all elements of an array into a string
export function arrayJoin(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 1) {
        throw "join() requires at least one argument (the array)";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "join() can only be called on arrays";
    }
    
    // Get separator (default to comma)
    let separator = ",";
    if (args.length > 1 && args[1].type === "string") {
        separator = (args[1] as StringValue).value;
    }
    
    const arrayObj = array as ObjectValue;
    
    // Get length
    let length = 0;
    if (arrayObj.properties.has("length")) {
        const lengthVal = arrayObj.properties.get("length") as NumberValue;
        length = lengthVal.value;
    }
    
    // Build the string
    const parts: string[] = [];
    for (let i = 0; i < length; i++) {
        const index = i.toString();
        if (arrayObj.properties.has(index)) {
            const element = arrayObj.properties.get(index) as RuntimeValue;
            
            // Convert element to string based on type
            let strValue: string;
            switch (element.type) {
                case "string":
                    strValue = (element as StringValue).value;
                    break;
                case "number":
                    strValue = (element as NumberValue).value.toString();
                    break;
                case "boolean":
                    strValue = (element as BooleanValue).value ? "frfr" : "cap";
                    break;
                case "null":
                    strValue = "null";
                    break;
                default:
                    strValue = "[object]";
            }
            
            parts.push(strValue);
        } else {
            parts.push("");
        }
    }
    
    return { type: "string", value: parts.join(separator) } as StringValue;
}

// Includes method: determines whether an array includes a certain element
export function arrayIncludes(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 2) {
        throw "includes() requires at least two arguments: array and element to find";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "includes() can only be called on arrays";
    }
    
    const searchElement = args[1];
    const arrayObj = array as ObjectValue;
    
    // Get length
    let length = 0;
    if (arrayObj.properties.has("length")) {
        const lengthVal = arrayObj.properties.get("length") as NumberValue;
        length = lengthVal.value;
    }
    
    // Search for the element
    for (let i = 0; i < length; i++) {
        const index = i.toString();
        if (arrayObj.properties.has(index)) {
            const element = arrayObj.properties.get(index) as RuntimeValue;
            
            // Simple equality check
            if (element.type === searchElement.type) {
                if (element.type === "number" && searchElement.type === "number") {
                    if ((element as NumberValue).value === (searchElement as NumberValue).value) {
                        return MK_BOOL(true);
                    }
                } else if (element.type === "string" && searchElement.type === "string") {
                    if ((element as StringValue).value === (searchElement as StringValue).value) {
                        return MK_BOOL(true);
                    }
                } else if (element.type === "boolean" && searchElement.type === "boolean") {
                    if ((element as BooleanValue).value === (searchElement as BooleanValue).value) {
                        return MK_BOOL(true);
                    }
                } else if (element.type === "null" && searchElement.type === "null") {
                    return MK_BOOL(true);
                }
            }
        }
    }
    
    return MK_BOOL(false);
}

// Reverse method: reverses an array in place
export function arrayReverse(args: RuntimeValue[], env: Environment): RuntimeValue {
    if (args.length < 1) {
        throw "reverse() requires an array argument";
    }
    
    const array = args[0];
    if (array.type !== "object") {
        throw "reverse() can only be called on arrays";
    }
    
    const arrayObj = array as ObjectValue;
    
    // Get length
    let length = 0;
    if (arrayObj.properties.has("length")) {
        const lengthVal = arrayObj.properties.get("length") as NumberValue;
        length = lengthVal.value;
    }
    
    // Reverse the array in place
    for (let i = 0; i < Math.floor(length / 2); i++) {
        const frontIndex = i.toString();
        const backIndex = (length - 1 - i).toString();
        
        // Swap elements
        if (arrayObj.properties.has(frontIndex) && arrayObj.properties.has(backIndex)) {
            const temp = arrayObj.properties.get(frontIndex) as RuntimeValue;
            arrayObj.properties.set(frontIndex, arrayObj.properties.get(backIndex) as RuntimeValue);
            arrayObj.properties.set(backIndex, temp);
        } else if (arrayObj.properties.has(frontIndex)) {
            arrayObj.properties.set(backIndex, arrayObj.properties.get(frontIndex) as RuntimeValue);
            arrayObj.properties.delete(frontIndex);
        } else if (arrayObj.properties.has(backIndex)) {
            arrayObj.properties.set(frontIndex, arrayObj.properties.get(backIndex) as RuntimeValue);
            arrayObj.properties.delete(backIndex);
        }
    }
    
    return array;
}

// Setup all array methods in the global environment
export function setupArrayMethods(env: Environment): void {
    env.declareVar("Array_push", MK_NATIVE_FN(arrayPush), true);
    env.declareVar("Array_pop", MK_NATIVE_FN(arrayPop), true);
    env.declareVar("Array_shift", MK_NATIVE_FN(arrayShift), true);
    env.declareVar("Array_unshift", MK_NATIVE_FN(arrayUnshift), true);
    env.declareVar("Array_length", MK_NATIVE_FN(arrayLength), true);
    env.declareVar("Array_join", MK_NATIVE_FN(arrayJoin), true);
    env.declareVar("Array_includes", MK_NATIVE_FN(arrayIncludes), true);
    env.declareVar("Array_reverse", MK_NATIVE_FN(arrayReverse), true);
} 