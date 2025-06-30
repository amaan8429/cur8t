#!/usr/bin/env python3
"""
Development runner for Cur8t Agents API
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and print description"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   {e.stderr}")
        return False

def main():
    """Main runner function"""
    print("🚀 Cur8t Agents API Development Runner")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("main.py"):
        print("❌ Please run this script from the agents-api directory")
        sys.exit(1)
    
    # Install dependencies
    print("📦 Installing dependencies...")
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        print("💡 Try running: pip install -r requirements.txt")
        sys.exit(1)
    
    print("\n🎉 Setup complete! You can now:")
    print("   • Start the API server: uvicorn main:app --reload")
    print("   • Test the API: python test_api.py")
    print("   • Run tests: pytest")
    print("   • View docs: http://localhost:8000/docs")
    
    # Ask if user wants to start the server
    start_server = input("\n🤔 Start the API server now? (y/n): ").lower().strip()
    
    if start_server in ['y', 'yes']:
        print("\n🚀 Starting API server...")
        print("📍 Server will be available at: http://localhost:8000")
        print("📖 API docs will be at: http://localhost:8000/docs")
        print("🛑 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        try:
            subprocess.run(["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
        except KeyboardInterrupt:
            print("\n👋 Server stopped. Have a great day!")
        except FileNotFoundError:
            print("❌ uvicorn not found. Please install it with: pip install uvicorn")
    else:
        print("\n👍 You can start the server later with: uvicorn main:app --reload")

if __name__ == "__main__":
    main() 