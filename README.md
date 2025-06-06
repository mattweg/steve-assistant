# Steve - Cloud-Based Personal Assistant

Steve is a cloud-based personal assistant platform built on AWS using CloudFormation. Unlike Emma (which is built around Claude Code), Steve is designed to integrate with mcpomni-connect, allowing it to interface with multiple language models through a unified architecture. Steve functions as a "head intern" personal assistant with a focus on task automation using various MCP integrations.

[![GitHub Repository](https://img.shields.io/badge/GitHub-steve--assistant-blue?logo=github)](https://github.com/mattweg/steve-assistant)

## Features

- **CloudFormation Deployment**: One-click deployment to AWS
- **Multi-Model Support**: Leverage different AI models via mcpomni-connect
- **MCP Integration**: Connect to Google Workspace, YNAB, Airtable, and more
- **Background Processing**: Run tasks in the background with status tracking
- **Custom Routines**: Define and execute multi-step workflows
- **Persona Configuration**: Customize Steve's behavior and communication style

## Quick Start

### Option 1: CloudFormation Deployment (Recommended)

1. **Deploy CloudFormation Stack**:
   ```bash
   aws cloudformation create-stack \
     --stack-name steve \
     --template-body file://infrastructure/cf-template.yaml \
     --parameters \
       ParameterKey=InstanceType,ParameterValue=t4g.medium \
       ParameterKey=KeyName,ParameterValue=your-key-name \
       ParameterKey=UserEmail,ParameterValue=your-email@example.com \
     --capabilities CAPABILITY_IAM
   ```

2. **Connect to Instance**:
   ```bash
   ssh -i your-key.pem ec2-user@<instance-ip>
   ```

3. **Start Using Steve**:
   ```bash
   steve --help
   ```

### Option 2: Manual Installation

1. **Install Dependencies**:
   ```bash
   npm install -g mcpomni-connect
   ```

2. **Install Steve CLI**:
   ```bash
   npm install -g steve-cli
   ```

3. **Start Using Steve**:
   ```bash
   steve --help
   ```

## Usage

```bash
# Get help
steve --help

# Ask a question
steve "What files are in this directory?"

# Run a routine
steve --routine=morning

# Use a specific persona
steve --persona=focused "Research AWS cost optimization"

# Run a task in the background
steve --background --print "Analyze this project" --out-file ~/report.txt

# Check status of background processes
steve --status
```

## Demo

Follow the [DEMO.md](DEMO.md) instructions to see Steve in action!

## Directory Structure

```
steve/
├── bin/               # Executable scripts
├── docs/              # Documentation
├── infrastructure/    # CloudFormation templates
├── lib/               # Core libraries
├── scripts/           # Utility scripts
├── src/               # Source code
└── test/              # Test files
```

## Documentation

See the `docs/` directory for detailed documentation:

- [Design Document](docs/steve-design.md)
- [Implementation Plan](docs/steve-implementation-plan.md)
- [Installation Guide](docs/steve-installation.md)
- [Test Plan](docs/steve-test-plan.md)
- [Emma Comparison](docs/steve-comparison.md)

## MCP Integration

Steve integrates with multiple MCP (Model Context Protocol) servers:

- Google Workspace (Email, Calendar, Drive)
- YNAB (Budgeting)
- Airtable (Structured data)
- URL Shortener
- Plus any additional MCPs supported by mcpomni-connect

## Development

### Prerequisites

- Node.js 14+
- npm 6+
- AWS CLI (for deployment)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/mattweg/steve-assistant.git
cd steve-assistant

# Install dependencies
npm install

# Make scripts executable
chmod +x bin/steve

# Run tests
npm test
```

## License

MIT

## Acknowledgments

This project is inspired by the Emma personal assistant project, but offers a different approach by leveraging mcpomni-connect for multi-model support and using CloudFormation for standardized deployment.