# Committer

AI-powered git commit message generator using Google Vertex AI (Gemini).

## Description

Committer analyzes your staged git changes and generates intelligent commit messages using AI. Simply stage your changes and let Committer create a meaningful commit message for you.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Cloud Project with:
  - Vertex AI API enabled
  - Vertex AI Generative AI API enabled
  - A service account with "Vertex AI User" role
  - A service account key file (JSON)

## Installation

### Global Installation

```bash
npm install -g committer
```

Or clone and build from source:

```bash
git clone https://github.com/ahmed-alzahrani/committer.git
cd committer
npm install
npm run build
npm link
```

## Setup

### 1. Google Cloud Configuration

1. Create a Google Cloud Project at [Google Cloud Console](https://console.cloud.google.com)
2. Enable the following APIs:
   - **Vertex AI API**
   - **Vertex AI Generative AI API** (or Generative Language API)
3. Create a Service Account:
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Grant the **Vertex AI User** role
   - Create and download a JSON key file

### 2. Configure Service Account Key

Place your service account key file in the project:

```bash
mkdir -p config/keys
cp /path/to/your-service-account-key.json config/keys/committer-service-account-key.json
```

**Important:** The `config/keys/` directory is in `.gitignore` - never commit your service account key!

## Usage

### Basic Usage

1. Stage your changes:
   ```bash
   git add .
   ```

2. Generate and commit:
   ```bash
   committer
   ```

3. Review the generated commit message and confirm if you want to commit.

### Using Different Modes

Specify a mode with the `--mode` or `-m` flag:

```bash
committer --mode conventional
committer -m emoji
committer --mode yoda
```

### Available Modes

- **`default`** - Standard concise commit messages
- **`conventional`** - Strict Conventional Commits format (`feat:`, `fix:`, etc.)
- **`emoji`** - Commit messages with emoji prefixes (🚀, 🐛, ✨, etc.)
- **`detailed`** - Longer, more descriptive messages with context
- **`goofy`** - Fun, casual commit messages
- **`japanese`** - Commit messages in Japanese
- **`rhymes`** - Commit messages that rhyme
- **`yoda`** - Commit messages in Yoda speak ("Fixed, the bug has been")
- **`questions`** - Commit messages posed as questions

## Examples

```bash
# Generate a conventional commit message
$ committer -m conventional
Mode selected: conventional
✓ Commit message generated
feat(auth): Add user authentication middleware

Are you sure you want to commit with this message? (Y/n)

# Generate an emoji commit message
$ committer -m emoji
Mode selected: emoji
✓ Commit message generated
🐛 Fix null pointer exception in user validation

Are you sure you want to commit with this message? (Y/n)

# Generate a Yoda-style commit message
$ committer -m yoda
Mode selected: yoda
✓ Commit message generated
Fixed, the bug has been. In production, deployed it is.

Are you sure you want to commit with this message? (Y/n)
```

## Development

### Building from Source

```bash
npm install
npm run build
```

### Development Mode

Watch for changes and auto-rebuild:

```bash
npm run watch
```

In another terminal, run:

```bash
npm run dev -- --mode conventional
```

### Project Structure

```
committer/
├── config/
│   ├── keys/           # Service account keys (gitignored)
│   └── modes.yaml      # Commit message mode definitions
├── src/
│   ├── ai/             # AI generation logic
│   ├── config/         # Configuration loading
│   ├── types/          # TypeScript types
│   ├── git.ts          # Git operations
│   └── index.ts        # CLI entry point
└── dist/               # Compiled JavaScript (gitignored)
```

## Customization

### Adding Custom Modes

Edit `config/modes.yaml` to add your own commit message styles:

```yaml
modes:
  my-custom-mode:
    name: "My Custom Mode"
    description: "My custom commit message style"
    prompt: |
      Generate a single commit message in my custom style.
      
      Diff:
      {{diff}}
```

The `{{diff}}` placeholder will be replaced with your actual git diff.