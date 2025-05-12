#!/bin/bash

# Setup script for SmartText Connect
# This script installs the necessary dependencies and sets up the project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up SmartText Connect...${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cat > .env.local << EOL
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EOL
    echo -e "${YELLOW}Please update .env.local with your Supabase credentials.${NC}"
fi

# Create Supabase directory if it doesn't exist
if [ ! -d "supabase" ]; then
    echo -e "${YELLOW}Creating Supabase directory...${NC}"
    mkdir -p supabase
fi

# Check if schema.sql exists
if [ ! -f "supabase/schema.sql" ]; then
    echo -e "${RED}supabase/schema.sql not found. Please make sure it exists.${NC}"
    echo -e "${YELLOW}You can create it manually with the SQL commands for your database schema.${NC}"
fi

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Update .env.local with your Supabase credentials"
echo -e "2. Run the SQL commands in supabase/schema.sql in your Supabase project"
echo -e "3. Run 'npm run dev' to start the development server"
echo -e "${GREEN}Happy coding!${NC}"
