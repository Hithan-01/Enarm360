# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with a React + TypeScript frontend and a Spring Boot backend.
- Production build is packaged as a single Spring Boot JAR that serves the frontend’s static assets.

Architecture and build pipeline
- Frontend (Create React App) at frontend/
  - Tooling: react-scripts (CRA), TypeScript, Mantine UI v8.3.1, Testing Library.
  - CSS Framework: Tailwind CSS v3.4.17 with PostCSS and Autoprefixer.
  - Additional UI: @tabler/icons-react, @emotion/react, Mantine Charts/Dates/Forms/Hooks/Notifications.
  - HTTP Client: Axios v1.11.0.
  - Date handling: date-fns v4.1.0, dayjs v1.11.18.
  - Routing: react-router-dom v7.8.2.
  - Dev proxy to backend: package.json → "proxy": "http://localhost:8080".
- Backend (Spring Boot) at backend/
  - Spring Boot version: 3.5.5.
  - Dependencies: Web, Security, Data JPA, Data REST, Thymeleaf, PostgreSQL driver, H2 (test), Jakarta Validation, JWT (jjwt v0.12.3), Hypersistence Utils v3.6.0, Hibernate Types v2.21.1.
  - Additional features: Lombok, DevTools, Quartz (scheduled tasks), Actuator (metrics).
  - Java version: 17 (pom <java.version>17</java.version>).
- Integration (pom.xml)
  - com.github.eirslett:frontend-maven-plugin builds the React app from ../frontend during Maven build (installs Node v20.9.0 and npm 10.1.0 for the packaging step).
  - maven-resources-plugin copies frontend/build into backend/src/main/resources/static so Spring Boot serves the compiled assets.
  - spring-boot-maven-plugin produces the runnable JAR.
- Docker
  - Dockerfile builds the backend with Maven and can skip the frontend plugin via -Dmaven.frontend.skip=true for faster container builds.

Common commands
- Initial setup
  - Frontend deps: (from repo root)
    - cd frontend
    - npm install
  - Backend deps: Maven wrapper will resolve them automatically on first run.

- Run in development
  - Backend API (default on 8080):
    - cd backend
    - ./mvnw spring-boot:run
  - Frontend dev server (on 3000, proxied to 8080):
    - cd frontend
    - npm start

- Tests
  - Backend (JUnit via Maven):
    - All tests: cd backend && ./mvnw test
    - Single test class: cd backend && ./mvnw -Dtest=MyClassTest test
    - Single test method: cd backend && ./mvnw -Dtest=MyClassTest#myMethod test
  - Frontend (Jest via react-scripts):
    - Watch mode: cd frontend && npm test
    - Run once (no watch): cd frontend && CI=true npm test -- --watchAll=false
    - Single test by name: cd frontend && npm test -- -t "regex of test name"
    - Single test by file: cd frontend && npm test -- src/path/YourComponent.test.tsx

- Build production (frontend + backend)
  - Full bundle (triggers frontend build and copies assets):
    - cd backend
    - ./mvnw clean package
  - Skip tests: ./mvnw clean package -DskipTests
  - Skip frontend (backend-only, useful in Docker as configured):
    - ./mvnw clean package -Dmaven.frontend.skip=true

- Run the packaged app
  - cd backend && java -jar target/*.jar
  - Change port if needed: java -Dserver.port=9090 -jar target/*.jar

- Docker
  - Build: docker build -t enarm360:latest .
  - Run: docker run -p 8080:8080 -e PORT=8080 enarm360:latest

Styling and UI Configuration
- Tailwind CSS configuration (tailwind.config.js):
  - Custom color palette: medical (blue tones), emerald (green tones).
  - Custom fonts: Inter (sans), Outfit (display), Space Grotesk (heading), Manrope (elegant).
  - Custom animations: fade-in, slide-up, gradient with keyframes.
  - Custom shadows: medical, medical-hover for depth effects.
  - Preflight disabled to avoid conflicts with Mantine components.
- PostCSS configuration with Tailwind and Autoprefixer.
- Mantine UI theming works alongside Tailwind (preflight disabled).

Linting
- Frontend uses CRA's built-in ESLint integration; there is no standalone "lint" script defined. Lint feedback appears during npm start and test runs.
- No Java code style/lint plugin is configured in pom.xml (e.g., Checkstyle/SpotBugs are not present).

Environment Configuration
- Database (PostgreSQL):
  - Production: Render.com hosted database (dpg-d30dorvdiees73fqp3o0-a.oregon-postgres.render.com:5432/enarm360)
  - Environment variables: DATABASE_URL, DB_USERNAME, DB_PASSWORD
  - H2 available for testing scenarios
- Application properties (application.properties):
  - JWT configuration with configurable secrets and expiration times
  - CORS settings for multiple origins (localhost:3000, localhost:3001, render deployment)
  - File upload limits (5MB default)
  - Scheduled tasks configuration (subscription management, auto-expiry)
  - Subscription system with pricing, coupons, payment settings
  - Timezone: America/Monterrey
- Port configuration: Uses PORT environment variable (default 8080) for deployment flexibility

Business Logic Features
- Subscription management system with automated scheduling:
  - Free tier: 10 attempts limit
  - Trial tier: 50 attempts limit  
  - Standard/Premium: unlimited attempts
  - Auto-expiry checks, renewal reminders, metrics collection
- Payment system integration (Stripe) with multi-currency support (USD, MXN, EUR)
- Discount coupon system with usage limits and validity periods
- File upload system with configurable storage locations

Deployment
- Production deployment on Render.com
- Docker configuration skips frontend build (uses -Dmaven.frontend.skip=true)
- Environment-based configuration for database, JWT secrets, CORS origins

Rules and guidelines from repo docs
- From CLAUDE.md (UI guidance, Spanish): "No me gusta que pongas colores en los botones difuminados… colores planos… en botones, en logo, en nada."
  - Interpretation for UI work: avoid gradients/diffused colors; prefer flat colors for buttons/logo. Interactivity can be added later via animations.

Notes for agents
- In dev, run both services: backend on 8080, frontend on 3000. The dev proxy forwards API calls to 8080.
- In prod, the backend JAR serves the compiled frontend from src/main/resources/static.
