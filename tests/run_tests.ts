import { readdirSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import chalk from 'chalk';

// Function to run a test file
function runTest(testFile: string): boolean {
    console.log(chalk.cyan(`\nRunning test: ${testFile}`));
    console.log(chalk.gray('----------------------------------------'));

    const result = spawnSync('node', ['./dist/src/cli.js', 'run', `./tests/${testFile}`], {
        stdio: 'inherit',
        cwd: process.cwd()
    });

    if (result.status === 0) {
        console.log(chalk.green('✓ Test passed'));
        return true;
    } else {
        console.log(chalk.red('✗ Test failed'));
        return false;
    }
}

// Main test runner
function runAllTests() {
    const testFiles = readdirSync('./tests')
        .filter(file => file.endsWith('.test.jizz'));

    console.log(chalk.yellow(`Found ${testFiles.length} test files`));

    let passed = 0;
    let failed = 0;

    for (const testFile of testFiles) {
        const success = runTest(testFile);
        if (success) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log(chalk.yellow('\nTest Summary:'));
    console.log(chalk.gray('----------------------------------------'));
    console.log(chalk.green(`Passed: ${passed}`));
    console.log(chalk.red(`Failed: ${failed}`));
    console.log(chalk.gray('----------------------------------------'));

    process.exit(failed > 0 ? 1 : 0);
}

runAllTests(); 