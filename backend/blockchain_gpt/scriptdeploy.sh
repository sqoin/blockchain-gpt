#!/bin/bash

# Check if Git is installed and install if not
if ! command -v git &>/dev/null; then
    echo "Git is not installed. Installing Git..."
    if command -v apt-get &>/dev/null; then
        sudo apt-get install -y git
    elif command -v yum &>/dev/null; then
        sudo yum install -y git
    elif command -v brew &>/dev/null; then
        brew install git
    else
        echo "Unable to install Git. Please install Git manually and run the script again."
        exit 1
    fi
fi

# Check if Docker is installed and install if not
if ! command -v docker &>/dev/null; then
    echo "Docker is not installed. Installing Docker..."
    if command -v apt-get &>/dev/null; then
        sudo apt-get install -y docker.io
    elif command -v yum &>/dev/null; then
        sudo yum install -y docker
    elif command -v brew &>/dev/null; then
        brew install docker
    else
        echo "Unable to install Docker. Please install Docker manually and run the script again."
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info &>/dev/null; then
    echo "Docker is not running. Please start Docker and run the script again."
    exit 1
fi

# Launch Docker Desktop (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open -a Docker
fi

# Get current working directory
cwd=$(pwd)

# Check if the current working directory exists
if [ ! -d "$cwd" ]; then
    echo "Current working directory does not exist."
    exit 1
fi
# Check if the development.ini file exists
if [ ! -f "$cwd/deployment.env" ]; then
    echo "deployment.env file does not exist."
    exit 1
fi

# Source the development.ini file
source "$cwd/deployment.env"

# Check if the current working directory is a Git repository
if git rev-parse --is-inside-work-tree &>/dev/null; then
    echo "Current working directory is a Git repository."
else
    echo "Current working directory is not a Git repository."
fi
# Fetch the latest changes from the Git repository
git fetch

# Check if the Dockerfile exists
if [ ! -f "$cwd/${NAME_FILE}" ]; then
    echo "Dockerfile does not exist."
    exit 1
fi

# Build a Docker image using the Dockerfile specified in the NAME_FILE variable
docker buildx build --platform linux/x86_64 --no-cache -t "$IMAGE_NAME:$NAME_IMAGE_ACTUAL" -f "$NAME_FILE" .

# Check if the image was created successfully
if [ $? -ne 0 ]; then
    echo "Error building Docker image."
    exit 1
fi
echo "build success"
# Tag the image with the name specified in the IMAGE_NAME variable and the NAME_IMAGE_ACTUAL variable
docker tag "$IMAGE_NAME:$NAME_IMAGE_ACTUAL" "$IMAGE_NAME:$NAME_IMAGE_ACTUAL"
echo "tag success"
# Push the image to a Docker registry
docker push "$IMAGE_NAME:$NAME_IMAGE_ACTUAL"

# Check if there was an error pushing the image
if [ $? -ne 0 ]; then
    echo "Error pushing Docker image."
    exit 1
fi

# Set the Kubernetes namespace to the namespace specified in the NAME_NAMESPACE variable
kubectl config set-context --current --namespace="$NAME_NAMESPACE"

# # Replace the IMAGE_TAG variable with the new image tag
awk '/image:/ { print "        image: '$IMAGE_NAME:$NAME_IMAGE_ACTUAL'"; next } 1' "$NAME_DIRECTORY_DEPLOY" >"$NAME_DIRECTORY_DEPLOY.tmp" && mv "$NAME_DIRECTORY_DEPLOY.tmp" "$NAME_DIRECTORY_DEPLOY"

# Delete the deployment
kubectl delete deployment "$NAME_DEPLOYMENT"

# Create the deployment

kubectl apply -f "$NAME_DIRECTORY_DEPLOY"

# Check if there was an error creating the deployment
if [ $? -ne 0 ]; then
    echo "Error creating deployment."
    exit 1
fi
