# Multi-Tenant Payload Example - MongoDB Setup

This example demonstrates how to set up a multi-tenant application with Payload CMS using MongoDB.

## Prerequisites

You need either Docker or a local MongoDB installation.

## Option 1: Using Docker (Recommended)

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Start the services:
   ```bash
   docker-compose up -d
   ```
3. The application will be available at http://localhost:3000

## Option 2: Using Local MongoDB

### Install MongoDB

#### On macOS:
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

#### On Ubuntu/Debian:
```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create the list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### On Windows:
Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community

### Setup Database for Local MongoDB

1. Update your `.env` file to use the local MongoDB connection:
   ```bash
   DATABASE_URI=mongodb://127.0.0.1:27017/payload-example-multi-tenant
   ```

2. Install dependencies and start the application:
   ```bash
   npm install
   npm run dev
   ```

## Database Configuration

The application is configured to use MongoDB with the following settings:

- **Database Name**: payload-example-multi-tenant
- **Connection**: MongoDB (default port 27017)
- **Collections**: Automatically created by Payload CMS

## Multi-Tenant Configuration

This example includes:

- **Tenant Management**: Create and manage multiple tenants
- **Tenant Isolation**: Data is automatically scoped to the appropriate tenant
- **User Access Control**: Users can be assigned to specific tenants
- **Super Admin**: Global access across all tenants

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The admin panel will be available at http://localhost:3000/admin

## Seeding Data

The application will automatically seed initial data when `SEED_DB=true` is set in your `.env` file.

## Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB is running:
   ```bash
   # Check if MongoDB is running
   mongo --eval "db.adminCommand('ismaster')"
   ```

2. Check MongoDB logs:
   ```bash
   # On macOS with Homebrew
   tail -f /usr/local/var/log/mongodb/mongo.log
   
   # On Ubuntu/Debian
   sudo tail -f /var/log/mongodb/mongod.log
   ```

3. Restart MongoDB:
   ```bash
   # On macOS with Homebrew
   brew services restart mongodb/brew/mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl restart mongod
   ```

### Application Issues

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Regenerate Payload types:
   ```bash
   npm run generate:types
   ```
