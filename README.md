# JavaMonitor

This is a NextJS starter in Firebase Studio designed for monitoring JVM (Java Virtual Machine) metrics. It provides a dashboard to visualize key performance indicators, historical trends, and AI-powered health insights.

To get started, take a look at `src/app/page.tsx`.

## Project Architecture

The application follows a modern web architecture:

1.  **Frontend (Client-Side):**
    *   Built with Next.js (React framework) for a dynamic and responsive user interface.
    *   Uses ShadCN UI components for pre-built, accessible UI elements.
    *   Styled with Tailwind CSS for utility-first styling.
    *   Displays real-time (mocked) JVM metrics, historical data charts, and AI-generated insights.

2.  **Backend (Server-Side):**
    *   Next.js API Routes and Server Components handle data fetching and server-side logic.
    *   Genkit is used for integrating Generative AI capabilities, specifically for providing health insights based on JVM metrics.
    *   Communicates with AI models (e.g., Google's Gemini) via Genkit.
    *   Currently uses mock data (`src/lib/mockData.ts`) for JVM metrics, but is designed to be adaptable to real data sources.

3.  **AI Integration:**
    *   Genkit flows (defined in `src/ai/flows/`) orchestrate interactions with large language models (LLMs).
    *   The `generate-health-insights.ts` flow takes JVM metrics as input and returns a textual analysis.

## Tech Stack

*   **Framework:** Next.js (v15.x with App Router)
*   **Language:** TypeScript
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **Generative AI:** Genkit (with Google AI provider)
*   **Charting:** Recharts
*   **Forms:** React Hook Form (if forms were to be added, currently not heavily used)
*   **Linting/Formatting:** ESLint, Prettier (via Next.js defaults)
*   **Package Manager:** npm

## How to Deploy

### Local Development

1.  **Prerequisites:**
    *   Node.js (version 20.x or later recommended)
    *   npm (usually comes with Node.js)

2.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up Environment Variables:**
    *   Create a `.env.local` file in the root of your project.
    *   If your Genkit flows require API keys (e.g., for Google AI), add them here:
        ```env
        GOOGLE_API_KEY=your_google_ai_api_key
        ```
    *   (The `GOOGLE_API_KEY` is typically used by the `@genkit-ai/googleai` plugin).

5.  **Run the development servers:**
    *   For the Next.js app:
        ```bash
        npm run dev
        ```
        This will typically start the app on `http://localhost:9002`.
    *   For Genkit (to test and run AI flows, in a separate terminal):
        ```bash
        npm run genkit:dev
        ```
        Or for watching changes:
        ```bash
        npm run genkit:watch
        ```
        The Genkit UI will usually be available at `http://localhost:4000`.

6.  **Access the application:**
    Open your browser and navigate to `http://localhost:9002`.

### Docker Deployment

To deploy this application using Docker, you would typically follow these steps:

1.  **Create a `Dockerfile`:**
    A `Dockerfile` describes how to build your Docker image. Here's a multi-stage example for a Next.js application:

    ```dockerfile
    # Stage 1: Install dependencies and build the application
    FROM node:20-alpine AS builder
    WORKDIR /app

    # Copy package.json and package-lock.json (or npm-shrinkwrap.json)
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Set build-time arguments for environment variables if needed
    # ARG GOOGLE_API_KEY
    # ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

    # Build the Next.js application
    RUN npm run build

    # Stage 2: Create a smaller image for production
    FROM node:20-alpine AS runner
    WORKDIR /app

    # Set environment variables (can also be set at runtime)
    ENV NODE_ENV=production
    # ENV GOOGLE_API_KEY=$GOOGLE_API_KEY # Ensure this is securely managed

    # Copy built app from the builder stage
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/next.config.ts ./next.config.ts
    # If you have a standalone output, copy that instead of .next, public, etc.
    # COPY --from=builder /app/.next/standalone ./

    # Expose the port Next.js runs on (default 3000, but your dev is 9002)
    # Check your `npm start` script or Next.js configuration.
    # Default Next.js start port is 3000.
    EXPOSE 3000

    # Command to run the application
    # If using standalone output: CMD ["node", "server.js"]
    CMD ["npm", "start"]
    ```
    *Note: If your `npm start` script uses a different port (e.g., `-p 9002`), adjust the `EXPOSE` instruction and ensure your Next.js server listens on that port in production mode.*
    *For Genkit, if you intend to run Genkit flows as part of this Docker container (e.g., if Next.js calls local Genkit flows directly without a separate Genkit server), you'd need to ensure Genkit starts. However, Genkit is often run as a separate service or deployed as cloud functions. For this setup, the Next.js app calls server actions that execute Genkit flows directly within the Next.js server process.*

2.  **Create a `.dockerignore` file:**
    This file specifies what not to copy into your Docker image, similar to `.gitignore`.
    ```
    .git
    .next
    node_modules
    .env.local
    .DS_Store
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    # Add other files/folders you don't want in the image
    ```

3.  **Build the Docker image:**
    Open your terminal in the project root (where the `Dockerfile` is) and run:
    ```bash
    docker build -t java-monitor-app .
    ```
    You can replace `java-monitor-app` with your desired image name.
    If you need to pass build-time arguments (like `GOOGLE_API_KEY` if used in the Dockerfile build stage):
    ```bash
    docker build --build-arg GOOGLE_API_KEY=your_actual_key -t java-monitor-app .
    ```
    However, it's generally better to pass secrets at runtime.

4.  **Run the Docker container:**
    ```bash
    docker run -p 3000:3000 -e GOOGLE_API_KEY=your_actual_key java-monitor-app
    ```
    *   `-p 3000:3000`: Maps port 3000 on your host machine to port 3000 in the container (adjust if your app runs on a different port internally, e.g., if `npm start` in `package.json` is `next start -p <some_port>`).
    *   `-e GOOGLE_API_KEY=your_actual_key`: Sets the environment variable inside the container. **Note: For production, use a secure way to manage secrets (e.g., Docker secrets, environment variable injection by your hosting platform).**

5.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000` (or the host port you mapped).

This provides a basic setup. For production Docker deployments, you'd also consider:
*   Optimizing image size.
*   Security best practices.
*   Using a non-root user in the container.
*   Logging.
*   Potentially using Docker Compose for multi-container setups if you were to run Genkit or a database as separate services.
```