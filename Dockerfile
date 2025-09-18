# Usar una imagen base de Java 17
FROM openjdk:17-jdk-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo pom.xml y el wrapper de Maven
COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/.mvn .mvn

# Dar permisos de ejecución al wrapper de Maven
RUN chmod +x ./mvnw

# Descargar las dependencias (esto se cachea si pom.xml no cambia)
RUN ./mvnw dependency:go-offline -B

# Copiar el código fuente del backend
COPY backend/src src

# Construir la aplicación
RUN ./mvnw clean package -DskipTests

# Exponer el puerto que usa Render
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar target/*.jar"]