# School Voting System (Full-Stack TypeScript)
Minimal scaffold: Node.js + Express (TypeScript) backend and React (TypeScript) frontend.
## Contents
- backend/: Express API (TypeScript), basic endpoints, sample env
- frontend/: React (Vite + TypeScript) app with simple voting UI
- database/: schema.sql and sample seed CSV
- docker/: Dockerfiles and docker-compose (optional)
## Quick start (local)
1. Backend:
   ```
   cd backend
   npm install
   npm run build
   npm start
   ```
2. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
## Notes
This scaffold includes core endpoints and a minimal UI to get you started. Replace mock auth and in-memory storage with real DB and SSO before production.
