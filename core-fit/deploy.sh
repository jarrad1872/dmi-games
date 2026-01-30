#!/bin/bash

# Core Fit - Quick Deployment Script
# Usage: ./deploy.sh [method]
# Methods: test, ftp, git, rsync

set -e

GAME_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAME_FILE="index.html"

echo "🎮 Core Fit Deployment Script"
echo "================================"

# Function to test locally
test_local() {
    echo "🧪 Starting local test server..."
    echo "📍 Opening: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    cd "$GAME_DIR"
    python3 -m http.server 8000
}

# Function to validate file exists
validate() {
    if [ ! -f "$GAME_DIR/$GAME_FILE" ]; then
        echo "❌ Error: $GAME_FILE not found in $GAME_DIR"
        exit 1
    fi
    echo "✅ Game file validated: $(du -h "$GAME_DIR/$GAME_FILE" | cut -f1)"
}

# Function to display deployment info
deploy_info() {
    echo ""
    echo "📋 Deployment Information:"
    echo "   File: $GAME_FILE"
    echo "   Size: $(du -h "$GAME_DIR/$GAME_FILE" | cut -f1)"
    echo "   Target: games.dmitools.com"
    echo ""
}

# Function for FTP deployment
deploy_ftp() {
    echo "📤 FTP Deployment"
    echo "Enter FTP details for games.dmitools.com"
    read -p "FTP Host: " FTP_HOST
    read -p "FTP User: " FTP_USER
    read -sp "FTP Password: " FTP_PASS
    echo ""
    read -p "Remote Directory [/public_html/core-fit]: " REMOTE_DIR
    REMOTE_DIR=${REMOTE_DIR:-/public_html/core-fit}
    
    echo "Uploading..."
    lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" <<EOF
cd $REMOTE_DIR
put "$GAME_DIR/$GAME_FILE"
bye
EOF
    
    echo "✅ Deployed successfully!"
    echo "🌐 Access at: https://games.dmitools.com/core-fit/"
}

# Function for rsync/SSH deployment
deploy_rsync() {
    echo "📤 rsync/SSH Deployment"
    read -p "SSH Host (user@host): " SSH_HOST
    read -p "Remote Path: " REMOTE_PATH
    
    echo "Uploading via rsync..."
    rsync -avz --progress "$GAME_DIR/$GAME_FILE" "$SSH_HOST:$REMOTE_PATH/"
    
    echo "✅ Deployed successfully!"
}

# Function for Git deployment
deploy_git() {
    echo "📤 Git Deployment"
    
    cd "$GAME_DIR"
    
    if [ ! -d ".git" ]; then
        echo "Initializing git repository..."
        git init
        git add .
        git commit -m "Initial commit: Core Fit game"
    else
        echo "Adding changes..."
        git add .
        git commit -m "Update Core Fit game" || echo "No changes to commit"
    fi
    
    read -p "Git remote URL: " GIT_REMOTE
    
    if ! git remote get-url origin &>/dev/null; then
        git remote add origin "$GIT_REMOTE"
    fi
    
    echo "Pushing to remote..."
    git push -u origin main || git push -u origin master
    
    echo "✅ Pushed to git successfully!"
}

# Function to create a deployment package
create_package() {
    echo "📦 Creating deployment package..."
    
    PACKAGE_NAME="core-fit-$(date +%Y%m%d-%H%M%S).zip"
    
    cd "$GAME_DIR"
    zip -r "$PACKAGE_NAME" index.html README.md FEATURES-CHECKLIST.md
    
    echo "✅ Package created: $PACKAGE_NAME"
    echo "   Upload this ZIP to your web hosting control panel"
}

# Main script logic
validate
deploy_info

case "${1:-}" in
    test)
        test_local
        ;;
    ftp)
        deploy_ftp
        ;;
    rsync|ssh)
        deploy_rsync
        ;;
    git)
        deploy_git
        ;;
    package|zip)
        create_package
        ;;
    *)
        echo "🎯 Deployment Options:"
        echo ""
        echo "  ./deploy.sh test     - Start local test server"
        echo "  ./deploy.sh ftp      - Deploy via FTP"
        echo "  ./deploy.sh rsync    - Deploy via SSH/rsync"
        echo "  ./deploy.sh git      - Deploy via Git"
        echo "  ./deploy.sh package  - Create ZIP package"
        echo ""
        echo "📖 See README.md for manual deployment instructions"
        echo ""
        ;;
esac
