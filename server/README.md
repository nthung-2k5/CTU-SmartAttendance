# CTU-SmartAttendance Backend Server

This repository contains the backend service for the CTU-SmartAttendance system (Can Tho University). The server provides RESTful APIs for mobile check-in applications and serves the web-based instructor dashboard.

## Architecture & Technology Stack
- **ElysiaJS**: High-performance web framework for the API layer.
- **Bun**: JavaScript runtime and package manager.
- **Firebase Admin SDK**: Server-side integration with Firestore database for secure, admin-level data operations.
- **Static File Serving**: The compiled React dashboard (`../dashboard/dist`) is served statically via the `@elysia/static` plugin from the `public` directory.

## Development Setup

The backend utilizes `bun` for dependency management and execution.

```bash
# 1. Install dependencies
bun install

# 2. Start the development server (Defaults to http://localhost:3000)
# Includes hot-reloading for server-side code changes.
bun run dev
```

Note: Ensure that the `firebase-service-account.json` file is correctly placed and configured as per your environment settings, as it is required by the Firebase Admin SDK to authenticate and bypass client-side security rules.

## Production Build

To prepare the server for production deployment, you can compile the TypeScript codebase into a standalone executable binary using Bun.

```bash
# Compile the server application
bun run build
```

This command generates an executable named `server` which can be executed directly without requiring the Bun runtime to be installed on the target machine.

## Database Migration Note
The project has been migrated from PostgreSQL to Firebase Firestore. Legacy ORM dependencies (Drizzle ORM) and schema files have been completely removed. All data operations are now handled exclusively via the Firebase Admin SDK.