# Steve vs. Emma: Platform Comparison

## Overview

| Feature | Steve | Emma |
|---------|-------|------|
| Base Technology | mcpomni-connect | Claude Code |
| Primary Role | Head Intern | Personal Assistant |
| Deployment | CloudFormation Automated | Manual EC2 Setup |
| Model Support | Multiple via mcpomni-connect | Claude only |
| Primary Focus | Task Automation | Organization & Planning |
| Infrastructure | AWS (CloudFormation) | AWS (EC2) |
| Installation | One-click or manual options | Manual process |

## Detailed Comparison

### Core Architecture

#### Steve
- **Foundation**: Built on mcpomni-connect, a multi-model connector
- **Infrastructure**: Deployed via CloudFormation for consistent setup
- **Design Philosophy**: Task-centric approach focused on automation
- **Execution Model**: Background processing with status tracking

#### Emma
- **Foundation**: Built on Claude Code, Anthropic's CLI tool
- **Infrastructure**: Manually configured EC2 instance
- **Design Philosophy**: Context-rich personal assistance
- **Execution Model**: Interactive sessions with conversation history

### Persona and Communication

#### Steve
- **Persona**: "Head Intern" - professional, helpful, slightly formal
- **Communication Style**: Task-oriented, concise
- **Interaction Model**: Command-driven with routine support
- **Decision-Making**: Suggests options, seeks approval for major actions

#### Emma
- **Persona**: Personal assistant - warm, efficient, detail-oriented
- **Communication Style**: Warm, personable, focused on outcomes
- **Interaction Model**: Conversation-based with context preservation
- **Decision-Making**: Proactive with established boundaries

### Capabilities and Integration

#### Steve
| Category | Steve's Approach |
|----------|------------------|
| **MCP Integrations** | Model-agnostic design allows broader MCP support |
| **Task Automation** | Strong focus on repetitive task automation |
| **Background Processing** | Robust system for long-running tasks |
| **Model Flexibility** | Can leverage multiple AI models via mcpomni-connect |
| **Deployment** | Streamlined via CloudFormation |
| **Extensibility** | Designed for extending with new MCPs and tools |

#### Emma
| Category | Emma's Approach |
|----------|------------------|
| **MCP Integrations** | Focused set of core MCPs (Google, YNAB, Airtable) |
| **Conversation History** | Strong built-in memory and context preservation |
| **Persona Consistency** | Deep, consistent personal assistant identity |
| **Claude Capabilities** | Direct access to Claude's reasoning and abilities |
| **Information Organization** | Sophisticated GTD-based organization |
| **Context Richness** | Maintains comprehensive understanding of user's context |

### Technical Implementation

#### Steve
```javascript
// Steve CLI core approach
const handleRequest = async (prompt, options) => {
  // Load appropriate persona
  const persona = loadPersona(options.persona);
  
  // Initialize mcpomni-connect with persona context
  const omniConnect = new McpOmniConnect({
    persona: persona,
    mcpConfig: config.mcpConfig,
    // Multiple model support
    models: config.enabledModels
  });
  
  // Process request, potentially leveraging multiple models
  const response = await omniConnect.process(prompt);
  
  return response;
};
```

#### Emma
```javascript
// Emma approach (conceptual)
const handleRequest = async (prompt) => {
  // Directly use Claude Code with emma-specific args
  const claudeProcess = spawn('claude', [
    '--dangerously-skip-permissions',
    '--print', prompt
  ]);
  
  // Process response
  const response = await processOutput(claudeProcess);
  
  return response;
};
```

### Deployment and Installation

#### Steve
- **CloudFormation Template**: One-click deployment
- **Automated Configuration**: User settings, directories, persona
- **Infrastructure as Code**: Full system definition
- **Simplified Updates**: Standardized update process
- **S3 Integration**: Built-in backup and synchronization

#### Emma
- **Manual Setup**: Step-by-step EC2 configuration
- **Custom Configuration**: Tailored to specific user needs
- **Component Installation**: Individual tool installation
- **Update Process**: Manual updates to components
- **Local Storage**: Primarily local with optional backups

### MCP Integration

#### Steve
| MCP | Integration Approach |
|-----|----------------------|
| **Google Workspace** | Universal MCP connector, model-agnostic |
| **YNAB** | Same integration pattern across all MCPs |
| **Airtable** | Consistent pattern with adapter layer |
| **URL Shortener** | Standard integration via mcpomni-connect |
| **Future MCPs** | Designed for easy addition via adapter pattern |

#### Emma
| MCP | Integration Approach |
|-----|----------------------|
| **Google Workspace** | Direct Claude Code integration |
| **YNAB** | Claude-specific implementation |
| **Airtable** | Claude-specific implementation |
| **URL Shortener** | Claude-specific implementation |
| **Future MCPs** | Requires Claude Code support |

### Routines and Workflows

#### Steve
- **Routine Definition**: JSON-based routine definitions
- **Time-Based Activation**: Automatic routine selection by time
- **Background Execution**: Can run routines in background
- **Multi-Model Support**: Can use different models for different routines
- **Extensibility**: Open routine architecture

#### Emma
- **Routine Implementation**: Script-based routines
- **Context-Based Selection**: Can detect appropriate routine from signals
- **Session Integration**: Integrated with conversation sessions
- **Claude Integration**: Leverages Claude's capabilities directly
- **GTD Methodology**: Strong GTD-based organization

### Ideal Use Cases

#### Steve: Best For
- Users who want to leverage multiple AI models
- Teams needing standardized deployment across multiple users
- Scenarios requiring extensive automation of repetitive tasks
- Users preferring command-based task execution
- Multi-cloud or hybrid environments

#### Emma: Best For
- Users heavily invested in the Claude ecosystem
- Scenarios requiring deep contextual understanding
- Sophisticated personal organization and planning
- Users preferring conversation-style interaction
- Complex information management needs

## Migration Considerations

### From Emma to Steve
- **Data Export**: Extract configurations and contexts
- **MCP Re-authentication**: Need to re-authenticate MCPs
- **Routine Recreation**: Rebuild routines in Steve format
- **Mental Model Shift**: Adapt to more command-oriented interaction
- **CloudFormation Deployment**: Consider automated deployment

### From Steve to Emma
- **Context Transfer**: May need manual context setup
- **Claude Adaptation**: Adjust to Claude-specific capabilities
- **Configuration Migration**: Manual transfer of configurations
- **MCP Re-authentication**: Re-authenticate with Emma's system
- **Interaction Style**: Adapt to more conversational approach

## Conclusion

Steve and Emma represent different approaches to AI assistance, with Steve focusing on task automation across multiple models via mcpomni-connect and Emma providing a deeply contextual assistant experience via Claude Code. The choice between them depends on specific needs:

- **Choose Steve** for task automation, multi-model flexibility, and standardized deployment
- **Choose Emma** for deep context, sophisticated organization, and Claude-specific capabilities

Both platforms continue to evolve, with Steve emphasizing breadth of model support and Emma focusing on depth of assistance capabilities.