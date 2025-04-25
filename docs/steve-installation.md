# Steve Installation Guide

## Introduction
This guide provides detailed instructions for installing and configuring Steve, a personal assistant platform built as a wrapper around mcpomni-connect. Steve can be deployed via CloudFormation or installed manually on an existing system.

## Prerequisites
Before installing Steve, ensure your system meets the following requirements:

### System Requirements
- **Operating System**: Amazon Linux 2023, Ubuntu 20.04+, or macOS 12+
- **CPU**: 2+ cores recommended
- **Memory**: 4GB+ RAM recommended
- **Disk Space**: 1GB+ free space
- **Network**: Internet connection for MCP interactions

### Software Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Git**: Any recent version
- **AWS CLI**: v2.0.0+ (for CloudFormation deployment only)
- **SSH Client**: For connecting to EC2 instance (CloudFormation deployment only)

## Installation Methods

### Method 1: CloudFormation Deployment (Recommended)
The CloudFormation deployment automatically provisions an EC2 instance and configures Steve with all dependencies.

#### Steps:
1. **Prepare AWS Account**
   - Ensure you have an AWS account with appropriate permissions
   - Create or identify an EC2 key pair for SSH access

2. **Deploy CloudFormation Stack**
   ```bash
   # Download CloudFormation template
   curl -O https://raw.githubusercontent.com/username/steve/main/steve-cf-template.yaml
   
   # Deploy stack
   aws cloudformation create-stack \
     --stack-name steve \
     --template-body file://steve-cf-template.yaml \
     --parameters \
       ParameterKey=InstanceType,ParameterValue=t4g.medium \
       ParameterKey=KeyName,ParameterValue=your-key-pair-name \
       ParameterKey=SSHLocation,ParameterValue=your-ip-address/32 \
       ParameterKey=UserEmail,ParameterValue=your-email@example.com \
     --capabilities CAPABILITY_IAM
   ```

3. **Wait for Deployment to Complete**
   ```bash
   aws cloudformation wait stack-create-complete --stack-name steve
   ```

4. **Get Instance Information**
   ```bash
   aws cloudformation describe-stacks \
     --stack-name steve \
     --query "Stacks[0].Outputs" \
     --output table
   ```

5. **Connect to Instance**
   ```bash
   ssh -i your-key-pair.pem ec2-user@<PublicIP>
   ```

6. **Complete Setup**
   ```bash
   # Initialize Steve
   source ~/.bashrc
   
   # Verify installation
   steve --version
   ```

### Method 2: Manual Installation
For users who prefer to install Steve on an existing system or cannot use CloudFormation.

#### Steps:
1. **Install Dependencies**
   ```bash
   # Update package lists
   sudo apt update  # Ubuntu
   sudo yum update -y  # Amazon Linux/RHEL/CentOS
   
   # Install Node.js and npm (if not already installed)
   # Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Amazon Linux/RHEL/CentOS
   curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **Install mcpomni-connect**
   ```bash
   npm install -g mcpomni-connect
   ```

3. **Clone Steve Repository**
   ```bash
   git clone https://github.com/username/steve.git ~/steve
   cd ~/steve
   ```

4. **Install Steve CLI**
   ```bash
   npm install -g .
   ```

5. **Create Configuration Directories**
   ```bash
   mkdir -p ~/.steve/config
   mkdir -p ~/.steve/personas
   mkdir -p ~/.steve/routines
   mkdir -p ~/.steve/mcps
   mkdir -p ~/.steve/background/processes
   ```

6. **Create Base Configuration**
   ```bash
   cat > ~/.steve/config/config.json << EOF
   {
     "version": "1.0.0",
     "defaultPersona": "steve",
     "defaultRoutine": "auto",
     "mcpConfig": {
       "path": "$HOME/.steve/mcps"
     },
     "background": {
       "processDir": "$HOME/.steve/background/processes"
     }
   }
   EOF
   ```

7. **Create Default Persona**
   ```bash
   # Download default persona configuration
   curl -o ~/.steve/personas/steve.json \
     https://raw.githubusercontent.com/username/steve/main/personas/steve.json
   ```

8. **Add to Startup**
   ```bash
   # Create startup script
   mkdir -p ~/.steve/bin
   
   cat > ~/.steve/bin/steve-startup.sh << 'EOF'
   #!/bin/bash
   
   # Steve Auto-Startup Script
   echo ""
   echo "┌────────────────────────────────────────┐"
   echo "│                                        │"
   echo "│   Steve Personal Assistant             │"
   echo "│   Your AI Intern is ready to help.     │"
   echo "│                                        │"
   echo "│   Type 'steve' to begin, or            │"
   echo "│   'steve --help' for options.          │"
   echo "│                                        │"
   echo "└────────────────────────────────────────┘"
   echo ""
   
   # Aliases for convenience
   alias steve-routine="steve --routine"
   alias steve-morning="steve --routine=morning"
   alias steve-evening="steve --routine=evening"
   alias steve-work="steve --routine=work"
   EOF
   
   chmod +x ~/.steve/bin/steve-startup.sh
   
   # Add to .bashrc
   echo -e "\n# Steve Auto-Startup\nif [ -f \$HOME/.steve/bin/steve-startup.sh ]; then\n  source \$HOME/.steve/bin/steve-startup.sh\nfi" >> ~/.bashrc
   ```

9. **Complete Setup**
   ```bash
   # Apply changes
   source ~/.bashrc
   
   # Verify installation
   steve --version
   ```

## Post-Installation Configuration

### Configure MCP Access
Steve requires authentication for each MCP you wish to use.

#### Google Workspace MCP
```bash
# Start Steve and follow authentication process
steve
> authenticate google workspace
```

#### YNAB MCP
```bash
steve
> authenticate ynab
```

#### Airtable MCP
```bash
steve
> authenticate airtable
```

### Create Routines
Create custom routines to automate repetitive tasks:

1. **Create Routine Directory**
   ```bash
   mkdir -p ~/.steve/routines
   ```

2. **Create Morning Routine**
   ```bash
   cat > ~/.steve/routines/morning.json << EOF
   {
     "name": "Morning Routine",
     "description": "Start your day organized",
     "prompt": "1. Check and summarize my calendar for today\n2. List any new important emails\n3. Remind me of today's priorities"
   }
   EOF
   ```

3. **Create Evening Routine**
   ```bash
   cat > ~/.steve/routines/evening.json << EOF
   {
     "name": "Evening Routine",
     "description": "Wrap up your day and prepare for tomorrow",
     "prompt": "1. Summarize task completions for today\n2. Preview tomorrow's calendar\n3. Suggest priorities for tomorrow"
   }
   EOF
   ```

## Using Steve

### Basic Usage
```bash
# Get help
steve --help

# Ask a question
steve "What files are in this directory?"

# Run a routine
steve --routine=morning

# Use a specific persona
steve --persona=focused "Research AWS cost optimization"
```

### Background Processing
```bash
# Run a task in the background
steve --background --print "Analyze this project and create a summary report" --out-file ~/report.txt

# Check status
steve --status

# View output of a specific process
steve --status <process-id>

# View logs
steve --logs <process-id>

# Terminate a process
steve --kill <process-id>
```

## Troubleshooting

### Common Issues

#### Steve Command Not Found
```bash
# Add to PATH manually
echo 'export PATH="$PATH:$HOME/.npm/bin"' >> ~/.bashrc
source ~/.bashrc
```

#### MCP Authentication Failures
```bash
# Check MCP configuration
ls -la ~/.steve/mcps

# Manually trigger authentication
steve "authenticate google workspace"
```

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Install newer version if needed
npm install -g n
n stable
```

### Logs and Debugging
Steve maintains logs for troubleshooting:

```bash
# Configuration logs
cat ~/.steve/steve.log

# Background process logs
cat ~/.steve/background/processes/<process-id>/debug.log

# mcpomni-connect logs
cat ~/.steve/mcpomni.log
```

## Updating Steve

### Update via npm
```bash
# Update Steve CLI
npm update -g steve-cli

# Update mcpomni-connect
npm update -g mcpomni-connect
```

### Update from Repository
```bash
# Pull latest changes
cd ~/steve
git pull

# Reinstall
npm install -g .
```

## Uninstallation

### Remove Steve Components
```bash
# Uninstall CLI
npm uninstall -g steve-cli

# Remove configuration
rm -rf ~/.steve

# Remove startup from .bashrc (manual edit required)
# Delete these lines from ~/.bashrc:
#
# # Steve Auto-Startup
# if [ -f $HOME/.steve/bin/steve-startup.sh ]; then
#   source $HOME/.steve/bin/steve-startup.sh
# fi
```

### Delete CloudFormation Stack
If you deployed via CloudFormation:

```bash
aws cloudformation delete-stack --stack-name steve
```

## Support and Resources

### Documentation
- [Steve GitHub Repository](https://github.com/username/steve)
- [mcpomni-connect Documentation](https://docs.mcpomni-connect.dev)
- [Troubleshooting Guide](https://github.com/username/steve/wiki/Troubleshooting)

### Community Support
- [GitHub Issues](https://github.com/username/steve/issues)
- [Discussion Forum](https://discuss.steve-assistant.com)

### Contributing
Contributions to Steve are welcome! See [CONTRIBUTING.md](https://github.com/username/steve/CONTRIBUTING.md) for details.