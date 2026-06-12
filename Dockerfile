FROM eclipse-temurin:17-jdk as build
WORKDIR /app
COPY inventory-management-system/backend/pom.xml .
COPY inventory-management-system/backend/src ./src
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENV PORT=8081
CMD ["java", "-jar", "app.jar"]
