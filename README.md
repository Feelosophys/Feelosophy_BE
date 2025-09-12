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
6. go to the .env file with connect string to connect to mông db 

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

## Architecture

This project follows a modular, layered architecture inspired by Spring Boot, with clear separation of concerns:

- **config/**: Configuration files for database, security, JWT, email, Swagger, and other app-wide settings.
- **constants/**: Centralized constants (roles, status codes, templates) for use throughout the app.
- **controllers/**: Handle HTTP requests and responses for each resource (e.g., users, blogs, courses). Controllers call service methods and return API responses.
- **services/**: Business logic and data processing. Services interact with models and encapsulate core operations (CRUD, validation, etc.).
- **models/**: Mongoose schemas defining the structure of MongoDB collections (e.g., User, Blog, Course, etc.).
- **routes/**: API route definitions, mapping endpoints to controllers. Each resource has its own route file.
- **middlewares/**: Custom Express middlewares for authentication, error handling, role checks, validation, etc.
- **utils/**: Utility/helper functions for common tasks (API response formatting, error classes, async wrappers, logging).
- **validators/**: Input validation rules for requests, using express-validator. Ensures data integrity before reaching controllers/services.
- **jobs/**: Scheduled/background jobs (e.g., cleanup tasks).
- **seed/**: Database seeder scripts for populating initial/sample data (users, blogs, courses, etc.).

**Key Principles:**
- **Separation of concerns:** Each layer/folder has a distinct responsibility.
- **Scalability:** Easy to add new features/resources by creating new modules in each layer.
- **Testability:** Business logic is separated from HTTP layer, making unit testing easier.
- **Maintainability:** Consistent structure and naming conventions make the codebase easy to navigate.

See the `src/` folder for implementation details of each layer.

## Main Endpoints
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- ... (see `/api-docs`)

## How to Create and Use an API (e.g., User)

Follow these steps to add a new resource API to the project:

1. **Design the Data Model**
   - Define the Mongoose schema in `src/models/User.js`.

2. **Create the Service**
   - Add business logic in `src/services/userService.js` (e.g., get all users, get user by ID).

3. **Create the Controller**
   - Handle HTTP requests in `src/controllers/userController.js` (call service methods, format responses).

4. **Define the Routes**
   - Map endpoints to controller methods in `src/routes/userRoutes.js`.

5. **Add Validation (Optional)**
   - Create validation rules in `src/validators/userValidators.js` (for input data).

6. **Mount the Routes**
   - Import and use the route file in `app.js`:
     ```js
     const userRoutes = require('./src/routes/userRoutes');
     app.use('/api/v1/users', userRoutes);
     ```

7. **Document the API**
   - Add Swagger JSDoc comments in the route file for API docs.

8. **Test the API**
   - Use Swagger UI, Postman, or curl to test endpoints (e.g., `GET /api/v1/users`, `GET /api/v1/users/:id`).

**Summary:**
Model → Service → Controller → Route → Validation → Mount in app.js → Swagger docs → Test

This modular flow applies to any resource (user, blog, course, etc.) in your project!

## Notes
- MongoDB runs in Docker on port 27019 and is accessible at `mongodb://mental:mental@localhost:27019/?authSource=admin` (see `.env` and `docker-compose.yml`).
- No need to install MongoDB locally—just use Docker Compose!
- For any issues, check your Docker Desktop is running and port 27019 is available.
