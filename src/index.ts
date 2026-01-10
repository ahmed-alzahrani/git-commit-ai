#!/usr/bin/env node

import { Command } from 'commander';
import { getPromptForMode } from './config/modes';
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

async function run(options: CliOptions) {
  console.log(CLI_MESSAGES.MODE_SELECTED(options.mode));

  if (!(await checkRepo())) {
    console.error(ERROR_MESSAGES.NOT_A_GIT_REPO);
    return;
  }

  let diff: string;
  try {
    diff = await getDiff();
  } catch {
    console.error(ERROR_MESSAGES.NO_STAGED_CHANGES);
    return;
  }

  const prompt = getPromptForMode(options.mode, diff);

  const spinner = ora(SPINNER_MESSAGES.GENERATING_COMMIT_MESSAGE).start();
  const commitMessage = await generateCommitMessage(prompt);
  spinner.succeed(SPINNER_MESSAGES.SUCCESS_GENERATED);
  console.log(commitMessage);

  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: CLI_MESSAGES.COMMIT_CONFIRMATION,
      default: true,
    },
  ]);

  if (!confirm.confirm) {
    console.log(ERROR_MESSAGES.COMMIT_MESSAGE_NOT_COMMITTED);
    return;
  }

  const commitSpinner = ora(SPINNER_MESSAGES.COMMITTING).start();
  await commit(commitMessage);
  commitSpinner.succeed(SPINNER_MESSAGES.SUCCESS_COMMITTED);
}

program
  .name(APP_INFO.NAME)
  .description(APP_INFO.DESCRIPTION)
  .version(APP_INFO.VERSION)
  .option('-m, --mode <mode>', 'commit message mode', APP_INFO.DEFAULT_MODE)
  .action(run);

program.parseAsync();
