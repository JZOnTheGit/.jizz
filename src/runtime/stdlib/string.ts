import { RuntimeValue, MK_NULL, MK_NUMBER, MK_STRING, StringValue, MK_BOOL, ObjectValue, MK_NATIVE_FN } from "../values";
import Environment from "../environment";

// String prototype methods
export const StringPrototype = new Map<string, RuntimeValue>();

// length
StringPrototype.set("length", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length !== 1 || args[0].type !== "string") {
        return MK_NULL();
    }
    return MK_NUMBER((args[0] as StringValue).value.length);
}));

// substring(start, end)
StringPrototype.set("substring", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length < 2 || args[0].type !== "string" || args[1].type !== "number") {
        return MK_NULL();
    }
    const str = (args[0] as StringValue).value;
    const start = (args[1] as any).value;
    const end = args[2]?.type === "number" ? (args[2] as any).value : str.length;
    return MK_STRING(str.substring(start, end));
}));

// indexOf(searchStr)
StringPrototype.set("indexOf", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length < 2 || args[0].type !== "string" || args[1].type !== "string") {
        return MK_NULL();
    }
    const str = (args[0] as StringValue).value;
    const searchStr = (args[1] as StringValue).value;
    return MK_NUMBER(str.indexOf(searchStr));
}));

// includes(searchStr)
StringPrototype.set("includes", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length < 2 || args[0].type !== "string" || args[1].type !== "string") {
        return MK_NULL();
    }
    const str = (args[0] as StringValue).value;
    const searchStr = (args[1] as StringValue).value;
    return MK_BOOL(str.includes(searchStr));
}));

// toUpperCase()
StringPrototype.set("toUpperCase", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length < 1 || args[0].type !== "string") {
        return MK_NULL();
    }
    return MK_STRING((args[0] as StringValue).value.toUpperCase());
}));

// toLowerCase()
StringPrototype.set("toLowerCase", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length < 1 || args[0].type !== "string") {
        return MK_NULL();
    }
    return MK_STRING((args[0] as StringValue).value.toLowerCase());
}));

// trim()
StringPrototype.set("trim", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length < 1 || args[0].type !== "string") {
        return MK_NULL();
    }
    return MK_STRING((args[0] as StringValue).value.trim());
}));

// split(separator)
StringPrototype.set("split", MK_NATIVE_FN((args: RuntimeValue[], _: Environment): RuntimeValue => {
    if (args.length < 2 || args[0].type !== "string" || args[1].type !== "string") {
        return MK_NULL();
    }
    const str = (args[0] as StringValue).value;
    const separator = (args[1] as StringValue).value;
    const parts = str.split(separator);
    
    // Create array object with string parts
    const array = { type: "object", properties: new Map() } as ObjectValue;
    parts.forEach((part, i) => {
        array.properties.set(i.toString(), MK_STRING(part));
    });
    array.properties.set("length", MK_NUMBER(parts.length));
    return array;
})); 