# Steve Demo Instructions

This document provides step-by-step instructions to demonstrate Steve's functionality. Since mcpomni-connect is a conceptual component, this demo uses a simulation approach.

## Prerequisites

1. Clone the Steve repository:
   ```bash
   git clone https://github.com/mattweg/steve-assistant.git
   cd steve-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make scripts executable:
   ```bash
   chmod +x bin/steve
   chmod +x src/steve.js
   ```

## Demo 1: Basic Usage

1. Run Steve with a simple query:
   ```bash
   bin/steve "What files are in this directory?"
   ```
   
   Expected output:
   ```
   Using persona: Steve
   
   This is a placeholder for mcpomni-connect integration.
   Persona: Steve (Head Intern and Personal Assistant)
   Prompt: What files are in this directory?
   
   [Steve Response Simulation]
   Hello! I'm Steve, your Head Intern and Personal Assistant. How can I assist you today?
   [End of simulation]
   ```

## Demo 2: Morning Routine

1. Run the morning routine:
   ```bash
   bin/steve --routine=morning
   ```
   
   Expected output:
   ```
   Executing morning routine: Start your day organized and informed
   
   Executing morning routine as steve...
   
   [Routine morning]
   Prompt: 1. Check and summarize my calendar for today
   2. List any new important emails
   3. Remind me of today's priorities
   4. Check the weather forecast
   5. Suggest a focus for the day
   
   [End of routine simulation]
   ```

## Demo 3: Background Processing

1. Run a task in the background:
   ```bash
   bin/steve --background --print "Analyze this project" --out-file /tmp/steve-analysis.txt
   ```
   
   Expected output:
   ```
   Starting background process (ID: <process-id>)
   Using persona: Steve
   Output will be saved to: /tmp/steve-analysis.txt
   Process started and completed (ID: <process-id>)
   Use 'steve --status <process-id>' to view results
   ```

2. Check the status of the background process:
   ```bash
   bin/steve --status <process-id>
   ```
   
   Expected output will include process details and the output of the task.

3. View the result file:
   ```bash
   cat /tmp/steve-analysis.txt
   ```

## Demo 4: CloudFormation Deployment (Simulation)

Since we can't actually deploy the CloudFormation template, we can examine it:

1. View the CloudFormation template:
   ```bash
   cat infrastructure/cf-template.yaml
   ```

2. Highlight key sections:
   - EC2 instance configuration
   - User data script for automated setup
   - S3 bucket for data persistence
   - Security groups and IAM roles

## Demo 5: Exploring the Implementation

1. Examine the core CLI file:
   ```bash
   cat src/steve.js
   ```

2. Look at the persona definition:
   ```bash
   cat src/persona.json
   ```

3. Review the routines:
   ```bash
   cat src/routines/*.json
   ```

## Conclusion

This demo showcases Steve's key features:
- Command-line interface
- Persona-based interactions
- Routine execution
- Background processing
- CloudFormation deployment architecture

In a full implementation, Steve would integrate with mcpomni-connect to leverage multiple language models through a unified interface, and the CloudFormation template would deploy a fully functional assistant on AWS.