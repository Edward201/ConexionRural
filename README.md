# Conexión Rural 360

Conexión Rural 360 is a web platform designed to provide educational content with a focus on rural contexts. It is a hybrid MOOC-type platform that promotes access to learning from and for the territories.

## Features

- **User Authentication**: Secure user registration and login system with password hashing.
- **Role-based Access Control**: Differentiates between regular users and administrators, with specific permissions for each role.
- **Content Management System (CMS)**: Allows administrators to manage the content of the main page.
- **Web Analytics**: Tracks user interactions and provides detailed analytics on page views, traffic sources, devices, and conversions.
- **Interactive UI**: A modern and responsive user interface built with React, TypeScript, and Tailwind CSS.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, Passport.js
- **Database**: PostgreSQL with Drizzle ORM
- **Bundler**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/conexion-rural-360.git
   cd conexion-rural-360
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   - Create a PostgreSQL database.
   - Create a `.env` file in the root of the project and add your database connection string:

     ```
     DATABASE_URL="postgresql://user:password@host:port/database"
     ```

4. **Run database migrations:**

   ```bash
   npm run db:push
   ```

5. **Seed the database with initial data:**

   ```bash
   npm run db:seed
   ```

### Running the Application

- **Development:**

  ```bash
  npm run dev
  ```

  This will start the Vite development server and the Express backend.

- **Production:**

  ```bash
  npm run build
  npm run start
  ```

## Usage

- **Admin Login**:
  - Username: `admin`
  - Password: `admin123`

- **Test User Login**:
  - Username: `test_user`
  - Password: `test123`

### Available Scripts

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the application in production mode.
- `npm run check`: Runs the TypeScript compiler to check for errors.
- `npm run db:push`: Pushes database schema changes.
- `npm run db:seed`: Seeds the database with initial users.
- `npm run db:seed-analytics`: Seeds the database with demo analytics data.
- `npm run db:seed-content`: Seeds the database with initial page content.