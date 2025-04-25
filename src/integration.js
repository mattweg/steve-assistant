/**
 * Integration layer between Steve CLI and mcpomni-connect Python package
 * 
 * This module provides a bridge between the Node.js-based CLI wrapper
 * and the Python-based mcpomni-connect implementation.
 * 
 * Created: April 25, 2025
 * Author: Steve (AI Intern)
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Path to mcpomni-connect Python script
const MCPOMNI_SCRIPT = path.join(__dirname, 'mcpomni-connect.py');

/**
 * Execute mcpomni-connect with the provided options
 * @param {string} prompt - Text prompt to process
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Command output
 */
function executeMcpomni(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    // Build arguments
    const args = [];
    
    // Add options
    if (options.model) {
      args.push('--model', options.model);
    }
    
    if (options.temperature) {
      args.push('--temperature', options.temperature.toString());
    }
    
    if (options.maxTokens) {
      args.push('--max-tokens', options.maxTokens.toString());
    }
    
    if (options.system) {
      args.push('--system', options.system);
    }
    
    if (options.skipPermissions) {
      args.push('--dangerously-skip-permissions');
    }
    
    // Add prompt or print option
    if (prompt) {
      // For direct execution with prompt (quoted)
      args.push('--print', prompt);
    }
    
    // Execute mcpomni-connect
    const mcpomni = spawn('python3', [MCPOMNI_SCRIPT, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    mcpomni.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    mcpomni.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    mcpomni.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`mcpomni-connect exited with code ${code}: ${stderr}`));
      }
    });
  });
}

/**
 * Check if mcpomni-connect is properly installed
 * @returns {Promise<boolean>} - Whether mcpomni-connect is available
 */
async function checkMcpomniInstallation() {
  try {
    // Check if mcpomni-connect.py exists
    if (!fs.existsSync(MCPOMNI_SCRIPT)) {
      return false;
    }
    
    // Try to list models to verify it works
    await executeMcpomni(null, { skipPermissions: true });
    return true;
  } catch (error) {
    console.error('Error checking mcpomni-connect installation:', error.message);
    return false;
  }
}

/**
 * Get list of available models from mcpomni-connect
 * @returns {Promise<Array>} - List of model information
 */
async function listModels() {
  try {
    // Run mcpomni-connect with --list-models flag
    const output = await new Promise((resolve, reject) => {
      const mcpomni = spawn('python3', [MCPOMNI_SCRIPT, '--list-models']);
      
      let stdout = '';
      let stderr = '';
      
      mcpomni.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      mcpomni.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      mcpomni.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`mcpomni-connect exited with code ${code}: ${stderr}`));
        }
      });
    });
    
    // Parse output
    const models = [];
    const lines = output.split('\n');
    
    let captureMode = false;
    for (const line of lines) {
      if (line === 'Configured Models:') {
        captureMode = true;
        continue;
      }
      
      if (captureMode && line.startsWith('-')) {
        const modelInfo = line.substring(2);
        models.push(modelInfo);
      }
    }
    
    return models;
  } catch (error) {
    console.error('Error listing models:', error.message);
    return [];
  }
}

/**
 * Configure a new model in mcpomni-connect
 * @param {string} modelName - Name for the model configuration
 * @returns {Promise<boolean>} - Whether configuration was successful
 */
async function configureModel(modelName) {
  try {
    // Launch mcpomni-connect configure process
    const configureProcess = spawn('python3', [MCPOMNI_SCRIPT, '--configure', modelName], {
      stdio: 'inherit'  // Forward I/O to terminal for interactive input
    });
    
    return new Promise((resolve, reject) => {
      configureProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error(`Model configuration failed with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('Error configuring model:', error.message);
    return false;
  }
}

module.exports = {
  executeMcpomni,
  checkMcpomniInstallation,
  listModels,
  configureModel
};