import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ModesConfig, Mode } from '../types';
import { PATHS, ERROR_MESSAGES } from './constants';

let cachedConfig: ModesConfig | null = null;

export function loadModesConfig(): ModesConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const fileContents = fs.readFileSync(PATHS.MODES_CONFIG, 'utf8');
    const config = yaml.load(fileContents) as ModesConfig;

    if (!config || !config.modes) {
      throw new Error(ERROR_MESSAGES.INVALID_MODES_CONFIG);
    }

    cachedConfig = config;
    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        ERROR_MESSAGES.FAILED_TO_LOAD_MODES_CONFIG(error.message)
      );
    }
    throw new Error(ERROR_MESSAGES.FAILED_TO_LOAD_MODES_CONFIG_UNKNOWN);
  }
}

export function getMode(modeId: string): Mode {
  const config = loadModesConfig();
  const mode = config.modes[modeId];

  if (!mode) {
    throw new Error(ERROR_MESSAGES.MODE_NOT_FOUND(modeId));
  }

  return mode;
}

export function replaceDiffPlaceholder(
  promptTemplate: string,
  diff: string
): string {
  return promptTemplate.replace(/\{\{diff\}\}/g, diff);
}

export function getPromptForMode(modeId: string, diff: string): string {
  const mode = getMode(modeId);
  return replaceDiffPlaceholder(mode.prompt, diff);
}
