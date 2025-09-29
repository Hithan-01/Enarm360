# Enarm360

Monorepo con frontend en React + TypeScript (Create React App) y backend en Spring Boot. La app de producción se empaqueta como un único JAR de Spring Boot que sirve los assets compilados del frontend.

## Arquitectura
- Frontend (CRA) en `frontend/`
  - Tooling: `react-scripts`, TypeScript, Mantine UI, Testing Library.
  - Proxy de desarrollo al backend: `package.json` → `"proxy": "http://localhost:8080"`.
- Backend (Spring Boot) en `backend/`
  - Java 17.
  - Dependencias principales: Web, Security, Data JPA, PostgreSQL, Jakarta Validation, JWT (jjwt), Hypersistence Utils.
- Integración (build full-stack)
  - `frontend-maven-plugin` (Maven) construye el frontend desde `../frontend` durante el empaquetado (instala Node v20.9.0 y npm 10.1.0 sólo para el pipeline de Maven).
  - `maven-resources-plugin` copia `frontend/build` a `backend/src/main/resources/static` para que el JAR sirva los assets.
  - `spring-boot-maven-plugin` genera el JAR ejecutable.

## Requisitos
- Java 17 (JDK).
- Node.js 20.x y npm 10.x para desarrollo del frontend (en el build de Maven el plugin instala su propia versión).
- PostgreSQL (local o remoto) si vas a levantar el backend con base de datos real.

## Puesta en marcha (setup)
- Frontend
  - Desde la raíz del repo:
    - `cd frontend`
    - `npm install`
- Backend
  - Maven wrapper (`./mvnw`) resolverá dependencias en la primera ejecución.

## Desarrollo
- Backend (API en 8080 por defecto)
  - `cd backend`
  - `./mvnw spring-boot:run`
- Frontend (dev server en 3000, proxied a 8080)
  - `cd frontend`
  - `npm start`

## Tests
- Backend (JUnit via Maven)
  - Todos los tests: `cd backend && ./mvnw test`
  - Una clase: `cd backend && ./mvnw -Dtest=MyClassTest test`
  - Un método: `cd backend && ./mvnw -Dtest=MyClassTest#myMethod test`
- Frontend (Jest via react-scripts)
  - Modo watch: `cd frontend && npm test`
  - Ejecutar una vez (sin watch): `cd frontend && CI=true npm test -- --watchAll=false`
  - Por nombre: `cd frontend && npm test -- -t "regex del test"`
  - Por archivo: `cd frontend && npm test -- src/ruta/TuArchivo.test.tsx`

## Build de producción (frontend + backend)
- Build completo (dispara build del frontend y copia assets):
  - `cd backend`
  - `./mvnw clean package`
- Opciones:
  - Omitir tests: `./mvnw clean package -DskipTests`
  - Omitir build del frontend (sólo backend, útil en Docker como está configurado):
    - `./mvnw clean package -Dmaven.frontend.skip=true`

## Ejecutar el JAR empaquetado
- `cd backend && java -jar target/*.jar`
- Cambiar puerto (ejemplo 9090): `java -Dserver.port=9090 -jar target/*.jar`

## Docker
- Build: `docker build -t enarm360:latest .`
- Run: `docker run -p 8080:8080 -e PORT=8080 enarm360:latest`
  - La imagen construye el backend con Maven y omite el plugin de frontend para rapidez en contenedor.

## Configuración (variables y propiedades)
Spring Boot permite sobrescribir propiedades vía variables de entorno o flags `-D`. Configura al menos:
- Base de datos PostgreSQL:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
- JWT:
  - `APP_JWT_SECRET`
  - `APP_JWT_EXPIRATION` (ms)
  - `APP_JWT_REFRESH_EXPIRATION` (ms)
- CORS (lista separada por comas):
  - `APP_CORS_ALLOWED_ORIGINS`

Ejemplos de arranque con overrides:
- Backend en 8080 con datasource custom:
  - `SPRING_DATASOURCE_URL={{jdbc_url}} SPRING_DATASOURCE_USERNAME={{db_user}} SPRING_DATASOURCE_PASSWORD={{db_pass}} \`
    `java -jar backend/target/*.jar`
- Cambiar puerto:
  - `java -Dserver.port=9090 -jar backend/target/*.jar`

Nota: evita comprometer secretos reales en archivos de configuración o commits; usa variables de entorno en desarrollo y despliegue.

## Notas importantes
- Proxy de desarrollo: el frontend (`npm start`) reenvía `/api` y demás llamadas a `http://localhost:8080` por el `proxy` del `package.json`.
- Puertos por defecto: frontend 3000, backend 8080. En producción, el JAR sirve los assets estáticos desde `src/main/resources/static`.
- UI (de `CLAUDE.md`): Evitar colores difuminados/gradientes en botones y logo; usar colores planos. La interactividad se puede añadir con animaciones posteriormente.

## Estructura (resumen)
- `frontend/`: CRA + TypeScript (Mantine, Testing Library, Tailwind configurado como devDependency).
- `backend/`: Spring Boot + JPA + Security + PostgreSQL + JWT; empaqueta JAR y sirve el frontend compilado.
- `Dockerfile`: build del backend con Maven; usa `-Dmaven.frontend.skip=true`.
