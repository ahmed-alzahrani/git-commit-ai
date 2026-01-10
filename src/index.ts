#!/usr/bin/env node

import { Command } from 'commander';
import { getPromptForMode, getMode } from './config/modes';
import { checkRepo, getDiff, commit } from './git';
import { CliOptions } from './types';
import { generateCommitMessage } from './ai/generate';
import ora from 'ora';
import inquirer from 'inquirer';
import {
  ERROR_MESSAGES,
  CLI_MESSAGES,
  SPINNER_MESSAGES,
  APP_INFO,
} from './config/constants';

const program = new Command();

async function validateGitState(): Promise<string | null> {
  if (!(await checkRepo())) {
    console.error(ERROR_MESSAGES.NOT_A_GIT_REPO);
    return null;
  }

  try {
    return await getDiff();
  } catch {
    console.error(ERROR_MESSAGES.NO_STAGED_CHANGES);
    return null;
  }
}

async function generateCommitMessageWithSpinner(
  prompt: string
): Promise<string> {
  const spinner = ora(SPINNER_MESSAGES.GENERATING_COMMIT_MESSAGE).start();
  try {
    const commitMessage = await generateCommitMessage(prompt);
    spinner.succeed(SPINNER_MESSAGES.SUCCESS_GENERATED);
    return commitMessage;
  } catch (error) {
    spinner.fail(ERROR_MESSAGES.FAILED_TO_GENERATE_COMMIT_MESSAGE);
    throw error;
  }
}

async function confirmWithUser(): Promise<boolean> {
  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: CLI_MESSAGES.COMMIT_CONFIRMATION,
      default: true,
    },
  ]);
  return confirm.confirm;
}

async function executeCommitWithSpinner(message: string): Promise<void> {
  const commitSpinner = ora(SPINNER_MESSAGES.COMMITTING).start();
  try {
    await commit(message);
    commitSpinner.succeed(SPINNER_MESSAGES.SUCCESS_COMMITTED);
  } catch (error) {
    commitSpinner.fail(ERROR_MESSAGES.FAILED_TO_COMMIT);
    throw error;
  }
}

function validateMode(modeId: string): void {
  try {
    getMode(modeId);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(ERROR_MESSAGES.MODE_NOT_FOUND(modeId));
    }
    throw error;
  }
}

async function run(options: CliOptions) {
  try {
    // Validate mode early before any git operations
    validateMode(options.mode);
    console.log(CLI_MESSAGES.MODE_SELECTED(options.mode));

    const diff = await validateGitState();
    if (!diff) {
      return;
    }

    const prompt = getPromptForMode(options.mode, diff);
    const commitMessage = await generateCommitMessageWithSpinner(prompt);
    console.log(commitMessage);

    const confirmed = await confirmWithUser();
    if (!confirmed) {
      console.log(ERROR_MESSAGES.COMMIT_MESSAGE_NOT_COMMITTED);
      return;
    }

    await executeCommitWithSpinner(commitMessage);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}

program
  .name(APP_INFO.NAME)
  .description(APP_INFO.DESCRIPTION)
  .version(APP_INFO.VERSION)
  .option(
    '-m, --mode <mode>',
    `commit message mode (default: ${APP_INFO.DEFAULT_MODE})`,
    APP_INFO.DEFAULT_MODE
  )
  .addHelpText(
    'after',
    `
Examples:
  $ committer                    Generate commit message with default mode
  $ committer --mode conventional  Use conventional commit format
  $ committer -m yoda            Use Yoda-style commit messages

Note:
  Make sure you have staged changes (git add) before running this command.
  The tool will prompt you to confirm before committing.
    `
  )
  .action(run);

program.parseAsync();
