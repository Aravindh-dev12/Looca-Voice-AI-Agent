#!/bin/bash

# Looca AGI Voice Architecture - Quick Start Script

echo "🚀 Starting Looca AGI Voice Platform..."
echo ""

# Check if Docker is available
if command -v docker-compose &> /dev/null; then
    echo "📦 Using Docker Compose for full stack..."
    docker-compose up -d postgres qdrant redis
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
    docker-compose up -d backend
    docker-compose up -d frontend
    echo ""
    echo "✅ Full stack running!"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo "   Qdrant: http://localhost:6333/dashboard"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
    exit 0
fi

# Manual mode
echo "🔧 Running in manual mode (no Docker)..."
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.11+"
    exit 1
fi

echo "✅ Prerequisites met"
echo ""

# Setup backend
echo "📦 Setting up Python backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup frontend
echo "📦 Setting up Next.js frontend..."
npm install
npx prisma generate

# Start backend in background
echo "🐍 Starting Python backend on port 8000..."
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Start frontend
echo "⚛️  Starting Next.js frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Looca AGI Voice Platform is running!"
echo ""
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔌 Backend API: http://localhost:8000"
echo "   📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
