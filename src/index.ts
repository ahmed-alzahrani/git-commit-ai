#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
    .name('gca')
    .description('AI powered git commit message generator')
    .version('1.0.0')
    .option('-m, --mode <mode>', 'commit message mode', 'default')
    .action((options) => {
        console.log(`Mode selected: ${options.mode}`);
        // todo: call the generate function later
    });

program.parse();