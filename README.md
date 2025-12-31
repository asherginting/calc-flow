# CalcFlow 🚀

A Dynamic Nested Calculation Tree Logic application built with a modern Monorepo structure. This project demonstrates a full-stack implementation using React, Node.js, and PostgreSQL.

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS (v3)
- React Flow (Visual Node Engine)

**Backend:**
- Node.js & Express
- TypeScript
- Prisma ORM
- PostgreSQL

**Infrastructure:**
- Docker & Docker Compose

## 📂 Project Structure

```
calc-flow/
├── client/             # Frontend Application (Vite + React)
├── server/             # Backend API (Express + Prisma)
├── docker-compose.yml  # Database Orchestration (PostgreSQL)
└── package.json        # Root scripts for easy management
```

## 🚀 Getting Started

Follow these steps to set up the project locally.
- Node.js (v20+ recommended)
- Docker Desktop (must be installed and running)

1. Clone this repo.
```
git clone git@github.com:asherginting/calc-flow.git
```

2. cd folder.
```
cd calc-flow
```

3. Install All Dependencies Run this single command in the root folder. It will automatically install dependencies for Root, Server, and Client.
```
npm install
```

4. Start the Database Make sure Docker Desktop is open, then spin up the PostgreSQL container:
```
docker compose up -d
```

5. Run the Application Start both Frontend and Backend concurrently with one command: ```npm run dev```

## 🌍 Access the App
Once running, you can access the services at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000