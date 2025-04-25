# Steve Implementation Plan

## Project Overview
Steve is a cloud-based personal assistant platform that wraps around mcpomni-connect to provide an extensible, agentic assistant experience. The platform will be deployed via CloudFormation and offer a seamless CLI experience similar to Emma but with broader model support.

## Implementation Timeline

### Phase 1: Foundation (Week 1)
- [ ] **Research & Requirements**
  - [x] Analyze Emma implementation patterns
  - [ ] Research mcpomni-connect API and usage
  - [ ] Define core requirements and constraints
  - [ ] Document APIs and integration points

- [ ] **Infrastructure Setup**
  - [ ] Create initial CloudFormation template for EC2 instance
  - [ ] Define security groups and IAM roles
  - [ ] Set up monitoring and logging
  - [ ] Create S3 bucket for context storage (optional)

### Phase 2: Core Implementation (Week 2)
- [ ] **Steve CLI Development**
  - [ ] Create base CLI wrapper for mcpomni-connect
  - [ ] Implement command parsing and execution
  - [ ] Build configuration management system
  - [ ] Develop background processing capability

- [ ] **MCP Integration Layer**
  - [ ] Design MCP routing architecture
  - [ ] Implement authentication management
  - [ ] Create unified error handling
  - [ ] Build response caching mechanism

### Phase 3: Persona & Routines (Week 3)
- [ ] **Persona Configuration**
  - [ ] Define Steve persona in configuration format
  - [ ] Implement persona loading and application
  - [ ] Create persona switching mechanism
  - [ ] Test persona consistency across sessions

- [ ] **Routine Implementation**
  - [ ] Develop routine definition format
  - [ ] Implement routine execution engine
  - [ ] Create standard routines (morning, evening, work)
  - [ ] Add automatic routine detection

### Phase 4: Installation & Deployment (Week 4)
- [ ] **Installation Scripts**
  - [ ] Create installation script for local setup
  - [ ] Build CloudFormation deployment script
  - [ ] Implement MCP authentication flow
  - [ ] Develop bashrc integration for auto-startup

- [ ] **Testing & Documentation**
  - [ ] Write comprehensive test suite
  - [ ] Create user documentation
  - [ ] Develop troubleshooting guide
  - [ ] Build example workflows

## Implementation Details

### CloudFormation Template Structure
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Steve Personal Assistant Platform'

Parameters:
  InstanceType:
    Type: String
    Default: t4g.medium
    Description: EC2 instance type

Resources:
  SteveInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId: ami-0123456789abcdef # Amazon Linux 2023
      SecurityGroups:
        - !Ref SteveSecurityGroup
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          # Initial setup script
          yum update -y
          yum install -y nodejs npm git
          # Install mcpomni-connect
          npm install -g mcpomni-connect
          # Clone Steve repository
          git clone https://github.com/username/steve.git /opt/steve
          # Run setup script
          cd /opt/steve && ./setup.sh

  SteveSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Enable SSH access
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0 # Consider restricting this in production

Outputs:
  InstanceId:
    Description: ID of the EC2 instance
    Value: !Ref SteveInstance
  PublicIP:
    Description: Public IP address of the instance
    Value: !GetAtt SteveInstance.PublicIp
```

### Steve CLI Implementation
The Steve CLI will be implemented as a Node.js application similar to Emma CLI. Key files:

#### bin/steve
```bash
#!/bin/bash
#
# Steve CLI - Enhanced mcpomni-connect CLI with persona
#
# This script provides a streamlined way to start mcpomni-connect with preferred
# settings and support for Steve persona.

# Default settings
MCPOMNI_ARGS="--dangerously-skip-permissions"

# Display help information
show_help() {
  echo "Steve - Personal Assistant powered by mcpomni-connect"
  echo ""
  echo "Usage: steve [options] [prompt]"
  echo ""
  echo "Background Options:"
  echo "  --background           Run in background mode (no interactive prompt)"
  echo "  --print TEXT           Use with --background to process text input"
  echo "  --out-file FILE        Specify output file for background mode"
  echo "  --status [ID]          Show status of all processes or specific process"
  echo "  --logs ID              View logs for a background process"
  echo "  --kill ID              Terminate a background process"
  echo "  --list                 List all background processes"
  echo ""
  echo "Persona Options:"
  echo "  --persona=PERSONA      Use alternative persona (default: steve)"
  echo ""
  echo "Routine Options:"
  echo "  --routine=ROUTINE      Run a specific routine (morning, evening, work)"
  echo ""
  echo "Display Options:"
  echo "  --help                 Show this help message"
  echo ""
  echo "Any other options will be passed directly to mcpomni-connect"
  echo ""
  echo "Examples:"
  echo "  steve \"What files are in this directory?\""
  echo "  steve --background --print \"Process this text in the background\" --out-file results.txt"
  echo "  steve --routine=morning"
  echo ""
}

# Function to generate a unique process ID
generate_process_id() {
  local timestamp=$(date +%s)
  local random_str=$(head /dev/urandom | tr -dc 'a-z0-9' | head -c 8)
  echo "${timestamp}-${random_str}"
}

# Parse command line arguments
if [[ $# -eq 0 ]]; then
  mcpomni-connect $MCPOMNI_ARGS
  exit 0
fi

# Handle special commands
# (Similar to Emma's implementation but adapted for Steve)
# ...

# If we're in background mode, handle the background process
# (Similar to Emma's implementation but adapted for Steve)
# ...
```

### MCP Integration Layer
The MCP integration layer will be implemented as a middleware component:

```javascript
// src/mcp-integration.js
class McpIntegration {
  constructor(config) {
    this.config = config;
    this.authenticatedMcps = {};
    this.responseCache = new Map();
  }
  
  async routeRequest(mcpName, method, params) {
    // Check authentication
    if (!this.isAuthenticated(mcpName)) {
      await this.authenticate(mcpName);
    }
    
    // Check cache
    const cacheKey = this.generateCacheKey(mcpName, method, params);
    if (this.responseCache.has(cacheKey)) {
      return this.responseCache.get(cacheKey);
    }
    
    // Execute request
    try {
      const response = await this.executeRequest(mcpName, method, params);
      
      // Cache response if appropriate
      if (this.isCacheable(mcpName, method)) {
        this.responseCache.set(cacheKey, response);
      }
      
      return response;
    } catch (error) {
      // Handle error with consistency
      return this.handleError(error, mcpName, method);
    }
  }
  
  // Additional methods for authentication, caching, error handling, etc.
  // ...
}

module.exports = McpIntegration;
```

### Installation Script
The installation script will handle setting up Steve on a new system:

```bash
#!/bin/bash
#
# Steve Installation Script
# Sets up Steve Personal Assistant on a new system

set -e

echo "Installing Steve Personal Assistant..."

# Check for prerequisites
if ! command -v node &> /dev/null; then
  echo "Node.js is required but not installed. Please install Node.js first."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "npm is required but not installed. Please install npm first."
  exit 1
fi

# Install mcpomni-connect if not already installed
if ! command -v mcpomni-connect &> /dev/null; then
  echo "Installing mcpomni-connect..."
  npm install -g mcpomni-connect
fi

# Create directory structure
STEVE_DIR="$HOME/.steve"
mkdir -p "$STEVE_DIR/config"
mkdir -p "$STEVE_DIR/personas"
mkdir -p "$STEVE_DIR/routines"
mkdir -p "$STEVE_DIR/mcps"
mkdir -p "$STEVE_DIR/background/processes"

# Install Steve CLI
echo "Installing Steve CLI..."
npm install -g steve-cli

# Create default configuration
cat > "$STEVE_DIR/config/config.json" << EOF
{
  "version": "1.0.0",
  "defaultPersona": "steve",
  "defaultRoutine": "auto",
  "mcpConfig": {
    "path": "$STEVE_DIR/mcps"
  },
  "background": {
    "processDir": "$STEVE_DIR/background/processes"
  }
}
EOF

# Create default persona
cat > "$STEVE_DIR/personas/steve.json" << EOF
{
  "name": "Steve",
  "role": "Head Intern and Personal Assistant",
  "communication": {
    "style": "Professional but approachable",
    "tone": "Helpful and efficient",
    "signature": "Steve (Your AI Intern)"
  },
  "skills": [
    "Task management",
    "Scheduling",
    "Information retrieval",
    "Document processing"
  ]
}
EOF

# Add to .bashrc for auto-startup
if ! grep -q "steve-startup" "$HOME/.bashrc"; then
  echo "Adding Steve auto-startup to .bashrc..."
  echo -e "\n# Steve Auto-Startup\nif [ -f $HOME/.steve/bin/steve-startup.sh ]; then\n  source $HOME/.steve/bin/steve-startup.sh\nfi" >> "$HOME/.bashrc"
fi

# Create steve-startup.sh
mkdir -p "$STEVE_DIR/bin"
cat > "$STEVE_DIR/bin/steve-startup.sh" << EOF
#!/bin/bash

# Steve Auto-Startup Script
# This script is sourced by .bashrc to provide Steve functionality

# Function to start Steve
steve_start() {
  steve "\$@"
}

# Alias for convenience
alias steve-routine="steve --routine"

# Display welcome message
echo "Steve Personal Assistant is ready to help."
echo "Type 'steve' to begin, or 'steve --help' for options."
EOF

chmod +x "$STEVE_DIR/bin/steve-startup.sh"

echo "Steve installation complete!"
echo "Restart your shell or run 'source ~/.bashrc' to complete setup."
```

## Testing Strategy
Testing will be conducted in multiple phases:

1. **Unit Testing**: Test individual components of Steve CLI
2. **Integration Testing**: Test MCP integration layer
3. **End-to-End Testing**: Test complete workflows
4. **Performance Testing**: Measure response times and resource usage

Tests will be automated using Jest and run as part of CI/CD pipeline.

## Next Steps
The implementation will proceed according to the timeline above, with regular check-ins and adjustments as needed. As each phase is completed, documentation will be updated to reflect the current state of the project.