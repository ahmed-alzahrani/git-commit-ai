export interface Mode {
  name: string;
  description: string;
  prompt: string; // Template with {{diff}} placeholder
}

export interface ModesConfig {
  modes: Record<string, Mode>;
}

export interface CliOptions {
  mode: string;
}
