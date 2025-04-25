#!/usr/bin/env node

/**
 * Steve CLI - Installation Script
 * 
 * Sets up necessary directories and symlinks for Steve CLI
 * 
 * Created: April 24, 2025
 * Author: Steve (AI Intern)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Setting up Steve CLI...');

// Get the package directory
const packageDir = path.resolve(__dirname, '..');
const srcDir = path.join(packageDir, 'src');
const binDir = path.join(packageDir, 'bin');

// Create steve executable in bin directory
const steveExecutable = path.join(binDir, 'steve');

try {
  // Make sure the JavaScript files are executable
  fs.chmodSync(path.join(srcDir, 'steve.js'), '755');
  fs.chmodSync(path.join(binDir, 'steve'), '755');
  
  console.log('Made files executable');
  
  // Check if mcpomni-connect is installed
  try {
    execSync('npm list -g mcpomni-connect', { stdio: 'pipe' });
    console.log('mcpomni-connect is already installed');
  } catch (err) {
    console.warn('\nWARNING: mcpomni-connect not found globally.');
    console.warn('Steve CLI requires mcpomni-connect to be installed and available in your PATH.');
    console.warn('Installing mcpomni-connect automatically...');
    
    try {
      execSync('npm install -g mcpomni-connect', { stdio: 'inherit' });
      console.log('Successfully installed mcpomni-connect');
    } catch (installErr) {
      console.error('\nERROR: Failed to install mcpomni-connect.');
      console.error('Please run: npm install -g mcpomni-connect');
    }
  }
  
  // Create .steve directory structure
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const steveDir = path.join(homeDir, '.steve');
  const configDir = path.join(steveDir, 'config');
  const personasDir = path.join(steveDir, 'personas');
  const routinesDir = path.join(steveDir, 'routines');
  const mcpsDir = path.join(steveDir, 'mcps');
  const bgDir = path.join(steveDir, 'background');
  const processesDir = path.join(bgDir, 'processes');
  
  // Create directories if they don't exist
  if (!fs.existsSync(steveDir)) {
    fs.mkdirSync(steveDir);
    console.log(`Created directory: ${steveDir}`);
  }
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
    console.log(`Created directory: ${configDir}`);
  }
  
  if (!fs.existsSync(personasDir)) {
    fs.mkdirSync(personasDir);
    console.log(`Created directory: ${personasDir}`);
  }
  
  if (!fs.existsSync(routinesDir)) {
    fs.mkdirSync(routinesDir);
    console.log(`Created directory: ${routinesDir}`);
  }
  
  if (!fs.existsSync(mcpsDir)) {
    fs.mkdirSync(mcpsDir);
    console.log(`Created directory: ${mcpsDir}`);
  }
  
  if (!fs.existsSync(bgDir)) {
    fs.mkdirSync(bgDir);
    console.log(`Created directory: ${bgDir}`);
  }
  
  if (!fs.existsSync(processesDir)) {
    fs.mkdirSync(processesDir);
    console.log(`Created directory: ${processesDir}`);
  }
  
  // Copy default persona
  try {
    fs.copyFileSync(
      path.join(srcDir, 'persona.json'),
      path.join(personasDir, 'steve.json')
    );
    console.log('Copied default persona');
  } catch (err) {
    console.error(`Error copying persona: ${err.message}`);
  }
  
  // Create default config
  const configFile = path.join(configDir, 'config.json');
  const config = {
    version: '1.0.0',
    defaultPersona: 'steve',
    defaultRoutine: 'auto',
    mcpConfig: {
      path: mcpsDir
    },
    background: {
      processDir: processesDir
    }
  };
  
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  console.log('Created default configuration');
  
  // Create basic routines
  const morningRoutine = {
    name: 'Morning Routine',
    description: 'Start your day organized',
    prompt: '1. Check and summarize my calendar for today\n2. List any new important emails\n3. Remind me of today\'s priorities'
  };
  
  const eveningRoutine = {
    name: 'Evening Routine',
    description: 'Wrap up your day and prepare for tomorrow',
    prompt: '1. Summarize task completions for today\n2. Preview tomorrow\'s calendar\n3. Suggest priorities for tomorrow'
  };
  
  fs.writeFileSync(
    path.join(routinesDir, 'morning.json'),
    JSON.stringify(morningRoutine, null, 2)
  );
  
  fs.writeFileSync(
    path.join(routinesDir, 'evening.json'),
    JSON.stringify(eveningRoutine, null, 2)
  );
  
  console.log('Created default routines');
  
  // Create steve-startup.sh
  const steveStartupDir = path.join(steveDir, 'bin');
  if (!fs.existsSync(steveStartupDir)) {
    fs.mkdirSync(steveStartupDir);
  }
  
  const steveStartupFile = path.join(steveStartupDir, 'steve-startup.sh');
  const steveStartupContent = `#!/bin/bash

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
`;
  
  fs.writeFileSync(steveStartupFile, steveStartupContent);
  fs.chmodSync(steveStartupFile, '755');
  console.log('Created startup script');
  
  // Suggest adding to .bashrc
  console.log('\nYou can add Steve to your .bashrc by running:');
  console.log(`echo -e "\\n# Steve Auto-Startup\\nif [ -f \\$HOME/.steve/bin/steve-startup.sh ]; then\\n  source \\$HOME/.steve/bin/steve-startup.sh\\nfi" >> ~/.bashrc`);
  
  console.log('\nSteve CLI setup completed successfully.');
  console.log('Type "steve" to start using your personal assistant.');
} catch (error) {
  console.error('Error during installation:', error.message);
  process.exit(1);
}