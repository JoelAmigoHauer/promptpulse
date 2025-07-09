#!/usr/bin/env python3
"""
Check and verify all required dependencies for Brand Intelligence Engine
"""

import subprocess
import sys
import importlib.util

def check_package_installed(package_name):
    """Check if a package is installed"""
    try:
        importlib.import_module(package_name)
        return True
    except ImportError:
        return False

def get_package_version(package_name):
    """Get the version of an installed package"""
    try:
        import pkg_resources
        return pkg_resources.get_distribution(package_name).version
    except:
        return "Unknown"

def main():
    """Check all required dependencies"""
    print("🔍 Checking Brand Intelligence Engine Dependencies")
    print("=" * 60)
    
    # Core dependencies for Brand Intelligence
    required_packages = [
        ("fastapi", "Web framework"),
        ("uvicorn", "ASGI server"),
        ("sqlalchemy", "Database ORM"),
        ("psycopg2", "PostgreSQL adapter"),
        ("redis", "Redis client"),
        ("celery", "Task queue"),
        ("python-multipart", "File uploads"),
        ("python-jose", "JWT tokens"),
        ("passlib", "Password hashing"),
        ("openai", "OpenAI API client"),
        ("anthropic", "Anthropic API client"),
        ("google.generativeai", "Google AI API client"),
        ("requests", "HTTP requests"),
        ("beautifulsoup4", "Web scraping"),
        ("python-dotenv", "Environment variables"),
        ("pydantic", "Data validation"),
        ("pydantic_settings", "Settings management"),
        ("alembic", "Database migrations"),
        ("pytest", "Testing framework"),
        ("httpx", "Async HTTP client")
    ]
    
    # Check each package
    missing_packages = []
    installed_packages = []
    
    for package_name, description in required_packages:
        # Handle different import names
        import_name = package_name
        if package_name == "psycopg2":
            import_name = "psycopg2"
        elif package_name == "python-jose":
            import_name = "jose"
        elif package_name == "python-multipart":
            import_name = "multipart"
        elif package_name == "python-dotenv":
            import_name = "dotenv"
        elif package_name == "pydantic_settings":
            import_name = "pydantic_settings"
        elif package_name == "beautifulsoup4":
            import_name = "bs4"
        elif package_name == "google.generativeai":
            import_name = "google.generativeai"
        
        is_installed = check_package_installed(import_name)
        
        if is_installed:
            version = get_package_version(package_name.replace(".", "-"))
            installed_packages.append((package_name, version, description))
            print(f"✅ {package_name:20} v{version:12} - {description}")
        else:
            missing_packages.append((package_name, description))
            print(f"❌ {package_name:20} {'Missing':12} - {description}")
    
    print("\n" + "=" * 60)
    print("📊 DEPENDENCY SUMMARY")
    print("=" * 60)
    
    print(f"✅ Installed: {len(installed_packages)}")
    print(f"❌ Missing: {len(missing_packages)}")
    
    if missing_packages:
        print("\n⚠️  MISSING PACKAGES:")
        for package, description in missing_packages:
            print(f"  - {package} ({description})")
        
        print("\n🔧 To install missing packages, run:")
        print("cd /opt/promptpulse-repo/promptpulse-backend")
        print("pip install -r requirements.txt")
        
        return False
    else:
        print("\n🎉 All dependencies are installed!")
        
        # Check API-specific functionality
        print("\n" + "=" * 60)
        print("🧪 TESTING API IMPORTS")
        print("=" * 60)
        
        # Test OpenAI
        try:
            import openai
            print("✅ OpenAI client can be imported")
        except Exception as e:
            print(f"❌ OpenAI import error: {e}")
        
        # Test Anthropic
        try:
            import anthropic
            print("✅ Anthropic client can be imported")
        except Exception as e:
            print(f"❌ Anthropic import error: {e}")
        
        # Test Google AI
        try:
            import google.generativeai
            print("✅ Google AI client can be imported")
        except Exception as e:
            print(f"❌ Google AI import error: {e}")
        
        # Test Brand Intelligence Engine
        try:
            sys.path.append('src')
            from src.services.brand_intelligence import BrandIntelligenceEngine
            print("✅ Brand Intelligence Engine can be imported")
        except Exception as e:
            print(f"❌ Brand Intelligence Engine import error: {e}")
        
        return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)