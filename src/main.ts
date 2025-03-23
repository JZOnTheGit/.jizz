import Parser from "./frontend/parser";
import Environment, { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import { readFileSync, existsSync } from 'fs';

// Get the filename from command line arguments
const filename = process.argv[2];

// Check if a file was provided
if (!filename) {
    console.error("Error: Please provide a .jizz file to run");
    process.exit(1);
}

// Check if it's a .jizz file
if (!filename.endsWith('.jizz')) {
    console.error("Error: Only .jizz files are supported");
    process.exit(1);
}

run(filename);

async function run(filename: string) {
    try {
        const parser = new Parser();
        const env = createGlobalEnv();

        const input = readFileSync(filename, 'utf8');
        const program = parser.produceAST(input);

        evaluate(program, env);
    } catch (error) {
        if (error instanceof Error && error.message.includes('no such file')) {
            console.error(`Error: File '${filename}' not found`);
        } else if (typeof error === "string" && error.startsWith("Error at line")) {
            // Already formatted error message
            console.error("\x1b[31m%s\x1b[0m", error);  // Print in red
        } else {
            console.error("\x1b[31m%s\x1b[0m", "Error: " + error);  // Print in red
        }
        process.exit(1);
    }
}

function repl() {
    const parser = new Parser();
    const env = createGlobalEnv();

    console.log("\nRepl v0.1");

    while(true) {
        const input = prompt("> ");
        //check for no user input or exit keyboard
        if(!input || input.includes("exit")) {
            console.log("Goodbye!");
            process.exit(0);
        }

        try {
            const program = parser.produceAST(input);
            const result = evaluate(program, env);
            console.log(result);
        } catch (error) {
            if (typeof error === "string" && error.startsWith("Error at line")) {
                console.error("\x1b[31m%s\x1b[0m", error);  // Print in red
            } else {
                console.error("\x1b[31m%s\x1b[0m", "Error: " + error);  // Print in red
            }
        }
    }
}