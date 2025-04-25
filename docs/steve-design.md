# Steve Design Document: Cloud-Formation Based Personal Assistant

## Executive Summary
Steve is a cloud-based personal assistant platform built on AWS using CloudFormation. Unlike Emma (which is built around Claude Code), Steve is designed to integrate with mcpomni-connect, allowing it to interface with multiple language models through a unified architecture. Steve functions as a "head intern" personal assistant with a focus on task automation using various MCP integrations.

## 1. System Architecture

### 1.1 Core Components
- **CloudFormation Stack**: EC2 bastion server with all dependencies
- **Steve CLI Wrapper**: Similar to emma-cli but built for mcpomni-connect
- **MCP Integration Layer**: Middleware to connect to various MCPs
- **Persona Configuration**: Steve persona definitions and behaviors
- **Persistence Layer**: Command history, settings, and context storage

### 1.2 AWS Infrastructure
- **EC2 Instance**: t4g.medium (4GB RAM) or equivalent
- **Security Groups**: SSH access + restricted outbound for API calls
- **IAM Roles**: Limited permissions for Steve server operations
- **S3 Bucket**: Optional storage for Steve's context and files
- **CloudWatch**: Monitoring and logging

### 1.3 System Flow
1. User connects to bastion host via SSH
2. User invokes Steve via command or auto-startup
3. Steve CLI wrapper initializes mcpomni-connect with persona settings
4. Steve processes user requests via appropriate MCP tools
5. Results and context are persisted for future sessions

## 2. MCP Integration

### 2.1 MCP Support
Steve will initially support the following MCP integrations:
- Google Workspace (Email, Calendar, Drive)
- YNAB (Budgeting)
- Airtable (Structured data)
- URL Shortener
- Plus any additional MCPs supported by mcpomni-connect

### 2.2 Integration Layer
A middleware component will:
- Route MCP requests to appropriate endpoints
- Handle authentication and token management 
- Provide unified error handling
- Cache responses for performance

## 3. CLI Design

### 3.1 Command Structure
```
steve [options] [prompt]
```

Options:
- `--background`: Run in background mode
- `--routine=<routine>`: Run a specific routine
- `--mcp=<mcp-name>`: Limit to specific MCP
- `--persona=<persona>`: Use alternate persona
- `--help`: Show help

### 3.2 Steve CLI Wrapper
- Built on Node.js, similar to emma-cli
- Handles startup, configuration, and shutdown
- Manages background processes
- Integrates with bashrc for auto-startup

## 4. Persona Configuration

### 4.1 Steve Persona
- **Role**: Head intern and personal assistant
- **Tone**: Professional, helpful, slightly informal
- **Capabilities**: Task management, scheduling, data organization
- **Communication Style**: Clear, concise, focused on outcomes

### 4.2 Persona Implementation
- Defined in configuration files
- Loaded at startup
- Consistent across sessions
- Ability to add additional personas for specific use cases

## 5. Development Plan

### 5.1 Phase 1: Foundation
- Set up CloudFormation template for basic infrastructure
- Create Steve CLI wrapper prototype
- Implement basic mcpomni-connect integration

### 5.2 Phase 2: Core Functionality
- Implement MCP integration layer
- Develop persona configuration system
- Build routine and background processing

### 5.3 Phase 3: Enhancement
- Add advanced features (routines, voice, etc.)
- Optimize performance
- Add more MCP integrations
- Develop documentation and examples

## 6. Deployment

### 6.1 Installation Process
1. Deploy CloudFormation stack
2. Connect to bastion host
3. Run Steve installation script
4. Configure MCP authentication
5. Set up auto-startup

### 6.2 Configuration
Configuration will be stored in:
- `~/.steve/config.json`: Main configuration
- `~/.steve/mcps/`: MCP-specific configurations
- `~/.steve/personas/`: Persona definitions
- `~/.steve/routines/`: Routine definitions

## 7. Testing Strategy

### 7.1 Test Categories
- Unit tests for CLI components
- Integration tests for MCP connections
- End-to-end tests for complete workflows
- Performance tests for response time

### 7.2 Test Automation
- Automated test suite using Jest
- CI/CD integration for continuous testing
- Synthetic transaction testing for MCP interactions

## 8. Documentation

### 8.1 User Documentation
- Installation guide
- Quick start tutorial
- Command reference
- MCP usage examples
- Troubleshooting guide

### 8.2 Developer Documentation
- Architecture overview
- API reference
- Customization guide
- Contributing guidelines

## 9. Comparison with Emma

| Feature | Emma | Steve |
|---------|------|-------|
| Base CLI | Claude Code | mcpomni-connect |
| Persona | Personal assistant | Head intern |
| Language Models | Claude only | Multiple via mcpomni-connect |
| Infrastructure | EC2 t4g.medium | CloudFormation with EC2 |
| Primary Focus | Organization & planning | Task automation |
| MCPs | Google Workspace, YNAB, Airtable | Same, plus extensibility |
| Installation | Manual setup | CloudFormation automation |

## 10. Future Enhancements

### 10.1 Short-term Roadmap
- Voice interface integration
- Mobile companion app
- Advanced scheduling capabilities
- Document processing enhancement

### 10.2 Long-term Vision
- Multi-user support
- Enterprise deployment options
- Ecosystem of Steve extensions
- Integration with smart home systems