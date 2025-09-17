# MailerOne Backend

MailerOne Backend is a Node.js application that provides APIs for managing users, roles, permissions, segments, templates, and email functionalities. This project uses Express.js, Mongoose, and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/winmail-backend.git
   cd winmail-backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   APP_NAME=WinMail API Suite
   PORT=5002
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_uri
   SMTP_EMAIL=your_smtp_email
   SMTP_PASSWORD=your_smtp_password
   FRONTEND_BASE_URL=http://localhost:3000
   CRYPTR_SECRET_KEY=your_cryptr_secret_key
   ```

4. Build the project:

   ```sh
   npm run build
   ```

5. Start the application:
   ```sh
   npm start
   ```

## Usage

- The application will be running on `http://localhost:5002`.
- Use a tool like Postman to interact with the API endpoints.

## API Endpoints

### Auth

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.

### Users

- `GET /api/users`: Get all users.
- `GET /api/users/:id`: Get a user by ID.
- `PUT /api/users/:id`: Update a user by ID.
- `DELETE /api/users/:id`: Delete a user by ID.

### Roles

- `POST /api/roles`: Create a new role.
- `GET /api/roles`: Get all roles.
- `GET /api/roles/:id`: Get a role by ID.
- `PUT /api/roles/:id`: Update a role by ID.
- `DELETE /api/roles/:id`: Delete a role by ID.

### Permissions

- `POST /api/permissions`: Create a new permission.
- `GET /api/permissions`: Get all permissions.
- `GET /api/permissions/:id`: Get a permission by ID.
- `PUT /api/permissions/:id`: Update a permission by ID.
- `DELETE /api/permissions/:id`: Delete a permission by ID.

### segments

- `POST /api/segments`: Create a new segment.
- `GET /api/segments`: Get all segments.
- `GET /api/segments/:id`: Get a segment by ID.
- `PUT /api/segments/:id`: Update a segment by ID.
- `DELETE /api/segments/:id`: Delete a segment by ID.

### Templates

- `POST /api/templates`: Create a new template.
- `GET /api/templates`: Get all templates.
- `GET /api/templates/:id`: Get a template by ID.
- `PUT /api/templates/:id`: Update a template by ID.
- `DELETE /api/templates/:id`: Delete a template by ID.

## Environment Variables

- `APP_NAME`: The name of the application.
- `PORT`: The port on which the application runs.
- `JWT_SECRET`: Secret key for JWT authentication.
- `MONGODB_URI`: MongoDB connection URI.
- `SMTP_EMAIL`: SMTP email for sending emails.
- `SMTP_PASSWORD`: SMTP password for sending emails.
- `FRONTEND_BASE_URL`: Base URL of the frontend application.
- `CRYPTR_SECRET_KEY`: Secret key for encryption.

## Project Structure
