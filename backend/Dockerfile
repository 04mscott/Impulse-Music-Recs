# Use an official Maven image to build the project
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/songRecommendations-0.0.1-SNAPSHOT.jar app.jar
CMD ["java", "-jar", "app.jar"]
