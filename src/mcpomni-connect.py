#!/usr/bin/env python3
"""
mcpomni-connect: Multi-model connector for Model Context Protocol

This script provides a unified interface to interact with multiple 
language models through a Model Context Protocol (MCP) interface.

Usage:
  mcpomni-connect [options] [prompt]
  mcpomni-connect --model MODEL_NAME [options] [prompt]
  mcpomni-connect --list-models
  mcpomni-connect --configure MODEL_NAME

Options:
  --model=MODEL               Specify model to use
  --temperature=TEMP          Set temperature (0.0-1.0)
  --max-tokens=N              Maximum tokens to generate
  --system=TEXT               System prompt
  --dangerously-skip-permissions  Skip permission checks
  --print=TEXT                Process text input
  --output=FILE               Output file path
  --list-models               List configured models
  --configure                 Configure a new model
  --help                      Show this help message
  --version                   Show version

Examples:
  mcpomni-connect "What is the capital of France?"
  mcpomni-connect --model anthropic-claude-3-haiku "Tell me a joke"
  mcpomni-connect --system "You are a helpful assistant" "Help me with Python"
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path
import random
import requests
from typing import Dict, List, Optional, Union
import uuid

__version__ = "0.1.0"

# Configuration paths
HOME_DIR = os.path.expanduser("~")
CONFIG_DIR = os.path.join(HOME_DIR, ".steve", "mcpomni-connect")
CONFIG_FILE = os.path.join(CONFIG_DIR, "config.json")
MODELS_DIR = os.path.join(CONFIG_DIR, "models")

# Ensure directories exist
os.makedirs(CONFIG_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# Default configuration
DEFAULT_CONFIG = {
    "version": __version__,
    "default_model": "anthropic-claude-3-haiku",
    "models": {}
}

class ModelService:
    """Base class for model services."""
    
    def __init__(self, config: Dict):
        self.config = config
        
    def generate(self, prompt: str, system: Optional[str] = None, 
                temperature: float = 0.7, max_tokens: int = 1024) -> str:
        """Generate text from the model."""
        raise NotImplementedError("Subclasses must implement this method")

class AnthropicService(ModelService):
    """Service for Anthropic models (Claude)."""
    
    def generate(self, prompt: str, system: Optional[str] = None, 
                temperature: float = 0.7, max_tokens: int = 1024) -> str:
        """Generate text using Anthropic API."""
        api_key = self.config.get("api_key")
        if not api_key:
            raise ValueError("Anthropic API key not found in configuration")
        
        model = self.config.get("model_name", "claude-3-haiku-20240307")
        
        headers = {
            "x-api-key": api_key,
            "content-type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        
        messages.append({"role": "user", "content": prompt})
        
        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        # This is a simulation - in a real implementation, we would make the API call
        # response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
        # response_json = response.json()
        # return response_json["content"][0]["text"]
        
        # For demo purposes, simulate a response
        time.sleep(0.5)  # Simulate API latency
        return f"[Simulated Anthropic {model} response to: '{prompt}']"

class OpenAIService(ModelService):
    """Service for OpenAI models."""
    
    def generate(self, prompt: str, system: Optional[str] = None, 
                temperature: float = 0.7, max_tokens: int = 1024) -> str:
        """Generate text using OpenAI API."""
        api_key = self.config.get("api_key")
        if not api_key:
            raise ValueError("OpenAI API key not found in configuration")
        
        model = self.config.get("model_name", "gpt-4")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        
        messages.append({"role": "user", "content": prompt})
        
        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        # This is a simulation - in a real implementation, we would make the API call
        # response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
        # response_json = response.json()
        # return response_json["choices"][0]["message"]["content"]
        
        # For demo purposes, simulate a response
        time.sleep(0.5)  # Simulate API latency
        return f"[Simulated OpenAI {model} response to: '{prompt}']"

class MistralService(ModelService):
    """Service for Mistral AI models."""
    
    def generate(self, prompt: str, system: Optional[str] = None, 
                temperature: float = 0.7, max_tokens: int = 1024) -> str:
        """Generate text using Mistral AI API."""
        api_key = self.config.get("api_key")
        if not api_key:
            raise ValueError("Mistral API key not found in configuration")
        
        model = self.config.get("model_name", "mistral-large-latest")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        
        messages.append({"role": "user", "content": prompt})
        
        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        # This is a simulation - in a real implementation, we would make the API call
        # response = requests.post("https://api.mistral.ai/v1/chat/completions", headers=headers, json=data)
        # response_json = response.json()
        # return response_json["choices"][0]["message"]["content"]
        
        # For demo purposes, simulate a response
        time.sleep(0.5)  # Simulate API latency
        return f"[Simulated Mistral {model} response to: '{prompt}']"

def create_parser() -> argparse.ArgumentParser:
    """Create command line argument parser."""
    parser = argparse.ArgumentParser(description="mcpomni-connect: Multi-model connector for MCP")
    
    parser.add_argument("prompt", nargs="*", help="Text prompt for the model")
    parser.add_argument("--model", type=str, help="Model to use")
    parser.add_argument("--temperature", type=float, default=0.7, help="Sampling temperature")
    parser.add_argument("--max-tokens", type=int, default=1024, help="Maximum tokens to generate")
    parser.add_argument("--system", type=str, help="System prompt")
    parser.add_argument("--dangerously-skip-permissions", action="store_true", help="Skip permission checks")
    parser.add_argument("--print", type=str, help="Process text input instead of prompt argument")
    parser.add_argument("--output", type=str, help="Output file path")
    parser.add_argument("--list-models", action="store_true", help="List available models")
    parser.add_argument("--configure", type=str, help="Configure a model")
    parser.add_argument("--version", action="version", version=f"mcpomni-connect {__version__}")
    
    return parser

def load_config() -> Dict:
    """Load configuration from file."""
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return DEFAULT_CONFIG

def save_config(config: Dict) -> None:
    """Save configuration to file."""
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=2)

def load_model_config(model_name: str) -> Dict:
    """Load model configuration."""
    model_file = os.path.join(MODELS_DIR, f"{model_name}.json")
    if os.path.exists(model_file):
        with open(model_file, "r") as f:
            return json.load(f)
    raise ValueError(f"Model configuration not found for {model_name}")

def save_model_config(model_name: str, model_config: Dict) -> None:
    """Save model configuration."""
    model_file = os.path.join(MODELS_DIR, f"{model_name}.json")
    with open(model_file, "w") as f:
        json.dump(model_config, f, indent=2)

def get_service_for_model(model_name: str) -> ModelService:
    """Get service instance for specified model."""
    model_config = load_model_config(model_name)
    model_type = model_config.get("type")
    
    if model_type == "anthropic":
        return AnthropicService(model_config)
    elif model_type == "openai":
        return OpenAIService(model_config)
    elif model_type == "mistral":
        return MistralService(model_config)
    else:
        raise ValueError(f"Unknown model type: {model_type}")

def configure_model(model_name: str) -> None:
    """Interactive configuration for a model."""
    print(f"Configuring model: {model_name}")
    
    # Determine model type
    model_types = ["anthropic", "openai", "mistral"]
    
    print("\nSelect model type:")
    for i, m_type in enumerate(model_types, 1):
        print(f"{i}. {m_type}")
    
    type_choice = input("Enter number: ")
    try:
        model_type = model_types[int(type_choice) - 1]
    except (ValueError, IndexError):
        print("Invalid choice. Using 'anthropic' as default.")
        model_type = "anthropic"
    
    # Get model-specific configuration
    model_config = {"type": model_type}
    
    if model_type == "anthropic":
        model_config["model_name"] = input("Enter model name [claude-3-haiku-20240307]: ") or "claude-3-haiku-20240307"
        model_config["api_key"] = input("Enter API key: ")
    elif model_type == "openai":
        model_config["model_name"] = input("Enter model name [gpt-4]: ") or "gpt-4"
        model_config["api_key"] = input("Enter API key: ")
    elif model_type == "mistral":
        model_config["model_name"] = input("Enter model name [mistral-large-latest]: ") or "mistral-large-latest"
        model_config["api_key"] = input("Enter API key: ")
    
    # Save model configuration
    save_model_config(model_name, model_config)
    
    # Update main config
    config = load_config()
    if "models" not in config:
        config["models"] = {}
    config["models"][model_name] = {
        "type": model_type,
        "name": model_config["model_name"]
    }
    save_config(config)
    
    print(f"\nModel {model_name} configured successfully!")

def list_models() -> None:
    """List all configured models."""
    config = load_config()
    models = config.get("models", {})
    
    if not models:
        print("No models configured. Use --configure to add a model.")
        return
    
    default_model = config.get("default_model")
    
    print("\nConfigured Models:")
    print("-----------------")
    
    for name, details in models.items():
        default_marker = " (default)" if name == default_model else ""
        model_type = details.get("type", "unknown")
        model_name = details.get("name", "unknown")
        print(f"- {name}{default_marker}: {model_type} ({model_name})")
    
    print("\nUse --configure MODEL_NAME to add or edit a model.")

def process_text(text: str, args: argparse.Namespace) -> str:
    """Process text with the specified model."""
    config = load_config()
    
    # Determine which model to use
    model_name = args.model if args.model else config.get("default_model")
    
    if not model_name:
        raise ValueError("No model specified and no default model configured")
    
    if model_name not in config.get("models", {}):
        raise ValueError(f"Model '{model_name}' not configured")
    
    # Get model service
    try:
        service = get_service_for_model(model_name)
    except Exception as e:
        raise ValueError(f"Error loading model '{model_name}': {e}")
    
    # Generate response
    try:
        response = service.generate(
            prompt=text,
            system=args.system,
            temperature=args.temperature,
            max_tokens=args.max_tokens
        )
        return response
    except Exception as e:
        raise ValueError(f"Error generating response: {e}")

def create_demo_model_config() -> None:
    """Create a demo model configuration for testing."""
    if not os.path.exists(CONFIG_FILE):
        save_config(DEFAULT_CONFIG)
    
    # Check if any models are configured
    config = load_config()
    if config.get("models"):
        return  # Models already configured
    
    # Create a demo Anthropic model
    model_name = "anthropic-claude-3-haiku"
    model_config = {
        "type": "anthropic",
        "model_name": "claude-3-haiku-20240307",
        "api_key": "sk_ant_demo" + str(uuid.uuid4())[:8]  # Fake API key for demo
    }
    
    save_model_config(model_name, model_config)
    
    # Update main config
    config["models"][model_name] = {
        "type": "anthropic",
        "name": "claude-3-haiku-20240307"
    }
    config["default_model"] = model_name
    save_config(config)
    
    # Create a demo OpenAI model
    model_name = "openai-gpt4"
    model_config = {
        "type": "openai",
        "model_name": "gpt-4",
        "api_key": "sk_openai_demo" + str(uuid.uuid4())[:8]  # Fake API key for demo
    }
    
    save_model_config(model_name, model_config)
    
    # Update main config
    config["models"][model_name] = {
        "type": "openai",
        "name": "gpt-4"
    }
    save_config(config)
    
    print("Created demo model configurations for testing")

def main() -> None:
    """Main entry point."""
    parser = create_parser()
    args = parser.parse_args()
    
    try:
        # Create demo model config for testing (this would not be in production)
        create_demo_model_config()
        
        # Handle list-models command
        if args.list_models:
            list_models()
            return
        
        # Handle configure command
        if args.configure:
            configure_model(args.configure)
            return
        
        # Determine input text
        if args.print:
            text = args.print
        elif args.prompt:
            text = " ".join(args.prompt)
        else:
            # Interactive mode
            print("mcpomni-connect interactive mode")
            print('Type "exit" or "quit" to exit')
            print("---------------------------------")
            
            while True:
                try:
                    text = input("\n> ")
                    if text.lower() in ["exit", "quit"]:
                        break
                    
                    if not text:
                        continue
                    
                    response = process_text(text, args)
                    print("\n" + response)
                except KeyboardInterrupt:
                    break
                except Exception as e:
                    print(f"Error: {e}")
            
            return
        
        # Process text
        response = process_text(text, args)
        
        # Output
        if args.output:
            with open(args.output, "w") as f:
                f.write(response)
        else:
            print(response)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()