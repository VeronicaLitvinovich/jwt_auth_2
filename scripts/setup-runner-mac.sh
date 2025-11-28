#!/bin/bash

echo "Setting up self-hosted runner environment for macOS..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for this session
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Update Homebrew and install required packages
echo "Installing dependencies..."
brew update
brew install \
    curl \
    docker \
    docker-compose \
    postgresql \
    jq

# Install Docker Desktop if not installed
if ! [ -d "/Applications/Docker.app" ]; then
    echo "Please install Docker Desktop from https://docker.com/products/docker-desktop"
    echo "Or install via Homebrew: brew install --cask docker"
    open "https://docker.com/products/docker-desktop"
fi

# Start Docker Desktop if not running
if ! docker system info &> /dev/null; then
    echo "Starting Docker Desktop..."
    open -a Docker
    
    echo "Waiting for Docker to start..."
    while ! docker system info &> /dev/null; do
        sleep 5
        echo "Still waiting for Docker..."
    done
fi

# Create application directory in user's home directory
mkdir -p ~/app-data
echo "Application directory created at ~/app-data"

echo "=== Setup completed for macOS! ==="
echo ""
echo "Next steps:"
echo "1. Make sure Docker Desktop is running"
echo "2. Configure GitHub runner:"
echo "   - Go to your GitHub repository"
echo "   - Settings → Actions → Runners"
echo "   - Click 'New self-hosted runner'"
echo "   - Follow the setup instructions"
echo ""
echo "Docker status:"
docker --version
docker-compose --version
echo ""
echo "Node.js status:"
node --version
npm --version