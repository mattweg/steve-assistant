#!/usr/bin/env node

/**
 * Steve CLI - Uninstallation Script
 * 
 * Cleans up files and settings when uninstalling Steve CLI
 * 
 * Created: April 24, 2025
 * Author: Steve (AI Intern)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Uninstalling Steve CLI...');

try {
  // Ask user if they want to remove .steve directory completely
  console.log('\nWARNING: This will only uninstall the Steve CLI package.');
  console.log('Your .steve directory with configurations will remain intact.');
  console.log('To completely remove Steve data, manually delete the ~/.steve directory.');
  
  // Remove symlinks in ~/.local/bin if they exist
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const localBinDir = path.join(homeDir, '.local', 'bin');
    
    if (fs.existsSync(path.join(localBinDir, 'steve'))) {
      fs.unlinkSync(path.join(localBinDir, 'steve'));
      console.log('Removed symlink from ~/.local/bin/steve');
    }
  } catch (err) {
    // Ignore errors if files don't exist or can't be deleted
    console.log('Note: Could not clean up potential symlinks in ~/.local/bin');
  }
  
  console.log('\nTo complete the removal:');
  console.log('1. Remove Steve startup from your .bashrc (if added)');
  console.log('   Edit ~/.bashrc and remove the lines that source steve-startup.sh');
  console.log('2. Optionally remove the ~/.steve directory:');
  console.log('   rm -rf ~/.steve');
  
  console.log('\nSteve CLI uninstallation completed.');
} catch (error) {
  console.error('Error during uninstallation:', error.message);
  process.exit(1);
}