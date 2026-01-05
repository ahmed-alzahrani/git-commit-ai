import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { ModesConfig, Mode } from '../types';


export function loadModesConfig(): ModesConfig {
  const configPath = path.join(__dirname, '../../config/modes.yaml');
  
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents) as ModesConfig;
    
    if (!config || !config.modes) {
      throw new Error('Invalid modes configuration: missing modes property');
    }
    
    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load modes config: ${error.message}`);
    }
    throw new Error('Failed to load modes config: unknown error');
  }
}

export function getMode(modeId: string): Mode {
  const config = loadModesConfig();
  const mode = config.modes[modeId];
  
  if (!mode) {
    throw new Error(`Mode "${modeId}" not found in configuration`);
  }
  
  return mode;
}

export function replaceDiffPlaceholder(promptTemplate: string, diff: string): string {
  return promptTemplate.replace(/\{\{diff\}\}/g, diff);
}

export function getPromptForMode(modeId: string, diff: string): string {
  const mode = getMode(modeId);
  return replaceDiffPlaceholder(mode.prompt, diff);
}

