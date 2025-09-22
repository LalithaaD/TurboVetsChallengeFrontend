#!/bin/bash

echo "🚀 Setting up Angular Task Management Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Angular CLI is installed globally
if ! command -v ng &> /dev/null; then
    echo "📦 Installing Angular CLI globally..."
    npm install -g @angular/cli@17
fi

echo "✅ Angular CLI version: $(ng version --json | grep '"version"' | head -1 | cut -d'"' -f4)"

# Create environment files
echo "⚙️ Creating environment files..."
cat > src/environments/environment.ts << EOF
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
EOF

cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com'
};
EOF

echo "✅ Environment files created"

# Create favicon
echo "🎨 Creating favicon..."
echo "📄 Creating favicon.ico placeholder"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start your backend server: node simple-nestjs-server.js"
echo "2. Start the frontend: npm run serve"
echo "3. Open http://localhost:4200 in your browser"
echo ""
echo "🔑 Default login credentials (Seeded Admin):"
echo "   Email: test@example.com"
echo "   Password: password123"
echo "   Role: Admin (determined by backend JWT)"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Complete setup guide"
echo "   - Backend API: TASK_API_DOCUMENTATION.md"
echo ""
