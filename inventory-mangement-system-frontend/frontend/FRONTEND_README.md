# Inventory Management System - Frontend

Premium glassmorphism React frontend for the Inventory Management System.

## 🎨 Design System

The frontend features a modern glassmorphism design with:
- **Glass Effect UI**: Semi-transparent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful purple-to-indigo gradients
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Works on all screen sizes
- **Accessibility**: Proper focus states and semantic HTML

## 📦 Features Implemented

### Authentication
- ✅ Login page with JWT token handling
- ✅ Automatic token loading from localStorage
- ✅ Protected routes with authentication check
- ✅ Logout functionality

### Pages & Screens
- ✅ **Dashboard**: Sales overview, KPIs, recent orders, inventory status
- ✅ **Products**: Product catalog with search and filtering
- ✅ **Inventory**: Multi-branch inventory management with alerts
- ✅ **Orders**: Sales order management and tracking
- ✅ **Suppliers**: Supplier directory with contact information
- ✅ **Reports**: Advanced analytics with charts and metrics
- ✅ **404 Page**: Branded error page

### Components
- ✅ Layout component with sidebar navigation
- ✅ Glass-morphism styled cards and tables
- ✅ Responsive grid layouts
- ✅ Status badges with color coding
- ✅ Interactive charts and graphs

### State Management
- ✅ Zustand for global auth state
- ✅ JWT token persistence
- ✅ Automatic login on page refresh

### API Integration
- ✅ Axios instance with JWT interceptors
- ✅ Automatic token attachment to requests
- ✅ Error handling
- ✅ Environment-based API URLs

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### Installation

```bash
cd inventory-mangement-system-frontend/frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📋 Tech Stack

- **React 18.2**: UI library
- **React Router 6.19**: Navigation and routing
- **Axios 1.6**: HTTP client
- **Zustand 4.4**: State management
- **Tailwind CSS 3**: Utility-first CSS framework
- **Vite 5**: Build tool and dev server

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx           # Main layout with sidebar
│   ├── context/
│   │   └── authStore.js         # Auth state management
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── Products.jsx         # Products management
│   │   ├── Inventory.jsx        # Inventory tracking
│   │   ├── Orders.jsx           # Order management
│   │   ├── Suppliers.jsx        # Supplier management
│   │   ├── Reports.jsx          # Analytics & reports
│   │   └── NotFound.jsx         # 404 page
│   ├── services/
│   │   └── api.js               # Axios instance & API calls
│   ├── App.jsx                  # App root with routing
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── public/
├── index.html                   # HTML template
├── package.json
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
└── .env.development             # Development environment variables
```

## 🎨 Glassmorphism Classes

Custom utility classes for the glass effect:

```html
<!-- Basic glass card -->
<div class="glass rounded-xl p-6">Content</div>

<!-- Interactive glass card -->
<div class="glass glass-hover rounded-xl p-6">Hoverable Content</div>

<!-- Dark glass variant -->
<div class="glass-dark rounded-xl p-6">Dark Content</div>
```

## 🔌 API Integration

The frontend expects the backend API at the URL specified in `.env.development`:

```env
VITE_API_URL=http://localhost:8080/api
```

### Available Endpoints (Expected from Backend)

- `POST /auth/login` - User login
- `GET /products` - List products
- `GET /products/:id` - Get product details
- `GET /inventory` - Get inventory levels
- `GET /orders` - List sales orders
- `GET /suppliers` - List suppliers
- `GET /reports/*` - Various reports

## 🔐 Authentication

The app uses JWT tokens for authentication:

1. User logs in with email/password
2. Backend returns JWT token
3. Token is stored in localStorage
4. Axios interceptor automatically adds token to all requests
5. Token is cleared on logout

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## 📱 Responsive Design

The layout is fully responsive:
- **Mobile**: Collapsible sidebar, single column layout
- **Tablet**: Two column layouts, collapsible sidebar
- **Desktop**: Full sidebar, multi-column grids

## 🔄 Development Workflow

1. **Create feature branch**: `git checkout -b feature/feature-name`
2. **Make changes** to components or pages
3. **Test locally**: `npm run dev`
4. **Build**: `npm run build`
5. **Commit and push**: Create pull request

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Set root directory to `inventory-mangement-system-frontend/frontend`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```
6. Deploy

### Deploy to Netlify

1. Build locally: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🎯 Next Steps

- [ ] Add product search with full-text search
- [ ] Implement bulk inventory updates
- [ ] Add order creation flow
- [ ] Implement advanced filtering
- [ ] Add data export functionality (CSV/PDF)
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)

## 📧 Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-11
