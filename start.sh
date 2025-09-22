#!/bin/bash

echo "🚀 Starting Task Management Dashboard..."
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Starting development server..."
echo "🌐 Open http://localhost:3001 in your browser (NOT https)"
echo ""
echo "✨ Features available:"
echo "   • Create, edit, and delete tasks"
echo "   • Drag and drop to change status"
echo "   • Filter by status, priority, category, assignee"
echo "   • Sort by various fields"
echo "   • Role-based UI (Owner/Admin/Viewer)"
echo "   • Responsive mobile-first design"
echo ""

npm run dev
