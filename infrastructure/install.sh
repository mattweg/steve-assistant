#!/bin/bash
#
# Steve Installation Script
#
# Fully automated installation for the Steve personal assistant platform.
# This script handles all aspects of installation including dependencies,
# configuration, and integration with the mcpomni-connect Python package.
#
# Created: April 25, 2025
# Author: Steve (AI Intern)

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Installation parameters
STEVE_USER="steve-user"
STEVE_USER_HOME="/home/$STEVE_USER"
GITHUB_REPO="https://github.com/mattweg/steve-assistant.git"
STEVE_INSTALL_DIR="$STEVE_USER_HOME/steve"
CONFIG_DIR="$STEVE_USER_HOME/.steve"

# Log function
log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Success function
success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Warning function
warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Error function
error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
  error "This script must be run as root (sudo)"
fi

# Banner
echo -e "${BLUE}"
echo "┌────────────────────────────────────────┐"
echo "│                                        │"
echo "│   Steve Personal Assistant             │"
echo "│   Installation Script                  │"
echo "│                                        │"
echo "└────────────────────────────────────────┘"
echo -e "${NC}"
echo

#####################################
# Step 1: Install system dependencies
#####################################
log "Step 1: Installing system dependencies..."

apt-get update
apt-get install -y \
  python3 \
  python3-pip \
  python3-venv \
  nodejs \
  npm \
  git \
  jq \
  uv

success "System dependencies installed"

###################################
# Step 2: Create steve-user account
###################################
log "Step 2: Creating steve-user account..."

# Check if user already exists
if id "$STEVE_USER" &>/dev/null; then
  warning "User $STEVE_USER already exists, skipping user creation"
else
  useradd -m -s /bin/bash "$STEVE_USER"
  echo "$STEVE_USER:steve" | chpasswd
  usermod -aG sudo "$STEVE_USER"
  success "User $STEVE_USER created"
fi

###############################
# Step 3: Clone Steve repository
###############################
log "Step 3: Cloning Steve repository..."

if [ -d "$STEVE_INSTALL_DIR" ]; then
  warning "Steve directory already exists, updating instead of cloning"
  cd "$STEVE_INSTALL_DIR"
  git pull
else
  # Clone the repository
  git clone "$GITHUB_REPO" "$STEVE_INSTALL_DIR"
  success "Steve repository cloned to $STEVE_INSTALL_DIR"
fi

# Set proper ownership
chown -R "$STEVE_USER:$STEVE_USER" "$STEVE_INSTALL_DIR"

#####################################
# Step 4: Set up Python environment
#####################################
log "Step 4: Setting up Python environment..."

# Create Python virtual environment
runuser -l "$STEVE_USER" -c "python3 -m venv $STEVE_USER_HOME/.venv"

# Install necessary Python packages
runuser -l "$STEVE_USER" -c "source $STEVE_USER_HOME/.venv/bin/activate && \
                           pip install --upgrade pip && \
                           pip install requests numpy"

success "Python environment set up"

#################################
# Step 5: Configure Steve
#################################
log "Step 5: Configuring Steve..."

# Create necessary directories
runuser -l "$STEVE_USER" -c "mkdir -p $CONFIG_DIR/mcpomni-connect/models"
runuser -l "$STEVE_USER" -c "mkdir -p $CONFIG_DIR/personas"
runuser -l "$STEVE_USER" -c "mkdir -p $CONFIG_DIR/routines"
runuser -l "$STEVE_USER" -c "mkdir -p $CONFIG_DIR/mcps"
runuser -l "$STEVE_USER" -c "mkdir -p $CONFIG_DIR/background/processes"

# Copy persona and routine files
runuser -l "$STEVE_USER" -c "cp $STEVE_INSTALL_DIR/src/persona.json $CONFIG_DIR/personas/steve.json"
runuser -l "$STEVE_USER" -c "cp $STEVE_INSTALL_DIR/src/routines/*.json $CONFIG_DIR/routines/"

# Create mcpomni-connect config file
runuser -l "$STEVE_USER" -c "cat > $CONFIG_DIR/mcpomni-connect/config.json << EOF
{
  \"version\": \"1.0.0\",
  \"default_model\": \"anthropic-claude-3-haiku\",
  \"models\": {}
}
EOF"

# Create base Steve config
runuser -l "$STEVE_USER" -c "cat > $CONFIG_DIR/config.json << EOF
{
  \"version\": \"1.0.0\",
  \"defaultPersona\": \"steve\",
  \"defaultRoutine\": \"auto\",
  \"mcpConfig\": {
    \"path\": \"$CONFIG_DIR/mcps\"
  },
  \"background\": {
    \"processDir\": \"$CONFIG_DIR/background/processes\"
  }
}
EOF"

success "Steve configuration created"

#################################
# Step 6: Install Node dependencies
#################################
log "Step 6: Installing Node dependencies..."

cd "$STEVE_INSTALL_DIR"
runuser -l "$STEVE_USER" -c "cd $STEVE_INSTALL_DIR && npm install"

success "Node dependencies installed"

#################################
# Step 7: Set up executable scripts
#################################
log "Step 7: Setting up executable scripts..."

# Make scripts executable
chmod +x "$STEVE_INSTALL_DIR/bin/steve"
chmod +x "$STEVE_INSTALL_DIR/bin/steve-model"
chmod +x "$STEVE_INSTALL_DIR/src/steve.js"
chmod +x "$STEVE_INSTALL_DIR/src/mcpomni-connect.py"

# Create symlinks in /usr/local/bin
ln -sf "$STEVE_INSTALL_DIR/bin/steve" /usr/local/bin/steve
ln -sf "$STEVE_INSTALL_DIR/bin/steve-model" /usr/local/bin/steve-model

success "Executable scripts set up"

#################################
# Step 8: Set up bashrc integration
#################################
log "Step 8: Setting up bashrc integration..."

# Create steve-startup.sh
runuser -l "$STEVE_USER" -c "cat > $STEVE_USER_HOME/.steve/bin/steve-startup.sh << EOF
#!/bin/bash

# Steve Auto-Startup Script
# This script is sourced by .bashrc to provide Steve functionality

# Source Python virtual environment
source \$HOME/.venv/bin/activate

# Display welcome message
echo \"\"
echo \"┌────────────────────────────────────────┐\"
echo \"│                                        │\"
echo \"│   Steve Personal Assistant             │\"
echo \"│   Your AI Intern is ready to help.     │\"
echo \"│                                        │\"
echo \"│   Type 'steve' to begin, or            │\"
echo \"│   'steve --help' for options.          │\"
echo \"│                                        │\"
echo \"└────────────────────────────────────────┘\"
echo \"\"

# Check if models are configured
if ! steve-model list | grep -q 'Configured Models'; then
  echo \"No models configured yet. Use 'steve-model configure' to set up a model.\"
fi

# Aliases for convenience
alias steve-routine=\"steve --routine\"
alias steve-morning=\"steve --routine=morning\"
alias steve-evening=\"steve --routine=evening\"
alias steve-work=\"steve --routine=work\"
EOF"

# Make it executable
runuser -l "$STEVE_USER" -c "mkdir -p $STEVE_USER_HOME/.steve/bin"
runuser -l "$STEVE_USER" -c "chmod +x $STEVE_USER_HOME/.steve/bin/steve-startup.sh"

# Add to .bashrc if not already there
if ! grep -q "steve-startup.sh" "$STEVE_USER_HOME/.bashrc"; then
  runuser -l "$STEVE_USER" -c "echo -e \"\n# Steve Auto-Startup\nif [ -f \\\$HOME/.steve/bin/steve-startup.sh ]; then\n  source \\\$HOME/.steve/bin/steve-startup.sh\nfi\" >> $STEVE_USER_HOME/.bashrc"
  success "Added Steve auto-startup to .bashrc"
else
  warning "Steve auto-startup already in .bashrc, skipping"
fi

success "Bashrc integration set up"

#################################
# Step 9: Configure Python mcpomni-connect
#################################
log "Step 9: Setting up demo mcpomni-connect model..."

# Run mcpomni-connect to create a demo model
runuser -l "$STEVE_USER" -c "cd $STEVE_INSTALL_DIR && python3 src/mcpomni-connect.py --dangerously-skip-permissions"

success "Demo mcpomni-connect model configured"

#################################
# Step 10: Final setup and verification
#################################
log "Step 10: Performing final verification..."

# Test steve CLI
if runuser -l "$STEVE_USER" -c "steve --version" &>/dev/null; then
  success "Steve CLI is working correctly"
else
  warning "Steve CLI test failed, may need manual configuration"
fi

# Set proper ownership of all files
chown -R "$STEVE_USER:$STEVE_USER" "$STEVE_USER_HOME"

success "Installation completed successfully!"
echo
echo -e "${GREEN}==========================================================${NC}"
echo -e "${GREEN}Steve Personal Assistant has been installed successfully!${NC}"
echo -e "${GREEN}==========================================================${NC}"
echo
echo -e "To access Steve, run: ${YELLOW}su - $STEVE_USER${NC}"
echo -e "Then type: ${YELLOW}steve${NC} to start"
echo
echo -e "${BLUE}For model configuration, use:${NC} steve-model configure <model-name>"
echo -e "${BLUE}For available routines, try:${NC} steve --routine=morning"
echo