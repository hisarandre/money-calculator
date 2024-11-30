# Use OpenJDK for building the Spring Boot app
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw ./
COPY .mvn ./.mvn
COPY pom.xml ./

# Copy the source code
COPY src ./src

# Give execute permission to mvnw script
RUN chmod +x mvnw

# Package the application using Maven
RUN ./mvnw clean package -DskipTests

# Expose the app's port
EXPOSE 8080

# Run the application (adjust the path to the JAR if necessary)
CMD ["java", "-jar", "target/back-0.0.1-SNAPSHOT.jar"]
