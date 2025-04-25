# Steve Test Plan

## 1. Introduction

### 1.1 Purpose
This test plan outlines the strategy for testing the Steve Personal Assistant platform, a wrapper around mcpomni-connect with CloudFormation deployment capabilities.

### 1.2 Scope
The test plan covers the following components:
- CloudFormation deployment template
- Steve CLI wrapper
- MCP integration layer
- Persona configuration system
- Background processing functionality
- Session management
- Routine execution

### 1.3 Test Objectives
- Verify that Steve correctly deploys via CloudFormation
- Ensure that Steve CLI correctly interfaces with mcpomni-connect
- Validate that Steve properly applies persona configurations
- Confirm that MCP integrations function correctly
- Verify background process handling
- Test routine execution and session management
- Validate robustness and error handling

## 2. Test Strategy

### 2.1 Test Levels

#### 2.1.1 Unit Testing
- Individual components tested in isolation
- Focus on CLI command parsing, persona loading, configuration management
- Mocked dependencies for isolated testing

#### 2.1.2 Integration Testing
- Component interactions tested
- MCP integration layer with actual MCP services
- CLI wrapper with mcpomni-connect (mocked responses)
- Configuration loading and application

#### 2.1.3 System Testing
- End-to-end workflows
- CloudFormation deployment
- Full CLI functionality
- Persona application through complete request flow

#### 2.1.4 Acceptance Testing
- User experience validation
- Performance under expected load
- Compliance with requirements

### 2.2 Test Environments

#### 2.2.1 Development Environment
- Local development machines
- Mocked mcpomni-connect responses
- Simulated MCP integrations

#### 2.2.2 Integration Environment
- AWS test account
- Test CloudFormation deployment
- Real MCP integrations with test accounts

#### 2.2.3 Production-like Environment
- Mirror of production setup
- Full CloudFormation deployment
- Realistic data volumes and usage patterns

## 3. Test Cases

### 3.1 CloudFormation Tests

#### 3.1.1 Basic Deployment
1. Deploy CloudFormation template with default parameters
2. Verify EC2 instance launches successfully
3. Confirm security groups are correctly configured
4. Validate S3 bucket creation and permissions
5. Check IAM roles and policies

#### 3.1.2 Custom Parameters
1. Deploy with custom instance type
2. Deploy with restricted SSH access
3. Deploy with custom user email
4. Verify all parameters are correctly applied

#### 3.1.3 Infrastructure Validation
1. Verify EC2 instance can be accessed via SSH
2. Confirm required software is installed (Node.js, npm, git)
3. Validate directory structure creation
4. Check S3 synchronization setup

### 3.2 CLI Wrapper Tests

#### 3.2.1 Command Parsing
1. Test help command
2. Test version display
3. Verify persona selection option
4. Test routine execution option
5. Validate background processing flags

#### 3.2.2 Persona Management
1. Load default persona
2. Load custom persona
3. Test persona fallback (when specified persona not found)
4. Verify persona attributes are correctly applied

#### 3.2.3 Routine Execution
1. Execute morning routine
2. Execute evening routine
3. Test auto routine selection based on time
4. Verify custom routine execution
5. Test routine in background mode

#### 3.2.4 Background Processing
1. Start background process
2. Check status reporting
3. View process logs
4. Terminate running process
5. List all processes

### 3.3 MCP Integration Tests

#### 3.3.1 MCP Connection
1. Test connection to Google Workspace MCP
2. Test connection to YNAB MCP
3. Verify Airtable MCP integration
4. Test URL Shortener MCP

#### 3.3.2 Authentication Management
1. Test initial authentication flow
2. Verify token refresh
3. Test token storage and retrieval
4. Validate error handling for authentication failures

#### 3.3.3 Request Routing
1. Test routing to correct MCP
2. Verify parameter transformation
3. Validate response processing
4. Test error handling and retries

### 3.4 End-to-End Tests

#### 3.4.1 Common Workflows
1. Deploy instance and run initial setup
2. Execute daily routine
3. Process a multi-step task using MCPs
4. Run background job and retrieve results

#### 3.4.2 Error Handling
1. Test invalid command handling
2. Verify MCP connection failure recovery
3. Test interrupted process resumption
4. Validate missing config handling

## 4. Test Automation

### 4.1 Unit Test Automation
- Jest framework for JavaScript components
- Automated execution via CI/CD pipeline
- Code coverage reporting

### 4.2 Integration Test Automation
- Custom test harness for MCP interactions
- Scheduled execution in test environment
- Integration with monitoring system

### 4.3 System Test Automation
- CloudFormation deployment automation
- Simulated user interaction scripts
- Validation of expected outputs

## 5. Test Data

### 5.1 Test Personas
- Standard "Steve" persona
- Minimal test persona
- Extended test persona with all fields

### 5.2 Test Routines
- Morning routine
- Evening routine
- Minimal test routine
- Complex multi-step routine

### 5.3 MCP Test Data
- Test Google Workspace account
- YNAB test budget
- Airtable test base
- Sample tasks and requests

## 6. Test Schedule

### 6.1 Development Phase Testing
- Unit tests: Throughout development
- Integration tests: Weekly
- System tests: Bi-weekly

### 6.2 Release Cycle
- Pre-release testing: 1 week before release
- Regression testing: 3 days before release
- Deployment validation: Day of release

## 7. Test Deliverables

### 7.1 Test Plans
- Detailed test cases for each component
- Test data specifications
- Environment setup instructions

### 7.2 Test Results
- Test execution reports
- Defect tracking and resolution
- Coverage analysis

### 7.3 Test Tools
- Test automation scripts
- Mock MCP implementations
- Performance measurement tools

## 8. Risk Assessment and Mitigation

### 8.1 Identified Risks
1. **mcpomni-connect API Changes**: Changes to the underlying API could break Steve integration
   - *Mitigation*: Version locking and comprehensive integration tests

2. **CloudFormation Resource Limits**: AWS account limits could prevent deployment
   - *Mitigation*: Minimal resource usage and clear documentation of requirements

3. **MCP Authentication Complexity**: Multiple MCP authentications increase failure points
   - *Mitigation*: Robust error handling and recovery mechanisms

4. **Performance Under Load**: System might slow under heavy usage
   - *Mitigation*: Performance testing with realistic load and resource scaling

### 8.2 Contingency Plans
- Rollback procedures for failed deployments
- Offline functionality for MCP connection failures
- Degraded operation modes for resource constraints

## 9. Approval and Reporting

### 9.1 Test Completion Criteria
- 100% pass rate for critical test cases
- 90%+ pass rate for all test cases
- All high-severity defects resolved
- Performance metrics within acceptable ranges

### 9.2 Reporting Mechanism
- Automated test reports from CI/CD pipeline
- Weekly test status updates
- Defect triage meetings as needed

### 9.3 Final Approval Process
- Test results review
- Performance validation
- Security assessment
- User acceptance confirmation

## 10. Test Environment Setup

### 10.1 Development Environment Setup
```bash
# Clone repository
git clone https://github.com/username/steve.git

# Install dependencies
cd steve
npm install

# Run unit tests
npm test

# Start Steve in development mode
npm run dev
```

### 10.2 AWS Environment Setup
```bash
# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name steve-test \
  --template-body file://steve-cf-template.yaml \
  --parameters ParameterKey=InstanceType,ParameterValue=t4g.small \
               ParameterKey=KeyName,ParameterValue=your-key \
               ParameterKey=UserEmail,ParameterValue=test@example.com

# Wait for stack creation
aws cloudformation wait stack-create-complete --stack-name steve-test

# Get instance public IP
aws cloudformation describe-stacks \
  --stack-name steve-test \
  --query "Stacks[0].Outputs[?OutputKey=='PublicIP'].OutputValue" \
  --output text
```

### 10.3 Test Execution Environment
```bash
# Connect to instance
ssh -i your-key.pem ec2-user@<public-ip>

# Initialize Steve
source ~/.bashrc

# Run test routine
steve --routine=test
```