# Modular Node.js Backend (Spring Boot Inspired)

## Overview
A modular, well-structured Node.js backend using Express.js and MongoDB, inspired by Spring Boot's architecture. Features MVC, service layer, dependency management, JWT auth, validation, Swagger docs, and more.

## Prerequisites
- [Node.js](https://nodejs.org/) >= 16
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for MongoDB)

## Setup
1. **Clone the repo**
   ```sh
   git clone <your-repo-url>
   cd BE_NodeJs_Mental
   ```
2. **Copy `.env.example` to `.env` and fill in your values**
   (Or use the provided `.env` file. Ensure `MONGODB_URI` matches the Docker MongoDB config.)
3. **Start MongoDB with Docker Compose**
   ```sh
   docker-compose up -d
   ```
   This will run MongoDB in a container with the correct credentials and port.
4. **Install dependencies**
   ```sh
   npm install
   ```
5. **Start the server**
   ```sh
   npm run dev
   ```

## API Docs
Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) after starting the server.

## Project Structure
- `server.js`: Entry point
- `app.js`: Express app config
- `docker-compose.yml`: Docker Compose config for MongoDB
- `.env`: Environment variables
- `src/`
  - `config/`: Config files (DB, security, swagger, etc.)
  - `constants/`: App-wide constants
  - `controllers/`: Route handlers
  - `services/`: Business logic
  - `models/`: Mongoose schemas
  - `routes/`: API routes
  - `middlewares/`: Custom middlewares
  - `utils/`: Helpers/utilities
  - `validators/`: Input validation
  - `jobs/`: Scheduled jobs

## Main Endpoints
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- ... (see `/api-docs`)

## Notes
- MongoDB runs in Docker on port 27019 and is accessible at `mongodb://mental:mental@localhost:27019/?authSource=admin` (see `.env` and `docker-compose.yml`).
- No need to install MongoDB locally—just use Docker Compose!
- For any issues, check your Docker Desktop is running and port 27019 is available.
