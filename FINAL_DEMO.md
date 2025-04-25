# Steve: Final Demo Instructions

This document provides step-by-step instructions for the final demonstration of the Steve Personal Assistant platform, including fully automated installation and deployment.

## Option 1: Local Demo

### Prerequisites
- Linux or macOS environment
- `sudo` access
- Python 3.7+
- Node.js 14+
- Internet connection

### Steps

1. **Get the repository**
   ```bash
   git clone https://github.com/mattweg/steve-assistant.git
   cd steve-assistant
   ```

2. **Run automated installation script**
   ```bash
   sudo ./infrastructure/install.sh
   ```
   
   The installation script will:
   - Install system dependencies
   - Create a dedicated `steve-user` account
   - Set up Python environment with virtual env
   - Configure directories and files
   - Install Node dependencies
   - Set up executable scripts and symlinks
   - Configure bashrc integration
   - Set up a demo model for mcpomni-connect

3. **Access Steve as steve-user**
   ```bash
   su - steve-user
   ```
   
   You should see the Steve welcome banner automatically.

4. **Try basic commands**
   ```bash
   # Get help
   steve --help
   
   # Ask a question
   steve "What can you help me with today?"
   
   # Run morning routine
   steve --routine=morning
   
   # List configured models
   steve-model list
   ```

## Option 2: AWS Deployment

### Prerequisites
- AWS CLI installed and configured
- EC2 key pair
- Internet connection

### Steps

1. **Get the repository**
   ```bash
   git clone https://github.com/mattweg/steve-assistant.git
   cd steve-assistant
   ```

2. **Run CloudFormation deployment script**
   ```bash
   ./infrastructure/cloudformation-deploy.sh \
     --name steve-demo \
     --key your-key-pair-name \
     --email your-email@example.com
   ```
   
   The deployment script will:
   - Create a CloudFormation stack
   - Deploy an EC2 instance
   - Configure security groups and IAM roles
   - Set up Steve using the automated installation script
   - Provide connection details when deployment completes

3. **Connect to your instance**
   ```bash
   ssh -i your-key-pair.pem ec2-user@<instance-ip>
   ```

4. **Switch to steve-user**
   ```bash
   sudo su - steve-user
   ```
   
   You should see the Steve welcome banner automatically.

5. **Try basic commands**
   ```bash
   # Get help
   steve --help
   
   # Ask a question
   steve "What can you help me with today?"
   
   # Run morning routine
   steve --routine=morning
   
   # List configured models
   steve-model list
   ```

## Simulating Domain Access

To simulate connecting to `steve-user@steve.wegweb.net`:

1. **Add hosts entry (requires sudo)**
   ```bash
   sudo bash -c 'echo "127.0.0.1 steve.wegweb.net" >> /etc/hosts'
   ```

2. **Set up SSH config**
   ```bash
   cat >> ~/.ssh/config << EOF
   Host steve.wegweb.net
     User steve-user
     StrictHostKeyChecking no
     UserKnownHostsFile /dev/null
   EOF
   ```

3. **Connect using the domain**
   ```bash
   ssh steve-user@steve.wegweb.net
   # Password: steve
   ```

## Demo Features

### Core Functionality
- **Multiple Models**: View available models with `steve-model list`
- **Persona System**: Try different personas with `steve --persona <name>`
- **Routines**: Execute routines with `steve --routine=<name>`
- **Background Processing**: Run tasks in background with `steve --background --print "Your task" --out-file result.txt`

### Advanced Features
- **Model Management**: Configure new models with `steve-model configure <name>`
- **Process Monitoring**: Monitor background jobs with `steve --status`
- **Interactive Mode**: Start interactive session with just `steve`

## Demonstration Script

For a guided walkthrough:

1. Connect to Steve system (either local or AWS)
2. Switch to steve-user account
3. Show welcome banner and available commands
4. Demonstrate basic query: `steve "Tell me about yourself"`
5. Show routine execution: `steve --routine=morning`
6. Demonstrate background processing: 
   ```bash
   steve --background --print "Analyze this project and provide a summary" --out-file ~/analysis.txt
   steve --status
   cat ~/analysis.txt
   ```
7. Show model management: `steve-model list`
8. Launch interactive mode: `steve`

## Comparison with Emma

Unlike Emma, which is built on Claude Code, Steve:
- Uses mcpomni-connect to support multiple language models
- Has fully automated deployment via CloudFormation
- Focuses on task automation rather than conversation
- Includes a comprehensive model management system
- Provides a more standardized deployment approach