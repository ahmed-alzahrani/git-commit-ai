#!/usr/bin/env node

import { Command } from "commander";
import { getMode, getPromptForMode } from "./config/modes";
import { checkRepo, getDiff, commit } from "./git";
import { CliOptions } from "./types";
import { generateCommitMessage } from "./ai/generate";
import ora from "ora";
import inquirer from "inquirer";

const program = new Command();

async function run(options: CliOptions) {
    console.log(`Mode selected: ${options.mode}`);

    const mode = getMode(options.mode)

    if (!await checkRepo()) {
        console.error('Not a git repository');
        return;
    }

    let diff: string;
    try {
        diff = await getDiff();
    } catch (error) {
        console.error('No staged changes');
        return;
    }

    const prompt = getPromptForMode(options.mode, diff);

    const spinner = ora('Generating commit message...').start();
    const commitMessage = await generateCommitMessage(prompt);
    spinner.succeed('Commit message generated');
    console.log(commitMessage);

    const confirm = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to commit with this message?',
        default: true,
    }]);

    if (!confirm.confirm) {
        console.log('Commit message not committed');
        return;
    }

    const commitSpinner = ora('Committing...').start();
    await commit(commitMessage);
    commitSpinner.succeed('Committed');
}

program
    .name('committer')
    .description('AI powered git commit message generator')
    .version('1.0.0')
    .option('-m, --mode <mode>', 'commit message mode', 'default')
    .action(run);

program.parseAsync();