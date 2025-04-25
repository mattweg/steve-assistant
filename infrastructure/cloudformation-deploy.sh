#!/bin/bash
#
# Steve CloudFormation Deployment Script
#
# This script automates the deployment of a Steve Personal Assistant
# instance on AWS using CloudFormation.
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

# Default parameters
STACK_NAME="steve-assistant"
INSTANCE_TYPE="t4g.medium"
SSH_LOCATION="0.0.0.0/0"
TEMPLATE_FILE="$(dirname "$0")/cf-template.yaml"

# Function to display usage
usage() {
  echo "Usage: $0 [options]"
  echo
  echo "Options:"
  echo "  -n, --name STACK_NAME    CloudFormation stack name (default: $STACK_NAME)"
  echo "  -k, --key KEY_NAME       EC2 key pair name (required)"
  echo "  -e, --email EMAIL        User email address (required)"
  echo "  -t, --type INSTANCE_TYPE EC2 instance type (default: $INSTANCE_TYPE)"
  echo "  -i, --ip CIDR            IP CIDR for SSH access (default: $SSH_LOCATION)"
  echo "  -h, --help               Display this help message"
  echo
  echo "Example:"
  echo "  $0 --name my-steve --key my-key-pair --email user@example.com"
  exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -n|--name)
      STACK_NAME="$2"
      shift 2
      ;;
    -k|--key)
      KEY_NAME="$2"
      shift 2
      ;;
    -e|--email)
      USER_EMAIL="$2"
      shift 2
      ;;
    -t|--type)
      INSTANCE_TYPE="$2"
      shift 2
      ;;
    -i|--ip)
      SSH_LOCATION="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Verify required parameters
if [ -z "$KEY_NAME" ]; then
  echo -e "${RED}Error: EC2 key pair name (-k, --key) is required${NC}"
  usage
fi

if [ -z "$USER_EMAIL" ]; then
  echo -e "${RED}Error: User email address (-e, --email) is required${NC}"
  usage
fi

# Validate email format
if [[ ! "$USER_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
  echo -e "${RED}Error: Invalid email format${NC}"
  exit 1
fi

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo -e "${RED}Error: CloudFormation template not found at $TEMPLATE_FILE${NC}"
  exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo -e "${RED}Error: AWS CLI is not installed${NC}"
  echo "Please install AWS CLI and configure it with appropriate credentials"
  exit 1
fi

# Banner
echo -e "${BLUE}"
echo "┌─────────────────────────────────────────────────┐"
echo "│                                                 │"
echo "│   Steve Personal Assistant - AWS Deployment     │"
echo "│                                                 │"
echo "└─────────────────────────────────────────────────┘"
echo -e "${NC}"
echo

# Display deployment parameters
echo -e "${BLUE}Deployment Parameters:${NC}"
echo "  Stack Name: $STACK_NAME"
echo "  Key Pair: $KEY_NAME"
echo "  User Email: $USER_EMAIL"
echo "  Instance Type: $INSTANCE_TYPE"
echo "  SSH Access: $SSH_LOCATION"
echo "  Template: $TEMPLATE_FILE"
echo

# Confirm deployment
read -p "Proceed with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Deployment cancelled${NC}"
  exit 0
fi

# Create CloudFormation stack
echo -e "${BLUE}Creating CloudFormation stack...${NC}"
aws cloudformation create-stack \
  --stack-name "$STACK_NAME" \
  --template-body "file://$TEMPLATE_FILE" \
  --parameters \
    ParameterKey=InstanceType,ParameterValue="$INSTANCE_TYPE" \
    ParameterKey=KeyName,ParameterValue="$KEY_NAME" \
    ParameterKey=UserEmail,ParameterValue="$USER_EMAIL" \
    ParameterKey=SSHLocation,ParameterValue="$SSH_LOCATION" \
  --capabilities CAPABILITY_IAM

# Wait for stack creation to complete
echo -e "${BLUE}Waiting for stack creation to complete...${NC}"
echo "This may take several minutes. Please be patient."
aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME"

# Get stack outputs
echo -e "${BLUE}Stack creation completed. Retrieving instance information...${NC}"
OUTPUTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs" --output json)

# Extract relevant outputs
PUBLIC_IP=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="PublicIP") | .OutputValue')
PUBLIC_DNS=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="PublicDnsName") | .OutputValue')
SSH_COMMAND=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="SSHCommand") | .OutputValue')

# Display connection information
echo
echo -e "${GREEN}=========================================================${NC}"
echo -e "${GREEN}Steve Personal Assistant has been deployed successfully!${NC}"
echo -e "${GREEN}=========================================================${NC}"
echo
echo -e "${BLUE}Connection Information:${NC}"
echo "  Public IP: $PUBLIC_IP"
echo "  Public DNS: $PUBLIC_DNS"
echo
echo -e "${BLUE}Connect to your instance:${NC}"
echo "  $SSH_COMMAND"
echo
echo -e "${BLUE}After connecting:${NC}"
echo "  Run 'steve' to start using your personal assistant"
echo
echo -e "${YELLOW}Note: It may take a few minutes for the instance to complete its setup after CloudFormation finishes.${NC}"