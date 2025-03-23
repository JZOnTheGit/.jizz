import { MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeValue } from "./values.ts";

export function createGlobalEnv(){
    const env = new Environment();
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    //define a native builtin method
    env.declareVar("buss", MK_NATIVE_FN((args, scope) => {
        console.log(...args);
        return MK_NULL();
    }), true);

    function timeFunction(_args: RuntimeValue[], _env: Environment): RuntimeValue{
        return MK_NUMBER(Date.now());
    }
    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);

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