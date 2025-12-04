# Base image with Python and Node.js
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Install basic tools
RUN apt-get install -y git wget unzip

# Set working directory
WORKDIR /workspace

# Default command
CMD ["tail", "-f", "/dev/null"]
