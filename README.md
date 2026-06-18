# URL Shortener

Professional, full‑stack URL shortening service with a Node.js/Express backend and a React + Vite frontend.

## Project Overview
This repository implements a scalable URL shortener: users submit long URLs and receive compact short codes that redirect to the original address. The backend persists records in MongoDB and exposes a small REST API consumed by the frontend.

## Key Features
- Fast short-code generation (nanoid)
- Persistent storage with MongoDB (mongoose)
- Optional JWT-based authentication for protected actions
- CORS-enabled API for frontend integration

## Tech Stack
- Backend: Node.js, Express, Mongoose, dotenv, nanoid, bcryptjs, jsonwebtoken
- Frontend: React, Vite, Tailwind CSS

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or hosted)

## Setup & Run
1. Backend
   - cd BACKEND
   - npm install
   - Copy `.env.example` to `.env` and set variables (see below)
   - Development: npm run dev
   - Production: npm start

2. Frontend
   - cd FRONTEND
   - npm install
   - npm run dev

Start backend first, then the frontend. Adjust API base URL in the frontend if needed.

## Environment Variables (BACKEND/.env)
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- PORT=3000

## API (examples)
- POST /api/shorten — Create a short URL (body: { url, optionalCustomCode })
- GET /:code — Redirect to the original URL
- Authenticated endpoints use Authorization: Bearer <token>

## Project Structure
```
url-shortner/
├── BACKEND/   # Express API
├── FRONTEND/  # React + Vite app
└── README.md
```

## Contributing
Contributions welcome. Open an issue to discuss major changes before submitting a pull request. Keep commits focused and include clear descriptions.

## License
This project uses the ISC license (see BACKEND/package.json).

## Author
Praful Suryawanshi — GitHub: @Newbie-p