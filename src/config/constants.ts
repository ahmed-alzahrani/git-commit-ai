import * as path from 'path';
import * as fs from 'fs';

// Load version from package.json
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Paths
export const PATHS = {
  MODES_CONFIG: path.join(__dirname, '../../config/modes.yaml'),
  SERVICE_ACCOUNT_KEY: path.join(
    __dirname,
    '../../config/keys/committer-service-account-key.json'
  ),
} as const;

// AI/Vertex AI Configuration
export const AI_CONFIG = {
  MODEL: 'gemini-2.5-flash',
  LOCATION: 'us-central1',
  MAX_OUTPUT_TOKENS: 5000,
  TEMPERATURE: 0.7,
} as const;

// Git-related
export const GIT = {
  DIFF_FLAGS: ['--cached'] as const,
  REVPARSE_FLAGS: ['--is-inside-work-tree'] as const,
} as const;

// Spinner Messages
export const SPINNER_MESSAGES = {
  GENERATING_COMMIT_MESSAGE: 'Generating commit message...',
  COMMITTING: 'Committing...',
  SUCCESS_GENERATED: 'Commit message generated',
  SUCCESS_COMMITTED: 'Committed',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NOT_A_GIT_REPO: 'Not a git repository',
  NO_STAGED_CHANGES: 'No staged changes',
  MODE_NOT_FOUND: (modeId: string) =>
    `Mode "${modeId}" not found in configuration`,
  NO_COMMIT_MESSAGE_GENERATED: 'No commit message generated from AI response',
  FAILED_TO_LOAD_MODES_CONFIG: (message: string) =>
    `Failed to load modes config: ${message}`,
  FAILED_TO_LOAD_MODES_CONFIG_UNKNOWN:
    'Failed to load modes config: unknown error',
  INVALID_MODES_CONFIG: 'Invalid modes configuration: missing modes property',
  COMMIT_MESSAGE_NOT_COMMITTED: 'Commit message not committed',
} as const;

// CLI Messages
export const CLI_MESSAGES = {
  MODE_SELECTED: (mode: string) => `Mode selected: ${mode}`,
  COMMIT_CONFIRMATION: 'Are you sure you want to commit with this message?',
} as const;

// Application Info
export const APP_INFO = {
  NAME: 'committer',
  DESCRIPTION: 'AI powered git commit message generator',
  VERSION: packageJson.version,
  DEFAULT_MODE: 'default',
} as const;
