#!/bin/bash

set -e

# Function to display status messages
status_message() {
    echo "==== $1 ===="
}

# Function to check if SEO is enabled
check_seo_enabled() {
    if [ -f .env ]; then
        source .env
        if [ "$NEXT_PUBLIC_SEO" != "true" ]; then
            echo "Please enable SEO by setting NEXT_PUBLIC_SEO=\"true\" in the .env file."
            exit 1
        fi
    else
        echo ".env file not found! Please make sure the environment variables are set."
        exit 1
    fi
}


# Function to perform a fresh installation
fresh_install() {
      # Check if SEO is enabled
    check_seo_enabled
    # Load environment variables from .env file
    status_message "Loading environment variables"
    if [ -f .env ]; then
        set -o allexport
        source .env
        set +o allexport
    else
        echo ".env file not found! Please make sure the environment variables are set."
        exit 1
    fi

    # Proceed with the rest of the fresh installation steps
    status_message "Installing NVM"
    wget -O nvm.sh https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

    # Load NVM and install Node.js
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    status_message "Installing Node.js"
    nvm install 20

    # Install PM2 if not installed
    if ! pm2 -v ; then
        status_message "Installing PM2"
        npm install -g pm2
    fi

    # Find an available port and update config files
    find_available_port_and_update

    # Install project dependencies and build the project
    install_dependencies_and_build

    # Start the project with PM2
    status_message "Starting the project with PM2"
    pm2 start npm --name "realestate" -- start

    # Save PM2 processes
    pm2 save
    status_message "Installation and deployment complete!"
}

# Function to install dependencies and build the project
install_dependencies_and_build() {
    # Install project dependencies
    status_message "Installing project dependencies"
    npm install

    # Build the project
    status_message "Building the project"
    npm run build
}

# Function to find an available port and update .htaccess and package.json
find_available_port_and_update() {
    status_message "Finding an available port"
    PORT=$(find_available_port)
    if [ $? -ne 0 ]; then
        exit 1
    fi
    echo "Found available port: $PORT"

    # Update .htaccess and package.json files with the new port
    status_message "Updating .htaccess file"
    sed -i "s/http:\/\/127\.0\.0\.1:[0-9]*\//http:\/\/127.0.0.1:$PORT\//g" .htaccess

    status_message "Updating package.json file"
    sed -i "s/NODE_PORT=*[0-9]*/NODE_PORT=$PORT/" package.json
}

# Function to find an available port
find_available_port() {
    for port in $(seq 8003 9001); do
        if ! sudo lsof -i :$port > /dev/null 2>&1; then
            echo $port
            return 0
        fi
    done
    echo "No available ports found between 8001 and 9001" >&2
    return 1
}

# Start fresh installation process
fresh_install
