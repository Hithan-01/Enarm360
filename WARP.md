# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with a React + TypeScript frontend and a Spring Boot backend.
- Production build is packaged as a single Spring Boot JAR that serves the frontend’s static assets.

Architecture and build pipeline
- Frontend (Create React App) at frontend/
  - Tooling: react-scripts (CRA), TypeScript, Mantine UI, Testing Library.
  - Dev proxy to backend: package.json → "proxy": "http://localhost:8080".
- Backend (Spring Boot) at backend/
  - Dependencies: Web, Security, Data JPA, PostgreSQL driver, Jakarta Validation, JWT (jjwt), Hypersistence Utils.
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

Linting
- Frontend uses CRA’s built-in ESLint integration; there is no standalone "lint" script defined. Lint feedback appears during npm start and test runs.
- No Java code style/lint plugin is configured in pom.xml (e.g., Checkstyle/SpotBugs are not present).

Rules and guidelines from repo docs
- From CLAUDE.md (UI guidance, Spanish): “No me gusta que pongas colores en los botones difuminados… colores planos… en botones, en logo, en nada.”
  - Interpretation for UI work: avoid gradients/diffused colors; prefer flat colors for buttons/logo. Interactivity can be added later via animations.

Notes for agents
- In dev, run both services: backend on 8080, frontend on 3000. The dev proxy forwards API calls to 8080.
- In prod, the backend JAR serves the compiled frontend from src/main/resources/static.
