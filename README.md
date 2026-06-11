# Supply Lens

Supply Lens is a full-stack inventory and supply chain management demo platform built with React and Spring Boot. It provides a premium control-tower dashboard for tracking products, inventory levels, sales orders, purchase orders, suppliers, branch stock, and operational reports using public/demo data.

## Project Structure

```text
inventory-management-system/backend
inventory-mangement-system-frontend/frontend
```

The backend and frontend live in the same repository but are deployed separately.

## Run Backend Locally

```powershell
cd "inventory-management-system/backend"
& "C:\Users\saira\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

Health check:

```text
http://localhost:8081/api/health
```

Swagger:

```text
http://localhost:8081/swagger-ui.html
```

## Run Frontend Locally

```powershell
cd "inventory-mangement-system-frontend/frontend"
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Frontend URL:

```text
http://localhost:5173
```

## Demo Mode

Authentication is disabled for this public customer demo. The backend seeds an in-memory H2 database with demo products, inventory, branches, suppliers, customers, sales orders, purchase orders, and reporting data at startup.

## Deployment Notes

- Frontend can be deployed to Vercel from `inventory-mangement-system-frontend/frontend`.
- Backend can be deployed to Railway or Render from `inventory-management-system/backend`.
- Set frontend environment variable `VITE_API_URL` to the deployed backend API URL.
