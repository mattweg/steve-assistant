#!/usr/bin/env node

/**
 * Steve CLI - Main entry point
 * 
 * This file serves as the main entry point for the Steve CLI
 * which provides a wrapper around mcpomni-connect and adds
 * personal assistant functionality.
 * 
 * Created: April 24, 2025
 * Author: Steve (AI Intern)
 */

const path = require('path');
const fs = require('fs');
const { program } = require('commander');
const { spawn, execSync } = require('child_process');

// Configuration
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const STEVE_DIR = path.join(HOME_DIR, '.steve');
const CONFIG_FILE = path.join(STEVE_DIR, 'config', 'config.json');
const DEFAULT_PERSONA = 'steve';
const DEFAULT_ROUTINE = 'auto';

// Ensure directories exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirExists(path.join(STEVE_DIR, 'config'));
ensureDirExists(path.join(STEVE_DIR, 'personas'));
ensureDirExists(path.join(STEVE_DIR, 'routines'));
ensureDirExists(path.join(STEVE_DIR, 'mcps'));
ensureDirExists(path.join(STEVE_DIR, 'background', 'processes'));

// Load configuration
let config = {
  version: '1.0.0',
  defaultPersona: DEFAULT_PERSONA,
  defaultRoutine: DEFAULT_ROUTINE,
  mcpConfig: {
    path: path.join(STEVE_DIR, 'mcps'),
  },
  background: {
    processDir: path.join(STEVE_DIR, 'background', 'processes'),
  },
};

if (fs.existsSync(CONFIG_FILE)) {
  try {
    const fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    config = { ...config, ...fileConfig };
  } catch (error) {
    console.error(`Error loading configuration: ${error.message}`);
  }
}

// Define command line interface
program
  .name('steve')
  .description('Steve - Personal Assistant powered by mcpomni-connect')
  .version(config.version)
  .option('-b, --background', 'Run in background mode')
  .option('-p, --print <text>', 'Process text input (for background mode)')
  .option('-o, --out-file <file>', 'Output file for background mode')
  .option('-s, --status [id]', 'Show status of background processes')
  .option('-l, --logs <id>', 'View logs for a background process')
  .option('-k, --kill <id>', 'Terminate a background process')
  .option('--list', 'List all background processes')
  .option('--persona <persona>', 'Use alternative persona', config.defaultPersona)
  .option('--routine <routine>', 'Run a specific routine', config.defaultRoutine)
  .option('--mcp <mcp>', 'Use specific MCP');

// Parse arguments
program.parse(process.argv);
const options = program.opts();

// Generate a unique process ID
const generateProcessId = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};

// Function to load persona
const loadPersona = (personaName) => {
  const personaFile = path.join(STEVE_DIR, 'personas', `${personaName}.json`);
  
  if (!fs.existsSync(personaFile)) {
    console.error(`Persona "${personaName}" not found. Using default persona.`);
    return loadPersona(DEFAULT_PERSONA);
  }
  
  try {
    return JSON.parse(fs.readFileSync(personaFile, 'utf8'));
  } catch (error) {
    console.error(`Error loading persona: ${error.message}`);
    return {
      name: 'Steve',
      role: 'Head Intern',
      communication: {
        style: 'Professional',
        signature: 'Steve (AI Intern)',
      },
    };
  }
};

// Function to load and execute routine
const executeRoutine = (routineName) => {
  if (routineName === 'auto') {
    // Determine appropriate routine based on time of day
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      routineName = 'morning';
    } else if (hour >= 17 && hour < 23) {
      routineName = 'evening';
    } else {
      routineName = 'default';
    }
  }
  
  const routineFile = path.join(STEVE_DIR, 'routines', `${routineName}.json`);
  
  if (!fs.existsSync(routineFile)) {
    console.error(`Routine "${routineName}" not found. Using default routine.`);
    return executeRoutine('default');
  }
  
  try {
    const routine = JSON.parse(fs.readFileSync(routineFile, 'utf8'));
    console.log(`Executing ${routineName} routine: ${routine.description}`);
    
    // Create prompt for mcpomni-connect based on routine
    const prompt = `Execute ${routineName} routine as ${options.persona}:\n\n${routine.prompt}`;
    
    // Run mcpomni-connect with routine prompt
    // This part would integrate with mcpomni-connect API in the real implementation
    if (options.background) {
      // Run routine in background
      const processId = generateProcessId();
      
      // To be implemented: background processing logic
      console.log(`Started ${routineName} routine in background with ID: ${processId}`);
    } else {
      // Run routine interactively
      console.log(`\nExecuting ${routineName} routine as ${options.persona}...`);
      
      // This is a placeholder for actual mcpomni-connect execution
      // In real implementation, we would call mcpomni-connect API here
      console.log(`\n[Routine ${routineName}]`);
      console.log(`Prompt: ${routine.prompt}`);
      console.log(`\n[End of routine simulation]`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error executing routine: ${error.message}`);
    return false;
  }
};

// Handle background process status
const handleProcessStatus = (processId) => {
  const processesDir = config.background.processDir;
  
  // If no ID specified, list all processes
  if (!processId) {
    if (!fs.existsSync(processesDir)) {
      console.log('No background processes found.');
      return;
    }
    
    const processes = fs.readdirSync(processesDir);
    
    if (processes.length === 0) {
      console.log('No background processes found.');
      return;
    }
    
    console.log('Background processes:');
    
    processes.forEach(id => {
      const statusFile = path.join(processesDir, id, 'status.json');
      
      if (fs.existsSync(statusFile)) {
        try {
          const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
          console.log(`- ${id}: ${status.state} (Started: ${status.startTime})`);
        } catch (error) {
          console.log(`- ${id}: Unknown status`);
        }
      } else {
        console.log(`- ${id}: No status file`);
      }
    });
    
    return;
  }
  
  // Check specific process status
  const processDir = path.join(processesDir, processId);
  const statusFile = path.join(processDir, 'status.json');
  
  if (!fs.existsSync(processDir)) {
    console.error(`Process ID ${processId} not found.`);
    return;
  }
  
  if (!fs.existsSync(statusFile)) {
    console.error(`No status file found for process ID ${processId}.`);
    return;
  }
  
  try {
    const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    
    console.log(`\nStatus for process ${processId}:`);
    console.log(`- State: ${status.state}`);
    console.log(`- Started: ${status.startTime}`);
    
    if (status.endTime) {
      console.log(`- Ended: ${status.endTime}`);
    }
    
    if (status.exitCode !== null) {
      console.log(`- Exit code: ${status.exitCode}`);
    }
    
    if (status.error) {
      console.log(`- Error: ${status.error}`);
    }
    
    console.log(`- Command: ${status.command}`);
    console.log(`- Output file: ${status.outputFile}`);
    
    // Show output if available
    if (fs.existsSync(status.outputFile)) {
      console.log('\nOutput:');
      console.log('-'.repeat(50));
      console.log(fs.readFileSync(status.outputFile, 'utf8'));
      console.log('-'.repeat(50));
    }
  } catch (error) {
    console.error(`Error reading status file: ${error.message}`);
  }
};

// Handle process logs
const handleProcessLogs = (processId) => {
  const processDir = path.join(config.background.processDir, processId);
  const logFile = path.join(processDir, 'debug.log');
  
  if (!fs.existsSync(processDir)) {
    console.error(`Process ID ${processId} not found.`);
    return;
  }
  
  if (!fs.existsSync(logFile)) {
    console.error(`No log file found for process ID ${processId}.`);
    return;
  }
  
  console.log(`\nLogs for process ${processId}:`);
  console.log('-'.repeat(50));
  console.log(fs.readFileSync(logFile, 'utf8'));
  console.log('-'.repeat(50));
};

// Handle process termination
const handleProcessKill = (processId) => {
  const processDir = path.join(config.background.processDir, processId);
  const pidFile = path.join(processDir, 'pid');
  
  if (!fs.existsSync(processDir)) {
    console.error(`Process ID ${processId} not found.`);
    return;
  }
  
  if (!fs.existsSync(pidFile)) {
    console.error(`No PID file found for process ID ${processId}.`);
    return;
  }
  
  try {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim(), 10);
    
    if (isNaN(pid)) {
      console.error(`Invalid PID for process ID ${processId}.`);
      return;
    }
    
    // Try to kill the process
    try {
      process.kill(pid);
      console.log(`Process ${processId} (PID: ${pid}) terminated.`);
      
      // Update status
      const statusFile = path.join(processDir, 'status.json');
      
      if (fs.existsSync(statusFile)) {
        try {
          const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
          
          status.state = 'TERMINATED';
          status.endTime = new Date().toISOString();
          
          fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
        } catch (error) {
          console.error(`Error updating status file: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`Error terminating process: ${error.message}`);
    }
  } catch (error) {
    console.error(`Error reading PID file: ${error.message}`);
  }
};

// Handle interactive mode (direct prompt)
const handleInteractiveMode = (prompt) => {
  // Load persona
  const persona = loadPersona(options.persona);
  
  console.log(`Using persona: ${persona.name}`);
  
  // In a real implementation, we would call mcpomni-connect with the prompt
  // and persona configuration
  console.log('\nThis is a placeholder for mcpomni-connect integration.');
  console.log(`Persona: ${persona.name} (${persona.role})`);
  console.log(`Prompt: ${prompt}`);
  
  // This is where we would execute mcpomni-connect in a real implementation
  // For now, we just simulate the response
  console.log('\n[Steve Response Simulation]');
  console.log(`Hello! I'm ${persona.name}, your ${persona.role}. How can I assist you today?`);
  console.log('[End of simulation]');
};

// Handle background mode
const handleBackgroundMode = (text, outputFile) => {
  if (!text) {
    console.error('Error: --print is required with --background');
    process.exit(1);
  }
  
  // Generate process ID
  const processId = generateProcessId();
  
  // Set default output file if not provided
  if (!outputFile) {
    outputFile = path.join(config.background.processDir, processId, 'output.txt');
  }
  
  // Load persona
  const persona = loadPersona(options.persona);
  
  console.log(`Starting background process (ID: ${processId})`);
  console.log(`Using persona: ${persona.name}`);
  console.log(`Output will be saved to: ${outputFile}`);
  
  // Create process directory
  const processDir = path.join(config.background.processDir, processId);
  ensureDirExists(processDir);
  
  // In a real implementation, we would call mcpomni-connect in a background process
  // For now, we just simulate the process
  
  // Create status file
  const statusFile = path.join(processDir, 'status.json');
  const status = {
    id: processId,
    state: 'RUNNING',
    startTime: new Date().toISOString(),
    endTime: null,
    exitCode: null,
    command: `steve --background --print "${text}"`,
    outputFile: outputFile,
    persona: persona.name,
  };
  
  fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
  
  // Create output file with simulated response
  ensureDirExists(path.dirname(outputFile));
  
  fs.writeFileSync(outputFile, 
    `[Background Process Simulation]\n` +
    `Hello! I'm ${persona.name}, your ${persona.role}.\n\n` +
    `You asked: ${text}\n\n` +
    `I would process this request in the background and provide a response here.\n` +
    `[End of simulation]`
  );
  
  // Update status to completed
  status.state = 'COMPLETED';
  status.endTime = new Date().toISOString();
  fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
  
  console.log(`Process started and completed (ID: ${processId})`);
  console.log(`Use 'steve --status ${processId}' to view results`);
};

// Main logic
const main = () => {
  // Handle status command
  if (options.status !== undefined) {
    handleProcessStatus(options.status);
    return;
  }
  
  // Handle logs command
  if (options.logs) {
    handleProcessLogs(options.logs);
    return;
  }
  
  // Handle kill command
  if (options.kill) {
    handleProcessKill(options.kill);
    return;
  }
  
  // Handle list command
  if (options.list) {
    handleProcessStatus();
    return;
  }
  
  // Handle routine execution
  if (options.routine && options.routine !== DEFAULT_ROUTINE) {
    executeRoutine(options.routine);
    return;
  }
  
  // Handle background mode
  if (options.background) {
    handleBackgroundMode(options.print, options.outFile);
    return;
  }
  
  // Handle interactive mode with prompt
  const args = program.args;
  
  if (args.length > 0) {
    const prompt = args.join(' ');
    handleInteractiveMode(prompt);
    return;
  }
  
  // No arguments provided, run default interactive mode
  console.log('Starting Steve in interactive mode...');
  console.log('This is a placeholder for mcpomni-connect interactive mode.');
  console.log('In a real implementation, this would launch the mcpomni-connect CLI with Steve configuration.');
};

// Run main function
main();