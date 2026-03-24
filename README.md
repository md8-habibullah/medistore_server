# mediStore Server

A modern and smart backend application built for the **mediStore** e-commerce platform. This robust server handles everything from inventory management to user authentication and order processing, providing a seamless data layer for the frontend client.

## Tech Stack

This project utilizes a modern web development stack to ensure scalability, type safety, and efficient data handling:

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Advanced open-source relational DBMS - Database Management System)
- **ORM (Object-Relational Mapping):** Prisma
- **Authentication:** Better-Auth
- **Package Manager:** pnpm

## Core Architecture & Features

The server is built using modular routing and a well-defined schema, making it easy to maintain and scale.

- **Role-Based Access Control (RBAC):** Users are categorized into `CUSTOMER`, `SELLER`, and `ADMIN` roles, allowing for strict endpoint protection.
- **Authentication:** Managed via `better-auth`, handling secure sessions, tokens, and user verification via the `/api/auth` routes.
- **Relational Data Management:** The Prisma schema defines clear relationships between `Category`, `Medicine`, `Order`, `OrderItem`, `Review`, and `User` models.
- **CORS (Cross-Origin Resource Sharing):** Configured to accept requests smoothly from the frontend URL (`http://localhost:3000` by default).

## Getting Started

Follow these steps to set up the development environment locally.

### Prerequisites

- Node.js installed
- PostgreSQL database running
- `pnpm` package manager installed globally

## Frontend Client

The user interface for this backend API is managed in a separate repository. You can explore the frontend codebase here:
[mediStore Client Repository](https://github.com/md8-habibullah/medistore_client.git)

### Installation

1. **Clone the repository:**

```bash
  git clone https://github.com/md8-habibullah/medistore_server.git
  cd medistore_server
```

2. **Install dependencies:**

```bash
  pnpm install

```

3. **Environment Setup:**
   Create a `.env` file in the root directory (refer to `.env.example` if available) and add your environment variables:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/medistore"
FRONTEND_APP_URL="http://localhost:3000"

```

4. **Database Migration & Generation:**
   Sync the Prisma ORM with your PostgreSQL database:

```bash
pnpm prisma generate
pnpm prisma db push

```

5. **Seed the Database:**
   Populate the database with initial categories or admin accounts:

```bash
pnpm run seed

```

6. **Start the Development Server:**

```bash
pnpm run dev

```

The server will start running at `http://localhost:5000`.

## API (Application Programming Interface) Routes

The server exposes the following main HTTP (Hypertext Transfer Protocol) endpoints under the `` prefix:

- `GET /` - Root health check endpoint.
- `ANY /api/auth/*` - Handles all authentication and session creation.
- `USE /medicine` - Medicine inventory, search, and management.
- `USE /orders` - Order placement and status tracking.
- `USE /reviews` - Product ratings and user comments.
- `USE /users` - User profile and account management.

## Scripts

- `pnpm run dev`: Starts the server in watch mode using `tsx` for rapid development.
- `pnpm run build`: Generates the Prisma client and compiles the TypeScript code into minified ES Modules using `tsup`.
- `pnpm start`: Runs the compiled production code.

---

### Glossary of Short-forms

- **API:** Application Programming Interface - A set of rules that allows different software applications to communicate with each other.
- **ORM:** Object-Relational Mapping - A programming technique to convert data between incompatible type systems (like JavaScript objects and SQL databases).
- **CORS:** Cross-Origin Resource Sharing - A security feature that restricts or allows web applications running at one origin to interact with resources from a different origin.
- **JSON:** JavaScript Object Notation - A lightweight format for storing and transporting data.
- **HTTP:** Hypertext Transfer Protocol - The foundation of data communication for the World Wide Web.
- **ESM:** ECMAScript Modules - The official standard format to package JavaScript code for reuse.
