# Usar una imagen base de Java 17
FROM openjdk:17-jdk-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar TODA la estructura del proyecto (backend y frontend)
COPY . .

# Cambiar al directorio backend
WORKDIR /app/backend

# Dar permisos de ejecución al wrapper de Maven
RUN chmod +x ./mvnw

# Construir la aplicación (salteando el frontend plugin)
RUN ./mvnw clean package -DskipTests -Dmaven.frontend.skip=true

# Exponer el puerto que usa Render
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar target/*.jar"]