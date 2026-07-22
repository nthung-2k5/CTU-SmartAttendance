# CTU-SmartAttendance Dashboard

This is the instructor dashboard for the CTU-SmartAttendance system (Can Tho University). The interface provides attendance management capabilities and displays real-time status data (Present/Late/Absent) synced with the backend.

## Tech Stack
- **React 19 & Vite**: Frontend framework and build tool.
- **Tailwind CSS & Shadcn UI**: Utility-first CSS framework and component system.
- **Firebase Client SDK**: Handles real-time data synchronization via `onSnapshot` listeners to Firestore.
- **Bun**: JavaScript runtime and package manager.

## Development Setup

The project uses `bun` as the package manager to maintain consistency with the Elysia backend environment.

```bash
# 1. Install dependencies
bun install

# 2. Start the development server (Defaults to http://localhost:5173)
bun run dev
```

Note: The development server supports Hot Module Replacement (HMR). The backend server must be running concurrently (default port 3000) for API interactions.

## Production Build

The system architecture serves the frontend statically through the Elysia backend. The frontend must be built and output to the backend's static directory.

```bash
# Build the application for production
bun run build
```

This command bundles the assets and automatically outputs them to the `../server/public` directory. Once built, the backend server handles the distribution of these static files on its configured port (default `http://localhost:3000`).

## Configuration

Firebase client configuration is located at `src/config/firebase.ts`. Ensure the configuration matches your Firebase Console project settings for real-time features to function. Environment variables (`.env`) can be utilized to manage configuration values dynamically.