# Supply Lens — Intelligent Inventory & Supply Chain Management

A full-stack enterprise inventory management platform that provides real-time visibility into stock levels, order fulfillment, supplier performance, and operational analytics across multiple store branches.

## Key Features

- **Real-time Dashboard** — Live KPIs with auto-refreshing metrics, fulfillment tracking, and capacity monitoring
- **Product Catalog** — 1,000+ SKUs with search, filtering, categorization, and stock management
- **Multi-Branch Inventory** — Track stock levels, reorder points, and alerts across 15 store locations
- **Order Management** — Sales order tracking with status workflows (Pending → Processing → Shipped → Delivered)
- **Purchase Orders** — Supplier replenishment with delivery tracking and procurement analytics
- **Supplier Network** — 30+ supplier profiles with ratings, lead times, and contact management
- **Reports & Analytics** — Revenue trends, top products, category performance with Recharts visualizations
- **Global Search** — Instant search across products, orders, and suppliers (⌘K)

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Spring Security
- MySQL 8 (H2 for quick start)
- OpenCSV for data import
- Swagger / OpenAPI documentation
- Maven

### Frontend
- React 19
- Vite 8
- Tailwind CSS 3.4
- Recharts (charts & analytics)
- Axios (API client)
- React Router 7
- Zustand (state management)
- Lucide React (icons)

## Quick Start

### Backend

```bash
cd inventory-management-system/backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8081`  
Swagger docs: `http://localhost:8081/swagger-ui.html`  
Health check: `http://localhost:8081/api/health`

### Frontend

```bash
cd inventory-mangement-system-frontend/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Deployment

- **Frontend**: Deploy to Vercel from `inventory-mangement-system-frontend/frontend`
- **Backend**: Deploy to Railway or Render from `inventory-management-system/backend`
- Set `VITE_API_URL` environment variable on frontend to point to deployed backend URL

### MySQL Configuration (Production)

Set these environment variables on the backend:
```
SPRING_PROFILES_ACTIVE=mysql
MYSQL_HOST=your-db-host
MYSQL_PORT=3306
MYSQL_DB=supply_lens
MYSQL_USER=your-user
MYSQL_PASSWORD=your-password
```

## Project Structure

```
Supply-Lens/
├── inventory-management-system/backend/     # Spring Boot API
│   ├── src/main/java/com/inventory/
│   │   ├── config/          # Security, data loader
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA entities (11 tables)
│   │   └── repository/      # Data access layer
│   └── src/main/resources/
│       ├── application.yml
│       └── data/            # CSV seed data (24K+ records)
│
└── inventory-mangement-system-frontend/frontend/  # React SPA
    └── src/
        ├── components/      # Layout, Modal, AnimatedNumber
        ├── pages/           # Dashboard, Products, Inventory, Orders, etc.
        ├── services/        # API client
        └── context/         # Auth store

```

## Database Schema (11 Tables)

| Table | Description |
|-------|-------------|
| products | SKUs, pricing, categories, reorder levels |
| categories | Product categorization hierarchy |
| inventory | Stock per product per branch |
| store_branches | 15 physical store locations |
| suppliers | Vendor profiles and performance |
| purchase_orders | Supplier replenishment orders |
| purchase_order_items | PO line items |
| sales_orders | Customer orders |
| sales_order_items | Order line items |
| customers | Customer profiles |
| users | System users with role-based access |

## Built By

**aiStreams LLC**

**Developer:** Vamsi Krishna  
Full-stack development — Java/Spring Boot backend services, MySQL database design, React.js frontend, system architecture, and deployment.
