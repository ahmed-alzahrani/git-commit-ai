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

export interface ServiceAccountCredentials {
  project_id: string;
  private_key: string;
  client_email: string;
}

export interface PackageJson {
  name: string;
  version: string;
}
